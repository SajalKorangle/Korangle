import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { ViewDefaultersServiceAdapter } from "./view-defaulters.service.adapter";
import { FeeService } from "../../../../services/fee.service";
import {StudentService} from "../../../../services/student.service";
import {ClassService} from "../../../../services/class.service";
import {INSTALLMENT_LIST} from "../../classes/constants";
import {EmitterService} from "../../../../services/emitter.service";
import * as XLSX from "xlsx";

@Component({
    selector: 'view-defaulters',
    templateUrl: './view-defaulters.component.html',
    styleUrls: ['./view-defaulters.component.css'],
    providers: [ FeeService, StudentService, ClassService ],
})

export class ViewDefaultersComponent implements OnInit {

    installmentList = INSTALLMENT_LIST;

    nullValue = null;

    @Input() user;

    subFeeReceiptList: any;
    subDiscountList: any;
    studentFeeList: any;
    studentSectionList: any;
    studentList: any;
    classList: any;
    sectionList: any;

    parentList = [];

    filterTypeList = [
        'Student',
        'Parent',
    ];

    selectedFilterType = this.filterTypeList[1];

    // d1 = new Date();
    // d2 = new Date();

    installmentNumber = 0;

    maximumNumber = null;
    minimumNumber = 1;

    selectedClassSection = null;
    filteredClassSectionList = [];

    serviceAdapter: ViewDefaultersServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                public studentService: StudentService,
                public classService: ClassService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new ViewDefaultersServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        let monthNumber = (new Date()).getMonth();
        this.installmentNumber = (monthNumber > 2)?monthNumber-3:monthNumber+9;
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    checkMobileNumber(mobileNumber: number): boolean {
        if (mobileNumber && mobileNumber.toString().length == 10) {
            return true;
        }
        return false;
    }

    policeNumberInput(event: any): boolean {
        let value = event.key;
        if (value !== '0' && value !== '1' && value !== '2' && value !== '3' &&
            value !== '4' && value !== '5' && value !== '6' && value !== '7' &&
            value !== '8' && value !== '9') {
            return false;
        }
        return true;
    }

    handleLoading(): void {

        this.studentList.forEach(student => {

            let filteredStudentFeeList = this.studentFeeList.filter(studentFee => {
                return studentFee.parentStudent == student.id;
            });

            let filteredSubFeeReceiptList = this.subFeeReceiptList.filter(subFeeReceipt => {
                return filteredStudentFeeList.find(studentFee => {
                    return studentFee.id == subFeeReceipt.parentStudentFee;
                }) != undefined;
            });

            let filteredSubDiscountList = this.subDiscountList.filter(subDiscount => {
                return filteredStudentFeeList.find(studentFee => {
                    return studentFee.id == subDiscount.parentStudentFee;
                }) != undefined;
            });

            student['feesDueTillMonth'] = filteredStudentFeeList.reduce((total, studentFee) => {
                return total + this.installmentList.slice(0,this.installmentNumber).reduce((installmentAmount, installment) => {
                    let lateFeeAmount = 0;
                    if (studentFee[installment+'LastDate'] && studentFee[installment+'LateFee'] && studentFee[installment+'LateFee'] > 0) {
                        let lastDate = new Date(studentFee[installment+'LastDate']);
                        let clearanceDate = new Date();
                        if (studentFee[installment+'ClearanceDate']) {
                            clearanceDate = new Date(studentFee[installment+'ClearanceDate']);
                        }
                        let numberOfLateDays = Math.ceil((clearanceDate.getTime()-lastDate.getTime())/(1000*60*60*24));
                        if (numberOfLateDays > 0) {
                            lateFeeAmount = (studentFee[installment+'LateFee']?studentFee[installment+'LateFee']:0)*numberOfLateDays;
                            if (student[installment+'MaximumLateFee'] && student[installment+'MaximumLateFee'] < lateFeeAmount) {
                                lateFeeAmount = student[installment+'MaximumLateFee'];
                            }
                        }
                    }
                    return installmentAmount
                        + (studentFee[installment+'Amount']?studentFee[installment+'Amount']:0)
                        + lateFeeAmount;
                }, 0);
            }, 0) - filteredSubFeeReceiptList.reduce((total, subFeeReceipt) => {
                return total + this.installmentList.slice(0,this.installmentNumber).reduce((installmentAmount, installment) => {
                    return installmentAmount
                        + (subFeeReceipt[installment+'Amount']?subFeeReceipt[installment+'Amount']:0)
                        + (subFeeReceipt[installment+'LateFee']?subFeeReceipt[installment+'LateFee']:0);
                }, 0);
            }, 0) - filteredSubDiscountList.reduce((total, subDiscount) => {
                return total + this.installmentList.slice(0,this.installmentNumber).reduce((installmentAmount, installment) => {
                    return installmentAmount
                        + (subDiscount[installment+'Amount']?subDiscount[installment+'Amount']:0)
                        + (subDiscount[installment+'LateFee']?subDiscount[installment+'LateFee']:0);
                }, 0);
            }, 0);

            student['feesDueOverall'] = filteredStudentFeeList.reduce((total, studentFee) => {
                return total + this.installmentList.reduce((installmentAmount, installment) => {
                    let lateFeeAmount = 0;
                    if (studentFee[installment+'LastDate'] && studentFee[installment+'LateFee'] && studentFee[installment+'LateFee'] > 0) {
                        let lastDate = new Date(studentFee[installment+'LastDate']);
                        let clearanceDate = new Date();
                        if (studentFee[installment+'ClearanceDate']) {
                            clearanceDate = new Date(studentFee[installment+'ClearanceDate']);
                        }
                        let numberOfLateDays = Math.ceil((clearanceDate.getTime()-lastDate.getTime())/(1000*60*60*24));
                        if (numberOfLateDays > 0) {
                            lateFeeAmount = (studentFee[installment+'LateFee']?studentFee[installment+'LateFee']:0)*numberOfLateDays;
                            if (student[installment+'MaximumLateFee'] && student[installment+'MaximumLateFee'] < lateFeeAmount) {
                                lateFeeAmount = student[installment+'MaximumLateFee'];
                            }
                        }
                    }
                    return  installmentAmount
                        + (studentFee[installment+'Amount']?studentFee[installment+'Amount']:0)
                        + lateFeeAmount;
                }, 0);
            }, 0) - filteredSubFeeReceiptList.reduce((total, subFeeReceipt) => {
                return total + this.installmentList.reduce((installmentAmount, installment) => {
                    return installmentAmount
                        + (subFeeReceipt[installment+'Amount']?subFeeReceipt[installment+'Amount']:0)
                        + (subFeeReceipt[installment+'LateFee']?subFeeReceipt[installment+'LateFee']:0);
                }, 0);
            }, 0) - filteredSubDiscountList.reduce((total, subDiscount) => {
                return total + this.installmentList.reduce( (installmentAmount, installment) => {
                    return installmentAmount
                        + (subDiscount[installment+'Amount']?subDiscount[installment+'Amount']:0)
                        + (subDiscount[installment+'LateFee']?subDiscount[installment+'LateFee']:0);
                }, 0);
            }, 0);

            student['feesPaidThisSession'] = filteredSubFeeReceiptList.filter(subFeeReceipt => {
                return subFeeReceipt.parentSession == this.user.activeSchool.currentSessionDbId;
            }).reduce((total, subFeeReceipt) => {
                return total + this.installmentList.reduce( (installmentAmount, installment) => {
                    return installmentAmount
                        + (subFeeReceipt[installment+'Amount']?subFeeReceipt[installment+'Amount']:0)
                        + (subFeeReceipt[installment+'LateFee']?subFeeReceipt[installment+'LateFee']:0);
                }, 0);
            }, 0);

            student['discountThisSession'] = filteredSubDiscountList.filter(subDiscount => {
                return subDiscount.parentSession == this.user.activeSchool.currentSessionDbId;
            }).reduce((total, subDiscount) => {
                return total + this.installmentList.reduce((installmentAmount, installment) => {
                    return installmentAmount
                        + (subDiscount[installment+'Amount']?subDiscount[installment+'Amount']:0)
                        + (subDiscount[installment+'LateFee']?subDiscount[installment+'LateFee']:0);
                }, 0);
            }, 0);

            student['totalFeesThisSession'] = filteredStudentFeeList.filter(studentFee => {
                return studentFee.parentSession == this.user.activeSchool.currentSessionDbId;
            }).reduce((total, studentFee) => {
                return total + this.installmentList.reduce((installmentAmount, installment) => {
                    let lateFeeAmount = 0;
                    if (studentFee[installment+'LastDate'] && studentFee[installment+'LateFee'] && studentFee[installment+'LateFee'] > 0) {
                        let lastDate = new Date(studentFee[installment+'LastDate']);
                        let clearanceDate = new Date();
                        if (studentFee[installment+'ClearanceDate']) {
                            clearanceDate = new Date(studentFee[installment+'ClearanceDate']);
                        }
                        let numberOfLateDays = Math.ceil((clearanceDate.getTime()-lastDate.getTime())/(1000*60*60*24));
                        if (numberOfLateDays > 0) {
                            lateFeeAmount = (studentFee[installment+'LateFee']?studentFee[installment+'LateFee']:0)*numberOfLateDays;
                            if (student[installment+'MaximumLateFee'] && student[installment+'MaximumLateFee'] < lateFeeAmount) {
                                lateFeeAmount = student[installment+'MaximumLateFee'];
                            }
                        }
                    }
                    return installmentAmount
                        + (studentFee[installment+'Amount']?studentFee[installment+'Amount']:0)
                        + lateFeeAmount;
                }, 0);
            }, 0);

            let studentSection = this.studentSectionList.find(studentSection => {
                return studentSection.parentStudent == student.id
                    && studentSection.parentSession == this.user.activeSchool.currentSessionDbId;
            });

            student['class'] = this.classList.find(classs => {
                return studentSection.parentClass == classs.dbId;
            });

            student['section'] = this.sectionList.find(section => {
                return studentSection.parentDivision == section.id;
            });

            this.checkAndAddToFilteredClassSectionList(student['class'], student['section']);

            let parentObject = this.parentList.find(parent => {
                return parent.mobileNumber == student.mobileNumber
                    && parent.mobileNumber != null;
            });

            if (parentObject) {
                parentObject['studentList'].push(student);
            } else {
                let newParentObject = {
                    'name': student.fathersName,
                    'mobileNumber': student.mobileNumber,
                    'studentList': [student],
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

        this.studentList = this.studentList.sort((a,b) => {
            let amount = b.feesDueTillMonth - a.feesDueTillMonth;
            if (amount != 0) { return amount; }
            amount = b.feesDueOverall - a.feesDueOverall;
            if (amount != 0) { return amount; }
            amount = a.feesPaidThisSession - b.feesPaidThisSession;
            if (amount != 0) { return amount; }
            return b.totalFeesThisSession - a.totalFeesThisSession;
        });

        this.filteredClassSectionList = this.filteredClassSectionList.sort((a,b) => {
            let orderNumber = a.class.orderNumber-b.class.orderNumber
            if (orderNumber != 0) {return orderNumber;}
            return a.section.orderNumber-b.section.orderNumber;
        })

    }

    checkAndAddToFilteredClassSectionList(classs: any, section: any): void {
        if (this.filteredClassSectionList.find(classSection => {
            return classSection.class.dbId == classs.dbId && classSection.section.id == section.id;
        }) == undefined) {
            this.filteredClassSectionList.push({
                'class': classs,
                'section': section,
            });
        }
    }

    getFilteredStudentList(): any {
        let tempList = this.studentList;
        if (this.selectedClassSection) {
            tempList = tempList.filter(student => {
                return student.class.dbId == this.selectedClassSection.class.dbId
                    && student.section.id == this.selectedClassSection.section.id;
            });
        }
        if ((this.maximumNumber && this.maximumNumber != '')
            || (this.minimumNumber && this.minimumNumber.toString() != '')) {
            tempList = tempList.filter(student => {
                let amount = student.feesDueTillMonth;
                return ((this.maximumNumber && this.maximumNumber != '')?amount<=this.maximumNumber:true)
                    && ((this.minimumNumber && this.minimumNumber.toString() != '')?amount>=this.minimumNumber:true)
            });
        }
        return tempList;
    }

    getFilteredStudentListFeesDueTillMonth(): any {
        return this.getFilteredStudentList().reduce((total, student) => {
            return total + student.feesDueTillMonth;
        }, 0);
    }

    getFilteredParentList(): any {
        let tempList = this.parentList;
        if ((this.maximumNumber && this.maximumNumber != '')
            || (this.minimumNumber && this.minimumNumber != '')) {
            tempList = tempList.filter(parent => {
                let amount = parent.studentList.reduce((amount, student) => {
                    return amount + student['feesDueTillMonth'];
                }, 0);
                return ((this.maximumNumber && this.maximumNumber != '')?amount<=this.maximumNumber:true)
                    && ((this.minimumNumber && this.minimumNumber != '')?amount>=this.minimumNumber:true)
            });
        }
        return tempList;
    }

    getParentFeesDueTillMonth(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['feesDueTillMonth'];
        }, 0);
    }

    getFilteredParentListFeesDueTillMonth(): any {
        return this.getFilteredParentList().reduce((total, parent) => {
            return total + this.getParentFeesDueTillMonth(parent);
        }, 0);
    }

    getParentFeesDueOverall(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['feesDueOverall'];
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

    getParentTotalFees(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['totalFeesThisSession'];
        }, 0);
    }

    printFeesReport(): any {
        alert('Functionality yet to be implemented');
        return ;
        /*const value = {
            studentList: this.getFilteredStudentFeeDuesList(),
            columnFilter: this.columnFilter
        };
        EmitterService.get('print-student-list').emit(value);*/
    }
    
    downloadFeesReport(): void {

        if (this.selectedFilterType==this.filterTypeList[0]) {
            this.downloadStudentFeesReport();
        } else {
            this.downloadParentFeesReport();
        }

    }

    downloadStudentFeesReport(): void {

        let template: any;

        template = [

            ['S No.', 'Student', 'Parent', 'Class', 'Mobile No.', 'Mobile No. (2)', 'Fees Due (till month)',
                'Fees Due (overall)', 'Fees Paid (this session)', 'Discount (this session)', 'Total Fees (this session)'],

        ];

        let count = 0;
        this.getFilteredStudentList().forEach(student => {
            let row = [];
            row.push(++count);
            row.push(student.name);
            row.push(student.fathersName);
            row.push(student.class.name+', '+student.section.name);
            row.push(student.mobileNumber);
            row.push(student.secondMobileNumber);
            row.push(student.feesDueTillMonth);
            row.push(student.feesDueOverall);
            row.push(student.feesPaidThisSession);
            row.push(student.discountThisSession);
            row.push(student.totalFeesThisSession);
            template.push(row);
        });

        /* generate worksheet */
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(template);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, 'korangle_student_fees.csv');
    }

    downloadParentFeesReport(): void {

        let template: any;

        template = [

            ['S No.', 'Parent', 'Student', 'Class', 'Mobile No.', 'Mobile No. (2)', 'Fees Due (till month)',
                'Fees Due (overall)', 'Fees Paid (this session)', 'Discount (this session)', 'Total Fees (this session)'],

        ];

        let count = 0;
        this.getFilteredParentList().forEach(parent => {
            let row = [];
            row.push(++count);
            row.push(parent.name);
            if (parent.studentList.length == 1) {
                row.push(parent.studentList[0].name);
                row.push(parent.studentList[0].class.name+', '+parent.studentList[0].section.name);
                row.push(parent.studentList[0].mobileNumber);
                row.push(parent.studentList[0].secondMobileNumber);
            } else {
                row.push('');
                row.push('');
                row.push(parent.studentList[0].mobileNumber);
                row.push('');
            }
            row.push(this.getParentFeesDueTillMonth(parent));
            row.push(this.getParentFeesDueOverall(parent));
            row.push(this.getParentFeesPaid(parent));
            row.push(this.getParentDiscount(parent));
            row.push(this.getParentTotalFees(parent));
            template.push(row);
            if (parent.studentList.length > 1) {
                parent.studentList.forEach(student => {
                    let newRow = [];
                    newRow.push('');
                    newRow.push('');
                    newRow.push(student.name);
                    newRow.push(student.class.name+', '+student.section.name);
                    newRow.push('');
                    newRow.push(student.secondMobileNumber);
                    newRow.push(student.feesDueTillMonth);
                    newRow.push(student.feesDueOverall);
                    newRow.push(student.feesPaidThisSession);
                    newRow.push(student.discountThisSession);
                    newRow.push(student.totalFeesThisSession);
                    template.push(newRow);
                });
            }
        });

        /* generate worksheet */
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(template);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, 'korangle_parent_fees.csv');
    }

}
