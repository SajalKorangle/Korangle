
import { PromoteStudentComponent } from './promote-student.component';
import { ATTENDANCE_STATUS_LIST } from '../../../attendance/classes/constants';
import {Student} from '../../../../classes/student';
import {StudentSubject} from '../../../../services/modules/subject/models/student-subject';
import {StudentTest} from '../../../../services/modules/examination/models/student-test';
import {StudentFee} from '../../../../services/modules/fees/models/student-fee';

export class PromoteStudentServiceAdapter {

    vm: PromoteStudentComponent;

    constructor() {}

    initializeAdapter(vm: PromoteStudentComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {

        const schoolId = this.vm.user.activeSchool.dbId;
        const sessionId = this.vm.user.activeSchool.currentSessionDbId;
        const nextSessionId = this.vm.user.activeSchool.currentSessionDbId + 1;

        const student_section_list_one = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentStudent__parentTransferCertificate': 'null__korangle',
        };

        const student_section_list_two = {
            'parentSession': nextSessionId,
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentStudent__parentTransferCertificate': 'null__korangle',
        };

        const test_second_list = {
            'parentExamination__parentSchool': schoolId,
            'parentExamination__parentSession': nextSessionId,
        };

        const class_subject_list = {
            parentSchool: schoolId,
            parentSession: nextSessionId,
        };

        const request_school_fee_rule_data = {
            'parentFeeType__parentSchool': schoolId,
            'parentSession': nextSessionId,
        };

        const request_class_filter_fee_data = {
            'parentSchoolFeeRule__parentFeeType__parentSchool': schoolId,
            'parentSchoolFeeRule__parentSession': nextSessionId,
        };

        const request_bus_stop_filter_fee_data = {
            'parentSchoolFeeRule__parentFeeType__parentSchool': schoolId,
            'parentSchoolFeeRule__parentSession': nextSessionId,
        };

        const tc_data = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentStudentSection__parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'status__in': ['Generated', 'Issued']
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs,{}), // 0
            this.vm.classService.getObjectList(this.vm.classService.division,{}),   // 1
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_list_one), // 2
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_list_two), // 3
            this.vm.examinationService.getObjectList(this.vm.examinationService.test_second, test_second_list), // 4
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_list), // 5
            this.vm.feeService.getList(this.vm.feeService.school_fee_rules, request_school_fee_rule_data),  // 6
            this.vm.feeService.getList(this.vm.feeService.class_filter_fees, request_class_filter_fee_data),    // 7
            this.vm.feeService.getList(this.vm.feeService.bus_stop_filter_fees, request_bus_stop_filter_fee_data),  // 8
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}), // 9
            this.vm.tcService.getObjectList(this.vm.tcService.transfer_certificate, tc_data),   // 10
        ]).then(value => {

            // console.log(value);

            this.vm.classList = value[0];
            this.vm.sectionList = value[1];

            this.vm.studentSectionListOne = value[2].filter(ss=> value[10].find(tc=>tc.parentStudentSection==ss.id)==undefined);
            this.vm.studentSectionListTwo = value[3];

            this.vm.testSecondList = value[4];
            this.vm.classSubjectList = value[5];
            this.vm.schoolFeeRuleList = value[6];
            this.vm.classFilterFeeList = value[7];
            this.vm.busStopFilterFeeList = value[8];
            this.vm.sessionList = value[9];

            this.populateFromAndToVariables();

            const student_list = [...new Set(this.vm.studentSectionListOne
                .map(a => a.parentStudent).concat(this.vm.studentSectionListTwo.map(a => a.parentStudent)))];

            const iterationCount = Math.ceil(student_list.length / this.vm.STUDENT_LIMITER);
            const service_list = [];
            let loopVariable = 0;
            while (loopVariable < iterationCount) {

                const temp_id_list = {
                    // tslint:disable-next-line:max-line-length
                    'id__in': student_list.slice(this.vm.STUDENT_LIMITER * loopVariable, this.vm.STUDENT_LIMITER * (loopVariable + 1)).join(),
                };

                service_list.push(this.vm.studentService.getObjectList(this.vm.studentService.student, temp_id_list));
                loopVariable = loopVariable + 1;
            }

            Promise.all(service_list).then(valueTwo => {

                // console.log(valueTwo);

                this.vm.studentList = [];
                let loopVariable = 0;
                while(loopVariable < iterationCount) {
                    this.vm.studentList = this.vm.studentList.concat(valueTwo[loopVariable]);
                    loopVariable = loopVariable + 1;
                }

                this.vm.isLoading = false;

            }, error => {
                this.vm.isLoading = false;
            })

        }, error => {
            this.vm.isLoading = false;
        });

    }

    populateFromAndToVariables(): void {

        this.vm.fromSelectedClass = this.vm.classList[0];
        this.vm.fromSelectedSection = this.vm.sectionList[0];
        this.vm.toSelectedClass = this.vm.classList[0];
        this.vm.toSelectedSection = this.vm.sectionList[0];

        const tempStudentIdList = this.vm.studentSectionListTwo.map(a => a.parentStudent);

        this.vm.unPromotedStudentList = this.vm.studentSectionListOne.filter(studentSection => {
            return !tempStudentIdList.includes(studentSection.parentStudent);
        });
    }


    // Promote Students
    promoteStudents(): void {

        this.vm.isLoading = true;

        const student_subject_list = [];

        this.vm.classSubjectList.filter(classSubject => {
            return classSubject.parentClass == this.vm.toSelectedClass.id
                && classSubject.parentDivision == this.vm.toSelectedSection.id;
        }).forEach(classSubject => {
            this.vm.newPromotedList.forEach(studentSection => {
                const student_subject = new StudentSubject();
                student_subject.parentStudent = studentSection.id;
                student_subject.parentSubject = classSubject.parentSubject;
                student_subject.parentSession = classSubject.parentSession;
                student_subject_list.push(student_subject);
            });
        });

        const student_test_list = [];

        this.vm.testSecondList.filter(testSecond => {
            return testSecond.parentClass == this.vm.toSelectedClass.id
                && testSecond.parentDivision == this.vm.toSelectedSection.id;
        }).forEach(testSecond => {
            this.vm.newPromotedList.forEach(studentSection => {
                const student_test = new StudentTest();
                student_test.parentExamination = testSecond.parentExamination;
                student_test.parentSubject = testSecond.parentSubject;
                student_test.parentStudent = studentSection.parentStudent;
                student_test.testType = testSecond.testType;
                student_test.marksObtained = 0;
                student_test_list.push(student_test);
            });
        });

        const feeTypeIdList = [...new Set(this.vm.schoolFeeRuleList.map(item => item.parentFeeType))];

        const student_fee_list = [];
        this.vm.newPromotedList.forEach(studentSection => {

            feeTypeIdList.forEach(feeTypeId => {
                this.vm.schoolFeeRuleList
                    .filter(item => {
                        return item.parentFeeType == feeTypeId;
                    }).sort((a, b) => {
                    return a.ruleNumber - b.ruleNumber;
                }).every(schoolFeeRule => {
                    if (schoolFeeRule.isClassFilter && this.vm.classFilterFeeList.find(classFilterFee => {
                        return classFilterFee.parentSchoolFeeRule == schoolFeeRule.id
                            && classFilterFee.parentClass == this.vm.toSelectedClass.id
                            && classFilterFee.parentDivision == this.vm.toSelectedSection.id;
                    }) == undefined) {
                        return true;
                    }
                    if (schoolFeeRule.isBusStopFilter && this.vm.busStopFilterFeeList.find(busStopFilterFee => {
                        return busStopFilterFee.parentSchoolFeeRule == schoolFeeRule.id
                            && busStopFilterFee.parentBusStop == this.vm.getStudent(studentSection.parentStudent).currentBusStop;
                    }) == undefined) {
                        return true;
                    }
                    if (schoolFeeRule.onlyNewAdmission) {
                        return true;
                    }
                    if (!schoolFeeRule.includeRTE && this.vm.getStudent(studentSection.parentStudent).rte == 'YES') {
                        return true;
                    }

                    const student_fee_object = new StudentFee();
                    student_fee_object.parentStudent = studentSection.parentStudent;
                    student_fee_object.parentSchoolFeeRule = schoolFeeRule.id;
                    student_fee_object.parentFeeType = schoolFeeRule.parentFeeType;
                    student_fee_object.parentSession = schoolFeeRule.parentSession;
                    student_fee_object.isAnnually = schoolFeeRule.isAnnually;
                    student_fee_object.cleared = false;
                    this.vm.installmentList.forEach(installment => {
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

        });

        Promise.all([
            this.vm.studentService.createObjectList(this.vm.studentService.student_section, this.vm.newPromotedList),
            this.vm.subjectService.createObjectList(this.vm.subjectService.student_subject, student_subject_list),
            this.vm.examinationService.createObjectList(this.vm.examinationService.student_test, student_test_list),
            this.vm.feeService.createObjectList(this.vm.feeService.student_fees, student_fee_list),
        ]).then(value => {

            alert('Students promoted successfully');

            this.handleAfterPromotion(value[0]);

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }

    handleAfterPromotion(promotedList: any): void {

        const tempStudentSectionIdList = promotedList.map(a => a.parentStudent);

        this.vm.unPromotedStudentList = this.vm.unPromotedStudentList.filter(item => {
            return !tempStudentSectionIdList.includes(item.parentStudent);
        });

        this.vm.studentSectionListTwo = this.vm.studentSectionListTwo.concat(promotedList);

        this.vm.newPromotedList = [];

    }

}
