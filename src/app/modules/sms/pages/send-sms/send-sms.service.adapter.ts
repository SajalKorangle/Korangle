
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
            this.vm.smsOldService.getSMSCount(sms_count_request_data, this.vm.user.jwt),
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
                'active ': 'true__boolean',
            };
            
            let user_data = {
                'username': this.getAllStringMobileNumberList(),
            };

            Promise.all([
                this.vm.notificationService.getObjectList(this.vm.notificationService.gcm_device, gcm_device_data),
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


    sendSMSAndNotification(): void {

        // let smsContentType = (this.vm.hasUnicode()? 'unicode':'english');

        let mobileNumberList = '';
        let notifMobileNumberList = '';

        this.vm.smsMobileNumberList.forEach(mobileNumber => {
            mobileNumberList += mobileNumber.toString() + ',';
        });

        this.vm.notificationMobileNumberList.forEach(mobileNumber => {
            notifMobileNumberList += mobileNumber.toString() + ',';
        });

        /*let data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'smsContentType': smsContentType,
            'estimatedCount': this.vm.getSMSCount()*this.vm.getMobileNumberList('sms').length,
            'message': this.vm.message,
            'mobileNumberList': mobileNumberList,
            'notificationMobileNumberList': notifMobileNumberList,
        };*/

        let sms_data = {
            'contentType': (this.vm.hasUnicode()? 'unicode':'english'),
            'content': this.vm.message,
            'count': this.vm.getSMSCount()*this.vm.smsMobileNumberList.length,
            'notificationCount': notifMobileNumberList.length,
            'mobileNumberList': mobileNumberList,
            'notificationMobileNumberList': notifMobileNumberList,
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        let notification_data = this.vm.notificationMobileNumberList.map(mobileNumber => {
            return {
                'content': this.vm.message,
                'parentUser': this.vm.filteredUserList.find(user => { return user.username == mobileNumber.toString();}).id,
                'parentSchool': this.vm.user.activeSchool.dbId,
            };
        });

        if (!confirm('Please confirm that you are sending ' + (this.vm.getSMSCount()*this.vm.getMobileNumberList('sms').length) + ' SMS.')) {
            return;
        }

        let service_list = [];

        if (this.vm.selectedSentType == 'SMS') {
            service_list.push(this.vm.smsService.createObject(this.vm.smsService.sms, sms_data));
        } else if (this.vm.selectedSentType == 'BOTH') {
            if (this.vm.smsMobileNumberList.length > 0) {
                service_list.push(this.vm.smsService.createObject(this.vm.smsService.sms, sms_data));
            }
            if (this.vm.notificationMobileNumberList.length > 0) {
                service_list.push(this.vm.notificationService.createObjectList(this.vm.notificationService, notification_data));
            }
        } else if (this.vm.selectedSentType == 'NOTIFICATION') {
            service_list.push(this.vm.notificationService.createObjectList(this.vm.notificationService, notification_data));
        }

        this.vm.isLoading = true;

        Promise.all(service_list).then(value => {

            alert("Operation Successful");

            if ((this.vm.selectedSentType == 'SMS' || this.vm.selectedSentType == 'BOTH') && (this.vm.smsMobileNumberList.length > 0)) {
                if (value[0].status == 'success') {
                    this.vm.smsBalance -= value[0].data.count;
                } else if (value[0].status == 'failure') {
                    this.vm.smsBalance = value[0].count;
                }
            }

            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        })

        /*this.vm.smsOldService.sendSMS(data, this.vm.user.jwt).then(data => {
            this.vm.isLoading = false;
            alert(data.message);
            if (data.status === 'success') {
                this.vm.smsBalance -= data.count;
            } else if (data.status === 'failure') {
                this.vm.smsBalance = data.count;
            }
        }, error => {
            this.vm.isLoading = false;
        })*/
    }

}