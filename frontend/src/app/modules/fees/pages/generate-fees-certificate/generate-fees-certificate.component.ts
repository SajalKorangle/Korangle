import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { GenerateFeesCertificateServiceAdapter } from './generate-fees-certificate.service.adapter';
import { FeeService } from '../../../../services/modules/fees/fee.service';
import { PrintService } from '../../../../print/print-service';
import { PRINT_FEES_CERTIFICATE } from '../../print/print-routes.constants';
import { INSTALLMENT_LIST } from '../../classes/constants';
import { DataStorage } from '../../../../classes/data-storage';
import { SchoolService } from '../../../../services/modules/school/school.service';
import { GenericService } from '@services/generic/generic-service';

@Component({
    selector: 'generate-fees-certificate',
    templateUrl: './generate-fees-certificate.component.html',
    styleUrls: ['./generate-fees-certificate.component.css'],
    providers: [
        FeeService,
        SchoolService,
        GenericService,
    ],
})
export class GenerateFeesCertificateComponent implements OnInit {
    user;

    serviceAdapter: GenerateFeesCertificateServiceAdapter;

    isLoading = false;

    isStudentListLoading = false;
    boardList: any;
    classList: any;
    sectionList: any;
    selectedStudentSectionList = [];
    selectedStudentList = [];
    sessionList: any;
    selectedSession: any;
    feeTypeList = [];
    feeReceiptList = [];
    subFeeReceiptList = [];
    installmentList = INSTALLMENT_LIST;

    certificateNumber: any;

    constructor(
        public printService: PrintService,
        public schoolService: SchoolService,
        public genericService: GenericService,
        public feeService: FeeService,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new GenerateFeesCertificateServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        this.getSessionList();
    }

    getSessionList(): void {
        this.genericService.getObjectList({school_app: 'Session'}, {}).then((sessionList) => {
            this.sessionList = sessionList;
            this.sessionList.every((session) => {
                if (session.id === this.user.activeSchool.currentSessionDbId) {
                    this.selectedSession = session;
                    return false;
                }
                return true;
            });
        });
    }

    handleDetailsFromParentStudentFilter(details: any) {
        this.classList = details['classList'];
        this.sectionList = details['sectionList'];
    }

    handleStudentListSelection(selectedList: any) {
        this.selectedStudentSectionList = selectedList[1];
        this.serviceAdapter.getStudentProfile(selectedList[0]);
    }

    getFeesPaidByFeeTypeAndStudent(feeType: any, student: any): number {
        return this.subFeeReceiptList
            .filter((subFeeReceipt) => {
                return (
                    subFeeReceipt.parentFeeType == feeType.id &&
                    student.id ==
                        this.feeReceiptList.find((feeReceipt) => {
                            return subFeeReceipt.parentFeeReceipt == feeReceipt.id;
                        }).parentStudent
                );
            })
            .reduce((totalAmount, subFeeReceipt) => {
                return totalAmount + this.getSubFeeReceiptTotalAmount(subFeeReceipt);
            }, 0);
    }

    getTotalFeesPaidByStudent(student: any): number {
        return this.subFeeReceiptList
            .filter((subFeeReceipt) => {
                return (
                    student.id ==
                    this.feeReceiptList.find((feeReceipt) => {
                        return subFeeReceipt.parentFeeReceipt == feeReceipt.id;
                    }).parentStudent
                );
            })
            .reduce((totalAmount, subFeeReceipt) => {
                return totalAmount + this.getSubFeeReceiptTotalAmount(subFeeReceipt);
            }, 0);
    }

    getTotalFeesPaid(): number {
        let totalAmount = 0;
        this.selectedStudentList.forEach((student) => {
            totalAmount += this.getTotalFeesPaidByStudent(student);
        });
        return totalAmount;
    }

    getSubFeeReceiptTotalAmount(subFeeReceipt: any): number {
        return this.installmentList.reduce((totalAmount, installment) => {
            return (
                totalAmount +
                (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0) +
                (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0)
            );
        }, 0);
    }

    printFeesCertificate() {
        let data = {
            studentList: this.selectedStudentList.filter((student) => {
                return this.getTotalFeesPaidByStudent(student) > 0;
            }),
            boardList: this.boardList,
            selectedSession: this.selectedSession,
            subFeeReceiptList: this.subFeeReceiptList,
            feeReceiptList: this.feeReceiptList,
            certificateNumber: this.certificateNumber,
            studentSectionList: this.selectedStudentSectionList,
            classList: this.classList,
            sectionList: this.sectionList,
            feeTypeList: this.feeTypeList,
        };
        this.printService.navigateToPrintRoute(PRINT_FEES_CERTIFICATE, { user: this.user, value: data });
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }
}
