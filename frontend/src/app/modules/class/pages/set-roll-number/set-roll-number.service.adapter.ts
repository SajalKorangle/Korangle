
import {SetRollNumberComponent} from './set-roll-number.component';

export class SetRollNumberServiceAdapter {

    vm: SetRollNumberComponent;

    constructor() {}

    // Data
    classList: any;
    sectionList: any;
    studentSectionList: any;

    initializeAdapter(vm: SetRollNumberComponent): void {
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

    // classesPresent(){
    //     this.vm.classList.forEach(classs=>{
    //         this.
    //     })
    // }

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

}
