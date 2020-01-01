
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

        let request_student_mini_profile_data = {
            'schoolDbId': this.vm.user.activeSchool.dbId,
            'sessionDbId': this.vm.user.activeSchool.currentSessionDbId,
        };

        let request_permission_data = {
            'parentEmployee': this.vm.user.activeSchool.employeeId,
            'sessionId': this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            // request: parentSession, parentSchool
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination,request_examination_data),
            // response: name, parentSchool, parentSession, status
            
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            // response : id, classname,orderno
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            // response : id, classname,orderno

            // request: parentEmployee, sessionId
            this.vm.attendanceService.getAttendancePermissionList(request_permission_data, this.vm.user.jwt),
            // response: parentEmployee, parentClass, parentDivision, parentSession
            // WIll return the class and section alloted to the logged in employee

            this.vm.reportCardMpBoardService.getObjectList(this.vm.reportCardMpBoardService.extra_field, request_field_data),
            this.vm.reportCardMpBoardService.getObjectList(this.vm.reportCardMpBoardService.extra_sub_field, request_sub_field_data),
            
            // request: sessionDbId, schoolDbID
            // Model: parentStudent, parentDivision, parentClass, parentSession, rollNumber, attendance
            // this.vm.studentService.getStudentMiniProfileList(request_student_mini_profile_data),
            // Response: Student Model fields

        ]).then(value => {
            console.log(value);
            this.examinationList = value[0]; // All examinations
            this.vm.examinationList = value[0]; // All examinations
            if (this.vm.examinationList.length > 0) {
                this.vm.selectedExamination = this.vm.examinationList[0];
            }
            // Else if length is zero ?

            this.classList = value[1];
            // Filtering Classlist to remove class 10 and class 12
            // Do in attendance permission
            
            this.sectionList = value[2];

            this.permissionList = value[3];
            if(this.permissionList.length == 0){
                // Show message to user that he do not have any classes assigned
                // return;
            }
            let unique_classes = []
            let unique_division = []

            let class_10_id, class_12_id;
            this.classList.forEach(class_ =>{
                if(class_.name == 'Class - 10'){
                    class_10_id = class_.id;
                }
                if(class_.name == 'Class - 12'){ class_12_id = class_.id; }
            });

            this.permissionList.forEach(permission =>{
                if(permission.parentClass == class_10_id || permission.parentClass == class_12_id){return}
                if(unique_classes.includes(permission.parentClass) == false){unique_classes.push(permission.parentClass)}
                if(unique_division.includes(permission.parentDivision) == false){unique_division.push(permission.parentDivision)}
            });
            let request_student_section_data = {
                'parentStudent__parentSchool':this.vm.user.activeSchool.dbId,
                'parentDivision__in':unique_division.join(),
                'parentClass__in':unique_classes.join(),
                'parentSession':this.vm.user.activeSchool.currentSessionDbId,
            };
            // Fetch students for those class and sections
            let student_studentSection_map = {}
            this.vm.studentService.getObjectList(this.vm.studentService.student_section,request_student_section_data).then(value_studentSection=>{
                console.log(value_studentSection);
                // Assuming value.parentStudent to be unique
                let student_id = []
                value_studentSection.forEach(item=>{
                    student_studentSection_map[item.parentStudent] = {
                        'rollNumber':item.rollNumber,
                        // 'className':,
                        // 'sectionName':,
                        'studentSectionId':item.id,
                        'classId':item.parentClass,
                        'sectionId':item.parentDivision,
                    };
                    student_id.push(item.parentStudent);
                });
                let request_student_data = {
                    'id__in':student_id.join(),
                };
                this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_data).then(
                    value_student=>{
                        // map student with roll number from student section
                        console.log('map');
                        console.log(student_studentSection_map);
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
                        console.log('got student list');
                        console.log(this.studentList);

                    },
                    error=>{console.log('Error fetching students');},
                    );
            }, error=>{console.log('Error fetching student section data');});



            // TODO: Merge class section columns
            this.populateClassSectionList();

            this.fieldList = value[4];
            this.subFieldList = value[5];
            this.populateFieldList();

            // this.studentList = value[6];

            this.vm.isInitialLoading = false;


            return;

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
            // 'studentList': this.getStudentIdListForSelectedItems().join(),
            'parentStudent__in': this.getStudentIdListForSelectedItems().join(),
            // 'examinationList': [this.vm.selectedExamination.id],
            'parentExamination': [this.vm.selectedExamination.id],

            // 'subFieldList': this.getSubFieldList().join(),
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
            if (item.classId === this.vm.selectedClass.id
                && item.sectionId === this.vm.selectedClass.selectedSection.id) {
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
        // ToDo: if length of vm.studentList == 0, then ?
        // Means no student is present in selected class and section
        this.vm.studentList = [];
        
        this.studentList.filter(item => {
            if (item.classId === this.vm.selectedClass.id
                && item.sectionId === this.vm.selectedClass.selectedSection.id
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

        // Sorting student list
        // Todo: Handle cases when rollNumber is empty or null; same for name
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