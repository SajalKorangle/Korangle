
import {SetRollnumberComponent} from './set-rollnumber.component';

export class SetRollnumberServiceAdapter {

    vm: SetRollnumberComponent;

    constructor() {}

    // Data
    classList: any;
    sectionList: any;
    studentSectionList: any;

    initializeAdapter(vm: SetRollnumberComponent): void {
        this.vm = vm;
    }

    initializeData(): void {
        this.vm.isInitialLoading = true;

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
        ]).then(value => {
            this.vm.classList = value[0];
            this.vm.sectionList = value[1];
            console.log(value[0],value[1]);
            let request_student_section_data = {
                'parentStudent__parentSchool':this.vm.user.activeSchool.dbId,
                'parentSession':this.vm.user.activeSchool.currentSessionDbId,
                'parentStudent__parentTransferCertificate': 'null__korangle',
            };


            let student_studentSection_map = {};
            this.vm.studentService.getObjectList(this.vm.studentService.student_section,request_student_section_data).then(value_studentSection => {

                if(value_studentSection.length == 0){
                    this.vm.isInitialLoading = false;
                    alert('No students have been allocated');
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
                            student['studentSection'].newRollNumber = student['studentSection'].rollNumber;
                            return student;
                        });
                        this.vm.isInitialLoading = false;

                    }, error => {
                        console.log('Error fetching students');
                    });

            }, error => {
                console.log('Error fetching student section data');
            });
        }, error => {
            this.vm.isInitialLoading = false;
        });
    }

    getStudentDetails(){
        this.vm.filteredStudents = this.vm.getFilteredStudentList();
        this.vm.showTestDetails = true;
    }

    updateStudentRollNumbers(){
        this.vm.isInitialLoading = true;
        let list_to_update = this.vm.getFilteredStudentList().map(student => {
            let tempObject = {
                'id' : student['studentSection'].id,
                'rollNumber' : student['studentSection'].newRollNumber
            };
            return tempObject;
        });
        console.log(list_to_update);
        this.vm.studentService.partiallyUpdateObjectList(this.vm.studentService.student_section,list_to_update).then(()=>{
            this.vm.getFilteredStudentList().forEach(student => {
                student['studentSection'].rollNumber = student['studentSection'].newRollNumber;
            });
            alert('Roll Numbers Updated Successfully');
            this.vm.isInitialLoading = false;
        });
    }


    // populateStudentList(student_sub_grade_list: any): void {
    //     this.vm.getFilteredStudentList().forEach(item => {
    //
    //         item['subGradeList'] = [];
    //
    //         this.vm.selectedGrade.subGradeList.forEach(subGrade => {
    //             let result = this.getStudentSubGrade(item, subGrade, student_sub_grade_list);
    //             if (result) {
    //                 item['subGradeList'].push(result);
    //             } else {
    //                 result = {
    //                     'id': 0,
    //                     'parentStudent': item.id,
    //                     'parentSubGrade': subGrade.id,
    //                     'gradeObtained': '',
    //                 };
    //                 item['subGradeList'].push(result);
    //             }
    //         });
    //     });

        // console.log(this.vm.getFilteredStudentList());

    //     this.vm.studentList.sort(function(obj1,obj2){
    //         if(obj1.studentSection.rollNumber < obj2.studentSection.rollNumber) return -1;
    //         if(obj1.studentSection.rollNumber > obj2.studentSection.rollNumber) return 1;
    //         if(obj1.name <= obj2.name) return -1;
    //         return 1;
    //     });
    // }

    // getStudentSubGrade(student: any, subGrade: any, student_sub_grade_list: any): any {
    //     let result = null;
    //     student_sub_grade_list.every(item => {
    //         if (item.parentStudent === student.id
    //             && item.parentSubGrade === subGrade.id) {
    //             result = item;
    //             return false;
    //         }
    //         return true;
    //     });
    //     return result;
    // }

    // updateStudentField(studentSubGrade, element){
    //
    //     let current_value = element.target.value;
    //
    //     if (current_value == studentSubGrade.gradeObtained) return;
    //
    //     document.getElementById(studentSubGrade.parentStudent+'_'+studentSubGrade.parentSubGrade).classList.add('updatingField');
    //
    //     if (current_value == null || current_value == undefined) {
    //         current_value = '';
    //         return ;
    //         // alert("Enter a valid value");
    //     }
    //     // studentSubField.gradeObtained = parseFloat(current_value.toString()).toFixed(2);
    //     studentSubGrade.gradeObtained = current_value;
    //
    //     let service_list = [];
    //     if(studentSubGrade.id ==0){
    //         let request_studentSubGrade_data = {
    //             'parentStudent': studentSubGrade.parentStudent,
    //             'parentSubGrade' : studentSubGrade.parentSubGrade,
    //             'gradeObtained': studentSubGrade.gradeObtained,
    //         };
    //         service_list.push(this.vm.gradeService.createObject(this.vm.gradeService.student_sub_grade, request_studentSubGrade_data));
    //     }
    //     else{
    //         service_list.push(this.vm.gradeService.updateObject(this.vm.gradeService.student_sub_grade,studentSubGrade));
    //     }
    //     Promise.all(service_list).then(value => {
    //
    //         console.log(value);
    //         let item = this.vm.studentList.find(student => {
    //             return student.id == studentSubGrade.parentStudent;
    //         })['subGradeList'].find(subGrade => {
    //             return subGrade.parentSubGrade == studentSubGrade.parentSubGrade;
    //         });
    //         item.id = value[0].id;
    //         item.gradeObtained = value[0].gradeObtained;
    //
    //         document.getElementById(studentSubGrade.parentStudent+'_'+studentSubGrade.parentSubGrade).classList.remove('updatingField');
    //
    //     }, error => {
    //         alert('Error updating marks');
    //     });
    //
    // }

}
