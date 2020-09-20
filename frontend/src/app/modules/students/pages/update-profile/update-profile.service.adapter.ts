import {UpdateProfileComponent} from './update-profile.component'

export class UpdateProfileServiceAdapter {
    vm: UpdateProfileComponent

    constructor () {}

    initializeAdapter (vm: UpdateProfileComponent) : void {
        this.vm = vm
    }

    initializeData (): void {
        this.vm.isLoading = true
        Promise.all([
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, {parentSchool: this.vm.user.activeSchool.dbId}),
            // this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, {parentStudent__parentSchool: this.vm.user.activeSchool.dbId}),
            this.vm.schoolService.getObjectList(this.vm.schoolService.bus_stop,{
                'parentSchool': this.vm.user.activeSchool.dbId,
            })
        ]).then(value => {
            this.vm.studentParameterList = value[0].map(x => ({...x, filterValues: JSON.parse(x.filterValues)}));
            // this.vm.studentParameterValueList = value[1];
            this.vm.busStopList = value[1];
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        })
    }

    updateProfile(): void {
        if (this.vm.currentStudent.currentBusStop == 0) {
            this.vm.currentStudent.currentBusStop = null;
        }
        if (this.vm.currentStudent.admissionSession == 0) {
            this.vm.currentStudent.admissionSession = null;
        }
        if (this.vm.currentStudent.familySSMID
            && this.vm.currentStudent.familySSMID.toString().length !== 0
            && this.vm.currentStudent.familySSMID.toString().length !== 8) {
            alert('Number of digits in Family SSMID should be 8');
            return;
        }

        if (this.vm.currentStudent.mobileNumber
            && this.vm.currentStudent.mobileNumber.toString().length !== 0
            && this.vm.currentStudent.mobileNumber.toString().length !== 10) {
            alert("mobile number should be of l0 digits!");
            return;
        }
        if (this.vm.currentStudent.secondMobileNumber
            && this.vm.currentStudent.secondMobileNumber.toString().length !== 0
            && this.vm.currentStudent.secondMobileNumber.toString().length !== 10) {
            alert("alternate mobile number should be of l0 digits!");
            return;
        }

        if (this.vm.currentStudent.childSSMID
            && this.vm.currentStudent.childSSMID.toString().length !== 0
            && this.vm.currentStudent.childSSMID.toString().length !== 9) {
            alert('Number of digits in Child SSMID should be 9');
            return;
        }
        if (this.vm.currentStudent.aadharNum
            && this.vm.currentStudent.aadharNum.toString().length !== 0
            && this.vm.currentStudent.aadharNum.toString().length !== 12) {
            alert('Number of digits in Aadhar No. should be 12');
            return;
        }

        this.vm.isLoading = true;
        let service_list = [];

        service_list.push(this.vm.studentService.updateObject(this.vm.studentService.student,this.vm.currentStudent));

        if (this.vm.selectedStudentSection.rollNumber != this.vm.currentStudentSection.rollNumber
            && this.vm.currentStudent.id == this.vm.currentStudentSection.parentStudent) {
            service_list.push(this.vm.studentService.updateObject(this.vm.studentService.student_section,this.vm.currentStudentSection));
        } else {
            service_list.push(Promise.resolve(null))
        }

        let generate_list = [];
        let update_list = [];
        this.vm.studentParameterList.forEach(parameter => {
            if (this.vm.checkCustomFieldChanged(parameter)) {
                let temp_obj = this.vm.currentStudentParameterValueList.find(x => x.parentStudentParameter === parameter.id);
                if (temp_obj && temp_obj.id) {
                    update_list.push(temp_obj);
                } else if (temp_obj && !temp_obj.id) {
                    generate_list.push(temp_obj);
                }
            }
        });
        if (generate_list.length) {
            service_list.push(this.vm.studentService.createObjectList(this.vm.studentService.student_parameter_value, generate_list))
        } else {
            service_list.push(Promise.resolve(null))
        }
        if (update_list.length) {
            service_list.push(this.vm.studentService.updateObjectList(this.vm.studentService.student_parameter_value, update_list))
        } else {
            service_list.push(Promise.resolve(null))
        }

        console.log(generate_list);
        console.log(update_list);

        Promise.all(service_list).then(value =>{
            Object.keys(value[0]).forEach(key =>{
                this.vm.selectedStudent[key] = value[0][key];
            });
            this.vm.currentStudent = this.vm.commonFunctions.copyObject(this.vm.selectedStudent);
            if (this.vm.selectedStudentSection.rollNumber != this.vm.currentStudentSection.rollNumber
            && this.vm.currentStudent.id == this.vm.currentStudentSection.parentStudent) {
                Object.keys(value[1]).forEach(key => {
                    this.vm.selectedStudentSection[key] = value[1][key];
                });
                this.vm.currentStudentSection = this.vm.commonFunctions.copyObject(this.vm.selectedStudentSection);
            }
            if (generate_list.length) {
                value[2].forEach(item => {
                    this.vm.studentParameterValueList.push(item);
                })
            }
            if (update_list.length) {
                value[3].forEach(item => {
                    this.vm.studentParameterValueList = this.vm.studentParameterValueList.filter(x => x.id !== item.id);
                    this.vm.studentParameterValueList.push(item);
                })
            }
            this.vm.currentStudentParameterValueList = [];
            this.vm.studentParameterValueList.filter(x => x.parentStudent === this.vm.currentStudent.id).forEach(item => {
                this.vm.currentStudentParameterValueList.push(this.vm.commonFunctions.copyObject(item))
            });

            alert('Student: ' + this.vm.selectedStudent.name + ' updated successfully');
            this.vm.isLoading = false;

        },error => {
            this.vm.isLoading = false;
        });
    }

    getStudentProfile(studentId : any): void {
        this.vm.isLoading = true;
        let service_list = [];
        service_list.push(this.vm.studentService.getObject(this.vm.studentService.student, {
            'id': studentId,
        }));
        service_list.push(this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, {
            parentStudent: studentId,
        }));
        Promise.all(service_list).then(value => {

            this.vm.currentStudent = this.vm.commonFunctions.copyObject(value[0]);
            Object.keys(value[0]).forEach(key => {
                this.vm.selectedStudent[key] = value[0][key];
            });
            this.vm.currentStudentSection = this.vm.commonFunctions.copyObject(this.vm.selectedStudentSection);

            // Copying the student parameter values for reference
            this.vm.studentParameterValueList = value[1];
            this.vm.currentStudentParameterValueList = [];
            this.vm.studentParameterValueList.filter(x => x.parentStudent===studentId).forEach(item => {
                this.vm.currentStudentParameterValueList.push(this.vm.commonFunctions.copyObject(item))
            });
            this.vm.isLoading = false;
        });
    }
}
