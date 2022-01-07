import { AddStudentComponent } from './add-student.component';
import { ATTENDANCE_STATUS_LIST } from '../../../attendance/classes/constants';
import { StudentTest } from '../../../../services/modules/examination/models/student-test';
import { StudentSubject } from '../../../../services/modules/subject/models/student-subject';
import { StudentFee } from '../../../../services/modules/fees/models/student-fee';
import { CommonFunctions } from '@modules/common/common-functions';

export class AddStudentServiceAdapter {
    vm: AddStudentComponent;

    constructor() { }

    initializeAdapter(vm: AddStudentComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoading = true;

        let schoolId = this.vm.user.activeSchool.dbId;
        let sessionId = this.vm.user.activeSchool.currentSessionDbId;

        let bus_stop_list = {
            parentSchool: schoolId,
        };

        let test_second_list = {
            parentExamination__parentSchool: schoolId,
            parentExamination__parentSession: sessionId,
        };

        let class_subject_list = {
            parentSchool: schoolId,
            parentSession: sessionId,
        };

        let request_school_fee_rule_data = {
            parentFeeType__parentSchool: schoolId,
            parentSession: sessionId,
        };

        let request_class_filter_fee_data = {
            parentSchoolFeeRule__parentFeeType__parentSchool: schoolId,
            parentSchoolFeeRule__parentSession: sessionId,
        };

        let request_bus_stop_filter_fee_data = {
            parentSchoolFeeRule__parentFeeType__parentSchool: schoolId,
            parentSchoolFeeRule__parentSession: sessionId,
        };

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.vehicleService.getBusStopList(bus_stop_list, this.vm.user.jwt),
            this.vm.examinationService.getObjectList(this.vm.examinationService.test_second, test_second_list),
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_list),
            this.vm.feeService.getObjectList(this.vm.feeService.school_fee_rules, request_school_fee_rule_data),
            this.vm.feeService.getObjectList(this.vm.feeService.class_filter_fees, request_class_filter_fee_data),
            this.vm.feeService.getObjectList(this.vm.feeService.bus_stop_filter_fees, request_bus_stop_filter_fee_data),
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}),
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, {
                parentSchool: this.vm.user.activeSchool.dbId,
            }),
        ]).then(
            (value) => {
                this.vm.classList = value[0];
                this.vm.sectionList = value[1];
                this.vm.busStopList = value[2];
                this.vm.testSecondList = value[3];
                this.vm.classSubjectList = value[4];
                this.vm.schoolFeeRuleList = value[5];
                this.vm.classFilterFeeList = value[6];
                this.vm.busStopFilterFeeList = value[7];
                this.vm.sessionList = value[8];
                this.vm.studentParameterList = value[9].map((x) => ({ ...x, filterValues: JSON.parse(x.filterValues) }));

                this.vm.initializeVariable();

                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    getBankDetails() {
        if (this.vm.newStudent.bankIfscCode.length < 11) {
            return;
        }
        this.vm.bankService.getDetailsFromIFSCCode(this.vm.newStudent.bankIfscCode.toString()).then((value) => {
            this.vm.newStudent.bankName = value;
        });
    }

    dataURLtoFile(dataurl, filename) {
        try {
            const arr = dataurl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new File([u8arr], filename, { type: mime });
        } catch (e) {
            return null;
        }
    }

    createNewStudent(): void {
        if (this.vm.newStudent.name == null || this.vm.newStudent.name == '') {
            alert('Name should be populated');
            return;
        }

        if (this.vm.newStudent.fathersName == null || this.vm.newStudent.fathersName == '') {
            alert("Father's name should be populated");
            return;
        }

        if (this.vm.newStudent.mobileNumber != null && this.vm.newStudent.mobileNumber.toString().length != 10) {
            alert('Mobile number should be 10 digits');
            return;
        }

        if (this.vm.newStudent.secondMobileNumber != null && this.vm.newStudent.secondMobileNumber.toString().length != 10) {
            alert('Mobile number should be 10 digits');
            return;
        }

        if (this.vm.newStudent.childSSMID != null && this.vm.newStudent.childSSMID.toString().length != 9) {
            alert('Child SSMID should be 9 digits');
            return;
        }

        if (this.vm.newStudent.familySSMID != null && this.vm.newStudent.familySSMID.toString().length != 8) {
            alert('Family SSMID should be 8 digits');
            return;
        }

        if (this.vm.newStudent.aadharNum != null && this.vm.newStudent.aadharNum.toString().length != 12) {
            alert('Aadhar No. should be 12 digits');
            return;
        }

        this.vm.isLoading = true;

        if (this.vm.newStudent.dateOfBirth == '') {
            this.vm.newStudent.dateOfBirth = null;
        }

        if (this.vm.newStudent.dateOfAdmission == '') {
            this.vm.newStudent.dateOfAdmission = null;
        }

        const student_form_data = new FormData();
        const data = { ...this.vm.newStudent };
        Object.keys(data).forEach((key) => {
            if (key === 'profileImage') {
                if (this.vm.profileImage) {
                    student_form_data.append(key, this.dataURLtoFile(this.vm.profileImage, 'profileImage.jpeg'));
                }
            } else {
                if (data[key] !== null) {
                    student_form_data.append(key, data[key]);
                }
            }
        });

        let parentEmployee = this.vm.user.activeSchool.employeeId;
        let moduleName = this.vm.user.section.title;
        let taskName = this.vm.user.section.subTitle;
        let moduleList = this.vm.user.activeSchool.moduleList;
        let actionString = this.vm.user.first_name + " admitted " + this.vm.newStudent.name;

        this.vm.studentService.createObject(this.vm.studentService.student, student_form_data).then(
            (value) => {
                this.vm.newStudentSection.parentStudent = value.id;
                this.vm.isLoading = true;
                let student_subject_list = [];

                this.vm.classSubjectList
                    .filter((classSubject) => {
                        return (
                            classSubject.parentClass == this.vm.newStudentSection.parentClass &&
                            classSubject.parentDivision == this.vm.newStudentSection.parentDivision
                        );
                    })
                    .forEach((classSubject) => {
                        let student_subject = new StudentSubject();
                        student_subject.parentStudent = value.id;
                        student_subject.parentSubject = classSubject.parentSubject;
                        student_subject.parentSession = classSubject.parentSession;
                        student_subject_list.push(student_subject);
                    });

                let student_test_list = [];

                this.vm.testSecondList
                    .filter((testSecond) => {
                        return (
                            testSecond.parentClass == this.vm.newStudentSection.parentClass &&
                            testSecond.parentDivision == this.vm.newStudentSection.parentDivision
                        );
                    })
                    .forEach((testSecond) => {
                        let student_test = new StudentTest();
                        student_test.parentExamination = testSecond.parentExamination;
                        student_test.parentSubject = testSecond.parentSubject;
                        student_test.parentStudent = value.id;
                        student_test.testType = testSecond.testType;
                        student_test.marksObtained = 0;
                        student_test_list.push(student_test);
                    });

                let feeTypeIdList = [...new Set(this.vm.schoolFeeRuleList.map((item) => item.parentFeeType))];

                let student_fee_list = [];
                feeTypeIdList.forEach((feeTypeId) => {
                    this.vm.schoolFeeRuleList
                        .filter((item) => {
                            return item.parentFeeType == feeTypeId;
                        })
                        .sort((a, b) => {
                            return a.ruleNumber - b.ruleNumber;
                        })
                        .every((schoolFeeRule) => {
                            if (
                                schoolFeeRule.isClassFilter &&
                                this.vm.classFilterFeeList.find((classFilterFee) => {
                                    return (
                                        classFilterFee.parentSchoolFeeRule == schoolFeeRule.id &&
                                        classFilterFee.parentClass == this.vm.newStudentSection.parentClass &&
                                        classFilterFee.parentDivision == this.vm.newStudentSection.parentDivision
                                    );
                                }) == undefined
                            ) {
                                return true;
                            }
                            if (
                                schoolFeeRule.isBusStopFilter &&
                                this.vm.busStopFilterFeeList.find((busStopFilterFee) => {
                                    return (
                                        busStopFilterFee.parentSchoolFeeRule == schoolFeeRule.id &&
                                        busStopFilterFee.parentBusStop == this.vm.newStudent.currentBusStop
                                    );
                                }) == undefined
                            ) {
                                return true;
                            }
                            if (schoolFeeRule.onlyNewAdmission && this.vm.newStudent.admissionSession != schoolFeeRule.parentSession) {
                                return true;
                            }
                            if (!schoolFeeRule.includeRTE && this.vm.newStudent.rte == 'YES') {
                                return true;
                            }

                            let student_fee_object = new StudentFee();
                            student_fee_object.parentStudent = value.id;
                            student_fee_object.parentSchoolFeeRule = schoolFeeRule.id;
                            student_fee_object.parentFeeType = schoolFeeRule.parentFeeType;
                            student_fee_object.parentSession = schoolFeeRule.parentSession;
                            student_fee_object.isAnnually = schoolFeeRule.isAnnually;
                            student_fee_object.cleared = false;
                            this.vm.installmentList.forEach((installment) => {
                                student_fee_object[installment + 'Amount'] = schoolFeeRule[installment + 'Amount'];
                                student_fee_object[installment + 'LastDate'] = schoolFeeRule[installment + 'LastDate'];
                                student_fee_object[installment + 'LateFee'] = schoolFeeRule[installment + 'LateFee'];
                                student_fee_object[installment + 'MaximumLateFee'] = schoolFeeRule[installment + 'MaximumLateFee'];
                                student_fee_object[installment + 'ClearanceDate'] = null;
                            });
                            student_fee_list.push(student_fee_object);

                            return false;
                        });
                });

                this.vm.currentStudentParameterValueList = this.vm.currentStudentParameterValueList.filter((x) => {
                    return x.value !== this.vm.nullValue;
                });
                this.vm.currentStudentParameterValueList.forEach((x) => {
                    x.parentStudent = value.id;
                });

                let form_data_list = [];
                this.vm.studentParameterList.forEach((parameter) => {
                    let temp_obj = this.vm.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id);
                    if (temp_obj) {
                        const data = { ...temp_obj };
                        const form_data = new FormData();
                        Object.keys(data).forEach((key) => {
                            if (data[key]) {
                                if (key == 'document_name' || key == 'document_size') {
                                } else if (key == 'document_value') {
                                    form_data.append(key, this.dataURLtoFile(data[key], data['document_name']));
                                    form_data.append('document_size', data['document_size']);
                                } else {
                                    form_data.append(key, data[key]);
                                }
                            }
                        });
                        form_data_list.push(form_data);
                    }
                });
                Promise.all([
                    this.vm.studentService.createObject(this.vm.studentService.student_section, this.vm.newStudentSection),
                    this.vm.subjectService.createObjectList(this.vm.subjectService.student_subject, student_subject_list),
                    this.vm.examinationService.createObjectList(this.vm.examinationService.student_test, student_test_list),
                    this.vm.feeService.createObjectList(this.vm.feeService.student_fees, student_fee_list),
                    form_data_list.forEach((x) => {
                        this.vm.studentService.createObject(this.vm.studentService.student_parameter_value, x);
                    }),
                ]).then(
                    (valueTwo) => {
                        alert('Student admitted successfully');

                        this.vm.initializeVariable();

                        CommonFunctions.createRecord(parentEmployee, moduleName, taskName, moduleList, actionString);
                        this.vm.isLoading = false;
                    },
                    (error) => {
                        this.vm.isLoading = false;
                    }
                );
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }
}
