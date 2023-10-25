import { ViewListComponent } from "./view-list.component";
import { Query } from "@services/generic/query";
import { BehaviorSubject, combineLatest, from } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { merge } from 'rxjs';
import { CommonFunctions } from "@classes/common-functions";
import { StudentListFilterModalComponent } from "./component/student-list-filter-modal/student-list-filter-modal.component";
import { INSTALLMENT_LIST } from "@modules/fees/classes/constants";
import { ColumnFilterModalComponent } from "./component/column-filter-modal/column-filter-modal.component";
import { moveItemInArray } from "@angular/cdk/drag-drop";

export class ViewListStreamVariables {

    vm: ViewListComponent;

    installmentList = INSTALLMENT_LIST;

    deepCopy = CommonFunctions.getInstance().deepCopy;

    constructor(vm: ViewListComponent) { this.vm = vm; }

    intializeData() {

        this.populateIsInitialLoading();

        // starts populate student section list
        from(new Query()
            .filter({
                parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
                parentSession: this.vm.user.activeSchool.currentSessionDbId
            })
            .addParentQuery(
                'parentStudent',
                new Query()
                .addChildQuery(
                    'studentfee',
                    new Query()
                    .addChildQuery(
                        'subFeeReceiptList',
                        new Query()
                        .filter({parentFeeReceipt__cancelled: false})
                    )
                    .addChildQuery(
                        'subDiscountList',
                        new Query()
                        .filter({parentDiscount__cancelled: false})
                    )
                )
            )
            .getObjectList({student_app : 'StudentSection'})
        ).subscribe((value) => {
            this.vm.studentSectionList$.next(value);
        });
        // ends populate student section list

        // starts populate tc list
        let tcApiCallCount = 0; // for experimental purpose
        this.vm.studentSectionList$.asObservable().pipe(
            mergeMap((studentSectionList) => {

                if (studentSectionList == null) { return (new BehaviorSubject<any>(null)).asObservable(); }

                ++tcApiCallCount;
                if (tcApiCallCount > 1) { alert('multiple api calls for tc list'); }

                return from(
                    new Query()
                        .filter({
                            parentStudent__in: studentSectionList.map(item => item.parentStudent),
                            status__in: ['Generated', 'Issued']
                        })
                        .setFields('parentStudent', 'status')
                        .getObjectList({tc_app: 'TransferCertificateNew'})
                );

            })
        ).subscribe(value => {
            this.vm.tcList$.next(value);
        });
        // ends populate tc list

        // starts populate session list
        from(new Query()
            .orderBy('orderNumber')
            .getObjectList({school_app: 'Session'})
        ).subscribe(value => {
            this.vm.sessionList$.next(value);
        });
        // ends populate session list

        // starts populate useful session list
        combineLatest([
            this.vm.sessionList$.asObservable(),
            this.vm.intermediaryStudentSectionList$.asObservable(),
        ]).subscribe(([sessionList, intermediaryStudentSectionList]) => {

            if (!sessionList || !intermediaryStudentSectionList) {
                return;
            }

            let minSessionOrderNumber = Math.min.apply(Math, sessionList.filter(session => {
                return intermediaryStudentSectionList.find(student => {
                    return student.feeDetailsList.find(feeDetails => {
                        return feeDetails.parentSession == session.id;
                    }) != undefined;
                }) != undefined;
            }).map(session => session.orderNumber));

            this.vm.usefulSessionList$.next(sessionList.filter(session => session.orderNumber >= minSessionOrderNumber));

        });
        // ends populate useful session list

        // starts populate fee type list
        from(new Query()
            .filter({parentSchool: this.vm.user.activeSchool.dbId})
            .getObjectList({fees_third_app: 'FeeType'})
        ).subscribe(value => {
            this.vm.feeTypeList$.next(value);
        });
        // ends populate fee type list

        // starts populate class list
        from(new Query()
            .getObjectList({class_app: 'Class'})
        ).subscribe(value => {
            this.vm.classList$.next(value);
        });
        // ends populate class list

        // starts populate section list
        from(new Query()
            .getObjectList({class_app: 'Division'})
        ).subscribe(value => {
            this.vm.sectionList$.next(value);
        });
        // ends populate section list

        // starts populate student parameter list
        from(
            new Query()
                .filter({
                    parentSchool: this.vm.user.activeSchool.dbId,
                    parameterType__in : ['TEXT', 'FILTER']
                })
                .getObjectList({student_app: 'StudentParameter'})
        ).subscribe(value => {
            this.vm.studentParameterList$.next(value);
        });
        // ends populate student parameter list

        // starts populate initial report list
        from(new Query()
            .filter({
                parentSchool: this.vm.user.activeSchool.dbId
            })
            .getObjectList({fees_third_app: 'FeesViewAllReport'})
        ).subscribe(value => {
            this.vm.intialReportList$.next(value);
        });
        // ends populate initial report list

        // starts populate report list
        merge (
            // intialization
            this.vm.intialReportList$.pipe(
                map(value => {
                    return {
                        operation: 'initialization',
                        data: value
                    };
                })
            ),
            // newly saved
            this.vm.recentlySavedReport$.asObservable().pipe(
                map(value => {
                    return {
                        operation: 'newlySavedReport',
                        data: value
                    };
                })
            ),
            // updation
            this.vm.recentlyUpdatedReport$.asObservable().pipe(
                map(value => {
                    return {
                        operation: 'recentlyUpdatedReport',
                        data: value
                    };
                })
            ),
            // deletion
            this.vm.recentlyDeletedReportId$.asObservable().pipe(
                map(value => {
                    return {
                        operation: 'recentlyDeletedReport',
                        data: value
                    };
                })
            )
        ).subscribe(value => {
            let data = value.data;
            if (!data) { return; }
            let reportList = this.vm.reportList$.getValue();
            switch (value.operation) {
                case 'initialization':
                    reportList = data;
                    break;
                case 'newlySavedReport':
                    reportList.push(data);
                    break;
                case 'recentlyUpdatedReport':
                    let index = reportList.findIndex((report => {
                        return report.id == data.id;
                    }));
                    reportList[index] = data;
                    break;
                case 'recentlyDeletedReport':
                    reportList = reportList.filter(report => report.id != data);
                    break;
            }
            this.vm.reportList$.next(reportList);
        });
        // ends populate report list

        // starts populate selected report
        merge (
            // newly saved
            this.vm.recentlySavedReport$.asObservable().pipe(
                map(value => {
                    return {
                        operation: 'newlySavedReport',
                        data: value
                    };
                })
            ),
            // updation
            this.vm.recentlyUpdatedReport$.asObservable().pipe(
                map(value => {
                    return {
                        operation: 'recentlyUpdatedReport',
                        data: value
                    };
                })
            ),
            // deletion
            this.vm.recentlyDeletedReportId$.asObservable().pipe(
                map(value => {
                    return {
                        operation: 'recentlyDeletedReport',
                        data: value
                    };
                })
            ),
            // discard changes
            this.vm.handleSelectReportClick$.asObservable().pipe(
                map(value => {
                    if (
                        value &&
                        !this.vm.isUpdateBtnDisabled$.getValue() &&
                        confirm("Do you want to discard your current changes in this report?")
                    ) {
                        return {
                            operation: 'discardChanges',
                            data: value
                        };
                    }
                    return {
                        operation: 'discardChanges',
                        data: null
                    };
                })
            )
        ).subscribe(value => {
            let data = value.data;
            if (!data) { return; }
            switch (value.operation) {
                case 'newlySavedReport':
                    this.vm.selectedReport$.next(data);
                    break;
                case 'recentlyUpdatedReport':
                    this.vm.selectedReport$.next(data);
                    break;
                case 'recentlyDeletedReport':
                    this.vm.selectedReport$.next(null);
                    break;
                case 'discardChanges':
                    this.vm.selectedReport$.next(
                        this.vm.reportList$.getValue().find(report => 
                            report.id == this.vm.selectedReport$.getValue().id
                        )
                    );
                    break;
            }
        });
        // ends populate selected report

        // starts populate selected report name
        this.vm.selectedReport$.asObservable().subscribe(selectedReport => {
            this.vm.selectedReportName$.next(
                selectedReport && selectedReport.name ?
                    selectedReport.name : ''
            );
        });
        // ends populate selected report name

        // starts populate student display parameter list
        this.vm.studentParameterList$.asObservable().subscribe(studentParameterList => {
            if (!studentParameterList) { return; }
            this.vm.studentDisplayParameterList$.next([
                {display: 'Name', variable: 'name'},
                {display: 'Class', variable: 'classSectionName'},
                {display: 'Roll No.', variable: 'rollNumber'},
                {display: 'Father\'s Name', variable: 'fathersName'},
                {display: 'Mother\'s Name', variable: 'motherName'},
                {display: 'Mobile No.', variable: 'mobileNumber'},
                {display: 'Alt. Mobile No.', variable: 'secondMobileNumber'},
                {display: 'Scholar No.', variable: 'scholarNumber'},
                {display: 'Address', variable: 'address'},
                {display: 'Category', variable: 'newCategoryField'},
                {display: 'Date of Admission', variable: 'dateOfAdmission'},
                {display: 'Gender', variable: 'gender'},
                {display: 'RTE', variable: 'rte'},
                {display: 'Remark', variable: 'remark'}
            ].concat(
                studentParameterList.map(studentParameter => {
                    return {display: studentParameter.name, variable: 'studentParameter_' + studentParameter.id};
                })
            ));
        });
        // ends populate student display parameter list

        // starts populate search text
        this.vm.selectedReport$.asObservable().subscribe(value => {
            if (!value) {
                this.vm.searchText$.next('');
                return;
            }
            this.vm.searchText$.next(value.searchText);
        });
        // ends populate search text

        // starts populate selected search parameter
        combineLatest([
            this.vm.studentDisplayParameterList$.asObservable(),
            this.vm.selectedReport$.asObservable()
        ]).subscribe(([studentDisplayParameterList, selectedReport]) => {
            if (selectedReport && selectedReport.searchParameter) {
                this.vm.selectedSearchParameter$.next(selectedReport.searchParameter);
            } else if (studentDisplayParameterList) {
                this.vm.selectedSearchParameter$.next(studentDisplayParameterList[0].variable);
            }
        });
        // ends populate selected search parameter

        // starts populate student custom filter list
        this.vm.studentParameterList$.asObservable().subscribe(valueList => {
            if (!valueList) return;
            this.vm.studentCustomFilterList$.next(valueList.filter(value => value.parameterType == 'FILTER'));
        });
        // ends populate student custom filter list

        // starts populate student custom filter value list
        this.vm.studentSectionList$.asObservable().pipe(
            mergeMap((value) => {

                if (value == null) { return (new BehaviorSubject<any>(null)).asObservable(); }

                return from(
                    new Query()
                        .filter({
                            parentStudent__in: value.map(item => item.parentStudent),
                            parentStudentParameter__parameterType: 'FILTER'
                        })
                        .getObjectList({student_app: 'StudentParameterValue'})
                );

            })
        ).subscribe(value => {
            this.vm.studentParameterValueList$.next(value);
        });
        // ends populate student custom filter value list

        // starts populate intermediary student section list
        combineLatest([
            this.vm.studentSectionList$.asObservable(),
            this.vm.classList$.asObservable(),
            this.vm.sectionList$.asObservable(),
            this.vm.tcList$.asObservable(),
            this.vm.studentParameterList$.asObservable(),
            this.vm.studentParameterValueList$.asObservable(),
            this.vm.sessionList$.asObservable(),
            this.vm.feeTypeList$.asObservable()
        ]).subscribe(([
            studentSectionList,
            classList,
            sectionList,
            tcList,
            studentParameterList,
            studentParameterValueList,
            sessionList,
            feeTypeList
        ]) => {

            if (
                !classList || !sectionList || !studentSectionList || !tcList ||
                !studentParameterList || !studentParameterValueList || !sessionList || !feeTypeList
            ) {
                return;
            }

            this.vm.intermediaryStudentSectionList$.next(studentSectionList.map(studentSection => {

                let tempStudentSection = {
                    ...studentSection.parentStudentInstance,
                    rollNumber: studentSection.rollNumber,
                    classSectionName: classList.find(classs => classs.id === studentSection.parentClass).name
                        + ', ' + sectionList.find(section => section.id === studentSection.parentDivision).name,
                    tc: tcList.find(tc => tc.parentStudent == studentSection.parentStudent),
                    feeDetailsList: []
                };

                // starts calculate amount
                tempStudentSection.feeDetailsList = tempStudentSection.studentfee.map(studentFee => {
                    let result = {
                        parentSession: studentFee.parentSession,
                        parentFeeType: studentFee.parentFeeType
                    };
                    this.installmentList.filter((installment) => {
                        return (
                            !studentFee.isAnnually || (studentFee.isAnnually && installment == 'april')
                        ) && studentFee[installment + 'Amount'] && studentFee[installment + 'Amount'] > 0;
                    }).forEach((installment) => {

                        result[installment + 'Fee'] = studentFee[installment + 'Amount'];

                        // starts calculate late fee amount
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
                        if (lateFeeAmount > 0) {
                            result[installment + 'LateFee'] = lateFeeAmount;
                        }
                        // ends calculate late fee amount

                        // starts calculate main fee paid
                        let feePaid = studentFee.subFeeReceiptList.reduce((total, subFeeReceipt) => {
                            return total + (
                                subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0
                            );
                        }, 0);
                        if (feePaid > 0) { result[installment + 'FeePaid'] = feePaid; }
                        // ends calculate main fee paid

                        // starts calculate late fee paid
                        let lateFeePaid = studentFee.subFeeReceiptList.reduce((total, subFeeReceipt) => {
                            return total + (
                                subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0
                            );
                        }, 0);
                        if (lateFeePaid > 0) { result[installment + 'LateFeePaid'] = lateFeePaid; }
                        // ends calculate late fee paid

                        // starts calculate main fee discount given
                        let discountGiven = studentFee.subDiscountList.reduce((total, subDiscount) => {
                            return total + (
                                subDiscount[installment + 'Amount'] ? subDiscount[installment + 'Amount'] : 0
                            );
                        }, 0);
                        if (discountGiven > 0) { result[installment + 'DiscountGiven'] = discountGiven; }
                        // ends calculate main fee discount given

                        // starts calculate late fee discount given
                        let lateFeeDiscountGiven = studentFee.subDiscountList.reduce((total, subDiscount) => {
                            return total + (
                                subDiscount[installment + 'LateFee'] ? subDiscount[installment + 'LateFee'] : 0
                            );
                        }, 0);
                        if (lateFeeDiscountGiven > 0) { result[installment + 'LateFeeDiscountGiven'] = lateFeeDiscountGiven; }
                        // ends calculate late fee discount given

                    });
                    return result;
                });
                // ends calculate amount

                // starts attach student parameter value
                studentParameterList.forEach(studentCustomFilter => {
                    tempStudentSection['studentParameter_' + studentCustomFilter.id] =
                        studentParameterValueList.find(studentParameterValue =>
                            studentParameterValue.parentStudent == studentSection.parentStudent &&
                            studentParameterValue.parentStudentParameter == studentCustomFilter.id
                        );
                });
                // ends attach student parameter value

                return tempStudentSection;
            }));
        });
        // ends populate intermediary student section list

        // starts populate selected columns value mapped by student id
        combineLatest([
            this.vm.intermediaryStudentSectionList$.asObservable(),
            this.vm.columnListFilter$.asObservable(),
        ]).subscribe(([intermediaryStudentSectionList, columnListFilter]) => {

            if (!intermediaryStudentSectionList || !columnListFilter) {
                return;
            }

            let tempSelectedColumnsValueMappedByStudentId = {};

            intermediaryStudentSectionList.forEach(studentSection => {
                tempSelectedColumnsValueMappedByStudentId[studentSection.id] = columnListFilter.map(column =>
                    this.vm.getValue(studentSection, column.type, column.variable),
                );
            });

            this.vm.selectedColumnsValueByStudentId$.next(tempSelectedColumnsValueMappedByStudentId);

        });
        // ends populate selected columns value mapped by student id

        // starts populate filtered student section list
        combineLatest([
            this.vm.studentListFilter$.asObservable(),
            this.vm.intermediaryStudentSectionList$.asObservable(),
            this.vm.columnListFilter$.asObservable(),
            this.vm.searchText$.asObservable(),
            this.vm.selectedSearchParameter$.asObservable(),
            this.vm.selectedColumnsValueByStudentId$.asObservable()
        ]).subscribe(([
            studentListFilter, intermediaryStudentSectionList, columnListFilter,
             searchText, selectedSearchParameter, selectedColumnsValueByStudentId]) => {

            if (!intermediaryStudentSectionList || !selectedSearchParameter || !columnListFilter || !selectedColumnsValueByStudentId) {
                return;
            }

            let tempFilteredStudentSectionList = intermediaryStudentSectionList;

            // starts filter by search text for name
            if (searchText && searchText != '') {
                tempFilteredStudentSectionList = tempFilteredStudentSectionList.filter(studentSection => {
                    return studentSection[selectedSearchParameter]
                    && studentSection[
                        selectedSearchParameter
                    ].toString().toLowerCase().indexOf(searchText.toLowerCase()) != -1;
                });
            }
            // ends filter by search text for name

            // starts filter by student list filter
            if (studentListFilter) {

                tempFilteredStudentSectionList = tempFilteredStudentSectionList.filter(studentSection => {

                    if (!studentListFilter) { return true; }

                    // Starts : Check class section filter
                    if (studentListFilter['selectedClassList']) {
                        if (!studentListFilter['selectedClassList'].includes(
                            studentSection.classSectionName
                        )) {
                            return false;
                        }
                    }
                    // Ends : Check class section filter

                    // Starts : Age Filter
                    if (studentListFilter['age']) {

                        let ageFilter = studentListFilter['age'];

                        if (!studentSection.dateOfBirth) {
                            return false;
                        }

                        let age = CommonFunctions.getAge(ageFilter['asOnDate'], studentSection.dateOfBirth);

                        /* Min-Age check */
                        if (
                            ageFilter['minAge'] &&
                            !isNaN(ageFilter['minAge']) &&
                            age < ageFilter['minAge']
                        ) {
                            return false;
                        }

                        /* Max-Age check */
                        if (
                            ageFilter['maxAge'] &&
                            !isNaN(ageFilter['maxAge']) &&
                            age > ageFilter['maxAge']
                        ) {
                            return false;
                        }

                    }
                    // Ends : Age Filter

                    // Starts : Category Filter
                    if (
                        studentListFilter['category'] &&
                        !studentListFilter['category'].includes(
                            studentSection.newCategoryField ? studentSection.newCategoryField : "NONE"
                        )
                    ) {
                        return false;
                    }
                    // Ends : Category Filter

                    // Starts : Gender Filter
                    if (
                        studentListFilter['gender'] &&
                        !studentListFilter['gender'].includes(
                            studentSection.gender ? studentSection.gender : "NONE"
                        )
                    ) {
                        return false;
                    }
                    // Ends : Gender Filter

                    // Starts : Admission Filter
                    if (studentListFilter['admission']) {
                        let admissionFilter = studentListFilter['admission'];
                        let studentAdmissionSession = studentSection.admissionSession;
                        let admissionType;

                        if (!studentAdmissionSession) {
                            admissionType = "NONE";
                        } else if (studentAdmissionSession === this.vm.user.activeSchool.currentSessionDbId) {
                            admissionType = "New";
                        } else {
                            admissionType = "Old";
                        }

                        if (!admissionFilter.includes(admissionType)) {
                            return false;
                        }
                    }
                    // Ends : Admission Filter

                    // Starts : RTE Filter
                    if (
                        studentListFilter['RTE'] &&
                        !studentListFilter['RTE'].includes(
                            studentSection.rte ? studentSection.rte : "NONE"
                        )
                    ) {
                        return false;
                    }
                    // Ends : RTE Filter

                    // Starts : TC Filter
                    if (
                        studentListFilter['TC'] &&
                        !studentListFilter['TC'].includes(
                            studentSection.tc ? studentSection.tc.status : "NONE"
                        )
                    ) {
                        return false;
                    }
                    // Ends : TC Filter

                    // Starts : Custom Filter
                    if (
                        studentListFilter['studentCustomFilterList'] &&
                        studentListFilter['studentCustomFilterList'].find(studentCustomFilter => {
                            return (
                                !studentSection['studentParameter_' + studentCustomFilter.id] &&
                                !studentCustomFilter.noneSelected
                            ) || (
                                studentSection['studentParameter_' + studentCustomFilter.id] &&
                                !studentCustomFilter.filterValues.includes(studentSection['studentParameter_' + studentCustomFilter.id])
                            );
                        }) != undefined
                    ) {
                        return false;
                    }
                    // Ends : Custom Filter

                    return true;

                });

            }
            // ends filter by student list filter

            // starts show only selected columns
            tempFilteredStudentSectionList = tempFilteredStudentSectionList.map(studentSection => {
                return selectedColumnsValueByStudentId[studentSection.id];
            });
            // ends show only selected columns

            // starts filter by amount
            tempFilteredStudentSectionList = tempFilteredStudentSectionList.filter(studentSection => {
                return studentSection.find((value, index) => {
                    return columnListFilter[index]['type'] == 'fee' && (
                        (
                            columnListFilter[index]['variable']['minAmount'] &&
                            columnListFilter[index]['variable']['minAmount'] > value
                        ) || (
                            columnListFilter[index]['variable']['maxAmount'] &&
                            columnListFilter[index]['variable']['maxAmount'] < value
                        )
                    );
                }) == undefined;
            });
            // ends filter by amount

            // starts sort
            columnListFilter.forEach((columnFilter, columnIndex) => {
                if (columnFilter.sort) {
                    tempFilteredStudentSectionList.sort((a, b) => {
                        return columnFilter.type == 'profile' ? (
                            (a[columnIndex] ? a[columnIndex].toString() : '').localeCompare(b[columnIndex] ? b[columnIndex].toString() : '')
                        ) : a[columnIndex] - b[columnIndex];
                    });
                    if (columnFilter.sort == 'descending') {
                        tempFilteredStudentSectionList.reverse();
                    }
                }
            });
            // ends sort

            this.vm.filteredStudentSectionList$.next(tempFilteredStudentSectionList);

        });
        // ends populate filtered student section list

        // starts populate student list filter
        merge(
            this.vm.selectedReport$.asObservable().pipe(
                map(value => {
                    return {
                        operation: 'reportSelected',
                        data: value
                    };
                })
            ),
            this.vm.openStudentListFilterDialogBtnClicked$.pipe(
                mergeMap((value) => {
                    if (value == null) {
                        return (new BehaviorSubject<any>(null)).asObservable();
                    }
                    if (value == 'clicked') {
                        return from(this.vm.dialog.open(StudentListFilterModalComponent, {
                            data: {
                                classList: this.vm.classList$.getValue(),
                                sectionList: this.vm.sectionList$.getValue(),
                                studentSectionList: this.vm.studentSectionList$.getValue(),
                                studentCustomFilterList: this.vm.studentCustomFilterList$.getValue(),
                                studentListFilter: this.vm.studentListFilter$.getValue()
                            }
                        }).afterClosed());
                    }
                }),
                map(value => {
                    return {
                        operation: 'dialogClosed',
                        data: value
                    };
                })
            )
        ).subscribe(value => {
            let data = value['data'];
            switch (value['operation']) {
                case 'dialogClosed':
                    if (!data || !data['studentListFilter']) { return; }
                    this.vm.studentListFilter$.next(this.deepCopy(data['studentListFilter']));
                    break;
                case 'reportSelected':
                    if (!data) {
                        this.vm.studentListFilter$.next(null);
                    } else {
                        this.vm.studentListFilter$.next(this.deepCopy(data['studentListFilter']));
                    }
            }
        });
        // ends populate student list filter

        // starts populate column filter
        merge(
            this.vm.selectedReport$.asObservable().pipe(
                map(value => {
                    return {
                        operation: 'reportSelected',
                        data: value
                    };
                })
            ),
            this.vm.openColumnFilterDialogBtnClicked$.pipe(
                mergeMap((value) => {
                    if (value === null) { return (new BehaviorSubject<any>(null)).asObservable(); }
                    let columnListFilter = this.vm.columnListFilter$.getValue();
                    return from(this.vm.dialog.open(ColumnFilterModalComponent, {
                        data: {
                            columnIndex: value,
                            columnFilter: value < columnListFilter.length ? columnListFilter[value] : null,
                            usefulSessionList: this.vm.usefulSessionList$.getValue(),
                            feeTypeList: this.vm.feeTypeList$.getValue(),
                            studentDisplayParameterList: this.vm.studentDisplayParameterList$.getValue(),
                            currentSessionId: this.vm.user.activeSchool.currentSessionDbId
                        }
                    }).afterClosed());
                }),
                map(value => {
                    return {
                        operation: 'dialogClosed',
                        data: value
                    };
                })
            ),
            this.vm.columnDragged$.asObservable().pipe(
                map(value => {
                    if (!value) { return (new BehaviorSubject<any>(null)).asObservable(); }
                    return {
                        operation: 'dragged',
                        data: value
                    };
                })
            )
        ).subscribe(value => {

            let data = value['data'];
            let columnListFilter = this.vm.columnListFilter$.getValue();
            switch (value['operation']) {
                case 'dialogClosed':
                    if (!data) { return; }
                    if (data.shouldDelete) {
                        columnListFilter.splice(data['columnIndex'], 1);
                    } else if (data.columnIndex > columnListFilter.length - 1) {
                        columnListFilter.push(data['columnFilter']);
                    } else {
                        columnListFilter[data['columnIndex']] = data['columnFilter'];
                    }
                    break;
                case 'dragged':
                    moveItemInArray(columnListFilter, data.previousIndex, data.currentIndex);
                    break;
                case 'reportSelected':
                    if (!data) { columnListFilter = this.vm.DEFAULT_COLUMN_LIST_FILTER; }
                    else { columnListFilter = data['columnListFilter']; }
                    break;
            }
            this.vm.columnListFilter$.next(this.deepCopy(columnListFilter));

        });
        // ends populate column filter

        // starts populate show update btn
        this.vm.selectedReport$.asObservable().subscribe(selectedReport => {
            this.vm.showUpdateBtn$.next(selectedReport && selectedReport.id);
        });
        // ends populate show update btn

        // starts populate update btn disable
        combineLatest([
            this.vm.reportMightHaveChanged$.asObservable(),
            this.vm.selectedReportName$.asObservable()
        ]).subscribe(([isReportChanged, selectedReportName]) => {
            this.vm.isUpdateBtnDisabled$.next(
                !isReportChanged ||
                !selectedReportName ||
                selectedReportName == '' ||
                (this.vm.reportList$.getValue() && this.vm.reportList$.getValue().find(report => {
                    return report.name == selectedReportName && report.id != this.vm.selectedReport$.getValue().id;
                }) != undefined)
            );
        });
        // ends populate update btn disable

        // starts populate update btn tool tip
        combineLatest([
            this.vm.reportMightHaveChanged$.asObservable(),
            this.vm.selectedReportName$.asObservable()
        ]).subscribe(([isReportChanged, selectedReportName]) => {
            let toolTip = '';
            toolTip += !isReportChanged ? "- No changes in report to update\n" : '';
            toolTip += !selectedReportName || selectedReportName == '' ?
                "- Report Name should be populated\n" : '';
            toolTip += (this.vm.reportList$.getValue() && this.vm.reportList$.getValue().find(report => {
                    return report.name == selectedReportName && report.id != this.vm.selectedReport$.getValue().id;
                }) != undefined) ? '- Name already exists in some other report\n' : '';
            this.vm.updateBtnToolTip$.next(toolTip);
        });
        // ends populate update btn tool tip

        // starts populate show delete btn
        this.vm.selectedReport$.asObservable().subscribe(selectedReport => {
            this.vm.showDeleteBtn$.next(selectedReport && selectedReport.id);
        });
        // ends populate show delete btn

        // starts populate save new btn disable property
        this.vm.selectedReportName$.asObservable().subscribe(selectedReportName => {
            this.vm.isSaveNewBtnDisabled$.next(
                !selectedReportName ||
                selectedReportName == '' ||
                (this.vm.reportList$.getValue() && this.vm.reportList$.getValue().find(report => {
                    return report.name == selectedReportName;
                }) != undefined)
            );
        });
        // ends populate save new btn disable property

        // starts populate save new btn tool tip
        this.vm.selectedReportName$.asObservable().subscribe(selectedReportName => {
            let toolTip = '';
            toolTip = !selectedReportName || selectedReportName == '' ? toolTip + '- Report Name should be populated\n' : toolTip;
            toolTip = (this.vm.reportList$.getValue() && this.vm.reportList$.getValue().find(report => {
                        return report.name == selectedReportName;
                    }) != undefined) ? toolTip + '- Report Name already exists\n' : toolTip;
            this.vm.saveNewBtnToolTip$.next(toolTip);
        });
        // ends populate save new btn tool tip

        // starts populate newly saved report
        this.vm.saveNewBtnClicked$.asObservable().pipe(
            mergeMap( value => {
                if (!value) { return new BehaviorSubject<any>(null); }
                let data = {
                    name: this.vm.selectedReportName$.getValue(),
                    parentSchool: this.vm.user.activeSchool.dbId,
                    studentListFilter: this.vm.studentListFilter$.getValue(),
                    columnListFilter: this.vm.columnListFilter$.getValue(),
                    searchText: this.vm.searchText$.getValue(),
                    searchParameter: this.vm.selectedSearchParameter$.getValue()
                };
                return from(new Query()
                    .createObject({fees_third_app: 'FeesViewAllReport'}, data)
                );
            })
        ).subscribe(value => {
            if (!value)  { return; }
            alert('Report "' + value.name + '" saved successfully');
            this.vm.recentlySavedReport$.next(value);
        });
        // ends populate newly saved report

        // starts populate newly updated report
        this.vm.updateBtnClicked$.asObservable().pipe(
            mergeMap(value => {
                if (!value) { return new BehaviorSubject<any>(null); }
                return from(new Query()
                    .updateObject({fees_third_app: 'FeesViewAllReport'}, {
                        id: this.vm.selectedReport$.getValue().id,
                        name: this.vm.selectedReportName$.getValue(),
                        parentSchool: this.vm.user.activeSchool.dbId,
                        studentListFilter: this.vm.studentListFilter$.getValue(),
                        columnListFilter: this.vm.columnListFilter$.getValue(),
                        searchText: this.vm.searchText$.getValue(),
                        searchParameter: this.vm.selectedSearchParameter$.getValue()
                    })
                );
            })
        ).subscribe(value => {
            if (!value) { return; }
            alert('Report "' + value.name + '" updated successfully');
            this.vm.recentlyUpdatedReport$.next(value);
        });
        // ends populate newly updated report

        // starts populate recently deleted report id
        this.vm.deleteBtnClicked$.asObservable().pipe(
            mergeMap(value => {
                if (!value) { return new BehaviorSubject<any>(null); }
                return from(new Query()
                    .filter({id: this.vm.selectedReport$.getValue().id})
                    .deleteObjectList({fees_third_app: 'FeesViewAllReport'})
                );
            }),
            map(value => {
                if (!value) { return null; }
                return this.vm.selectedReport$.getValue().id;
            })
        ).subscribe(value => {
            if (!value) { return; }
            alert('Report deleted successfully');
            this.vm.recentlyDeletedReportId$.next(value);
        });
        // ends populate recently deleted report id

        // starts is report changed
        combineLatest([
            this.vm.selectedReport$.asObservable(),
            this.vm.selectedReportName$.asObservable(),
            this.vm.searchText$.asObservable(),
            this.vm.selectedSearchParameter$.asObservable(),
            this.vm.studentListFilter$.asObservable(),
            this.vm.columnListFilter$.asObservable()
        ]).subscribe(([
            selectedReport,
            selectedReportName,
            searchText,
            selectedSearchParameter,
            studentListFilter,
            columnListFilter
        ]) => {
            if (!selectedReport) { return; }
            if (
                selectedReport.name != selectedReportName ||
                selectedReport.searchText != searchText ||
                selectedReport.searchParameter != selectedSearchParameter ||
                JSON.stringify(selectedReport.studentListFilter) != JSON.stringify(studentListFilter) ||
                JSON.stringify(selectedReport.columnListFilter) != JSON.stringify(columnListFilter)
            ) {
                this.vm.reportMightHaveChanged$.next(true);
            } else {
                this.vm.reportMightHaveChanged$.next(false);
            }
        });
        // ends is report changed

    }

    populateIsInitialLoading() {
        merge(
            this.vm.saveNewBtnClicked$.asObservable().pipe(
                map(value => {
                    return {
                        operation: 'saveBtnClicked',
                        data: value
                    };
                })
            ),
            this.vm.recentlySavedReport$.asObservable().pipe(
                map(value => {
                    return {
                        operation: 'newlySavedReport',
                        data: value
                    };
                })
            ),
            this.vm.updateBtnClicked$.asObservable().pipe(
                map(value => {
                    return {
                        operation: 'updateBtnClicked',
                        data: value
                    };
                })
            ),
            this.vm.recentlyUpdatedReport$.asObservable().pipe(
                map(value => {
                    return {
                        operation: 'recentlyUpdatedReport',
                        data: value
                    };
                })
            ),
            this.vm.deleteBtnClicked$.asObservable().pipe(
                map(value => {
                    return {
                        operation: 'deleteBtnClicked',
                        data: value
                    };
                })
            ),
            this.vm.recentlyDeletedReportId$.asObservable().pipe(
                map(value => {
                    return {
                        operation: 'recentlyDeletedReport',
                        data: value
                    };
                })
            ),
            combineLatest([
                this.vm.studentSectionList$.asObservable(),
                this.vm.tcList$.asObservable(),
                this.vm.sessionList$.asObservable(),
                this.vm.feeTypeList$.asObservable(),
                this.vm.classList$.asObservable(),
                this.vm.sectionList$.asObservable(),
                this.vm.filteredStudentSectionList$.asObservable(),
                this.vm.studentCustomFilterList$.asObservable(),
                this.vm.studentParameterValueList$.asObservable(),
                this.vm.selectedSearchParameter$.asObservable()
            ]).pipe(
                map(valueList => {
                    return {
                        operation: 'initialization',
                        data: valueList
                    };
                })
            )
        ).subscribe(value => {
            let data = value['data'];
            switch (value.operation) {
                case 'initialization':
                    this.vm.isInitialLoading$.next(!data.every(value => value != null));
                    break;
                case 'saveBtnClicked':
                    if (data) { this.vm.isInitialLoading$.next(true); return; }
                    break;
                case 'newlySavedReport':
                    if (data) { this.vm.isInitialLoading$.next(false); return; }
                    break;
                case 'updateBtnClicked':
                    if (data) { this.vm.isInitialLoading$.next(true); return; }
                    break;
                case 'recentlyUpdatedReport':
                    if (data) { this.vm.isInitialLoading$.next(false); return; }
                    break;
                case 'deleteBtnClicked':
                    if (data) { this.vm.isInitialLoading$.next(true); return; }
                    break;
                case 'recentlyDeletedReport':
                    if (data) { this.vm.isInitialLoading$.next(false); return; }
                    break;
            }
        });
    }

}