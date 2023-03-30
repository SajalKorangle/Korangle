import { PayFeesComponent } from './pay-fees.component';
import { environment } from 'environments/environment';
import { Query } from "@services/generic/query";

export class PayFeesServiceAdapter {
    vm: PayFeesComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: PayFeesComponent): void {
        this.vm = vm;
    }

    //initialize data
    async initializeData() {

        let schoolId = this.vm.user.activeSchool.dbId;

        let studentListId = this.vm.user.section.student.studentList.map((a) => a.id);

        let fee_type_list = {
            parentSchool: schoolId,
        };

        let bus_stop_list = {
            parentSchool: schoolId,
        };

        let employee_list = {
            parentSchool: schoolId,
        };

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

        let modeOfPaymentQuery = new Query()
        .addChildQuery(
            'modeofpaymentcharges',
            new Query()
        )
        .addParentQuery(
            'parentPaymentGateway',
            new Query()
        )
        .getObjectList({payment_app: 'ModeOfPayment'});

        await Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.fee_type, fee_type_list),   // 0
            this.vm.vehicleService.getBusStopList(bus_stop_list, this.vm.user.jwt), // 1
            this.vm.genericService.getObjectList({employee_app: 'Employee'}, {filter: employee_list}), // 2
            this.vm.genericService.getObjectList({class_app: 'Class'}, {}), // 3
            this.vm.genericService.getObjectList({class_app: 'Division'}, {}), // 4
            this.vm.genericService.getObjectList({fees_third_app: 'StudentFee'}, {filter: student_fee_list}), // 5
            this.vm.genericService.getObjectList({fees_third_app: 'FeeReceipt'}, {filter: fee_receipt_list}), // 6
            this.vm.genericService.getObjectList({fees_third_app: 'SubFeeReceipt'}, {filter: sub_fee_receipt_list}), // 7
            this.vm.genericService.getObjectList({fees_third_app: 'Discount'}, {filter: discount_list}), // 8
            this.vm.genericService.getObjectList({fees_third_app: 'SubDiscount'}, {filter: sub_discount_list}), // 9
            this.vm.genericService.getObjectList({student_app: 'StudentSection'}, {filter: student_fee_list}), // 10
            this.vm.genericService.getObjectList({school_app: 'Session'}, {}), // 11
            this.vm.schoolService.getObjectList(this.vm.schoolService.board, {}),   // 12
            this.vm.paymentService.getObject(this.vm.paymentService.school_merchant_account, {parentSchool: schoolId}), // 13
            this.vm.genericService.getObjectList({ fees_third_app: 'FeeReceiptOrder' }, { filter: { parentSchool: schoolId } }), // 14
            modeOfPaymentQuery, //15
        ]).then(
            (value) => {

                this.vm.schoolMerchantAccount = value[13];

                this.vm.feeTypeList = value[0];
                this.vm.busStopList = value[1];
                this.vm.employeeList = value[2];

                this.vm.classList = value[3];
                this.vm.sectionList = value[4];

                this.populateStudentFeeList(value[5]);
                this.populateFeeReceiptList(value[6]);
                this.vm.subFeeReceiptList = value[7];
                this.populateDiscountList(value[8]);
                this.vm.subDiscountList = value[9];
                this.vm.selectedStudentSectionList = value[10];
                this.vm.sessionList = value[11];
                this.vm.boardList = value[12];
                this.vm.paymentTransactionList = value[14];
                this.vm.handleStudentFeeProfile();

                this.vm.htmlRenderer.modeOfPaymentList = value[15];
                this.vm.htmlRenderer.selectedModeOfPayment = this.vm.htmlRenderer.modeOfPaymentList[0];
            }
        );

        const order_request = {
            orderId__in: this.vm.paymentTransactionList.map(transaction => transaction.parentOrder)
        };
        this.vm.orderList = await this.vm.paymentService.getObjectList(this.vm.paymentService.order_school, order_request);
        this.vm.parseOrder();

        this.vm.isLoading = false;
    }

    populateStudentFeeList(studentFeeList: any): void {
        this.vm.studentFeeList = studentFeeList.sort((a, b) => {
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

    async initiatePayment() {
        const totalAmount = this.vm.getTotalPaymentAmount();

        // ---------------- Data Validation ----------------
        if (totalAmount <= 0) {
            alert('Invalid amount');
            return;
        }

        let errorFlag = false;

        this.vm.selectedStudentList.forEach(student => { // initializing
            if (this.vm.amountError(student)())
                errorFlag = true;
        });

        if (errorFlag) {
            alert('Invalid Amount');
            return;
        }


        // Email Test
        if (!this.vm.validatorRegex.email.test(this.vm.email)) {
            alert('Email Validation Failed');
            return;
        }
        // --------------- Data Validation Ends ---------------
        this.vm.isLoading = true;

        if (!this.vm.user.email) {  // updating user email if previously empty
            const user_email_update_request = {
                'id': this.vm.user.id,
                'email': this.vm.email
            };
            // no need to await for response, not critical task/ utility task
            this.vm.genericService.partiallyUpdateObject({user_app: 'User'}, user_email_update_request);
        }

        const currentRedirectParams = new URLSearchParams(location.search);
        const frontendReturnUrlParams = new URLSearchParams();
        // redirect_to params decides the frontend page and state at which the user is redirected after payment
        frontendReturnUrlParams.append('redirect_to', location.origin + location.pathname + '?' + currentRedirectParams.toString());


        const onlineFeePaymentTransactionList = [];


        Object.keys(this.vm.amountMappedByStudentId).forEach(studentId => {
            if (this.vm.amountMappedByStudentId[studentId] == 0)
                return; // return from forEach
            this.vm.sessionList.forEach(session => {
                const filteredSubFeeReceiptList
                    = this.vm.newSubFeeReceiptListMappedByStudentId[studentId]
                        .filter(subFeeReceipt => subFeeReceipt.parentSession == session.id);
                if (filteredSubFeeReceiptList.length > 0) {
                    const onlineFeePaymentTransaction = {
                        parentSchool: this.vm.user.activeSchool.dbId,
                        parentStudent: studentId,
                        feeReceiptData: {
                            receiptNumber: 0,
                            parentSchool: this.vm.user.activeSchool.dbId,
                            parentStudent: studentId,
                            parentSession: session.id,
                            subFeeReceiptList: filteredSubFeeReceiptList
                        },
                    };
                    onlineFeePaymentTransactionList.push(onlineFeePaymentTransaction);
                }
            });
        });

        const newOrder = {
            orderAmount: totalAmount,
            customerName: this.vm.user.activeSchool.studentList[0].fathersName,
            customerPhone: this.vm.user.username,
            customerEmail: this.vm.email,
            returnData: {
                origin: environment.DJANGO_SERVER,  // backend url api which will be hit by cashfree to verify the completion of payment on their portal
                searchParams: frontendReturnUrlParams.toString()
            },
            orderNote: `payment towards school with KID ${this.vm.user.activeSchool.dbId}`,
            feeReceiptOrderList: onlineFeePaymentTransactionList,
        };

        const newCashfreeOrder = await this.vm.paymentService.createObject(this.vm.paymentService.order_school, newOrder);


        const form = document.createElement('form');

        form.method = 'post';
        form.action = environment.CASHFREE_CHECKOUT_URL;

        Object.entries(newCashfreeOrder).forEach(([key, value]) => {    // form data to send post req. at cashfree
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = value.toString();

            form.appendChild(hiddenField);
        });

        document.body.appendChild(form);
        form.submit();
    }

    async initiatePaymentWithNewMethod() {
        const amount = this.vm.getTotalPaymentAmount();

        // ---------------- Data Validation ----------------
        if (amount <= 0) {
            alert('Invalid amount');
            return;
        }

        let errorFlag = false;

        this.vm.selectedStudentList.forEach(student => { // initializing
            if (this.vm.amountError(student)())
                errorFlag = true;
        });

        if (errorFlag) {
            alert('Invalid Amount');
            return;
        }


        // Email Test
        if (!this.vm.validatorRegex.email.test(this.vm.email)) {
            alert('Email Validation Failed');
            return;
        }
        // --------------- Data Validation Ends ---------------
        this.vm.isLoading = true;

        const currentRedirectParams = new URLSearchParams(location.search);
        const frontendReturnUrlParams = new URLSearchParams();
        // redirect_to params decides the frontend page and state at which the user is redirected after payment
        frontendReturnUrlParams.append('redirect_to', location.origin + location.pathname + '?' + currentRedirectParams.toString());


        const onlineFeePaymentTransactionList = [];


        Object.keys(this.vm.amountMappedByStudentId).forEach(studentId => {
            if (this.vm.amountMappedByStudentId[studentId] == 0)
                return; // return from forEach
            this.vm.sessionList.forEach(session => {
                const filteredSubFeeReceiptList
                    = this.vm.newSubFeeReceiptListMappedByStudentId[studentId]
                        .filter(subFeeReceipt => subFeeReceipt.parentSession == session.id);
                if (filteredSubFeeReceiptList.length > 0) {
                    const onlineFeePaymentTransaction = {
                        parentSchool: this.vm.user.activeSchool.dbId,
                        parentStudent: studentId,
                        feeReceiptData: {
                            receiptNumber: 0,
                            parentSchool: this.vm.user.activeSchool.dbId,
                            parentStudent: studentId,
                            parentSession: session.id,
                            subFeeReceiptList: filteredSubFeeReceiptList
                        },
                    };
                    onlineFeePaymentTransactionList.push(onlineFeePaymentTransaction);
                }
            });
        });

        const newOrder = {
            orderAmount: amount,
            orderTotalAmount: this.vm.htmlRenderer.getNewMethodTotalPayableAmount(),
            paymentMode: this.vm.htmlRenderer.selectedModeOfPayment,
            customerName: this.vm.user.activeSchool.studentList[0].fathersName,
            customerPhone: this.vm.user.username,
            customerEmail: this.vm.email,
            returnData: {
                origin: environment.DJANGO_SERVER,  // backend url api which will be hit by cashfree to verify the completion of payment on their portal
                searchParams: frontendReturnUrlParams.toString()
            },
            orderNote: `payment towards school with KID ${this.vm.user.activeSchool.dbId}`,
            feeReceiptOrderList: onlineFeePaymentTransactionList,
        };

        const newOrderResponse = await this.vm.paymentService.createObject(this.vm.paymentService.easebuzz_order_school, newOrder);
        if (newOrderResponse.success) {
            this.vm.isLoading = false;
            window.location.href = newOrderResponse.success;
        } else {
            this.vm.isLoading = false;
            alert(newOrderResponse.failure || "Unable to generate payment link.");
        }
   }
}
