
import {GradeStudentFieldsComponent} from './grade-student-fields.component';

export class GradeStudentFieldsServiceAdapter {

    vm: GradeStudentFieldsComponent;

    constructor() {}

    // Data
    examinationList: any;
    classList: any;
    sectionList: any;
    fieldList: any;
    subFieldList: any;
    permissionList: any;

    studentList: any;

    initializeAdapter(vm: GradeStudentFieldsComponent): void {
        this.vm = vm;
    }

    copyObject(object: any): any {
        let tempObject = {};
        Object.keys(object).forEach(key => {
            tempObject[key] = object[key];
        });
        return tempObject;
    }

    //initialize data
    initializeData(): void {
        this.vm.isInitialLoading = true;

        let request_examination_data = {
            'sessionId': this.vm.user.activeSchool.currentSessionDbId,
            'schoolId': this.vm.user.activeSchool.dbId,
        };

        let request_field_data = {};

        let request_sub_field_data = {};

        let request_student_mini_profile_data = {
            'schoolDbId': this.vm.user.activeSchool.dbId,
            'sessionDbId': this.vm.user.activeSchool.currentSessionDbId,
        };

        let request_permission_data = {
            'parentEmployee': this.vm.user.activeSchool.employeeId,
            'sessionId': this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.examinationService.getExaminationList(request_examination_data, this.vm.user.jwt),

            this.vm.classService.getClassList(this.vm.user.jwt),
            this.vm.classService.getSectionList(this.vm.user.jwt),
            this.vm.attendanceService.getAttendancePermissionList(request_permission_data, this.vm.user.jwt),

            this.vm.subjectService.getExtraFieldList(request_field_data, this.vm.user.jwt),
            this.vm.subjectService.getExtraSubFieldList(request_sub_field_data, this.vm.user.jwt),
            this.vm.studentService.getStudentMiniProfileList(request_student_mini_profile_data, this.vm.user.jwt),
        ]).then(value => {

            this.examinationList = value[0];
            this.vm.examinationList = value[0];
            if (this.vm.examinationList.length > 0) {
                this.vm.selectedExamination = this.vm.examinationList[0];
            }

            this.classList = value[1];
            this.sectionList = value[2];
            this.permissionList = value[3];
            this.populateClassSectionList();

            this.fieldList = value[4];
            this.subFieldList = value[5];
            this.populateFieldList();

            this.studentList = value[6];

            this.vm.isInitialLoading = false;

        }, error => {
            this.vm.isInitialLoading = false;
        });

    }

    populateFieldList(): any {
        this.vm.fieldList = this.fieldList;
        this.vm.fieldList.forEach(field => {
            field['subFieldList'] = [];
            this.subFieldList.forEach( subField => {
                if (subField.parentExtraField === field.id) {
                    field['subFieldList'].push(subField);
                }
            });
        });
        this.vm.selectedField = this.vm.fieldList[0];
    }

    populateClassSectionList(): any {
        this.vm.classSectionList = [];
        this.classList.forEach(classs => {
            let tempClass = this.copyObject(classs);
            tempClass['sectionList'] = [];
            this.sectionList.forEach(section => {
                if (this.isClassSectionInPermissionList(classs, section)) {
                    let tempSection = this.copyObject(section);
                    tempClass['sectionList'].push(tempSection);
                }
            });
            if (tempClass.sectionList.length > 0) {
                tempClass['selectedSection'] = tempClass['sectionList'][0];
                this.vm.classSectionList.push(tempClass);
            }
        });
        if (this.vm.classSectionList.length > 0) {
            this.vm.selectedClass = this.vm.classSectionList[0];
        }
    }

    isClassSectionInPermissionList(classs: any, section: any): boolean {
        let result = false;
        this.permissionList.every(item => {
            if (item.parentClass === classs.dbId
                && item.parentDivision === section.id) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    // Get Student Field Details
    getStudentFieldDetails(): void {

        this.vm.isLoading = true;

        let request_student_field_data = {
            'studentList': this.getStudentIdListForSelectedItems().join(),
            'examinationList': [this.vm.selectedExamination.id],
            'subFieldList': this.getSubFieldList().join(),
        };

        this.vm.examinationService.getStudentExtraSubFieldList(request_student_field_data, this.vm.user.jwt).then(value2 => {
            this.populateStudentList(value2);
            this.vm.showTestDetails = true;
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    getStudentIdListForSelectedItems(): any {
        let id_list = [];
        this.studentList.forEach(item => {
            if (item.classDbId === this.vm.selectedClass.dbId
                && item.sectionDbId === this.vm.selectedClass.selectedSection.id) {
                id_list.push(item.dbId);
            }
        });
        return id_list;
    }

    getSubFieldList(): any {
        let id_list = [];
        id_list = this.vm.selectedField.subFieldList.map(a => a.id);
        return id_list;
    }

    populateStudentList(student_sub_field_list: any): void {
        this.vm.studentList = [];
        this.studentList.filter(item => {
            if (item.classDbId === this.vm.selectedClass.dbId
                && item.sectionDbId === this.vm.selectedClass.selectedSection.id
                && item.parentTransferCertificate === null) {
                return true;
            }
            return false;
        }).forEach(item => {
            let tempItem = {};
            tempItem = this.copyObject(item);
            tempItem['subFieldList'] = [];
            this.vm.selectedField.subFieldList.forEach(subField => {
                let result = this.getStudentSubField(item, subField, student_sub_field_list);
                if (result) {
                    if (result.marksObtained == 0.0) {
                        result.marksObtained = null;
                    }
                    tempItem['subFieldList'].push(result);
                } else {
                    result = {
                        'id': 0,
                        'parentStudent': item.dbId,
                        'parentExamination': this.vm.selectedExamination.id,
                        'parentExtraSubField': subField.id,
                        'marksObtained': null,
                    };
                    tempItem['subFieldList'].push(result);
                }
            });
            this.vm.studentList.push(tempItem);
        });
    }

    getStudentSubField(student: any, subField: any, student_sub_field_list: any): any {
        let result = null;
        student_sub_field_list.every(item => {
            if (item.parentStudent === student.dbId
                && item.parentExtraSubField === subField.id) {
                result = item;
                return false;
            }
            return true;
        });
        return result;
    }


    // Update Student Field Details
    updateStudentFieldDetails(): void {

        let student_field_data_to_update = this.getStudentFieldDataToUpdate();
        let student_field_data_to_add = this.getStudentFieldDataToAdd();
        student_field_data_to_update.forEach(item => {
            if (item.marksObtained == null) {
                item.marksObtained = 0.0;
            } else {
                item.marksObtained = parseFloat(item.marksObtained.toString()).toFixed(1);
            }
        });
        student_field_data_to_add.forEach(item => {
            if (item.marksObtained == null) {
                item.marksObtained = 0.0;
            } else {
                item.marksObtained = parseFloat(item.marksObtained.toString()).toFixed(1);
            }
        });

        this.vm.isLoading = true;

        Promise.all([
            this.vm.examinationService.updateStudentExtraSubFieldList(student_field_data_to_update, this.vm.user.jwt),
            this.vm.examinationService.createStudentExtraSubFieldList(student_field_data_to_add, this.vm.user.jwt),
        ]).then(value => {
            alert('Student Fields updated successfully');
            this.populateStudentList(value[0].concat(value[1]));
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    getStudentFieldDataToUpdate(): any {
        let data = [];
        this.vm.studentList.forEach(student => {
            data = data.concat(student.subFieldList.filter(subField => {
                return subField.id !== 0;
            }));
        });
        return data;
    }

    getStudentFieldDataToAdd(): any {
        let data = [];
        this.vm.studentList.forEach(student => {
            data = data.concat(student.subFieldList.filter(subField => {
                return subField.id === 0;
            }));
        });
        return data;
    }

}