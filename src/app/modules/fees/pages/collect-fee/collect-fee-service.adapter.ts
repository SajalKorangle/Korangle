
import { CollectFeeComponent } from './collect-fee.component';
import {CommonFunctions} from "../../../../classes/common-functions";

export class CollectFeeServiceAdapter {

    vm: CollectFeeComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: CollectFeeComponent): void {
        this.vm = vm;
    }


    //initialize data
    initializeData(): void {

        this.vm.isLoading = true;

        let schoolId = this.vm.user.activeSchool.dbId;
        let sessionId = this.vm.user.activeSchool.currentSessionDbId;

        let fee_type_list = {
            'parentSchool': schoolId,
        };

        let bus_stop_list = {
            parentSchool: schoolId,
        };

        let employee_list = {
            parentSchool: schoolId,
        };

        Promise.all([

            this.vm.feeService.getList(this.vm.feeService.fee_type, fee_type_list),
            this.vm.vehicleService.getBusStopList(bus_stop_list, this.vm.user.jwt),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_list),
            this.vm.schoolService.getObjectList(this.vm.schoolService.board,{}),

        ]).then( value => {

            this.vm.feeTypeList = value[0];
            this.vm.busStopList = value[1];
            this.vm.employeeList = value[2];
            this.vm.boardList = value[3];

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }


    // Get Student Fee Profile
    getStudentFeeProfile(): void {

        let studentListId = this.vm.selectedStudentList.map(a => a.id).join();

        let student_fee_list = {
            'parentStudent__in': studentListId,
        };

        let fee_receipt_list = {
            'parentStudent__in': studentListId,
            'cancelled': 'false__boolean',
        };

        let sub_fee_receipt_list = {
            'parentStudentFee__parentStudent__in': studentListId,
            'parentFeeReceipt__cancelled': 'false__boolean',
        };

        let discount_list = {
            'parentStudent__in': studentListId,
            'cancelled': 'false__boolean',
        };

        let sub_discount_list = {
            'parentStudentFee__parentStudent__in': studentListId,
            'parentDiscount__cancelled': 'false__boolean',
        };

        let student_section_list = {
            'parentStudent__in': studentListId,
        };

        this.vm.isLoading = true;

        Promise.all([

            this.vm.feeService.getList(this.vm.feeService.student_fees, student_fee_list),
            this.vm.feeService.getList(this.vm.feeService.fee_receipts, fee_receipt_list),
            this.vm.feeService.getList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list),
            this.vm.feeService.getList(this.vm.feeService.discounts, discount_list),
            this.vm.feeService.getList(this.vm.feeService.sub_discounts, sub_discount_list),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_fee_list),

        ]).then( value => {
            console.log(value[0]);
            console.log(value[1]);
            console.log(value[2]);
            this.populateStudentFeeList(value[0]);
            this.populateFeeReceiptList(value[1]);
            this.vm.subFeeReceiptList = value[2];
            this.populateDiscountList(value[3]);
            this.vm.subDiscountList = value[4];
            this.vm.selectedStudentSectionList = value[5];
            // this.populateSelectedStudentSectionList(value[5]);

            this.vm.handleStudentFeeProfile();

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }

    populateStudentFeeList(studentFeeList: any): void {
        this.vm.studentFeeList = studentFeeList.sort( (a,b) => {
            let first = this.vm.getFeeTypeByStudentFee(a);
            let second = this.vm.getFeeTypeByStudentFee(b);
            return a.orderNumber-b.orderNumber;
        });
    }

    populateFeeReceiptList(feeReceiptList: any): void {
        this.vm.feeReceiptList = feeReceiptList.sort((a,b) => {
            return b.receiptNumber-a.receiptNumber;
        });
    }

    populateDiscountList(discountList: any): void {
        this.vm.discountList = discountList.sort((a,b) => {
            return b.discountNumber-a.discountNumber;
        });
    }


    // Generate Fee Receipt/s
    generateFeeReceipts(): void {

        this.vm.isLoading = true;

        let fee_receipt_list = this.vm.newFeeReceiptList.map(feeReceipt => {
            // return CommonFunctions.getInstance().copyObject(feeReceipt);
            let tempObject = CommonFunctions.getInstance().copyObject(feeReceipt);
            if (feeReceipt['remark'] == '') {
                feeReceipt['remark'] = null;
            }
            return tempObject;
        });

        let sub_fee_receipt_list = this.vm.newSubFeeReceiptList.map(subFeeReceipt => {
            return CommonFunctions.getInstance().copyObject(subFeeReceipt);
        });

        let tempStudentFeeIdList = sub_fee_receipt_list.map(a => a.parentStudentFee);

        let student_fee_list = this.vm.studentFeeList.filter(studentFee => {
            return tempStudentFeeIdList.includes(studentFee.id);
        }).map(studentFee => {
            if (this.vm.getStudentFeeFeesDue(studentFee) + this.vm.getStudentFeeLateFeesDue(studentFee) == 0) {
                studentFee.cleared = true;
            }
            return CommonFunctions.getInstance().copyObject(studentFee);
        });

        this.vm.isLoading = true;

        Promise.all([
            this.vm.feeService.createList(this.vm.feeService.fee_receipts, fee_receipt_list),
            this.vm.feeService.partiallyUpdateObjectList(this.vm.feeService.student_fees, student_fee_list),
        ]).then(value => {

            value[0].forEach(fee_receipt => {
                sub_fee_receipt_list.forEach(subFeeReceipt => {
                    if(subFeeReceipt.parentSession == fee_receipt.parentSession
                        && this.vm.studentFeeList.find(item => {
                            return item.id == subFeeReceipt.parentStudentFee;
                        }).parentStudent == fee_receipt.parentStudent) {
                        subFeeReceipt['parentFeeReceipt'] = fee_receipt.id;
                    }
                });
            });

            this.vm.feeService.createList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list).then( value2 => {

                this.addToFeeReceiptList(value[0]);
                this.vm.subFeeReceiptList = this.vm.subFeeReceiptList.concat(value2);

                alert('Fees submitted successfully');

                this.vm.printFullFeeReceiptList(value[0], value2);

                this.vm.handleStudentFeeProfile();

                this.vm.isLoading = false;

            })

        }, error => {
            this.vm.isLoading = false;
        })

    }

    addToFeeReceiptList(fee_receipt_list: any): void {
        this.vm.feeReceiptList = this.vm.feeReceiptList.concat(fee_receipt_list).sort((a,b) => {
            return b.receiptNumber-a.receiptNumber;
        });
    }

}
