
import { ViewDefaultersComponent } from './view-defaulters.component';

export class ViewDefaultersServiceAdapter {

    vm: ViewDefaultersComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: ViewDefaultersComponent): void {
        this.vm = vm;
    }

    //initialize data
    /*initializeData(): void {

        this.vm.d1 = new Date();

        this.vm.isLoading = true;

        let student_section_list = {
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentStudent__parentTransferCertificate': 'null__korangle',
        };

        let student_list = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentTransferCertificate': 'null__korangle',
        };

        let student_fee_list = {
            'parentSession__or': this.vm.user.activeSchool.currentSessionDbId,
            'cleared': 'false__boolean',
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentStudent__parentTransferCertificate': 'null__korangle',
        };

        let sub_fee_receipt_list = {
            'parentStudentFee__parentSession__or': this.vm.user.activeSchool.currentSessionDbId,
            'parentStudentFee__cleared': 'false__boolean',
            'parentStudentFee__parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentStudentFee__parentStudent__parentTransferCertificate': 'null__korangle',
            'parentFeeReceipt__cancelled': 'false__boolean',
        };

        let sub_discount_list = {
            'parentStudentFee__parentSession__or': this.vm.user.activeSchool.currentSessionDbId,
            'parentStudentFee__cleared': 'false__boolean',
            'parentStudentFee__parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentStudentFee__parentStudent__parentTransferCertificate': 'null__korangle',
            'parentDiscount__cancelled': 'false__boolean',
        };

        Promise.all([
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_list),
            this.vm.studentService.getObjectList(this.vm.studentService.student, student_list),
            this.vm.feeService.getObjectList(this.vm.feeService.student_fees, student_fee_list),
            this.vm.feeService.getObjectList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list),
            this.vm.feeService.getObjectList(this.vm.feeService.sub_discounts, sub_discount_list),
        ]).then( value => {

            console.log(value);

            this.vm.studentSectionList = value[0];

            let tempStudentIdList = this.vm.studentSectionList.map(a => a.parentStudent);

            this.vm.studentList = this.populateStudentList(value[1], tempStudentIdList);
            this.vm.studentFeeList = this.populateStudentFeeList(value[2], tempStudentIdList);
            this.vm.subFeeReceiptList = this.populateSubFeeReceiptList(value[3], tempStudentIdList);
            this.vm.subDiscountList = this.populateSubDiscountList(value[4], tempStudentIdList);

            this.vm.isLoading = false;

            this.vm.d2 = new Date();

        }, error => {
            this.vm.isLoading = false;
        })

    }*/

    initializeData(): void {

        // this.vm.d1 = new Date();

        this.vm.isLoading = true;

        let student_section_list = {
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentStudent__parentTransferCertificate': 'null__korangle',
        };

        this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_list).then(valueList => {

            this.vm.studentSectionList = valueList;

            let tempStudentIdList = valueList.map(a => a.parentStudent);

            let student_list = {
                'id__in': tempStudentIdList.join(),
            };

            let student_fee_list = {
                'parentSession__or': this.vm.user.activeSchool.currentSessionDbId,
                'cleared': 'false__boolean',
                'parentStudent__in': tempStudentIdList.join(),
            };

            let sub_fee_receipt_list = {
                'parentStudentFee__parentSession__or': this.vm.user.activeSchool.currentSessionDbId,
                'parentStudentFee__cleared': 'false__boolean',
                'parentStudentFee__parentStudent__in': tempStudentIdList.join(),
                'parentFeeReceipt__cancelled': 'false__boolean',
            };

            let sub_discount_list = {
                'parentStudentFee__parentSession__or': this.vm.user.activeSchool.currentSessionDbId,
                'parentStudentFee__cleared': 'false__boolean',
                'parentStudentFee__parentStudent__in': tempStudentIdList.join(),
                'parentDiscount__cancelled': 'false__boolean',
            };

            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student, student_list),
                this.vm.feeService.getObjectList(this.vm.feeService.student_fees, student_fee_list),
                this.vm.feeService.getObjectList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list),
                this.vm.feeService.getObjectList(this.vm.feeService.sub_discounts, sub_discount_list),
                this.vm.classService.getClassList(this.vm.user.jwt),
                this.vm.classService.getSectionList(this.vm.user.jwt),
            ]).then(value => {

                this.vm.studentList = value[0];
                this.vm.studentFeeList = value[1];
                this.vm.subFeeReceiptList = value[2];
                this.vm.subDiscountList = value[3];
                this.vm.classList = value[4];
                this.vm.sectionList = value[5];

                this.vm.handleLoading();

                this.vm.isLoading = false;

                // this.vm.d2 = new Date();

            }, error => {
                this.vm.isLoading = false;
            });

        }, error => {
            this.vm.isLoading = false;
        });

    }

}