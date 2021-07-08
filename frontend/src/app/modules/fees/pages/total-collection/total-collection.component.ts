import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TotalCollectionServiceAdapter } from './total-collection.service.adapter';
import { FeeService } from '../../../../services/modules/fees/fee.service';
import { EmployeeService } from '../../../../services/modules/employee/employee.service';
import { StudentService } from '../../../../services/modules/student/student.service';
import { ClassService } from '../../../../services/modules/class/class.service';
import { INSTALLMENT_LIST, ReceiptColumnFilter } from '../../classes/constants';
import { CommonFunctions } from '../../../../classes/common-functions';
import { PrintService } from '../../../../print/print-service';
import { PRINT_FEE_RECIEPT_LIST } from '../../print/print-routes.constants';
import { DataStorage } from '../../../../classes/data-storage';
import { SchoolService } from '../../../../services/modules/school/school.service';

@Component({
    selector: 'total-collection',
    templateUrl: './total-collection.component.html',
    styleUrls: ['./total-collection.component.css'],
    providers: [FeeService, EmployeeService, StudentService, ClassService, SchoolService],
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

    serviceAdapter: TotalCollectionServiceAdapter;

    selectedEmployee = null;
    filteredEmployeeList = [];

    selectedSession = null;
    filteredSessionList = [];

    selectedModeOfPayment = null;
    filteredModeOfPaymentList = [];

    selectedClassSection = null;
    filteredClassSectionList = [];

    selectedFeeType = null;
    selectedFeeReceiptType = null;
    receiptTypeList = ['Valid Receipts', 'Cancelled Receipts'];
    filteredFeeTypeList = [];

    isInitialLoading = false;
    isLoading = false;

    constructor(
        public feeService: FeeService,
        public employeeService: EmployeeService,
        public studentService: StudentService,
        public classService: ClassService,
        public schoolService: SchoolService,
        private cdRef: ChangeDetectorRef,
        private printService: PrintService
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new TotalCollectionServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

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
        this.selectedEmployee = null;
        this.selectedClassSection = null;
        this.selectedModeOfPayment = null;
        this.selectedFeeType = null;
        this.selectedFeeReceiptType = this.receiptTypeList[0];
        this.selectedSession = null;

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
            selectedEmployee: this.selectedEmployee,
            selectedModeOfPayment: this.selectedModeOfPayment,
            selectedFeeType: this.selectedFeeType,
            sessionList: this.filteredSessionList,
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
            // checking tempStudentSeciton because cancelled receipt student could also be deleted.
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

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    getReceiptColumnFilterKeys(): any {
        return Object.keys(this.receiptColumnFilter);
    }

    getFilteredFeeReceiptList(): any {
        let tempList = this.feeReceiptList;

        if (this.selectedEmployee) {
            tempList = tempList.filter((feeReceipt) => {
                return feeReceipt.parentEmployee == this.selectedEmployee.id;
            });
        }
        if (this.selectedFeeReceiptType) {
            tempList = tempList.filter((feeReceipt) => {
                return feeReceipt.cancelled == Boolean(this.selectedFeeReceiptType == 'Cancelled Receipts');
            });
        }
        if (this.selectedModeOfPayment) {
            tempList = tempList.filter((feeReceipt) => {
                return feeReceipt.modeOfPayment == this.selectedModeOfPayment;
            });
        }
        if (this.selectedClassSection) {
            tempList = tempList.filter((feeReceipt) => {
                let classSection = this.getClassAndSection(feeReceipt.parentStudent, feeReceipt.parentSession);
                // checking classSection because cancelled receipt student could also be deleted.
                return (
                    classSection &&
                    classSection.classs.id == this.selectedClassSection.classs.id &&
                    classSection.section.id == this.selectedClassSection.section.id
                );
            });
        }

        if (this.selectedFeeType) {
            let filteredSubFeeList = this.subFeeReceiptList
                .filter((subFeeRecipt) => {
                    return subFeeRecipt.parentFeeType == this.selectedFeeType.id;
                })
                .map((a) => a.parentFeeReceipt);
            tempList = tempList.filter((feeReceipt) => {
                return (
                    filteredSubFeeList.find((parentFeeId) => {
                        return parentFeeId == feeReceipt.id;
                    }) != undefined
                );
            });
        }
        if (this.selectedSession) {
            tempList = tempList.filter((feeReceipt) => {
                return feeReceipt.parentSession == this.selectedSession.id;
            });
        }

        return tempList;
    }

    getFilteredFeeReceiptListTotalAmount(): any {
        return this.getFilteredFeeReceiptList().reduce((total, feeReceipt) => {
            return total + this.getFeeReceiptTotalAmount(feeReceipt);
        }, 0);
    }

    getFeeReceiptTotalAmount(feeReceipt: any): number {
        return this.subFeeReceiptList
            .filter((subFeeReceipt) => {
                if (this.selectedFeeType) {
                    return subFeeReceipt.parentFeeReceipt == feeReceipt.id && subFeeReceipt.parentFeeType == this.selectedFeeType.id;
                } else {
                    return subFeeReceipt.parentFeeReceipt == feeReceipt.id;
                }
            })
            .reduce((totalSubFeeReceipt, subFeeReceipt) => {
                return (
                    totalSubFeeReceipt +
                    this.installmentList.reduce((totalInstallment, installment) => {
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
