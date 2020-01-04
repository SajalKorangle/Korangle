
import { PromoteStudentComponent } from './promote-student.component';
import { ATTENDANCE_STATUS_LIST } from '../../../attendance/classes/constants';
import {Student} from '../../../../classes/student';
import {StudentSubject} from "../../../../services/modules/subject/models/student-subject";
import {StudentTest} from "../../../../services/modules/examination/models/student-test";
import {StudentFee} from "../../../../services/modules/fees/models/student-fee";

export class PromoteStudentServiceAdapter {

    vm: PromoteStudentComponent;

    constructor() {}

    initializeAdapter(vm: PromoteStudentComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {

        let schoolId = this.vm.user.activeSchool.dbId;
        let sessionId = this.vm.user.activeSchool.currentSessionDbId;
        let nextSessionId = this.vm.user.activeSchool.currentSessionDbId+1;

        let student_section_list_one = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentStudent__parentTransferCertificate': 'null__korangle',
        };

        let student_section_list_two = {
            'parentSession': nextSessionId,
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentStudent__parentTransferCertificate': 'null__korangle',
        };

        let test_second_list = {
            'parentExamination__parentSchool': schoolId,
            'parentExamination__parentSession': nextSessionId,
        };

        let class_subject_list = {
            parentSchool: schoolId,
            parentSession: nextSessionId,
        };

        let request_school_fee_rule_data = {
            'parentFeeType__parentSchool': schoolId,
            'parentSession': nextSessionId,
        };

        let request_class_filter_fee_data = {
            'parentSchoolFeeRule__parentFeeType__parentSchool': schoolId,
            'parentSchoolFeeRule__parentSession': nextSessionId,
        };

        let request_bus_stop_filter_fee_data = {
            'parentSchoolFeeRule__parentFeeType__parentSchool': schoolId,
            'parentSchoolFeeRule__parentSession': nextSessionId,
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs,{}),
            this.vm.classService.getObjectList(this.vm.classService.division,{}),            
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_list_one),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_list_two),
            this.vm.examinationService.getObjectList(this.vm.examinationService.test_second, test_second_list),
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_list),
            this.vm.feeService.getList(this.vm.feeService.school_fee_rules, request_school_fee_rule_data),
            this.vm.feeService.getList(this.vm.feeService.class_filter_fees, request_class_filter_fee_data),
            this.vm.feeService.getList(this.vm.feeService.bus_stop_filter_fees, request_bus_stop_filter_fee_data),
        ]).then(value => {

            console.log(value);

            this.vm.classList = value[0];
            this.vm.sectionList = value[1];

            this.vm.studentSectionListOne = value[2];
            this.vm.studentSectionListTwo = value[3];

            this.vm.testSecondList = value[4];
            this.vm.classSubjectList = value[5];
            this.vm.schoolFeeRuleList = value[6];
            this.vm.classFilterFeeList = value[7];
            this.vm.busStopFilterFeeList = value[8];

            this.populateFromAndToVariables();

            let student_list = {
                'id__in': [...new Set(this.vm.studentSectionListOne
                    .map(a => a.parentStudent).concat(this.vm.studentSectionListTwo.map(a => a.parentStudent)))],
            };

            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student, student_list),
            ]).then(valueTwo => {

                console.log(valueTwo);

                this.vm.studentList = valueTwo[0];

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

        let tempStudentIdList = this.vm.studentSectionListTwo.map(a => a.parentStudent);

        this.vm.unPromotedStudentList = this.vm.studentSectionListOne.filter(studentSection => {
            return !tempStudentIdList.includes(studentSection.parentStudent);
        });
    }


    // Promote Students
    promoteStudents(): void {

        this.vm.isLoading = true;

        let student_subject_list = [];

        this.vm.classSubjectList.filter(classSubject => {
            return classSubject.parentClass == this.vm.toSelectedClass.dbId
                && classSubject.parentDivision == this.vm.toSelectedSection.id;
        }).forEach(classSubject => {
            this.vm.newPromotedList.forEach(studentSection => {
                let student_subject = new StudentSubject();
                student_subject.parentStudent = studentSection.id;
                student_subject.parentSubject = classSubject.parentSubject;
                student_subject.parentSession = classSubject.parentSession;
                student_subject_list.push(student_subject);
            });
        });

        let student_test_list = [];

        this.vm.testSecondList.filter(testSecond => {
            return testSecond.parentClass == this.vm.toSelectedClass.dbId
                && testSecond.parentDivision == this.vm.toSelectedSection.id;
        }).forEach(testSecond => {
            this.vm.newPromotedList.forEach(studentSection => {
                let student_test = new StudentTest();
                student_test.parentExamination = testSecond.parentExamination;
                student_test.parentSubject = testSecond.parentSubject;
                student_test.parentStudent = studentSection.parentStudent;
                student_test.testType = testSecond.testType;
                student_test.marksObtained = 0;
                student_test_list.push(student_test);
            });
        });

        let feeTypeIdList = [...new Set(this.vm.schoolFeeRuleList.map(item => item.parentFeeType))];

        let student_fee_list = [];
        this.vm.newPromotedList.forEach(studentSection => {

            feeTypeIdList.forEach(feeTypeId => {
                this.vm.schoolFeeRuleList
                    .filter(item => {
                        return item.parentFeeType==feeTypeId;
                    }).sort((a,b) => {
                    return a.ruleNumber-b.ruleNumber;
                }).every(schoolFeeRule => {
                    if (schoolFeeRule.isClassFilter && this.vm.classFilterFeeList.find(classFilterFee => {
                        return classFilterFee.parentSchoolFeeRule == schoolFeeRule.id
                            && classFilterFee.parentClass == this.vm.toSelectedClass.dbId
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
                    if (schoolFeeRule.onlyNewAdmission
                        && this.vm.getStudent(studentSection.parentStudent).admissionSession != this.vm.user.activeSchool.currentSessionDbId) {
                        return true;
                    }
                    if (!schoolFeeRule.includeRTE && this.vm.getStudent(studentSection.parentStudent).rte == "YES") {
                        return true;
                    }

                    let student_fee_object = new StudentFee();
                    student_fee_object.parentStudent = studentSection.parentStudent;
                    student_fee_object.parentSchoolFeeRule = schoolFeeRule.id;
                    student_fee_object.parentFeeType = schoolFeeRule.parentFeeType;
                    student_fee_object.parentSession = schoolFeeRule.parentSession;
                    student_fee_object.isAnnually = schoolFeeRule.isAnnually;
                    student_fee_object.cleared = false;
                    this.vm.installmentList.forEach(installment => {
                        student_fee_object[installment+'Amount'] = schoolFeeRule[installment+'Amount'];
                        student_fee_object[installment+'LastDate'] = schoolFeeRule[installment+'LastDate'];
                        student_fee_object[installment+'LateFee'] = schoolFeeRule[installment+'LateFee'];
                        student_fee_object[installment+'MaximumLateFee'] = schoolFeeRule[installment+'MaximumLateFee'];
                        student_fee_object[installment+'ClearanceDate'] = null;
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

        let tempStudentSectionIdList = promotedList.map(a => a.parentStudent);

        this.vm.unPromotedStudentList = this.vm.unPromotedStudentList.filter(item => {
            return !tempStudentSectionIdList.includes(item.parentStudent);
        });

        this.vm.studentSectionListTwo = this.vm.studentSectionListTwo.concat(promotedList);

        this.vm.newPromotedList = [];

    }

}
