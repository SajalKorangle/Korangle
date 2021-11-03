import { GiveDiscountComponent } from './give-discount.component';
import { CommonFunctions } from '../../../../classes/common-functions';
import { getValidStudentSectionList } from '@modules/classes/valid-student-section-service';

export class GiveDiscountServiceAdapter {
    vm: GiveDiscountComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: GiveDiscountComponent): void {
        this.vm = vm;
    }

    //initialize data
    async initializeData() {

        // ------------------- Initial Data Fetching Starts ---------------------

        this.vm.isLoading = true;

        let schoolId = this.vm.user.activeSchool.dbId;
        let sessionId = this.vm.user.activeSchool.currentSessionDbId;

        let fee_type_list = {
            parentSchool: schoolId,
        };

        let bus_stop_list = {
            parentSchool: schoolId,
        };

        let employee_list = {
            parentSchool: schoolId,
        };

        Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.fee_type, fee_type_list),
            this.vm.vehicleService.getBusStopList(bus_stop_list, this.vm.user.jwt),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_list),
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}),
        ]).then(
            (value) => {
                this.vm.feeTypeList = value[0];
                this.vm.busStopList = value[1];
                this.vm.employeeList = value[2];
                this.vm.sessionList = value[3];

                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );

        const sms_count_request_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const value = await Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), //0
            this.vm.classService.getObjectList(this.vm.classService.division, {}), //1
            this.vm.smsOldService.getSMSCount(sms_count_request_data, this.vm.user.jwt), //2
            this.vm.smsService.getObjectList(this.vm.smsService.sms_event,
                { id__in: this.vm.GIVE_DISCOUNT_EVENT_DBID}), //3        
        ]);

        this.vm.smsBalance = value[3].count;
        this.vm.backendData.discountSMSEventList = value[3];
        
        this.vm.dataForMapping['classList'] = value[0];
        this.vm.dataForMapping['divisionList'] = value[1];
        this.vm.dataForMapping['school'] = this.vm.user.activeSchool;

        let fetch_event_settings_list = {
            SMSEventId__in: this.vm.backendData.discountSMSEventList.map(a => a.id).join(),
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        if (this.vm.backendData.discountSMSEventList.length > 0) {
            this.vm.backendData.eventSettingsList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_event_settings, fetch_event_settings_list);
        }

        // ------------------- Initial Data Fetching Ends ---------------------

        // ------------------- Fetching Valid Student Data Starts ---------------------
        let class_list = [];
        let division_list = [];
        
        class_list = value[0].map(classs => classs.id);
        division_list = value[1].map(div => div.id);

        let student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentStudent__parentTransferCertificate: 'null__korangle',
            parentClass__in: class_list,
            parentDivision__in: division_list,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        let studentSectionList = await getValidStudentSectionList(this.vm.tcService, this.vm.studentService, student_section_data);
        this.vm.dataForMapping['studentSectionList'] = studentSectionList;

        // ------------------- Fetching Valid Student Data Ends ---------------------
    }

    // Get Student Fee Profile
    getStudentFeeProfile(): void {
        let studentListId = this.vm.selectedStudentList.map((a) => a.id).join();

        let student_fee_list = {
            parentStudent__in: studentListId,
        };

        let fee_receipt_list = {
            parentStudent__in: studentListId,
            cancelled: 'false__boolean',
        };

        let sub_fee_receipt_list = {
            parentStudentFee__parentStudent__in: studentListId,
            parentFeeReceipt__cancelled: 'false__boolean',
        };

        let discount_list = {
            parentStudent__in: studentListId,
            cancelled: 'false__boolean',
        };

        let sub_discount_list = {
            parentStudentFee__parentStudent__in: studentListId,
            parentDiscount__cancelled: 'false__boolean',
        };

        let student_section_list = {
            parentStudent__in: studentListId,
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.student_fees, student_fee_list),
            this.vm.feeService.getObjectList(this.vm.feeService.fee_receipts, fee_receipt_list),
            this.vm.feeService.getObjectList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list),
            this.vm.feeService.getObjectList(this.vm.feeService.discounts, discount_list),
            this.vm.feeService.getObjectList(this.vm.feeService.sub_discounts, sub_discount_list),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_fee_list),
        ]).then(
            (value) => {
                this.populateStudentFeeList(value[0]);
                this.populateFeeReceiptList(value[1]);
                this.vm.subFeeReceiptList = value[2];
                this.populateDiscountList(value[3]);
                this.vm.subDiscountList = value[4];
                this.vm.selectedStudentSectionList = value[5];
                // this.populateSelectedStudentSectionList(value[5]);

                this.vm.handleStudentFeeProfile();

                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    populateStudentFeeList(studentFeeList: any): void {
        this.vm.studentFeeList = studentFeeList.sort((a, b) => {
            let first = this.vm.getFeeTypeByStudentFee(a);
            let second = this.vm.getFeeTypeByStudentFee(b);
            return a.orderNumber - b.orderNumber;
        });
    }

    populateFeeReceiptList(feeReceiptList: any): void {
        this.vm.feeReceiptList = feeReceiptList.sort((a, b) => {
            return b.receiptNumber - a.receiptNumber;
        });
    }

    populateDiscountList(discountList: any): void {
        this.vm.discountList = discountList.sort((a, b) => {
            return b.discountNumber - a.discountNumber;
        });
    }

    // Generate Fee Receipt/s
    generateDiscounts(): void {
        this.vm.isLoading = true;

        let discount_list = this.vm.newDiscountList.map((discount) => {
            // return CommonFunctions.getInstance().copyObject(feeReceipt);
            let tempObject = CommonFunctions.getInstance().copyObject(discount);
            if (discount['remark'] == '') {
                discount['remark'] = null;
            }
            return tempObject;
        });

        let sub_discount_list = this.vm.newSubDiscountList.map((subDiscount) => {
            return CommonFunctions.getInstance().copyObject(subDiscount);
        });

        let student_fee_list = this.vm.studentFeeList
            .filter((studentFee) => {
                return this.vm.getStudentFeeFeesDue(studentFee) + this.vm.getStudentFeeLateFeesDue(studentFee) == 0;
            })
            .map((item) => {
                item.cleared = true;
                return CommonFunctions.getInstance().copyObject(item);
            });

        this.vm.isLoading = true;

        Promise.all([
            this.vm.feeService.createObjectList(this.vm.feeService.discounts, discount_list),
            this.vm.feeService.partiallyUpdateObjectList(this.vm.feeService.student_fees, student_fee_list),
        ]).then(
            (value) => {
                value[0].forEach((discount) => {
                    sub_discount_list.forEach((subDiscount) => {
                        if (
                            subDiscount.parentSession == discount.parentSession &&
                            this.vm.studentFeeList.find((item) => {
                                return item.id == subDiscount.parentStudentFee;
                            }).parentStudent == discount.parentStudent
                        ) {
                            subDiscount['parentDiscount'] = discount.id;
                        }
                    });
                });

                this.vm.feeService.createObjectList(this.vm.feeService.sub_discounts, sub_discount_list).then((value2) => {
                    this.addToDiscountList(value[0]);
                    this.vm.subDiscountList = this.vm.subDiscountList.concat(value2);

                    this.notifyParents();
                    alert('Discount given successfully');

                    this.vm.handleStudentFeeProfile();

                    this.vm.isLoading = false;
                });
            },
            (error) => {
                this.vm.isLoading = false;
            }

        );
    }

    // Notify parents about Discount Details 

    async notifyParents() {
        let tempStudentList = this.vm.getStudentList();
        let studentList = [];
        
        tempStudentList.forEach((student) => {
            if(this.checkMobileNumber(student.mobileNumber) == true) {
                let tempData = CommonFunctions.getInstance().copyObject(student);
                studentList.push(tempData);
            }
        }); // Filtering those students who have valid mobile numbers

        this.vm.messageService.fetchGCMDevicesNew(studentList);

        if (studentList.length > 0) {

            let student = studentList[0];

            let discountAmount = this.vm.getStudentPayment(student);
            this.vm.dataForMapping['discountAmount'] = discountAmount;
            
            this.vm.dataForMapping['studentList'] =  studentList;
            
            await this.vm.messageService.fetchEventDataAndSendEventSMSNotification(
                this.vm.dataForMapping,
                ['student'],
                this.vm.GIVE_DISCOUNT_EVENT_DBID,
                this.vm.user.activeSchool.dbId,
                this.vm.smsBalance
            );
        }

    }

    checkMobileNumber(mobileNumber: number): boolean {
        return mobileNumber && mobileNumber.toString().length == 10;
    }

    addToDiscountList(discount_list: any): void {
        this.vm.discountList = this.vm.discountList.concat(discount_list).sort((a, b) => {
            return b.discountNumber - a.discountNumber;
        });
    }
}
