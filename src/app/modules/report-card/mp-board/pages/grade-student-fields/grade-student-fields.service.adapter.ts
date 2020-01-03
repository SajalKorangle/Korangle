
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
            this.examinationList = value[0]; 
            this.vm.examinationList = value[0]; 

            if (this.vm.examinationList.length > 0) {
                this.vm.selectedExamination = this.vm.examinationList[0];
            }
            this.classList = value[1];
            
            this.sectionList = value[2];

            this.permissionList = value[3];

            let unique_classes = []
            let unique_division = []

            let class_10_id, class_12_id;
            this.classList.forEach(class_ =>{
                if(class_.name == 'Class - 10'){
                    class_10_id = class_.id;
                }
                if(class_.name == 'Class - 12'){ class_12_id = class_.id; }
            });

            this.permissionList = this.permissionList.filter(permission =>{
                if(permission.parentClass == class_10_id || permission.parentClass == class_12_id){return false}
                // TODO: perform the same using set
                if(unique_classes.includes(permission.parentClass) == false){unique_classes.push(permission.parentClass)}
                if(unique_division.includes(permission.parentDivision) == false){unique_division.push(permission.parentDivision)}
                return true;
            });

            if(this.permissionList.length == 0){
                // Calling below function will me classSection list empty
                this.populateClassSectionList();
                return;
            }

            let request_student_section_data = {
                'parentStudent__parentSchool':this.vm.user.activeSchool.dbId,
                'parentDivision__in':unique_division.join(),
                'parentClass__in':unique_classes.join(),
                'parentSession':this.vm.user.activeSchool.currentSessionDbId,
            };

            let student_studentSection_map = {}
            this.vm.studentService.getObjectList(this.vm.studentService.student_section,request_student_section_data).then(value_studentSection=>{

                if(value_studentSection.length == 0){
                    alert('No students have been allocated');
                    return;
                }
                // ToDo: filter the required class,section; un-necessary added due to permutation of class,section
                let student_id = []
                value_studentSection.forEach(item=>{
                    student_studentSection_map[item.parentStudent] = {
                        'rollNumber':item.rollNumber,
                        'studentSectionId':item.id,
                        'classId':item.parentClass,
                        'sectionId':item.parentDivision,
                    };
                    student_id.push(item.parentStudent);
                });
                let request_student_data = {
                    'id__in':student_id.join(),
                };
                this.populateClassSectionList();
                this.vm.isInitialLoading = false;

                this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_data).then(
                    value_student=>{
                        // map student with roll number from student section
                        let studentDetails = value_student.map(student => {
                            student['rollNumber'] = student_studentSection_map[student.id].rollNumber;
                            student['classId'] = student_studentSection_map[student.id].classId;
                            student['sectionId'] = student_studentSection_map[student.id].sectionId;
                            student['studentSectionId'] = student_studentSection_map[student.id].studentSectionId;
                            // Below assignments ?
                            if(student['profileImage'] == '' || student['profileImage'] == null) student['profileImage'] = null;
                            if(student['parentTransferCertificate'] == '' || student['parentTransferCertificate'] == null) student['parentTransferCertificate'] = null;
                            student['className'] = ''
                            student['sectionName'] = ''
                            return student;
                        });
                        this.studentList = studentDetails;
                    },
                    error=>{console.log('Error fetching students');},
                    );
            }, error=>{console.log('Error fetching student section data');});


            this.fieldList = value[4];
            this.subFieldList = value[5];
            this.populateFieldList();
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
        let temp_classSectionList = [];

        this.classList.forEach(classs => {
            this.sectionList.forEach(section => {
                if (this.isClassSectionInPermissionList(classs, section)) {
                    temp_classSectionList.push({
                        'className':classs.name,
                        'classId':classs.id,
                        'sectionName':section.name,
                        'sectionId':section.id,
                        'classOrderNumber':classs.orderNumber,
                        'sectionOrderNumber':section.orderNumber,
                    });
                }
            });
        });

        if (temp_classSectionList.length > 0) {
            // Sort on basis of orderNumber; small order number will come first
            temp_classSectionList.sort(function(obj1, obj2){
                if(obj1.classOrderNumber == obj2.classOrderNumber){
                    return obj1.sectionOrderNumber - obj2.sectionOrderNumber;
                }
                return obj1.classOrderNumber - obj2.classOrderNumber;
            });
            this.vm.selectedClass = temp_classSectionList[0];
            this.vm.classSectionList = temp_classSectionList;
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
            'parentStudent__in': this.getStudentIdListForSelectedItems().join(),
            'parentExamination': [this.vm.selectedExamination.id],
        };
        this.vm.examinationService.getObjectList(this.vm.examinationService.student_extra_sub_field,request_student_field_data).then(value2 => {
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
            if (item.classId === this.vm.selectedClass.classId
                && item.sectionId === this.vm.selectedClass.sectionId) {
                id_list.push(item.id);
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
            if (item.classId === this.vm.selectedClass.classId
                && item.sectionId === this.vm.selectedClass.sectionId
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
                        'parentStudent': item.id,
                        'parentExamination': this.vm.selectedExamination.id,
                        'parentExtraSubField': subField.id,
                        'marksObtained': null,
                    };
                    tempItem['subFieldList'].push(result);
                }
            });
            this.vm.studentList.push(tempItem);
        });

        this.vm.studentList.sort(function(obj1,obj2){
            if(obj1.rollNumber < obj2.rollNumber) return -1;
            if(obj1.rollNumber > obj2.rollNumber) return 1;
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



    updateStudentField(studentSubField, element): any {
        let current_value = element.target.value;
        if(current_value == null || current_value == NaN) return;
        
        let temp_studentSubField = this.copyObject(studentSubField);
        if(studentSubField.marksObtained != null){
            if(studentSubField.marksObtained == current_value) return;
        }
        temp_studentSubField.marksObtained = parseFloat(current_value.toString()).toFixed(1);;

        Promise.all([
            this.vm.examinationService.updateObject(this.vm.examinationService.student_extra_sub_field,temp_studentSubField),
        ]).then(value => {
            alert('Student Fields updated successfully');
        }, error => {
            alert('Error updating marks');
        });
    }
}