import { UpdateViaExcelComponent } from './update-via-excel.component';
import { CommonFunctions } from '@classes/common-functions';
import { Query } from '@services/generic/query';


export class UpdateViaExcelServiceAdapter {
    vm: UpdateViaExcelComponent;

    constructor() { }

    initializeAdapter(vm: UpdateViaExcelComponent): void {
        this.vm = vm;
    }

    /* Initialize Data */
    async initializeData() {
        this.vm.isLoading = true;

        const student_full_profile_request_filter = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const student_section_filter = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        const tc_filter = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            status__in: ['Generated', 'Issued'],
        };

        const tc_fields = ['parentStudent'];

        const classQuery = new Query()
            .getObjectList({class_app: 'Class'});

        const divisionQuery = new Query()
            .getObjectList({class_app: 'Division'});

        const studentQuery = new Query()
            .filter(student_full_profile_request_filter)
            .getObjectList({student_app: 'Student'});

        const studentSectionQuery = new Query()
            .filter(student_section_filter)
            .getObjectList({student_app: 'StudentSection'});

        const tcQuery = new Query()
            .filter(tc_filter)
            .setFields(...tc_fields)
            .getObjectList({tc_app: 'TransferCertificateNew'});

        let studentList = [];
        let studentSectionList = [];
        [
            this.vm.classList,   // 0
            this.vm.sectionList,   // 1
            studentList,   // 2
            studentSectionList,   // 3
            this.vm.tcList,   // 4
        ] = await Promise.all([
            classQuery,   // 0
            divisionQuery,   // 1
            studentQuery,   // 2
            studentSectionQuery,   // 3
            tcQuery,   // 4
        ]);

        this.vm.initializeClassSectionList();

        this.vm.studentSectionList = studentSectionList;

        /* Initialize Student Full Profile List */
        let studentFullProfileList = [];
        for (let i = 0; i < studentSectionList.length; i++) {
            for (let j = 0; j < studentList.length; j++) {
                if (studentSectionList[i].parentStudent === studentList[j].id) {

                    let student_data = {};
                    let student_object = studentList[j];
                    let student_section_object = studentSectionList[i];

                    if (student_object.profileImage) {
                        student_data['profileImage'] = student_object.profileImage;
                    } else {
                        student_data['profileImage'] = this.vm.NULL_CONSTANT;
                    }

                    student_data['name'] = student_object.name;
                    student_data['id'] = student_object.id;
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
                    student_data['newCategoryField'] = student_object.newCategoryField;
                    student_data['newReligionField'] = student_object.newReligionField;
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
                    student_data['dateOfAdmission'] = student_object.dateOfAdmission;

                    if (student_object.currentBusStop) {
                        student_data['currentBusStop'] = student_object.currentBusStop;
                    } else {
                        student_data['currentBusStop'] = this.vm.NULL_CONSTANT;
                    }

                    if (student_object.admissionSession) {
                        student_data['admissionSession'] = student_object.admissionSession;
                    } else {
                        student_data['admissionSession'] = this.vm.NULL_CONSTANT;
                    }

                    if (student_object.parentAdmissionClass) {
                        student_data['parentAdmissionClass'] = student_object.parentAdmissionClass;
                    }

                    student_data['parentDivision'] = student_section_object.parentDivision;
                    student_data['sectionName'] = this.vm.sectionList.find(section => section.id == student_section_object.parentDivision).name;
                    student_data['className'] = this.vm.classList.find(classs => classs.id == student_section_object.parentClass).name;
                    student_data['parentClass'] = student_section_object.parentClass;
                    studentFullProfileList.push(student_data);
                    break;
                }
            }
        }
        this.vm.initializeStudentFullProfileList(studentFullProfileList);
        this.vm.isLoading = false;
    }  // Ends: initializeData()
}
