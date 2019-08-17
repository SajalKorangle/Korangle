
import {SendSmsComponent} from "./send-sms.component";

export class SendSmsServiceAdapter {

    classList: any;
    sectionList: any;

    vm: SendSmsComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: SendSmsComponent): void {
        this.vm = vm;
    }

    getAllMobileNumberList(): any {
        let mobileNumberList = [];
        this.vm.studentSectionList.forEach(studentSection => {
            if (studentSection.selected) {
                if (mobileNumberList.indexOf(studentSection.student.mobileNumber) === -1) {
                    mobileNumberList.push(studentSection.student.mobileNumber);
                }
                if (this.vm.isMobileNumberValid(studentSection.student.secondMobileNumber)) {
                    if (mobileNumberList.indexOf(studentSection.student.secondMobileNumber) === -1) {
                        mobileNumberList.push(studentSection.student.secondMobileNumber);
                    }
                }
            }
        });
        this.vm.employeeList.forEach(employee => {
            if (employee.selected) {
                if (this.vm.isMobileNumberValid(employee.mobileNumber)) {
                    if (mobileNumberList.indexOf(employee.mobileNumber) === -1) {
                        mobileNumberList.push(employee.mobileNumber);
                    }
                }
            }
        });
        return mobileNumberList;
    }

    getAllStringMobileNumberList(): any {
        let mobileNumberList = [];
        this.vm.studentSectionList.forEach(studentSection => {
            if (studentSection.selected) {
                if (mobileNumberList.indexOf(studentSection.student.mobileNumber) === -1) {
                    mobileNumberList.push(studentSection.student.mobileNumber.toString());
                }
                if (this.vm.isMobileNumberValid(studentSection.student.secondMobileNumber)) {
                    if (mobileNumberList.indexOf(studentSection.student.secondMobileNumber) === -1) {
                        mobileNumberList.push(studentSection.student.secondMobileNumber.toString());
                    }
                }
            }
        });
        this.vm.employeeList.forEach(employee => {
            if (employee.selected) {
                if (this.vm.isMobileNumberValid(employee.mobileNumber)) {
                    if (mobileNumberList.indexOf(employee.mobileNumber) === -1) {
                        mobileNumberList.push(employee.mobileNumber.toString());
                    }
                }
            }
        });
        return mobileNumberList;
    }

    //initialize data
    initializeData(): void {

        let student_section_data = {
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentStudent__parentTransferCertificate': 'null__korangle',
        };

        let student_data = {
            'parentTransferCertificate': 'null__korangle',
            'parentSchool': this.vm.user.activeSchool.dbId,
            'fields__korangle': 'id,name,fathersName,mobileNumber,secondMobileNumber,scholarNumber'
        };

        const sms_count_request_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const employee_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'dateOfLeaving': 'null__korangle',
            'fields__korangle': 'id,name,fathersName,mobileNumber',
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.classService.getClassList(this.vm.user.jwt),
            this.vm.classService.getSectionList(this.vm.user.jwt),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student, student_data),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_data),
            this.vm.smsService.getSMSCount(sms_count_request_data, this.vm.user.jwt),
        ]).then(value => {

            console.log(value);

            this.classList = value[0];
            this.sectionList = value[1];
            this.vm.studentSectionList = value[2];
            this.populateStudentList(value[3]);
            this.populateEmployeeList(value[4]);
            this.vm.smsBalance = value[5].count;

            this.populateClassSectionList();
            this.populateStudentSectionList();
            
            let gcm_device_data = {
                'user__username__in': this.getAllMobileNumberList(),
            };
            
            let user_data = {
                'username': this.getAllStringMobileNumberList(),
            };

            Promise.all([
                this.vm.notificationService.getList(this.vm.notificationService.gcm_device, gcm_device_data),
                this.vm.userService.getList(this.vm.userService.user, user_data),
            ]).then(value2 => {

                this.vm.gcmDeviceList = value2[0];
                this.populateFilteredUserList(value[1]);

                this.vm.isLoading = false;

            }, error => {
                this.vm.isLoading = false;
            });

        }, error => {
            this.vm.isLoading = false;
        });

    }

    populateClassSectionList(): void {
        this.classList.forEach(classs => {
            this.sectionList.forEach(section => {
                if (this.vm.studentSectionList.find(studentSection => {
                    return studentSection.parentClass == classs.dbId && studentSection.parentDivision == section.id;
                    }) != undefined) {
                    this.vm.classSectionList.push(
                        {
                            'class': classs,
                            'section': section,
                            'selected': true,
                        }
                    );
                }
            })
        })
    }

    populateStudentList(studentList: any): void {
        this.vm.studentList = studentList;
    }

    populateEmployeeList(employeeList: any): void {
        this.vm.employeeList = employeeList;
        this.vm.employeeList.forEach(employee => {
            employee['selected'] = true;
            employee['validMobileNumber'] = this.vm.isMobileNumberValid(employee.mobileNumber);
        });
    }

    populateStudentSectionList(): void {
        this.vm.studentSectionList.forEach(studentSection => {
            studentSection['student'] = this.vm.studentList.find(student => {
                return student.id == studentSection.parentStudent;
            });
            studentSection['validMobileNumber'] = this.vm.isMobileNumberValid(studentSection['student'].mobileNumber);
            if (studentSection['validMobileNumber']) {
                studentSection['selected'] = true;
            } else {
                studentSection['selected'] = false;
            }
        });
        this.vm.studentSectionList = this.vm.studentSectionList.sort((a,b) => {
            return 10*(this.classList.find(item => item.dbId==a.parentClass).orderNumber - this.classList.find(item => item.dbId==b.parentClass).orderNumber)
                + (this.sectionList.find(item => item.id==a.parentDivision).orderNumber = this.sectionList.find(item => item.id==b.parentDivision).orderNumber);
        });
    }
    
    populateFilteredUserList(userList: any): void {
        this.vm.filteredUserList = userList.filter(user => {
            return this.vm.gcmDeviceList.find(item => {
                return item.user == user.id;
            }) != undefined;
        });
    }

}