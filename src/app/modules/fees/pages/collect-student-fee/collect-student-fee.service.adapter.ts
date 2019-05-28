
import { CollectStudentFeeComponent } from './collect-student-fee.component';
import {CommonFunctions} from "../../../../classes/common-functions";

export class CollectStudentFeeServiceAdapter {

    vm: CollectStudentFeeComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: CollectStudentFeeComponent): void {
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

        ]).then( value => {

            this.vm.feeTypeList = value[0];
            this.vm.busStopList = value[1];
            this.vm.employeeList = value[2];

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }


    // Get Student Fee Profile
    getStudentFeeProfile(): void {

        let studentListId = this.vm.selectedStudentList.map(a => a.id).join();

        let student_fee_list = {
            'parentStudent': studentListId,
        };

        let fee_receipt_list = {
            'parentStudent': studentListId,
            'cancelled': 'false__boolean',
        };

        let sub_fee_receipt_list = {
            'parentStudentFee__parentStudent': studentListId,
            'parentFeeReceipt__cancelled': 'false__boolean',
        };

        let discount_list = {
            'parentStudent': studentListId,
            'cancelled': 'false__boolean',
        };

        let sub_discount_list = {
            'parentStudentFee__parentStudent': studentListId,
            'parentDiscount__cancelled': 'false__boolean',
        };

        let student_section_list = {
            'parentStudent': studentListId,
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

        this.vm.isLoading = true;

        this.vm.feeService.createList(this.vm.feeService.fee_receipts, fee_receipt_list).then(value => {

            value.filter(fee_receipt => {
                sub_fee_receipt_list.filter(subFeeReceipt => {
                    if(subFeeReceipt.parentSession == fee_receipt.parentSession
                        && this.vm.studentFeeList.find(item => {
                            return item.id == subFeeReceipt.parentStudentFee;
                        }).parentStudent == fee_receipt.parentStudent) {
                        subFeeReceipt['parentFeeReceipt'] = fee_receipt.id;
                    }
                });
            });

            this.vm.feeService.createList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list).then( value2 => {

                this.addToFeeReceiptList(value);
                this.vm.subFeeReceiptList = this.vm.subFeeReceiptList.concat(value2);

                alert('Fees submitted successfully');

                this.vm.printFullFeeReceiptList(value, value2);

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