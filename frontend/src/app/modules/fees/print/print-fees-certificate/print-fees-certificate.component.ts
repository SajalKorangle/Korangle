import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MEDIUM_LIST } from '../../../../classes/constants/medium';
import { PrintService } from '../../../../print/print-service';
import { INSTALLMENT_LIST } from '../../classes/constants';

@Component({
    selector: 'app-print-fees-certificate',
    templateUrl: './print-fees-certificate.component.html',
    styleUrls: ['./print-fees-certificate.component.css'],
})
export class PrintFeesCertificateComponent implements OnInit {
    user: any;

    mediumList = MEDIUM_LIST;
    installmentList = INSTALLMENT_LIST;

    certificateNumber: any;
    boardList = [];
    studentList = [];
    studentSectionList = [];
    classList = [];
    sectionList = [];
    feeTypeList = [];
    subFeeReceiptList = [];
    feeReceiptList = [];
    selectedSession: any;

    viewChecked = true;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) {}

    ngOnInit(): void {
        const { user, value } = this.printService.getData();
        this.user = user;
        console.log(value);
        this.certificateNumber = value.certificateNumber;
        this.studentList = value.studentList;
        this.boardList = value.boardList;
        this.selectedSession = value.selectedSession;
        this.subFeeReceiptList = value.subFeeReceiptList;
        this.feeReceiptList = value.feeReceiptList;
        this.feeTypeList = value.feeTypeList;
        this.classList = value.classList;
        this.sectionList = value.sectionList;
        this.studentSectionList = value.studentSectionList;
        this.viewChecked = false;
    }

    getCurrentDate() {
        return new Date();
    }

    convertToDate(date: any) {
        const [year, month, day] = date.split("-");
        return new Date(year, month - 1, day);
      }

    getClassAndSectionName(student: any): any {
        let classs = this.classList.find((classs) => {
            return (
                classs.id ==
                this.studentSectionList.find((studentSection) => {
                    return studentSection.parentStudent == student.id;
                }).parentClass
            );
        });
        let section = this.sectionList.find((section) => {
            return (
                section.id ==
                this.studentSectionList.find((studentSection) => {
                    return studentSection.parentStudent == student.id;
                }).parentDivision
            );
        });
        return classs.name + ', ' + section.name;
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

    getFilteredFeesTypeList(student: any): any {
        return this.feeTypeList.filter((feeType) => {
            return this.getFeesPaidByFeeTypeAndStudent(feeType, student) > 0;
        });
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
        return this.studentList.reduce((totalAmount, student) => {
            return totalAmount + this.getTotalFeesPaidByStudent(student);
        }, 0);
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

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();
            this.studentList = [];
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.studentList = [];
    }
}
