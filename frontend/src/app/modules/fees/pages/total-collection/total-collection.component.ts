import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TotalCollectionServiceAdapter } from './total-collection.service.adapter';
import { FeeService } from '../../../../services/modules/fees/fee.service';
import { INSTALLMENT_LIST, ReceiptColumnFilter } from '../../classes/constants';
import { CommonFunctions } from '../../../../classes/common-functions';
import { PrintService } from '../../../../print/print-service';
import { PRINT_FEE_RECIEPT_LIST } from '../../print/print-routes.constants';
import { DataStorage } from '../../../../classes/data-storage';
import { SchoolService } from '../../../../services/modules/school/school.service';
import { GenericService } from '@services/generic/generic-service';
import {TotalCollectionHtmlRenderer} from './total-collection.html.renderer';

@Component({
    selector: 'total-collection',
    templateUrl: './total-collection.component.html',
    styleUrls: ['./total-collection.component.css'],
    providers: [
        FeeService,
        SchoolService,
        GenericService,
    ],
})
export class TotalCollectionComponent implements OnInit {
    // Constants
    receiptColumnFilter = new ReceiptColumnFilter();
    nullValue = null;
    installmentList = INSTALLMENT_LIST;

    user;

    startDate: any;
    endDate: any;
    minDate: any;

    feeTypeList = [];
    employeeList = [];
    classList = [];
    sectionList = [];

    feeReceiptList: any;
    subFeeReceiptList = [];

    studentList = [];
    studentSectionList = [];

    boardList;
    sessionList;

    feeReceiptBookList = [];

    serviceAdapter: TotalCollectionServiceAdapter;

    filteredEmployeeList = [];

    filteredSessionList = [];

    filteredModeOfPaymentList = [];

    filteredClassSectionList = [];

    filteredFeeReceiptBookList = [];

    selectedFeeReceiptType = null;
    receiptTypeList = ['Valid Receipts', 'Cancelled Receipts'];

    isInitialLoading = false;
    isLoading = false;
    htmlRenderer: TotalCollectionHtmlRenderer;

    constructor(
        public feeService: FeeService,
        public schoolService: SchoolService,
        public genericService: GenericService,
        private cdRef: ChangeDetectorRef,
        private printService: PrintService
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new TotalCollectionServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlRenderer = new TotalCollectionHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);

        //this.initializeSelection();
        /*delete this.receiptColumnFilter['printButton'];

        this.receiptColumnFilter.scholarNumber = false;
        this.receiptColumnFilter.remark = false;*/

        if (CommonFunctions.getInstance().isMobileMenu()) {
            this.receiptColumnFilter.remark = false;
            this.receiptColumnFilter.employee = false;
        }
    }

    initializeSelection(): void {
        this.selectedFeeReceiptType = this.receiptTypeList[0];
        this.receiptColumnFilter = new ReceiptColumnFilter();
        delete this.receiptColumnFilter['printButton'];
        this.receiptColumnFilter.scholarNumber = false;
        this.receiptColumnFilter.remark = false;
        this.receiptColumnFilter.session = true;
    }

    printFeeReceiptList(): void {
        let data = {
            receiptColumnFilter: this.receiptColumnFilter,
            feeTypeList: this.feeTypeList,
            feeReceiptList: this.getFilteredFeeReceiptList(),
            subFeeReceiptList: this.subFeeReceiptList,
            studentList: this.studentList,
            studentSectionList: this.studentSectionList,
            employeeList: this.filteredEmployeeList,
            classList: this.classList,
            sectionList: this.sectionList,
            sessionList: this.filteredSessionList,
            feeReceiptBookList: this.feeReceiptBookList,
        };

        this.printService.navigateToPrintRoute(PRINT_FEE_RECIEPT_LIST, { user: this.user, value: data });
    }

    getClass(studentId: any, sessionId: any): any {
        return this.classList.find((classs) => {
            let tempStudentSection = this.studentSectionList.find((studentSection) => {
                return studentSection.parentStudent == studentId && studentSection.parentSession == sessionId;
            });
            // checking tempStudentSection because cancelled receipt student could also be deleted.
            return tempStudentSection && classs.id == tempStudentSection.parentClass;
        });
    }

    getSection(studentId: any, sessionId: any): any {
        return this.sectionList.find((section) => {
            let tempStudentSection = this.studentSectionList.find((studentSection) => {
                return studentSection.parentStudent == studentId && studentSection.parentSession == sessionId;
            });
            // checking tempStudentSection because cancelled receipt student could also be deleted.
            return tempStudentSection && section.id == tempStudentSection.parentDivision;
        });
    }

    getClassAndSection(studentId: any, sessionId: any): any {
        const classs = this.getClass(studentId, sessionId);
        // because cancelled receipt student could also be deleted.
        if (classs === undefined) {
            return undefined;
        }
        const section = this.getSection(studentId, sessionId);
        return {
            classs: classs,
            section: section,
        };
    }

    selectAllEmployees(): void {
        this.filteredEmployeeList.forEach((item) => {
            item.selectedEmployee = true;
        });
    }
    unselectAllEmployees(): void {
        this.filteredEmployeeList.forEach((item) => {
            item.selectedEmployee = false;
        });
    }

    selectAllClassSection(): void {
        this.filteredClassSectionList.forEach((item) => {
            item.selectedClassSection = true;
        });
    }
    unselectAllClassSection(): void {
        this.filteredClassSectionList.forEach((item) => {
            item.selectedClassSection = false;
        });
    }

    selectAllSession(): void {
        this.filteredSessionList.forEach((item) => {
            item.selectedSession = true;
        });
    }
    unselectAllSession(): void {
        this.filteredSessionList.forEach((item) => {
            item.selectedSession = false;
        });
    }

    selectAllFeeReceiptBook(): void {
        this.filteredFeeReceiptBookList.forEach((item) => {
            item.selected = true;
        });
    }
    unselectAllFeeReceiptBook(): void {
        this.filteredFeeReceiptBookList.forEach((item) => {
            item.selected = false;
        });
    }

    selectAllPaymentModes(): void {
        this.filteredModeOfPaymentList.forEach((item) => {
            item.selectedModeOfPayment = true;
        });
    }
    unselectAllPaymentModes(): void {
        this.filteredModeOfPaymentList.forEach((item) => {
            item.selectedModeOfPayment = false;
        });
    }

    selectAllFeeType(): void {
        this.feeTypeList.forEach((item) => {
            item.selectedFeeType = true;
        });
    }
    unselectAllFeeType(): void {
        this.feeTypeList.forEach((item) => {
            item.selectedFeeType = false;
        });
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    getReceiptColumnFilterKeys(): any {
        return Object.keys(this.receiptColumnFilter);
    }

    getFilteredFeeReceiptList(): any {

        let tempList = this.feeReceiptList;

        // filter by selected employee
        this.filteredEmployeeList.forEach((employee) => {
            if (!employee.selectedEmployee) {
                tempList = tempList.filter((feeReceipt) => {
                    return feeReceipt.parentEmployee !== employee.id;
                });
            }
        });

        // filter by mode of payment
        this.filteredModeOfPaymentList.forEach((myMode) => {
            if (!myMode.selectedModeOfPayment) {
                tempList = tempList.filter((feeReceipt) => {
                    return feeReceipt.modeOfPayment !== myMode.mode;
                });
            }
        });

        // filter by fee receipt type
        if (this.selectedFeeReceiptType) {
            tempList = tempList.filter((feeReceipt) => {
                return feeReceipt.cancelled == Boolean(this.selectedFeeReceiptType == 'Cancelled Receipts');
            });
        }

        // filter by class section
        this.filteredClassSectionList.forEach((oneClassSection) => {
            if (!oneClassSection.selectedClassSection) {
                tempList = tempList.filter((feeReceipt) => {
                    let classSection = this.getClassAndSection(feeReceipt.parentStudent, feeReceipt.parentSession);
                    // checking classSection because cancelled receipt student could also be deleted.
                    return (
                        !classSection ||
                        classSection.classs.id !== oneClassSection.classs.id ||
                        classSection.section.id !== oneClassSection.section.id
                    );
                });
            }
        });

        // filter by Fee Type
        let filteredSubFeeReceiptList = [];
        this.feeTypeList.forEach((feeType) => {
            if (feeType.selectedFeeType) {
                filteredSubFeeReceiptList = [...filteredSubFeeReceiptList, ...(this.subFeeReceiptList
                    .filter((subFeeReceipt) => { return subFeeReceipt.parentFeeType == feeType.id; })
                    .map((a) => a.parentFeeReceipt))];
            }
        });


        let checkFeeType = false;
        this.feeTypeList.forEach((feeType) => {
            if (feeType.selectedFeeType) {
                checkFeeType = true;
                tempList = tempList.filter((feeReceipt) => filteredSubFeeReceiptList.includes(feeReceipt.id));
            }
        });

        if (!checkFeeType) {
            tempList = [];
        }

        // filter by session
        this.filteredSessionList.forEach((session) => {
            if (!session.selectedSession) {
                tempList = tempList.filter((feeReceipt) => {
                    return feeReceipt.parentSession !== session.id;
                });
            }
        });

        // filter by fee receipt book
        this.filteredFeeReceiptBookList.forEach((feeReceiptBook) => {
            if (!feeReceiptBook.selected) {
                tempList = tempList.filter((feeReceipt) => {
                    return feeReceipt.parentFeeReceiptBook !== feeReceiptBook.id;
                });
            }
        });

        return tempList;
    }

    getFilteredFeeReceiptListTotalAmount(): any {
        return this.getFilteredFeeReceiptList().reduce((total, feeReceipt) => {
            return total + this.getFeeReceiptTotalAmount(feeReceipt);
        }, 0);
    }

    getFeeReceiptTotalAmount(feeReceipt: any): number {
        let selectedFeeTypeIdList = this.feeTypeList.filter(feeType => { return feeType.selectedFeeType; }).map(feeType => { return feeType.id; });
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

    checkCancelledRemark(): void {
        this.receiptColumnFilter.cancelledRemark = Boolean(this.selectedFeeReceiptType === 'Cancelled Receipts');
        this.receiptColumnFilter.cancelledBy = Boolean(this.selectedFeeReceiptType === 'Cancelled Receipts');
    }
}
