
import { ViewFeeComponent } from './view-fee.component';
import { CommonFunctions } from "../../../../classes/common-functions";

export class ViewFeeServiceAdapter {

    vm: ViewFeeComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: ViewFeeComponent): void {
        this.vm = vm;
    }


    //initialize data
    initializeData(): void {

        this.vm.isLoading = true;

        let schoolId = this.vm.user.activeSchool.dbId;
        let sessionId = this.vm.user.activeSchool.currentSessionDbId;

        let studentListId = this.vm.user.section.student.studentList.map(a => a.id).join();

        console.log(studentListId);

        let fee_type_list = {
            'parentSchool': schoolId,
        };

        let bus_stop_list = {
            parentSchool: schoolId,
        };

        let employee_list = {
            parentSchool: schoolId,
        };

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

        Promise.all([

            this.vm.feeService.getList(this.vm.feeService.fee_type, fee_type_list),
            this.vm.vehicleService.getBusStopList(bus_stop_list, this.vm.user.jwt),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_list),
            this.vm.classService.getObjectList(this.vm.classService.classs,{}),
            this.vm.classService.getObjectList(this.vm.classService.division,{}),

            this.vm.feeService.getList(this.vm.feeService.student_fees, student_fee_list),
            this.vm.feeService.getList(this.vm.feeService.fee_receipts, fee_receipt_list),
            this.vm.feeService.getList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list),
            this.vm.feeService.getList(this.vm.feeService.discounts, discount_list),
            this.vm.feeService.getList(this.vm.feeService.sub_discounts, sub_discount_list),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_fee_list),

        ]).then( value => {

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

}