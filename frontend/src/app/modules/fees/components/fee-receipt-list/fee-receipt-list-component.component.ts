import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { INSTALLMENT_LIST } from '../../classes/constants';
import { PrintService } from '../../../../print/print-service';
import { PRINT_FULL_FEE_RECIEPT_LIST } from '../../print/print-routes.constants';
import { SchoolService } from '../../../../services/modules/school/school.service';
import { MatDialog } from '@angular/material/dialog';
import { CancelFeeReceiptModalComponent } from '@modules/fees/components/cancel-fee-receipt-modal/cancel-fee-receipt-modal.component';
import { FeeReceiptListComponentServiceAdapter } from '@modules/fees/components/fee-receipt-list/fee-receipt-list.component.service.adapter';
import { FeeService } from '@services/modules/fees/fee.service';

@Component({
    selector: 'app-fee-receipt-list',
    templateUrl: './fee-receipt-list-component.component.html',
    styleUrls: ['./fee-receipt-list-component.component.css'],
    providers: [SchoolService, FeeService],
})
export class FeeReceiptListComponent implements OnInit {
    @Input() user;
    @Input() feeTypeList;
    @Input() feeReceiptList;
    @Input() subFeeReceiptList;
    @Input() studentList;
    @Input() studentSectionList;
    @Input() classList;
    @Input() sectionList;
    @Input() employeeList;
    @Input() feeReceiptBookList;
    @Input() receiptColumnFilter;
    @Input() number;
    @Input() boardList;
    @Input() sessionList = [];
    @Input() isPrinting = false;
    @Input() printSingleReceipt = false;

    @Output() receiptCancelled = new EventEmitter<any>();

    // Constant Lists
    installmentList = INSTALLMENT_LIST;
    isLoading: boolean;
    serviceAdapter: FeeReceiptListComponentServiceAdapter;

    constructor(
        private schoolService: SchoolService,
        private dialog: MatDialog,
        public printService: PrintService,
        public feeService: FeeService
    ) { }

    ngOnInit() {
        this.serviceAdapter = new FeeReceiptListComponentServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
    }

    printFeeReceipt(feeReceipt: any): void {
        let data = {
            feeTypeList: this.feeTypeList,
            feeReceiptList: [feeReceipt],
            subFeeReceiptList: this.subFeeReceiptList.filter((item) => {
                return item.parentFeeReceipt == feeReceipt.id;
            }),
            studentList: this.studentList,
            studentSectionList: this.studentSectionList,
            classList: this.classList,
            sectionList: this.sectionList,
            employeeList: this.employeeList,
            boardList: this.boardList,
            sessionList: this.sessionList,
            feeReceiptBookList: this.feeReceiptBookList,
            printSingleReceipt: this.printSingleReceipt
        };

        this.printService.navigateToPrintRoute(PRINT_FULL_FEE_RECIEPT_LIST, { user: this.user, value: data });
    }

    getFeeReceiptFilteredAmount(feeReceipt: any): number {
        let selectedFeeTypeIdList = this.feeTypeList.filter(feeType => { return feeType.selectedFeeType; }).map(feeType => { return feeType.id; });
        if (selectedFeeTypeIdList.length == 0)
        {
            return this.subFeeReceiptList.filter((subFeeReceipt) => {
            return subFeeReceipt.parentFeeReceipt == feeReceipt.id;
            })
            .reduce((totalSubFeeReceipt, subFeeReceipt) => {
                return (
                    totalSubFeeReceipt + this.installmentList.reduce((totalInstallment, installment) => {
                        return (
                            totalInstallment +
                            (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0) +
                            (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0)
                        );
                    }, 0)
                );
            }, 0);
        }
        return this.subFeeReceiptList.filter((subFeeReceipt) => {
        return subFeeReceipt.parentFeeReceipt == feeReceipt.id && selectedFeeTypeIdList.includes(subFeeReceipt.parentFeeType);
        })
        .reduce((totalSubFeeReceipt, subFeeReceipt) => {
            return (
                totalSubFeeReceipt + this.installmentList.reduce((totalInstallment, installment) => {
                    return (
                        totalInstallment +
                        (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0) +
                        (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0)
                    );
                }, 0)
            );
        }, 0);
    }

    increaseNumber(): void {
        this.number += this.number;
    }

    getStudent(studentId: number): any {
        return this.studentList.find((student) => {
            return student.id == studentId;
        });
    }

    getStudentScholarNumber(studentId: number): any {
        return this.studentList.find((student) => {
            return student.id == studentId;
        }).scholarNumber;
    }

    getClassName(studentId: any, sessionId: any): any {
        return this.classList.find((classs) => {
            return (
                classs.id ==
                this.studentSectionList.find((studentSection) => {
                    return studentSection.parentStudent == studentId && studentSection.parentSession == sessionId;
                }).parentClass
            );
        }).name;
    }

    getSectionName(studentId: any, sessionId: any): any {
        return this.sectionList.find((section) => {
            return (
                section.id ==
                this.studentSectionList.find((studentSection) => {
                    return studentSection.parentStudent == studentId && studentSection.parentSession == sessionId;
                }).parentDivision
            );
        }).name;
    }

    getEmployeeName(parentEmployee: any): any {
        let employee = this.employeeList.find((employee) => {
            return employee.id == parentEmployee;
        });
        return employee ? employee.name : null;
    }

    getSessionName(parentSession: any): any {
        let session = this.sessionList.find((session) => {
            return session.id == parentSession;
        });
        return session.name;
    }

    hasUserPermissionToCancelAndNotPrintPage() {
        const module = this.user.activeSchool.moduleList.find((module) => module.title === 'Fees 3.0');
        return module.taskList.some((task) => task.title === 'Cancel Fee Receipt') && !this.isPrinting;
    }

    getStudentMobileNumber(feeReceipt: any) {
        let student = this.studentList.find((student) => {
            return student.id == feeReceipt.parentStudent;
        });
        return student ? student.mobileNumber : null;
    }

    showCancelReceiptModal(feeReceipt: any) {
        const dialogRef = this.dialog.open(CancelFeeReceiptModalComponent, {
            height: '440px',
            width: '540px',
            data: {
                user: this.user,
                feeReceipt: feeReceipt,
                totalAmount: this.getFeeReceiptFilteredAmount(feeReceipt),
                studentName: this.getStudent(feeReceipt.parentStudent).name,
                classSection:
                    this.getClassName(feeReceipt.parentStudent, feeReceipt.parentSession) +
                    ',' +
                    this.getSectionName(feeReceipt.parentStudent, feeReceipt.parentSession),
                fathersName: this.getStudent(feeReceipt.parentStudent).fathersName,
                collectedBy: this.getEmployeeName(feeReceipt.parentEmployee),
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.serviceAdapter.cancelFeeReceipt(feeReceipt);
            }
        });
    }

    getFeeReceiptNo(feeReceipt: any): any {
        return this.feeReceiptBookList.find(feeReceiptBook => {
            return feeReceiptBook.id == feeReceipt.parentFeeReceiptBook;
        }).receiptNumberPrefix + feeReceipt.receiptNumber;
    }

}
