
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

    getStudentFeeProfile(): void {
        let studentListId = this.vm.selectedStudentList.map(a => a.id).join();
        let fee_type_list = {
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        let currentSession = this.vm.selectedSession;
        let sessionStart = currentSession.startDate;
        let sessionEnd = currentSession.endDate;

        let fee_receipt_list = {
            'parentStudent__in': studentListId,
            'cancelled': 'false__boolean',
            'parentFeeReceipt__generationDateTime__date__gte':sessionStart,
            'parentFeeReceipt__generationDateTime__date__lte':sessionEnd,
        };
        let sub_fee_receipt_list = {
            'parentStudentFee__parentStudent__in': studentListId,
            'parentFeeReceipt__cancelled': 'false__boolean',
            'parentFeeReceipt__generationDateTime__date__gte':sessionStart,
            'parentFeeReceipt__generationDateTime__date__lte':sessionEnd,
        };
        
        Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.fee_type, fee_type_list),
            this.vm.feeService.getObjectList(this.vm.feeService.fee_receipts, fee_receipt_list), // dep
            this.vm.feeService.getObjectList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list), // ?
        ]).then(value => {
            this.vm.feeTypeList = value[0];
            this.populateFeeReceiptList(value[1]);
            this.vm.subFeeReceiptList = value[2];
            this.vm.isLoading = false;
        })
    }

    populateFeeReceiptList(feeReceiptList: any): void {
        this.vm.feeReceiptList = feeReceiptList.sort((a,b) => {
            return b.receiptNumber-a.receiptNumber;
        });
    }

}
