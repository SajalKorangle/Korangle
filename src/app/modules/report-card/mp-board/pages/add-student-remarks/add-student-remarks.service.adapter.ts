
import {AddStudentRemarksComponent} from './add-student-remarks.component';

export class AddStudentRemarksServiceAdapter {

    vm: AddStudentRemarksComponent;

    constructor() {}

    // Data
    classList: any;
    sectionList: any;
    studentSectionList: any;


    initializeAdapter(vm: AddStudentRemarksComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {

        this.vm.isInitialLoading = true;

        let attendance_permission_data = {
            'parentEmployee': this.vm.user.activeSchool.employeeId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.attendanceService.getObjectList(this.vm.attendanceService.attendance_permission,attendance_permission_data),
            // this.vm.studentService.getObjectList(this.vm.studentService.student_section,student_section_data),
        ]).then(value => {
            this.classList = value[0];
            this.sectionList = value[1];
            this.vm.attendancePermissionList = value[2];
            // Filter attendancePermission List to remove class 10 and class 12

            let unique_classes = []
            let unique_division = []

            let class_10_id, class_12_id;
            this.classList.forEach(class_ =>{
                if(class_.name == 'Class - 10'){
                    class_10_id = class_.id;
                }
                if(class_.name == 'Class - 12'){ class_12_id = class_.id; }
            });

            let temp_classSectionList = []
            this.vm.attendancePermissionList = this.vm.attendancePermissionList.filter(permission =>{
                if(permission.parentClass == class_10_id || permission.parentClass == class_12_id){return false}
                unique_classes.push(permission.parentClass);
                unique_division.push(permission.parentDivision);
                temp_classSectionList.push({
                    'classId': permission.parentClass,
                    'sectionId': permission.parentDivision,
                });
                return true;
            });

            unique_classes = Array.from(new Set(unique_classes));
            unique_division = Array.from(new Set(unique_division));

            if(this.vm.attendancePermissionList.length == 0){
                // Calling below function will me classSection list empty
                alert('You do not have any permission');
                return;
            }

            let request_student_section_data = {
                'parentStudent__parentSchool':this.vm.user.activeSchool.dbId,
                'parentDivision__in':unique_division.join(),
                'parentClass__in':unique_classes.join(),
                'parentSession':this.vm.user.activeSchool.currentSessionDbId,
            };


            let student_studentSection_map = {};
            
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data).then(value_studentSection=>{
                
                if(value_studentSection.length == 0){
                    alert('No students have been allocated');
                    this.vm.isInitialLoading = false;
                    return;
                }

                value_studentSection = value_studentSection.filter(eachStudentSection => {
                    return this.vm.attendancePermissionList.some(eachAttendancePermission => {
                        if(eachStudentSection.parentClass == eachAttendancePermission.parentClass 
                            && eachStudentSection.parentDivision == eachAttendancePermission.parentDivision) return true;
                        return false;
                    });
                });

                let student_id = [];
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

                // this.populateClassSectionList();
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
                        this.studentSectionList = studentDetails;
                        this.vm.studentSectionList = studentDetails;
                    },
                    error=>{console.log('Error fetching students');this.vm.isInitialLoading = false;},
                    );
            },error=>{this.vm.isInitialLoading = false;});

            // Merging class section list from temp_classSectionList

            temp_classSectionList = temp_classSectionList.map(classSection => {
                let temp = {};
                temp['class'] = this.classList.find(eachClass=>{
                    return eachClass.id == classSection.classId;
                });
                temp['section'] = this.sectionList.find(eachSection=>{
                    return eachSection.id == classSection.sectionId;
                });
                return temp;
            });
            this.vm.classSectionList = temp_classSectionList;
            this.vm.selectedClassSection = this.vm.classSectionList[0];


        }, error => {
            this.vm.isInitialLoading = false;
        });

    }

    getStudentRemarkDetails(): void {

        let student_remark_data = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentStudent__in': this.vm.studentSectionList.filter(studentSection => {
                return studentSection.parentClass == this.vm.selectedClassSection.class.id
                    && studentSection.parentDivision == this.vm.selectedClassSection.section.id;
            }).map(item => item.parentStudent).join(','),
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.reportCardMpBoardService.getObjectList(this.vm.reportCardMpBoardService.student_remark,student_remark_data),
        ]).then(value => {

            this.vm.studentRemarkList = value[0];

            this.vm.isLoading = false;
            this.vm.showStudentList = true;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    updateStudentRemark(studentSection: any, newRemark: any, element: any): void {

        if (this.vm.getStudentRemark(studentSection) != newRemark) {

            let prev_student_remark = this.vm.studentRemarkList.find(studentRemark => {
                return studentRemark.parentStudent == studentSection.parentStudent;
            });

            let service_list = [];

            if (prev_student_remark) {
                let student_remark_data = {
                    'id': prev_student_remark.id,
                    'parentStudent': prev_student_remark.parentStudent,
                    'parentSession': prev_student_remark.parentSession,
                    'remark': newRemark,
                };
                service_list.push(this.vm.reportCardMpBoardService.updateObject(this.vm.reportCardMpBoardService.student_remark,student_remark_data));
            } else {
                let student_remark_data = {
                    'parentStudent': studentSection.parentStudent,
                    'parentSession': studentSection.parentSession,
                    'remark': newRemark,
                };
                service_list.push(this.vm.reportCardMpBoardService.createObject(this.vm.reportCardMpBoardService.student_remark,student_remark_data));
            }

            element.classList.add('updatingField');

            Promise.all(service_list).then(value => {

                if(prev_student_remark) {
                    this.vm.studentRemarkList.find(studentRemark => {
                        return studentRemark.id == value[0].id;
                    }).remark = value[0].remark;
                } else {
                    this.vm.studentRemarkList.push(value[0]);
                }

                element.classList.remove('updatingField');

            }, error => {
                // Nothing to do here
            })

        }

    }

}