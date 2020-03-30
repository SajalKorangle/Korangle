
import {GradeStudentFieldsComponent} from './grade-student-fields.component';

export class GradeStudentFieldsServiceAdapter {

    vm: GradeStudentFieldsComponent;

    constructor() {}

    // Data
    // examinationList: any;
    classList: any;
    sectionList: any;
    // fieldList: any;
    // subFieldList: any;
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
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        let request_field_data = {};

        let request_sub_field_data = {};

        let request_permission_data = {
            'parentEmployee': this.vm.user.activeSchool.employeeId,
            'sessionId': this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination,request_examination_data),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.attendanceService.getAttendancePermissionList(request_permission_data, this.vm.user.jwt),
            this.vm.reportCardMpBoardService.getObjectList(this.vm.reportCardMpBoardService.extra_field, request_field_data),
            this.vm.reportCardMpBoardService.getObjectList(this.vm.reportCardMpBoardService.extra_sub_field, request_sub_field_data),
        ]).then(value => {
            // this.examinationList = value[0];

            console.log(value);

            this.vm.examinationList = value[0];
            if (this.vm.examinationList.length > 0) {
                this.vm.selectedExamination = this.vm.examinationList[0];
            } else {
                this.vm.isInitialLoading = false;
                return;
            }

            this.classList = value[1];
            this.sectionList = value[2];
            this.permissionList = value[3];
            
            let class_9_id, class_10_id, class_11_id, class_12_id;
            this.classList.forEach(classs => {
                switch(classs.name) {
                    case 'Class - 9':
                        class_9_id = classs.id;
                        break;
                    case 'Class - 10':
                        class_10_id = classs.id;
                        break;
                    case 'Class - 11':
                        class_11_id = classs.id;
                        break;
                    case 'Class - 12':
                        class_12_id = classs.id;
                        break;
                }
            });

            this.permissionList = this.permissionList.filter(permission => {
                switch(permission.parentClass) {
                    case class_9_id:
                    case class_10_id:
                    case class_11_id:
                    case class_12_id:
                        return false;
                }
                return true;
            });

            if(this.permissionList.length == 0) {
                this.vm.isInitialLoading = false;
                return;
            }

            let request_student_section_data = {
                'parentStudent__parentSchool':this.vm.user.activeSchool.dbId,
                'parentDivision__in':Array.from(new Set(this.permissionList.map(item=>{return item.parentDivision}))).join(),
                'parentClass__in':Array.from(new Set(this.permissionList.map(item=>{return item.parentClass}))).join(),
                'parentSession':this.vm.user.activeSchool.currentSessionDbId,
                'parentStudent__parentTransferCertificate': 'null__korangle',
            };

            let student_studentSection_map = {};
            this.vm.studentService.getObjectList(this.vm.studentService.student_section,request_student_section_data).then(value_studentSection => {

                value_studentSection = value_studentSection.filter(item => {
                    if(this.permissionList.find(permission=>{
                        return permission.parentClass == item.parentClass && permission.parentDivision == item.parentDivision
                    }) != undefined){
                        return true;
                    }
                    return false;
                });

                if(value_studentSection.length == 0){
                    this.vm.isInitialLoading = false;
                    // alert('No students have been allocated');
                    return;
                }
                
                let student_id = [];
                value_studentSection.forEach(item=>{
                    student_studentSection_map[item.parentStudent] = item;
                    student_id.push(item.parentStudent);
                });

                let request_student_data = {
                    'id__in':student_id.join(),
                    'fields__korangle': 'id,name,profileImage',
                };

                this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_data).then(
                    value_student=>{

                        // map student with student section
                        this.vm.studentList = value_student.map(student => {
                            student['studentSection'] = student_studentSection_map[student.id];
                            return student;
                        });

                        this.populateClassSectionList(value_studentSection);

                        this.vm.isInitialLoading = false;

                    }, error => {
                        console.log('Error fetching students');
                    });

            }, error => {
                console.log('Error fetching student section data');
            });

            // this.fieldList = value[4];
            // this.subFieldList = value[5];
            this.populateFieldList(value[4], value[5]);
        }, error => {
            this.vm.isInitialLoading = false;
        });

    }

    populateFieldList(fieldList: any, subFieldList: any): any {
        this.vm.fieldList = fieldList;
        this.vm.fieldList.forEach(field => {
            field['subFieldList'] = [];
            subFieldList.forEach( subField => {
                if (subField.parentExtraField === field.id) {
                    field['subFieldList'].push(subField);
                }
            });
        });
        console.log(this.vm.fieldList);
        this.vm.selectedField = this.vm.fieldList[0];
    }

    populateClassSectionList(studentSectionList: any): any {

        this.vm.classSectionList = [];

        this.classList.forEach(classs => {
            this.sectionList.forEach(section => {
                if (this.isClassSectionInPermissionList(classs, section) &&
                    studentSectionList.find(studentSection => {
                        return studentSection.parentClass == classs.id
                            && studentSection.parentDivision == section.id;
                    }) != undefined) {
                    this.vm.classSectionList.push({
                        'class': classs,
                        'section': section,
                    });
                }
            });
        });

        if (this.vm.classSectionList.length > 0) {
            // Sort on basis of orderNumber; small order number will come first
            this.vm.classSectionList = this.vm.classSectionList.sort(function(obj1, obj2){
                if(obj1.orderNumber == obj2.orderNumber){
                    return obj1.orderNumber - obj2.orderNumber;
                }
                return obj1.orderNumber - obj2.orderNumber;
            });
            this.vm.selectedClassSection = this.vm.classSectionList[0];
        }

    }

    isClassSectionInPermissionList(classs: any, section: any): boolean {
        let result = false;
        this.permissionList.every(item => {
            if (item.parentClass === classs.id
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
            // 'parentStudent__in': this.getStudentIdListForSelectedItems().join(),
            'parentStudent__in': this.vm.getFilteredStudentList().map(item => item.id).join(),
            'parentExamination': [this.vm.selectedExamination.id],
        };
        this.vm.examinationService.getObjectList(this.vm.examinationService.student_extra_sub_field,request_student_field_data).then(value2 => {
            console.log(value2);
            this.populateStudentList(value2);
            this.vm.showTestDetails = true;
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    /*getStudentIdListForSelectedItems(): any {
        let id_list = [];
        this.studentList.forEach(item => {
            if (item.studentSection.parentClass === this.vm.selectedClassSection.class.id
                && item.studentSection.parentDivision === this.vm.selectedClassSection.section.id) {
                id_list.push(item.id);
            }
        });
        return id_list;
    }*/

    populateStudentList(student_sub_field_list: any): void {
        this.vm.getFilteredStudentList().forEach(item => {

            item['subFieldList'] = [];

            this.vm.selectedField.subFieldList.forEach(subField => {
                let result = this.getStudentSubField(item, subField, student_sub_field_list);
                if (result) {
                    if (result.marksObtained == 0.0) {
                        result.marksObtained = '';
                    }
                    item['subFieldList'].push(result);
                } else {
                    result = {
                        'id': 0,
                        'parentStudent': item.id,
                        'parentExamination': this.vm.selectedExamination.id,
                        'parentExtraSubField': subField.id,
                        'marksObtained': '',
                    };
                    item['subFieldList'].push(result);
                }
            });

        });

        console.log(this.vm.getFilteredStudentList());

        this.vm.studentList.sort(function(obj1,obj2){
            if(obj1.studentSection.rollNumber < obj2.studentSection.rollNumber) return -1;
            if(obj1.studentSection.rollNumber > obj2.studentSection.rollNumber) return 1;
            if(obj1.name <= obj2.name) return -1;
            return 1;
        });
    }

    getStudentSubField(student: any, subField: any, student_sub_field_list: any): any {
        let result = null;
        student_sub_field_list.every(item => {
            if (item.parentStudent === student.id
                && item.parentExtraSubField === subField.id) {
                result = item;
                return false;
            }
            return true;
        });
        return result;
    }

    updateStudentField(studentSubField, current_value): any {

        if (current_value == studentSubField.marksObtained) return;

        if (current_value == null || current_value == NaN || current_value == '') {
            current_value = 0.0;
        }
        studentSubField.marksObtained = parseFloat(current_value.toString()).toFixed(2);

        if (studentSubField.marksObtained > 2.00 || studentSubField.marksObtained < 0.00) {
            alert("Marks should be b/w 0 & 2");
            return;
        }

        document.getElementById(studentSubField.parentStudent+'_'+studentSubField.parentExtraSubField).classList.add('updatingField');

        let service_list = [];
        if(studentSubField.id ==0){
            let request_studentSubField_data = {
                'parentStudent': studentSubField.parentStudent,
                'parentExamination': studentSubField.parentExamination,
                'parentExtraSubField': studentSubField.parentExtraSubField,
                'marksObtained': studentSubField.marksObtained,
            };
            service_list.push(this.vm.examinationService.createObject(this.vm.examinationService.student_extra_sub_field, request_studentSubField_data));
        }
        else{
            service_list.push(this.vm.examinationService.updateObject(this.vm.examinationService.student_extra_sub_field,studentSubField));
        }
        Promise.all(service_list).then(value => {

            console.log(value);
            let item = this.vm.studentList.find(student => {
                return student.id == studentSubField.parentStudent;
            })['subFieldList'].find(subField => {
                return subField.parentExtraSubField == studentSubField.parentExtraSubField;
            });
            item.id = value[0].id;
            if (value[0].marksObtained == 0.00) {
                item.marksObtained = '';
            } else {
                item.marksObtained = value[0].marksObtained;
            }

            document.getElementById(studentSubField.parentStudent+'_'+studentSubField.parentExtraSubField).classList.remove('updatingField');

        }, error => {
            alert('Error updating marks');
        });
    }

    updateAllRemainingStudentFields(): void {

        if (this.vm.minimumMarks < 0.00 || this.vm.minimumMarks > 2.00) {
            this.vm.minimumMarks == 0.00;
        }
        if (this.vm.maximumMarks < 0.00 || this.vm.maximumMarks > 2.00) {
            this.vm.minimumMarks == 2.00;
        }
        if (this.vm.maximumMarks < this.vm.minimumMarks) {
            this.vm.minimumMarks == 0.00;
            this.vm.maximumMarks == 0.00;
        }

        let request_student_subfield_data = [];

        this.vm.getFilteredStudentList().forEach(student => {
            student.subFieldList.filter(subField => {
                return subField.id == 0;
            }).forEach(studentSubField => {
                let randomMarks = (Math.random()*(this.vm.maximumMarks-this.vm.minimumMarks)+this.vm.minimumMarks).toFixed(2);
                request_student_subfield_data.push({
                    'id': studentSubField.id,
                    'parentStudent': studentSubField.parentStudent,
                    'parentExamination': studentSubField.parentExamination,
                    'parentExtraSubField': studentSubField.parentExtraSubField,
                    'marksObtained': randomMarks,
                });
                document.getElementById(studentSubField.parentStudent+'_'+studentSubField.parentExtraSubField).classList.add('updatingField');
            });
        });

        this.vm.examinationService.createObjectList(this.vm.examinationService.student_extra_sub_field, request_student_subfield_data).then(value => {

            this.vm.getFilteredStudentList().forEach(student => {
                student.subFieldList.filter(subField => {
                    return subField.id == 0;
                }).forEach(studentSubField => {
                    let studentSubFieldNew = value.find(item => {
                        return item.parentStudent == studentSubField.parentStudent
                            && item.parentExamination == studentSubField.parentExamination
                            && item.parentExtraSubField == studentSubField.parentExtraSubField;
                    });
                    studentSubField.id = studentSubFieldNew.id;
                    if (studentSubFieldNew.marksObtained == 0.00) {
                        studentSubField.marksObtained = '';
                    } else {
                        studentSubField.marksObtained = studentSubFieldNew.marksObtained;
                    }
                    document.getElementById(studentSubField.parentStudent+'_'+studentSubField.parentExtraSubField).classList.remove('updatingField');
                });
            });

        }, error => {
            alert("Error updating marks");
        });

    }
}