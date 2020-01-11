
import { ViewDefaultersComponent } from './view-defaulters.component';

export class ViewDefaultersServiceAdapter {

    vm: ViewDefaultersComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: ViewDefaultersComponent): void {
        this.vm = vm;
    }

    initializeData(): void {

        // this.vm.d1 = new Date();

        this.vm.isLoading = true;

        let student_section_list = {
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentStudent__parentTransferCertificate': 'null__korangle',
        };
        
        this.vm.schoolService.getObjectList(this.vm.schoolService.session,{}).then(sessionList =>{
            this.vm.sessionList = sessionList
            console.log(this.vm.sessionList)
            let todaysDate = new Date();
            this.vm.currentSession = this.vm.sessionList.find(session => {
                return new Date(session.startDate) <= todaysDate
                    && new Date(new Date(session.endDate).getTime() +  24 * 60 * 60 * 1000) > todaysDate;
            });
        })

        this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_list).then(valueList => {

            this.vm.studentSectionList = valueList;

            let tempStudentIdList = valueList.map(a => a.parentStudent);

            let student_list = {
                'id__in': tempStudentIdList.join(),
                'fields__korangle': 'id,name,fathersName,mobileNumber,secondMobileNumber',
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
                this.vm.classService.getObjectList(this.vm.classService.classs,{}),
                this.vm.classService.getObjectList(this.vm.classService.division,{}),
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