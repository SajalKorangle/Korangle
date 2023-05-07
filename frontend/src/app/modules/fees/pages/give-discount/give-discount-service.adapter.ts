import { GiveDiscountComponent } from './give-discount.component';
import { CommonFunctions } from '../../../../classes/common-functions';

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
            this.vm.feeService.getObjectList(this.vm.feeService.fee_type, fee_type_list), // 0
            this.vm.vehicleService.getBusStopList(bus_stop_list, this.vm.user.jwt), // 1
            this.vm.genericService.getObjectList({employee_app: 'Employee'}, {filter: employee_list}), // 2
            this.vm.genericService.getObjectList({school_app: 'Session'}, {}), // 3
            this.vm.genericService.getObjectList({fees_third_app: 'FeeReceiptBook'}, {filter: {parentSchool: schoolId}}), // 4
        ]).then(
            (value) => {
                this.vm.feeTypeList = value[0];
                this.vm.busStopList = value[1];
                this.vm.employeeList = value[2];
                this.vm.sessionList = value[3];
                this.vm.feeReceiptBookList = value[4];

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
            this.vm.genericService.getObjectList({class_app: 'Class'}, {}), // 0
            this.vm.genericService.getObjectList({class_app: 'Division'}, {}), // 1
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

}

    // Get Student Fee Profile
    getStudentFeeProfile(): void {
        let studentListId = this.vm.selectedStudentList.map((a) => a.id);

        let student_fee_list = {
            parentStudent__in: studentListId,
        };

        let fee_receipt_list = {
            parentStudent__in: studentListId,
            cancelled: false,
        };

        let sub_fee_receipt_list = {
            parentStudentFee__parentStudent__in: studentListId,
            parentFeeReceipt__cancelled: false,
        };

        let discount_list = {
            parentStudent__in: studentListId,
            cancelled: false,
        };

        let sub_discount_list = {
            parentStudentFee__parentStudent__in: studentListId,
            parentDiscount__cancelled: false,
        };

        let student_section_list = {
            parentStudent__in: studentListId,
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.genericService.getObjectList({fees_third_app: 'StudentFee'}, {filter: student_fee_list}), // 0
            this.vm.genericService.getObjectList({fees_third_app: 'FeeReceipt'}, {filter: fee_receipt_list}), // 1
            this.vm.genericService.getObjectList({fees_third_app: 'SubFeeReceipt'}, {filter: sub_fee_receipt_list}), // 2
            this.vm.genericService.getObjectList({fees_third_app: 'Discount'}, {filter: discount_list}), // 3
            this.vm.genericService.getObjectList({fees_third_app: 'SubDiscount'}, {filter: sub_discount_list}), // 4
            this.vm.genericService.getObjectList({student_app: 'StudentSection'}, {filter: student_section_list}), // 5
        ]).then(
            (value) => {
                this.populateStudentFeeList(value[0]);
                this.populateFeeReceiptList(value[1]);
                this.vm.subFeeReceiptList = value[2];
                this.populateDiscountList(value[3]);
                this.vm.subDiscountList = value[4];
                this.vm.selectedStudentSectionList = value[5];

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
            return a.orderNumber - b.orderNumber;
        });
    }

    populateFeeReceiptList(feeReceiptList: any): void {
        this.vm.feeReceiptList = feeReceiptList.sort((a, b) => {
            return (new Date(b.generationDateTime).getTime()) - (new Date(a.generationDateTime).getTime());
        });
    }

    populateDiscountList(discountList: any): void {
        this.vm.discountList = discountList.sort((a, b) => {
            return b.discountNumber - a.discountNumber;
        });
    }

    // Generate Fee Receipt/s
    async generateDiscounts() {
        this.vm.isLoading = true;

        let sub_discount_list = this.vm.newSubDiscountList.map((subDiscount) => {
            return CommonFunctions.getInstance().deepCopy(subDiscount);
        });

        let discount_list = this.vm.newDiscountList.map((discount) => {
            discount = CommonFunctions.getInstance().deepCopy(discount);
            if (discount['remark'] == '') {
                discount['remark'] = null;
            }
            return {
                ...discount,
                discountNumber: 0,
                subDiscountList: sub_discount_list.filter(subDiscount => subDiscount.parentSession == discount.parentSession
                    && this.vm.studentFeeList.find((studentFee) => studentFee.id == subDiscount.parentStudentFee).parentStudent == discount.parentStudent)
            };
        });


        this.vm.isLoading = true;

        const newDiscountResponse = await this.vm.genericService.createObjectList({ fees_third_app: 'Discount' }, discount_list);

        const subDiscountList = newDiscountResponse.reduce((acc: Array<any>, discount) => acc.concat(discount.subDiscountList), []);
        const newDiscountList = newDiscountResponse.map(discount => {
            delete discount.subDiscountList;
            return discount;
        });
        this.addToDiscountList(newDiscountList);
        this.vm.subDiscountList = this.vm.subDiscountList.concat(subDiscountList);

        alert('Discount given successfully');
        this.notifyParents();

        this.vm.handleStudentFeeProfile();
        this.vm.isLoading = false;
    }

    // Notify parents about Discount Details
    async notifyParents() {
        let tempStudentList = this.vm.getStudentList();
        let studentList = [];

        // Calculating and storing neccessary variables for SMS/Notification template
        if (tempStudentList.length > 0) {

            tempStudentList.forEach((student) => {

                if (this.checkMobileNumber(student.mobileNumber) == false) {
                    return;
                }

                let sessionList = this.vm.getFilteredSessionListByStudent(student);

                sessionList.forEach((session) => {

                    let discountAmount = this.vm.getSessionPayment(student, session) + this.vm.getSessionLateFeePayment(student, session);

                    let tempStudent =  CommonFunctions.getInstance().copyObject(student);

                    if (discountAmount > 0) {
                        tempStudent['discountAmount'] = discountAmount;
                        tempStudent['session'] = session;
                        studentList.push(tempStudent);
                    }

                });
            });
        }

        this.vm.messageService.fetchGCMDevicesNew(studentList);

        this.vm.dataForMapping['studentList'] =  studentList;
        this.vm.dataForMapping['studentSectionList'] = this.vm.selectedStudentSectionList;

        await this.vm.messageService.fetchEventDataAndSendEventSMSNotification(
            this.vm.dataForMapping,
            ['student'],
            this.vm.GIVE_DISCOUNT_EVENT_DBID,
            this.vm.user.activeSchool.dbId,
            this.vm.smsBalance
        );

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
