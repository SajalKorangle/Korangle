import { ViewFeeComponent } from './view-fee.component';
import { environment } from 'environments/environment';
import { Constants } from '@classes/constants';

export class ViewFeeServiceAdapter {
    vm: ViewFeeComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: ViewFeeComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoading = true;

        let schoolId = this.vm.user.activeSchool.dbId;
        let sessionId = this.vm.user.activeSchool.currentSessionDbId;

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

        let student_section_list = {
            parentStudent__in: studentListId,
        };

        Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.fee_type, fee_type_list),
            this.vm.vehicleService.getBusStopList(bus_stop_list, this.vm.user.jwt),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_list),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),

            this.vm.feeService.getObjectList(this.vm.feeService.student_fees, student_fee_list),
            this.vm.feeService.getObjectList(this.vm.feeService.fee_receipts, fee_receipt_list),
            this.vm.feeService.getObjectList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list),
            this.vm.feeService.getObjectList(this.vm.feeService.discounts, discount_list),
            this.vm.feeService.getObjectList(this.vm.feeService.sub_discounts, sub_discount_list),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_fee_list),
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}),
            this.vm.schoolService.getObjectList(this.vm.schoolService.board, {}),
        ]).then(
            (value) => {
                console.log(value);

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

    async initiatePayment(amountMappedByStudntId, newSubFeeReceiptListMappedByStudntId, email) {
        this.vm.isLoading = true;
        const totalAmount = Object.values(amountMappedByStudntId).reduce((acc: number, next: number) => acc + next, 0);

        if (totalAmount == 0) {
            this.vm.isLoading = false;
            return;
        }

        const returnUrl = new URL(
            environment.DJANGO_SERVER + Constants.api_version + this.vm.feeService.module_url + this.vm.feeService.order_completion);
        returnUrl.searchParams.append('redirect_to', location.href);

        const newOrder = {
            orderAmount: totalAmount,
            customerName: this.vm.user.activeSchool.studentList[0].fathersName,
            customerPhone: this.vm.user.username,
            customerEmail: email,
            returnUrl: returnUrl.toString(),
            orderNote: 'payment towards school fee'
        };

        const newCashfreeOrder = await this.vm.feeService.createObject(this.vm.feeService.order, newOrder);

        const newTransactionList = [];

        Object.keys(amountMappedByStudntId).forEach(studentId => {
            if (amountMappedByStudntId[studentId] == 0)
                return; // return from for Each
            const newTransaction = {
                parentStudent: studentId,
                parentOrder: newCashfreeOrder.id,
                feeDetailJSON: newSubFeeReceiptListMappedByStudntId[studentId],
            };
            newTransactionList.push(newTransaction);
        });

        await this.vm.feeService.createObjectList(this.vm.feeService.transaction, newTransactionList);
        window.open(newCashfreeOrder.paymentLink, '_self');
        this.vm.isLoading = false;
    }
}
