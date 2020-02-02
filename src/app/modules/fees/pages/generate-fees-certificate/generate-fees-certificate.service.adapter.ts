
import { GenerateFeesCertificateComponent } from './generate-fees-certificate.component';

export class GenerateFeesCertificateServiceAdapter {

    vm: GenerateFeesCertificateComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: GenerateFeesCertificateComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoading = true;

        Promise.all([
            this.vm.schoolService.getObjectList(this.vm.schoolService.board,{}),
        ]).then(value => {
            this.vm.boardList = value[0];
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    getStudentProfile(selectedStudentList): void {
        this.vm.isLoading = true;

        let studentListId = selectedStudentList.map(a => a.id).join();

        let request_student_data = {
            'id__in': studentListId,
        };

        let fees_type_list = {
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        let fee_receipt_list = {
            'parentStudent__in': studentListId,
            'cancelled': 'false__boolean',
            'parentFeeReceipt__generationDateTime__date__gte': this.vm.selectedSession.startDate,
            'parentFeeReceipt__generationDateTime__date__lte': this.vm.selectedSession.endDate,
        };

        let sub_fee_receipt_list = {
            'parentStudentFee__parentStudent__in': studentListId,
            'parentFeeReceipt__cancelled': 'false__boolean',
            'parentFeeReceipt__generationDateTime__date__gte': this.vm.selectedSession.startDate,
            'parentFeeReceipt__generationDateTime__date__lte': this.vm.selectedSession.endDate,
        };

        Promise.all([
            this.vm.studentService.getObjectList(this.vm.studentService.student ,request_student_data),
            this.vm.feeService.getObjectList(this.vm.feeService.fee_type, fees_type_list),
            this.vm.feeService.getObjectList(this.vm.feeService.fee_receipts, fee_receipt_list),
            this.vm.feeService.getObjectList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list),
        ]).then(value => {

            this.vm.selectedStudentList = value[0];
            this.vm.feeTypeList = value[1];
            this.vm.feeReceiptList = value[2];
            this.vm.subFeeReceiptList = value[3];

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }

}
