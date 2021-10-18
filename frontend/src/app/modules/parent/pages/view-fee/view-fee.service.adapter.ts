import { ViewFeeComponent } from './view-fee.component';
import { environment } from 'environments/environment';

export class ViewFeeServiceAdapter {
    vm: ViewFeeComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: ViewFeeComponent): void {
        this.vm = vm;
    }

    //initialize data
    async initializeData() {

        let schoolId = this.vm.user.activeSchool.dbId;

        let studentListId = this.vm.user.section.student.studentList.map((a) => a.id).join();

        console.log(studentListId);

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

        await Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.fee_type, fee_type_list),   // 0
            this.vm.vehicleService.getBusStopList(bus_stop_list, this.vm.user.jwt), // 1
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_list),    // 2
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),    // 3
            this.vm.classService.getObjectList(this.vm.classService.division, {}),  // 4

            this.vm.feeService.getObjectList(this.vm.feeService.student_fees, student_fee_list),    // 5
            this.vm.feeService.getObjectList(this.vm.feeService.fee_receipts, fee_receipt_list),    // 6
            this.vm.feeService.getObjectList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list),    // 7
            this.vm.feeService.getObjectList(this.vm.feeService.discounts, discount_list),  // 8
            this.vm.feeService.getObjectList(this.vm.feeService.sub_discounts, sub_discount_list),  // 9
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_fee_list), // 10
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}), // 11
            this.vm.schoolService.getObjectList(this.vm.schoolService.board, {}),   // 12
            this.vm.paymentService.getObject(this.vm.paymentService.school_merchant_account, {}), // 13
            this.vm.feeService.getObjectList(this.vm.feeService.online_fee_payment_transaction, {}), //14
        ]).then(
            (value) => {
                console.log(value);

                this.vm.hasOnlinePaymentAccount = Boolean(value[13]);

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
            this.vm.userService.partiallyUpdateObject(this.vm.userService.user, user_email_update_request);
        }

        // backend url api which will be hit by cashfree to verify the completion of payment on their portal.
        const returnUrl = new URL(
            environment.DJANGO_SERVER + this.vm.paymentService.module_url + this.vm.paymentService.version_free_api.order_completion + '/');

        const redirectParams = new URLSearchParams(location.search);


        // redirect_to params decides the frontend page and state at which the user is redirected after payment
        returnUrl.searchParams.append('redirect_to', location.origin + location.pathname + '?' + redirectParams.toString());

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
            returnUrl: returnUrl.toString(),
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
}
