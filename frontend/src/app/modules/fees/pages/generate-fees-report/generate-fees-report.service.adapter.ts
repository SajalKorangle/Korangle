import { GenerateFeesReportComponent } from './generate-fees-report.component';

export class GenerateFeesReportServiceAdapter {
    vm: GenerateFeesReportComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: GenerateFeesReportComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {

        this.vm.isLoading = true;

        this.vm.genericService.getObjectList({school_app: 'Session'}, {}).then((session) => {
            this.vm.sessionList = session;
            let todaysDate = new Date();
            this.vm.currentSession = this.vm.sessionList.find((session) => {
                return (
                    new Date(session.startDate) <= todaysDate &&
                    new Date(new Date(session.endDate).getTime() + 24 * 60 * 60 * 1000) > todaysDate
                );
            });

            let student_section_list = {
                parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
                parentStudent__parentTransferCertificate: null,
            };

            let fee_receipt_list = {
                parentSchool: this.vm.user.activeSchool.dbId,
                cancelled: false,
                generationDateTime__gte: this.vm.getSession().startDate + ' 00:00:00+05:30',
                generationDateTime__lte: this.vm.getSession().endDate + ' 23:59:59+05:30',
            };

            Promise.all([
                this.vm.genericService.getObjectList({student_app: 'StudentSection'}, {filter: student_section_list}), // 0
                this.vm.genericService.getObjectList({fees_third_app: 'FeeReceipt'}, {filter: fee_receipt_list}), // 1
            ]).then(
                (valueList) => {
                    this.vm.studentSectionList = valueList[0];

                    let tempStudentIdList = valueList[0].map((a) => a.parentStudent);

                    let student_list = {
                        id__in: tempStudentIdList,
                    };

                    let student_fee_list = {
                        __or__ : [
                            { parentSession: this.vm.user.activeSchool.currentSessionDbId },
                            { cleared: false },
                        ],
                        parentStudent__in: tempStudentIdList,
                    };

                    let sub_fee_receipt_list = {
                        __or__ : [
                            { parentStudentFee__parentSession: this.vm.user.activeSchool.currentSessionDbId },
                            { parentStudentFee__cleared: false },
                        ],
                        parentStudentFee__parentStudent__in: tempStudentIdList,
                        parentFeeReceipt__cancelled: false,
                    };

                    let sub_discount_list = {
                        __or__ : [
                            { parentStudentFee__parentSession: this.vm.user.activeSchool.currentSessionDbId },
                            { parentStudentFee__cleared: false },
                        ],
                        parentStudentFee__parentStudent__in: tempStudentIdList,
                        parentDiscount__cancelled: false,
                    };

                    let second_sub_fee_receipt_list = {
                        parentFeeReceipt__in: valueList[1].map((a) => a.id),
                    };

                    Promise.all([
                        this.vm.genericService.getObjectList({student_app: 'Student'}, {filter: student_list}), // 0
                        this.vm.genericService.getObjectList({fees_third_app: 'StudentFee'}, {filter: student_fee_list}), // 1
                        this.vm.genericService.getObjectList({fees_third_app: 'SubFeeReceipt'}, {filter: sub_fee_receipt_list}), // 2
                        this.vm.genericService.getObjectList({fees_third_app: 'SubDiscount'}, {filter: sub_discount_list}), // 3
                        this.vm.genericService.getObjectList({class_app: 'Class'}, {}), // 4
                        this.vm.genericService.getObjectList({class_app: 'Division'}, {}), // 5
                        this.vm.genericService.getObjectList({fees_third_app: 'SubFeeReceipt'}, {filter: second_sub_fee_receipt_list}), // 6
                    ]).then(
                        (value) => {
                            this.vm.studentList = value[0];
                            this.vm.studentFeeList = value[1];
                            this.vm.subFeeReceiptList = value[2];
                            this.vm.subDiscountList = value[3];
                            this.vm.classList = value[4];
                            this.vm.sectionList = value[5];
                            this.vm.secondSubFeeReceiptList = value[6];

                            this.vm.handleLoading();

                            this.vm.isLoading = false;
                        },
                        (error) => {
                            this.vm.isLoading = false;
                        }
                    );
                },
                (error) => {
                    this.vm.isLoading = false;
                }
            );
        });
    }
}
