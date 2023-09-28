import { DeleteStudentComponent } from './delete-student.component';
import { CommonFunctions } from '@classes/common-functions';
import { Query } from '@services/generic/query';
import { CommonFunctions as CommonFunctionsRecordActivity } from '@modules/common/common-functions';

export class DeleteStudentServiceAdapter {
    vm: DeleteStudentComponent;

    constructor() {}

    initializeAdapter(vm: DeleteStudentComponent): void {
        this.vm = vm;
    }

    //initialize data
    async initializeData(): Promise<any> {

        this.vm.isLoading = true;

        const classQuery = new Query()
            .filter({})
            .getObjectList({ class_app: 'Class' });

        const divisionQuery = new Query()
            .filter({})
            .getObjectList({ class_app: 'Division' });

        const studentParameterQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ student_app: 'StudentParameter' });

        const studentParameterValueQuery = new Query()
            .filter({ parentStudent__parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ student_app: 'StudentParameterValue' });

        const busStopQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ school_app: 'BusStop' });

        const sessionQuery = new Query()
            .filter({})
            .getObjectList({ school_app: 'Session' });

        const transferCertificateNewQuery = new Query()
            .filter({
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
                parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
                status__in: ['Generated', 'Issued'],
            })
            .getObjectList({ tc_app: 'TransferCertificateNew' });

        const studentSectionQuery = new Query()
            .filter({
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
                parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            })
            .orderBy('parentClass__orderNumber', 'parentDivision__orderNumber', 'rollNumber', 'parentStudent__name')
            .getObjectList({ student_app: 'StudentSection' });

        const issuedBookQuery = new Query()
            .filter({
                parentSchool: this.vm.user.activeSchool.dbId,
            })
            .annotate(
                'issuedBooks',
                'book_issue_record__id',
                'Count',
                {
                    book_issue_record__depositTime: null
                }
            )
            .setFields('issuedBooks')
            .getObjectList({ student_app: 'Student' });

        let classList, divisionList;

        [
            classList,
            divisionList,
            this.vm.studentParameterList,
            this.vm.studentParameterValueList,
            this.vm.busStopList,
            this.vm.session_list,
            this.vm.backendData.tcList,
            this.vm.studentSectionList,
            this.vm.issuedBookRecordList
        ] = await Promise.all([
            classQuery, // 0
            divisionQuery,  // 1
            studentParameterQuery,  // 2
            studentParameterValueQuery, // 3
            busStopQuery,   // 4
            sessionQuery,   // 5
            transferCertificateNewQuery,    // 6
            studentSectionQuery,    // 7,
            issuedBookQuery // 8
        ]);

        console.log(this.vm.issuedBookRecordList);

        classList.forEach((classs) => {
            classs.sectionList = [];
            divisionList.forEach((section) => {
                classs.sectionList.push(CommonFunctions.getInstance().copyObject(section));
            });
        });
        this.vm.initializeClassSectionList(classList);
        this.vm.studentParameterList = this.vm.studentParameterList.map((x) => ({
            ...x,
            filterValues: JSON.parse(x.filterValues).map((x2) => ({ name: x2, show: false })),
            showNone: false,
            filterFilterValues: '',
        }));
        this.vm.studentParameterOtherList = this.vm.studentParameterList.filter((x) => x.parameterType !== 'DOCUMENT');

        let tempStudentProfileList = [];
        let studentIdList = [];
        this.vm.studentSectionList.forEach(student => {
            studentIdList.push(student.parentStudent);
        });
        let studentList = await new Query().filter({id__in: studentIdList}).getObjectList({ student_app: 'Student'});

        this.vm.studentSectionList.forEach((student_section_object) => {
            let student_object = studentList.find((student) => { return student.id == student_section_object.parentStudent; });
            let class_object = classList.find((classs) => {return classs.id == student_section_object.parentClass; });
            let division_object = divisionList.find((division) => {return division.id == student_section_object.parentDivision; });
            tempStudentProfileList.push(this.get_student_full_profile(student_section_object, student_object, class_object, division_object));
        });

        this.vm.initializeStudentFullProfileList(tempStudentProfileList);
    }

    get_student_full_profile(student_section_object, student_object, class_object, division_object): any {

        let student_data = {};

        student_data['profileImage'] = student_object.profileImage;
        student_data['name'] = student_object.name;
        student_data['dbId'] = student_object.id;
        student_data['fathersName'] = student_object.fathersName;
        student_data['mobileNumber'] = student_object.mobileNumber;
        student_data['secondMobileNumber'] = student_object.secondMobileNumber;
        student_data['dateOfBirth'] = student_object.dateOfBirth;
        student_data['remark'] = student_object.remark;
        student_data['rollNumber'] = student_section_object.rollNumber;
        student_data['scholarNumber'] = student_object.scholarNumber;
        student_data['motherName'] = student_object.motherName;
        student_data['gender'] = student_object.gender;
        student_data['caste'] = student_object.caste;
        student_data['category'] = student_object.newCategoryField;
        student_data['religion'] = student_object.newReligionField;
        student_data['fatherOccupation'] = student_object.fatherOccupation;
        student_data['address'] = student_object.address;
        student_data['familySSMID'] = student_object.familySSMID;
        student_data['childSSMID'] = student_object.childSSMID;
        student_data['bankName'] = student_object.bankName;
        student_data['bankIfscCode'] = student_object.bankIfscCode;
        student_data['bankAccountNum'] = student_object.bankAccountNum;
        student_data['aadharNum'] = student_object.aadharNum;
        student_data['bloodGroup'] = student_object.bloodGroup;
        student_data['fatherAnnualIncome'] = student_object.fatherAnnualIncome;
        student_data['rte'] = student_object.rte;
        student_data['parentTransferCertificate'] = student_object.parentTransferCertificate;
        student_data['busStopDbId'] = student_object.currentBusStop;
        student_data['admissionSessionDbId'] = student_object.admissionSession;
        student_data['dateOfAdmission'] = student_object.dateOfAdmission;
        student_data['parentAdmissionClass'] = student_object.parentAdmissionClass;
        student_data['sectionDbId'] = division_object.id;
        student_data['sectionName'] = division_object.name;
        student_data['className'] = class_object.name;
        student_data['classDbId'] = class_object.id;

        return student_data;
    }

    async checkDeletability(studentList: any): Promise<any> {

        this.vm.isLoading = true;

        let studentIdList = [];
        studentList.forEach((student) => {
            studentIdList.push(student.dbId);
        });

        const studentSectionQuery = new Query()
            .filter({ parentStudent__in: studentIdList })
            .getObjectList({ student_app: 'StudentSection' });

        const feeReceiptQuery = new Query()
            .filter({
                parentStudent__in: studentIdList,
                cancelled: 'False',
            })
            .getObjectList({ fees_third_app: 'FeeReceipt' });

        const discountQuery = new Query()
            .filter({
                parentStudent__in: studentIdList,
                cancelled: 'False',
            })
            .getObjectList({ fees_third_app: 'Discount' });

        const transferCertificateNewQuery = new Query()
            .filter({
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
                parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
                status__in: ['Generated', 'Issued'],
            })
            .getObjectList({ tc_app: 'TransferCertificateNew' });

        let selectedStudentSectionList, selectedStudentFeeReceiptList, selectedStudentDiscountList, selectedStudentTcList;

        [
            selectedStudentSectionList,
            selectedStudentFeeReceiptList,
            selectedStudentDiscountList,
            selectedStudentTcList
        ] = await Promise.all([
            studentSectionQuery,    // 0
            feeReceiptQuery,    // 1
            discountQuery,  //2
            transferCertificateNewQuery,    // 3
        ]);

        studentList.forEach((student) => {

            this.vm.selectedStudentSectionList = selectedStudentSectionList.filter(x => x.parentStudent == student.dbId);
            this.vm.selectedStudentFeeReceiptList = selectedStudentFeeReceiptList.filter(x => x.parentStudent == student.dbId);
            this.vm.selectedStudentDiscountList = selectedStudentDiscountList.filter(x => x.parentStudent == student.dbId);
            this.vm.selectedStudentTcList = selectedStudentTcList.filter(x => x.parentStudent == student.dbId);

            student.deleteDisabledReason = {};

            student.deleteDisabledReason["hasMultipleSessions"] = this.vm.selectedStudentSectionList.length > 1;

            student.deleteDisabledReason["hasFeeReceipt"] = this.vm.selectedStudentFeeReceiptList.find((feeReceipt) => {
                return (
                    feeReceipt.parentStudent == student.dbId &&
                    feeReceipt.parentSession == this.vm.user.activeSchool.currentSessionDbId &&
                    feeReceipt.cancelled == false
                );
            }) != undefined;

            student.deleteDisabledReason["hasDiscount"] = this.vm.selectedStudentDiscountList.find((discount) => {
                return (
                    discount.parentStudent == student.dbId &&
                    discount.parentSession == this.vm.user.activeSchool.currentSessionDbId &&
                    discount.cancelled == false
                );
            }) != undefined;

            student.deleteDisabledReason["hasTC"] = this.vm.selectedStudentTcList.find((tc) => {
                return (
                    tc.parentStudent == student.dbId &&
                    tc.parentSession == this.vm.user.activeSchool.currentSessionDbId &&
                    tc.cancelledBy == null
                );
            }) != undefined;
            student.deleteDisabledReason["hasIssuedBooks"] = this.vm.issuedBookRecordList.find((record)=>record.id === student.dbId).issuedBooks;

            student.isDeletable = !student.deleteDisabledReason["hasMultipleSessions"] &&
            !student.deleteDisabledReason["hasFeeReceipt"] &&
            !student.deleteDisabledReason["hasDiscount"] &&
            !student.deleteDisabledReason["hasTC"] &&
            !student.deleteDisabledReason["hasIssuedBooks"]
            ;

            if (!student.isDeletable) {
                let msg = "The student can't be deleted due to the following reason(s) - \n";
                if (student.deleteDisabledReason["hasMultipleSessions"]) {
                    msg = msg + "Student is registered in multiple sessions.\n";
                }
                if (student.deleteDisabledReason["hasFeeReceipt"]) {
                    msg = msg + "Fee Receipt/s have been issued for the student.\n";
                }
                if (student.deleteDisabledReason["hasDiscount"]) {
                    msg = msg + "Discount/s have been issued for the student.\n";
                }
                if (student.deleteDisabledReason["hasTC"]) {
                    msg = msg + "TC is already generated.\n";
                }
                if (student.deleteDisabledReason["hasIssuedBooks"]) {
                    msg = msg + `Student has ${student.deleteDisabledReason["hasIssuedBooks"]} issued books.\n`;
                }
                student['nonDeletableMessage'] = msg;
            }

        });
        this.vm.isLoading = false;
    }

    async deleteSelectedStudents(): Promise<any> {
        this.vm.isLoading = true;
        let parentEmployee = this.vm.user.activeSchool.employeeId;
        let moduleName = this.vm.user.section.title;
        let taskName = this.vm.user.section.subTitle;
        let moduleList = this.vm.user.activeSchool.moduleList;
        let actionString = "";

        let deletableStudentIdList = [];
        let deletableStudentNameList = [];

        if (this.vm.currentClassStudentFilter == 'Class') {
            this.vm.studentFullProfileList.forEach((student) => {
                if (student.show && student.selectProfile && student.isDeletable) {
                    deletableStudentIdList.push(student.dbId);
                    deletableStudentNameList.push(student.name);
                }
            });
        }
        else if (this.vm.currentClassStudentFilter == 'Student') {
            deletableStudentIdList.push(this.vm.selectedStudent.dbId);
            deletableStudentNameList.push(this.vm.selectedStudent.name);
        }

        if (deletableStudentIdList.length == 0) {
            this.vm.isLoading = false;
            return;
        }

        this.vm.studentFullProfileList = this.vm.studentFullProfileList.filter((x) => {
            let flag = true;
            deletableStudentIdList.forEach((id) => {
                flag = flag && (id != x.dbId);
            });
            return flag;
        });

        this.vm.handleStudentDisplay();

        await new Query().filter({ id__in: deletableStudentIdList }).deleteObjectList({ student_app: 'Student' });

        deletableStudentNameList.forEach((studentName) => {
            actionString = " deleted a student " + studentName + " from the session.";
            CommonFunctionsRecordActivity.createRecord(parentEmployee, moduleName, taskName, moduleList, actionString);
        });

        this.vm.selectedStudent = null;
        this.vm.isLoading = false;
    }
}
