import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { GenerateFeesReportServiceAdapter } from './generate-fees-report.service.adapter';
import { INSTALLMENT_LIST } from '../../classes/constants';
import { DataStorage } from '../../../../classes/data-storage';
import { GenericService } from '@services/generic/generic-service';

@Component({
    selector: 'generate-fees-report',
    templateUrl: './generate-fees-report.component.html',
    styleUrls: ['./generate-fees-report.component.css'],
    providers: [
        GenericService,
    ],
})
export class GenerateFeesReportComponent implements OnInit {
    installmentList = INSTALLMENT_LIST;
    sessionList = [];

    user;

    subFeeReceiptList: any;
    subDiscountList: any;
    studentFeeList: any;
    studentSectionList: any;
    studentList: any;
    classList: any;
    sectionList: any;
    secondSubFeeReceiptList: any;

    parentList = [];

    installmentNumber = 0;

    currentSession: any;

    maximumNumber = null;
    minimumNumber = null;

    serviceAdapter: GenerateFeesReportServiceAdapter;

    isLoading = false;

    constructor(
        public genericService: GenericService,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new GenerateFeesReportServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        let monthNumber = new Date().getMonth();
        this.installmentNumber = monthNumber > 2 ? monthNumber - 3 : monthNumber + 9;
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    getSession(): any {
        return this.sessionList.find((session) => {
            return session.id == this.user.activeSchool.currentSessionDbId;
        });
    }

    policeNumberInput(event: any): boolean {
        let value = event.key;
        if (
            value !== '0' &&
            value !== '1' &&
            value !== '2' &&
            value !== '3' &&
            value !== '4' &&
            value !== '5' &&
            value !== '6' &&
            value !== '7' &&
            value !== '8' &&
            value !== '9'
        ) {
            return false;
        }
        return true;
    }

    handleLoading(): void {
        this.studentList.forEach((student) => {
            let filteredStudentFeeList = this.studentFeeList.filter((studentFee) => {
                return studentFee.parentStudent == student.id;
            });

            let filteredSubFeeReceiptList = this.subFeeReceiptList.filter((subFeeReceipt) => {
                return (
                    filteredStudentFeeList.find((studentFee) => {
                        return studentFee.id == subFeeReceipt.parentStudentFee;
                    }) != undefined
                );
            });

            let filteredSubDiscountList = this.subDiscountList.filter((subDiscount) => {
                return (
                    filteredStudentFeeList.find((studentFee) => {
                        return studentFee.id == subDiscount.parentStudentFee;
                    }) != undefined
                );
            });

            student['feesDueTillMonth'] =
                filteredStudentFeeList.reduce((total, studentFee) => {
                    let filteredInstallmentList = [];
                    if (studentFee.parentSession == this.currentSession.id) {
                        filteredInstallmentList = this.installmentList.slice(0, this.installmentNumber + 1);
                    } else {
                        filteredInstallmentList = this.installmentList;
                    }
                    return (
                        total +
                        filteredInstallmentList.reduce((installmentAmount, installment) => {
                            let lateFeeAmount = 0;
                            if (
                                studentFee[installment + 'LastDate'] &&
                                studentFee[installment + 'LateFee'] &&
                                studentFee[installment + 'LateFee'] > 0
                            ) {
                                let lastDate = new Date(studentFee[installment + 'LastDate']);
                                let clearanceDate = new Date();
                                if (studentFee[installment + 'ClearanceDate']) {
                                    clearanceDate = new Date(studentFee[installment + 'ClearanceDate']);
                                }
                                let numberOfLateDays = Math.floor((clearanceDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                                if (numberOfLateDays > 0) {
                                    lateFeeAmount =
                                        (studentFee[installment + 'LateFee'] ? studentFee[installment + 'LateFee'] : 0) * numberOfLateDays;
                                    if (
                                        studentFee[installment + 'MaximumLateFee'] &&
                                        studentFee[installment + 'MaximumLateFee'] < lateFeeAmount
                                    ) {
                                        lateFeeAmount = studentFee[installment + 'MaximumLateFee'];
                                    }
                                }
                            }

                            return (
                                installmentAmount +
                                (studentFee[installment + 'Amount'] ? studentFee[installment + 'Amount'] : 0) +
                                lateFeeAmount
                            );
                        }, 0)
                    );
                }, 0) -
                filteredSubFeeReceiptList.reduce((total, subFeeReceipt) => {
                    let filteredInstallmentList = [];
                    if (subFeeReceipt.parentSession == this.currentSession.id) {
                        filteredInstallmentList = this.installmentList.slice(0, this.installmentNumber + 1);
                    } else {
                        filteredInstallmentList = this.installmentList;
                    }
                    return (
                        total +
                        filteredInstallmentList.reduce((installmentAmount, installment) => {
                            return (
                                installmentAmount +
                                (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0) +
                                (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0)
                            );
                        }, 0)
                    );
                }, 0) -
                filteredSubDiscountList.reduce((total, subDiscount) => {
                    let filteredInstallmentList = [];
                    if (subDiscount.parentSession == this.currentSession.id) {
                        filteredInstallmentList = this.installmentList.slice(0, this.installmentNumber + 1);
                    } else {
                        filteredInstallmentList = this.installmentList;
                    }
                    return (
                        total +
                        filteredInstallmentList.reduce((installmentAmount, installment) => {
                            return (
                                installmentAmount +
                                (subDiscount[installment + 'Amount'] ? subDiscount[installment + 'Amount'] : 0) +
                                (subDiscount[installment + 'LateFee'] ? subDiscount[installment + 'LateFee'] : 0)
                            );
                        }, 0)
                    );
                }, 0);

            student['feesDueOverall'] =
                filteredStudentFeeList.reduce((total, studentFee) => {
                    return (
                        total +
                        this.installmentList.reduce((installmentAmount, installment) => {
                            let lateFeeAmount = 0;
                            if (
                                studentFee[installment + 'LastDate'] &&
                                studentFee[installment + 'LateFee'] &&
                                studentFee[installment + 'LateFee'] > 0
                            ) {
                                let lastDate = new Date(studentFee[installment + 'LastDate']);
                                let clearanceDate = new Date();
                                if (studentFee[installment + 'ClearanceDate']) {
                                    clearanceDate = new Date(studentFee[installment + 'ClearanceDate']);
                                }
                                let numberOfLateDays = Math.floor((clearanceDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                                if (numberOfLateDays > 0) {
                                    lateFeeAmount =
                                        (studentFee[installment + 'LateFee'] ? studentFee[installment + 'LateFee'] : 0) * numberOfLateDays;
                                    if (
                                        studentFee[installment + 'MaximumLateFee'] &&
                                        studentFee[installment + 'MaximumLateFee'] < lateFeeAmount
                                    ) {
                                        lateFeeAmount = studentFee[installment + 'MaximumLateFee'];
                                    }
                                }
                            }
                            return (
                                installmentAmount +
                                (studentFee[installment + 'Amount'] ? studentFee[installment + 'Amount'] : 0) +
                                lateFeeAmount
                            );
                        }, 0)
                    );
                }, 0) -
                filteredSubFeeReceiptList.reduce((total, subFeeReceipt) => {
                    return (
                        total +
                        this.installmentList.reduce((installmentAmount, installment) => {
                            return (
                                installmentAmount +
                                (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0) +
                                (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0)
                            );
                        }, 0)
                    );
                }, 0) -
                filteredSubDiscountList.reduce((total, subDiscount) => {
                    return (
                        total +
                        this.installmentList.reduce((installmentAmount, installment) => {
                            return (
                                installmentAmount +
                                (subDiscount[installment + 'Amount'] ? subDiscount[installment + 'Amount'] : 0) +
                                (subDiscount[installment + 'LateFee'] ? subDiscount[installment + 'LateFee'] : 0)
                            );
                        }, 0)
                    );
                }, 0);

            student['feesPaidThisSession'] = filteredSubFeeReceiptList
                .filter((subFeeReceipt) => {
                    return subFeeReceipt.parentSession == this.user.activeSchool.currentSessionDbId;
                })
                .reduce((total, subFeeReceipt) => {
                    return (
                        total +
                        this.installmentList.reduce((installmentAmount, installment) => {
                            return (
                                installmentAmount +
                                (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0) +
                                (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0)
                            );
                        }, 0)
                    );
                }, 0);

            student['discountThisSession'] = filteredSubDiscountList
                .filter((subDiscount) => {
                    return subDiscount.parentSession == this.user.activeSchool.currentSessionDbId;
                })
                .reduce((total, subDiscount) => {
                    return (
                        total +
                        this.installmentList.reduce((installmentAmount, installment) => {
                            return (
                                installmentAmount +
                                (subDiscount[installment + 'Amount'] ? subDiscount[installment + 'Amount'] : 0) +
                                (subDiscount[installment + 'LateFee'] ? subDiscount[installment + 'LateFee'] : 0)
                            );
                        }, 0)
                    );
                }, 0);

            student['totalFeesThisSession'] = filteredStudentFeeList
                .filter((studentFee) => {
                    return studentFee.parentSession == this.user.activeSchool.currentSessionDbId;
                })
                .reduce((total, studentFee) => {
                    return (
                        total +
                        this.installmentList.reduce((installmentAmount, installment) => {
                            let lateFeeAmount = 0;
                            if (
                                studentFee[installment + 'LastDate'] &&
                                studentFee[installment + 'LateFee'] &&
                                studentFee[installment + 'LateFee'] > 0
                            ) {
                                let lastDate = new Date(studentFee[installment + 'LastDate']);
                                let clearanceDate = new Date();
                                if (studentFee[installment + 'ClearanceDate']) {
                                    clearanceDate = new Date(studentFee[installment + 'ClearanceDate']);
                                }
                                let numberOfLateDays = Math.floor((clearanceDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                                if (numberOfLateDays > 0) {
                                    lateFeeAmount =
                                        (studentFee[installment + 'LateFee'] ? studentFee[installment + 'LateFee'] : 0) * numberOfLateDays;
                                    if (
                                        studentFee[installment + 'MaximumLateFee'] &&
                                        studentFee[installment + 'MaximumLateFee'] < lateFeeAmount
                                    ) {
                                        lateFeeAmount = studentFee[installment + 'MaximumLateFee'];
                                    }
                                }
                            }
                            return (
                                installmentAmount +
                                (studentFee[installment + 'Amount'] ? studentFee[installment + 'Amount'] : 0) +
                                lateFeeAmount
                            );
                        }, 0)
                    );
                }, 0);

            let studentSection = this.studentSectionList.find((studentSection) => {
                return (
                    studentSection.parentStudent == student.id && studentSection.parentSession == this.user.activeSchool.currentSessionDbId
                );
            });

            student['class'] = this.classList.find((classs) => {
                return studentSection.parentClass == classs.id;
            });

            student['section'] = this.sectionList.find((section) => {
                return studentSection.parentDivision == section.id;
            });

            let parentObject = this.parentList.find((parent) => {
                return parent.mobileNumber == student.mobileNumber && parent.mobileNumber != null;
            });

            if (parentObject) {
                parentObject['studentList'].push(student);
            } else {
                let newParentObject = {
                    name: student.fathersName,
                    mobileNumber: student.mobileNumber,
                    studentList: [student],
                };
                this.parentList.push(newParentObject);
            }
        });

        this.parentList = this.parentList.sort((a, b) => {
            let amount = this.getParentFeesDueTillMonth(b) - this.getParentFeesDueTillMonth(a);
            if (amount != 0) {
                return amount;
            }
            amount = this.getParentFeesDueOverall(b) - this.getParentFeesDueOverall(a);
            if (amount != 0) {
                return amount;
            }
            amount = this.getParentFeesPaid(a) - this.getParentFeesPaid(b);
            if (amount != 0) {
                return amount;
            }
            return this.getParentTotalFees(b) - this.getParentTotalFees(a);
        });
    }

    getFilteredParentList(): any {
        let tempList = this.parentList;
        if ((this.maximumNumber && this.maximumNumber != '') || (this.minimumNumber && this.minimumNumber != '')) {
            tempList = tempList.filter((parent) => {
                let amount = parent.studentList.reduce((amount, student) => {
                    return amount + student['feesDueTillMonth'];
                }, 0);
                return (
                    (this.maximumNumber && this.maximumNumber != '' ? amount <= this.maximumNumber : true) &&
                    (this.minimumNumber && this.minimumNumber != '' ? amount >= this.minimumNumber : true)
                );
            });
        }
        return tempList;
    }

    getParentFeesDueTillMonth(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['feesDueTillMonth'];
        }, 0);
    }

    getAllParentFeesDueTillMonth(): any {
        return this.getFilteredParentList().reduce((total, parent) => {
            return total + this.getParentFeesDueTillMonth(parent);
        }, 0);
    }

    getParentFeesDueOverall(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['feesDueOverall'];
        }, 0);
    }

    getAllParentFeesDueOverall(): number {
        return this.getFilteredParentList().reduce((total, parent) => {
            return total + this.getParentFeesDueOverall(parent);
        }, 0);
    }

    getParentFeesPaid(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['feesPaidThisSession'];
        }, 0);
    }

    getParentDiscount(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['discountThisSession'];
        }, 0);
    }

    getAllParentDiscount(): any {
        return this.getFilteredParentList().reduce((total, parent) => {
            return total + this.getParentDiscount(parent);
        }, 0);
    }

    getParentTotalFees(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['totalFeesThisSession'];
        }, 0);
    }

    getAllParentTotalFees(): number {
        return this.getFilteredParentList().reduce((total, parent) => {
            return total + this.getParentTotalFees(parent);
        }, 0);
    }

    getExpectedRevenue(): number {
        return this.getAllParentFeesDueOverall() + this.getTotalCollection();
    }

    getTotalCollection(): number {
        return this.secondSubFeeReceiptList.reduce((totalOne, subFeeReceipt) => {
            return (
                totalOne +
                this.installmentList.reduce((installmentAmount, installment) => {
                    return (
                        installmentAmount +
                        (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0) +
                        (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0)
                    );
                }, 0)
            );
        }, 0);
    }
}
