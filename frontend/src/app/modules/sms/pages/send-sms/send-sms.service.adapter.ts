
import {SendSmsComponent} from "./send-sms.component";

export class SendSmsServiceAdapter {

    classList: any;
    sectionList: any;

    vm: SendSmsComponent;
    purchasedSMS: number=0;

    constructor() {}

    // Data

    initializeAdapter(vm: SendSmsComponent): void {
        this.vm = vm;
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
            'fields__korangle': 'id,name,fathersName,mobileNumber,secondMobileNumber,scholarNumber,rte,gender,newCategoryField,admissionSession'
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
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student, student_data),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_data),
            this.vm.smsOldService.getSMSCount(sms_count_request_data, this.vm.user.jwt),
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, {
                'parentSchool': this.vm.user.activeSchool.dbId,
                'parameterType': 'FILTER'
            }),
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, {
                'parentStudentParameter__parentSchool': this.vm.user.activeSchool.dbId,
                'parentStudentParamter__parameterType': 'FILTER'
            })
        ]).then(value => {
            this.classList = value[0];
            this.sectionList = value[1];
            this.vm.studentSectionList = value[2];
            this.populateStudentList(value[3]);
            this.populateEmployeeList(value[4]);
            this.vm.smsBalance = value[5].count;
            this.vm.studentParameterList = value[6].map(x => ({...x, filterValues: JSON.parse(x.filterValues).map(x => ({name: x, show: false})), showNone: false, filterFilterValues: ''}));
            this.vm.studentParameterValueList = value[7]

            this.populateClassSectionList();
            this.populateStudentSectionList();

            let stringMobileNumberList = this.getAllStringMobileNumberList();

            let service_list = [];

            let iterationCount = Math.ceil(stringMobileNumberList.length/700);

            let loopVariable = 0;
            while(loopVariable<iterationCount) {

                let gcm_device_data = {
                    'user__username__in': stringMobileNumberList.slice(700*loopVariable,700*(loopVariable+1)),
                    'active': 'true__boolean',
                };

                let user_data = {
                    'fields__korangle': 'username,id',
                    'username__in': stringMobileNumberList.slice(700*loopVariable,700*(loopVariable+1)),
                };

                service_list.push(this.vm.notificationService.getObjectList(this.vm.notificationService.gcm_device, gcm_device_data));
                service_list.push(this.vm.userService.getObjectList(this.vm.userService.user, user_data));

                loopVariable = loopVariable + 1;
            }


            Promise.all(service_list).then(value2 => {

                let gcmDeviceList = [];
                let userList = [];

                let loopVariable = 0;
                while(loopVariable<iterationCount) {
                    gcmDeviceList = gcmDeviceList.concat(value2[loopVariable*2]);
                    userList = userList.concat(value2[loopVariable*2+1]);
                    loopVariable = loopVariable + 1;
                }

                this.vm.gcmDeviceList = gcmDeviceList;
                this.populateFilteredUserList(userList);

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
                    return studentSection.parentClass == classs.id && studentSection.parentDivision == section.id;
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
            return 10*(this.classList.find(item => item.id==a.parentClass).orderNumber - this.classList.find(item => item.id==b.parentClass).orderNumber)
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

        this.vm.smsMobileNumberList.forEach((mobileNumber,index) => {
            mobileNumberList += mobileNumber.toString() + ((index!=this.vm.smsMobileNumberList.length-1)?',':'');
        });

        this.vm.notificationMobileNumberList.forEach((mobileNumber, index) => {
            notifMobileNumberList += mobileNumber.toString() + ((index!=this.vm.notificationMobileNumberList.length-1)?',':'');
        });

        let sms_data = {
            'contentType': (this.vm.hasUnicode()? 'unicode':'english'),
            'content': this.vm.message,
            'parentMessageType': 1,
            'count': this.vm.getSMSCount()*this.vm.smsMobileNumberList.length,
            'notificationCount': this.vm.notificationMobileNumberList.length,
            'mobileNumberList': mobileNumberList,
            'notificationMobileNumberList': notifMobileNumberList,
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        let notification_data = this.vm.notificationMobileNumberList.map(mobileNumber => {
            return {
                'parentMessageType': 1,
                'content': this.vm.message,
                'parentUser': this.vm.filteredUserList.find(user => { return user.username == mobileNumber.toString();}).id,
                'parentSchool': this.vm.user.activeSchool.dbId,
            };
        });

        if (this.vm.smsMobileNumberList.length>0) {
            if (!confirm('Please confirm that you are sending ' + (this.vm.getSMSCount()*this.vm.getMobileNumberList('sms').length) + ' SMS.')) {
                return;
            }
        }

        let service_list = [];
        service_list.push(this.vm.smsService.createObject(this.vm.smsService.sms, sms_data));
        if (this.vm.notificationMobileNumberList.length > 0 ) {
            service_list.push(this.vm.notificationService.createObjectList(this.vm.notificationService.notification, notification_data));
        }

        this.vm.isLoading = true;

        Promise.all(service_list).then(value => {

            alert("Operation Successful");

            if ((this.vm.selectedSentType == this.vm.sentTypeList[0] || this.vm.selectedSentType == this.vm.sentTypeList[2]) && (this.vm.smsMobileNumberList.length > 0)) {
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

    }

    createRzpayOrder(data) {
        this.vm.isLoading = true;
        let sms_purchase_data = {
            parentSchool :this.vm.user.activeSchool.dbId,
            purchseDateTime: Date.now(),
            numberOfSMS : data.noOfSMS,
            price : data.price,
            orderId : -1,
            payment_capture : 0
        }
        this.purchasedSMS = sms_purchase_data.numberOfSMS;
        //call api to create order_id
        Promise.all([
            this.vm.smsService.createObject(this.vm.smsService.sms_purchase,sms_purchase_data)
        ]).then(value => {        
            this.payWithRazor(value[0]);
            this.vm.isLoading = false;
        })
        
    }

    payWithRazor(val) {
        const options: any = {
          key: 'rzp_test_9ItYu1Pd8xL43N',
          amount: val.price, // amount should be in paise format to display Rs 1255 without decimal point
          currency: 'INR',
          name: 'Korangle', // company name or product name
          description: 'sms-purchase',  // product description
          order_id: val.orderId, // order_id created by you in backend
          receipt_id :val.id,
          modal: {
            // We should prevent closing of the form when esc key is pressed.
            escape: false,
          },
          prefill: {
              email:this.vm.user.email,
              contact: this.vm.user.username
          },
          notes: {
            // include notes if any
          },
          theme: {
            color: '#0c238a'
          },
        };
        options.handler = ((response, error) => {
          options.error = error;
          // call your backend api to verify payment signature, capture transaction & update the record
            let update_data = {
                id : options.receipt_id,
                response : response,
                amount : options.amount
            }
            Promise.all([
                this.vm.smsService.updateObject(this.vm.smsService.sms_purchase,update_data)
                ]).then(value => {
                    if(value[0] === undefined)
                    alert('Transaction Failed Contact your Admin!!!' + 'Payment Details :-  ' + 'Payment Id = ' +response.razorpay_payment_id +
                    '  Order Id = '+ response.razorpay_order_id);                    
                    else
                    {
                        alert('Transaction Completed!!!')
                        this.vm.smsBalance += this.purchasedSMS;
                        this.purchasedSMS = 0;
                        this.vm.cdRef.detectChanges();
                        
                    }
                }, error => {
                    this.purchasedSMS = 0;
                })
            });
        options.modal.ondismiss = (() => {
          // handle the case when user closes the form while transaction is in progress
          alert('Transaction cancelled.');
        });
        const rzp = new this.vm.winRef.nativeWindow.Razorpay(options);
        rzp.open();
    }

}
