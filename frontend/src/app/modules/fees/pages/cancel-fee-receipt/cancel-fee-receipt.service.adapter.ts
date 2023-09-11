import { CancelFeeReceiptComponent } from './cancel-fee-receipt.component';
import { Query } from '@services/generic/query';

export class CancelFeeReceiptServiceAdapter {
    vm: CancelFeeReceiptComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: CancelFeeReceiptComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isInitialLoading = true;

        let employee_list = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 0
            this.vm.classService.getObjectList(this.vm.classService.division, {}), // 1
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_list), // 2
            new Query().filter({parentSchool: this.vm.user.activeSchool.dbId}).orderBy('id').getObjectList({fees_third_app: 'FeeReceiptBook'}), // 3
        ]).then(
            (value) => {
                this.vm.classList = value[0];
                this.vm.sectionList = value[1];
                this.vm.employeeList = value[2];
                this.vm.feeReceiptBookList = value[3];
                this.vm.activeFeeReceiptBookList = this.vm.feeReceiptBookList.filter(feeReceiptBook => feeReceiptBook.active);
                this.vm.selectedFeeReceiptBook = this.vm.feeReceiptBookList.find(feeReceiptBook => feeReceiptBook.active);
                this.vm.searchBy = this.vm.searchFilterList[0];

                this.vm.isInitialLoading = false;
            },
            (error) => {
                this.vm.isInitialLoading = false;
            }
        );
    }

    // Get Fee Receipt List
    getInitialFeeReceiptList(): void {
        this.vm.isLoading = true;
        this.vm.feeReceiptList = [];
        this.vm.subFeeReceiptList = [];
        this.vm.receiptCount = 0;
        this.fetchReceiptsOfCount();
    }

    // Cancel Fee Receipt
    cancelFeeReceipt(feeReceipt: any): void {
        this.vm.isLoading = true;

        let fee_receipt_object = {
            id: feeReceipt.id,
            cancelled: true,
            cancelledBy: this.vm.user.activeSchool.employeeId,
            cancelledRemark: feeReceipt.cancelledRemark,
            cancelledDateTime: new Date(),
        };

        Promise.all([
            this.vm.feeService.partiallyUpdateObject(this.vm.feeService.fee_receipts, fee_receipt_object),
        ]).then(
            (value) => {
                alert('Fee Receipt is cancelled');

                this.vm.feeReceiptList.find((item) => {
                    return item.id == feeReceipt.id;
                }).cancelled = true;

                this.vm.isLoading = false;
            }
        );
    }

    fetchReceiptsOfCount() {
        let fee_receipt_list = {};

        if (this.vm.searchBy === this.vm.searchFilterList[0]) {
            //if cheque or receipt no search
            fee_receipt_list = {
                parentSchool: this.vm.user.activeSchool.dbId,
                parentFeeReceiptBook: this.vm.selectedFeeReceiptBook.id,
                receiptNumber__or: this.vm.searchParameter,
                chequeNumber: this.vm.searchParameter,
                korangle__order: '-generationDateTime',
                korangle__count: this.vm.receiptCount.toString() + ',' + (this.vm.receiptCount + this.vm.loadingCount).toString(),
            };
        } else {
            //if parent or student search
            let studentListId = this.vm.selectedStudentList.map((a) => a.id).join();
            fee_receipt_list = {
                parentSchool: this.vm.user.activeSchool.dbId,
                parentStudent__in: studentListId,
                korangle__order: '-generationDateTime',
                korangle__count: this.vm.receiptCount.toString() + ',' + (this.vm.receiptCount + this.vm.loadingCount).toString(),
            };
        }

        Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.fee_receipts, fee_receipt_list), //0
        ]).then(
            (value) => {
                this.vm.receiptCount += value[0].length; // incrementing receipt count

                if (value[0].length < this.vm.loadingCount) {
                    this.vm.loadMoreReceipts = false; // if the fee receipts are less than the loading count then dont loadMore
                }

                let subFee_List = {
                    parentFeeReceipt__parentSchool: this.vm.user.activeSchool.dbId,
                    parentFeeReceipt__in: value[0].map((fee) => fee.id).join(),
                };

                Promise.all([this.vm.feeService.getObjectList(this.vm.feeService.sub_fee_receipts, subFee_List)]).then(
                    (subFeeValue) => {
                        subFeeValue[0].forEach((val) => {
                            this.vm.subFeeReceiptList.push(val);
                        });

                        let service_list = [];

                        let student_list = {
                            id__in: [
                                ...new Set(
                                    value[0]
                                        .filter((item) => {
                                            return !this.vm.studentList.find((student) => {
                                                return student.id == item.parentStudent;
                                            });
                                        })
                                        .map((item) => item.parentStudent)
                                ),
                            ],
                        };

                        if (student_list.id__in.length != 0) {
                            service_list.push(this.vm.studentService.getObjectList(this.vm.studentService.student, student_list));
                        }

                        let tempList = value[0].map((item) => item.parentSession);
                        tempList
                            .filter((item, index) => {
                                return tempList.indexOf(item) == index;
                            })
                            .forEach((item) => {
                                let student_section_list = {
                                    parentSession: item,
                                    parentStudent__in: [
                                        ...new Set(
                                            value[0]
                                                .filter((item2) => {
                                                    return item2.parentSession == item;
                                                })
                                                .map((item2) => item2.parentStudent)
                                                .filter((item2) => {
                                                    return !this.vm.studentSectionList.find((studentSection) => {
                                                        return (
                                                            studentSection.parentSession == item && studentSection.parentStudent == item2
                                                        );
                                                    });
                                                })
                                        ),
                                    ],
                                };

                                if (student_section_list.parentStudent__in.length != 0) {
                                    service_list.push(
                                        this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_list)
                                    );
                                }
                            });

                        if (service_list.length > 0) {
                            Promise.all(service_list).then(
                                (value2) => {

                                    if (student_list.id__in.length != 0) {
                                        this.vm.studentList = this.vm.studentList.concat(value2[0]);
                                        value2 = value2.slice(1);
                                    }

                                    value2.forEach((item) => {
                                        this.vm.studentSectionList = this.vm.studentSectionList.concat(item);
                                    });

                                    value[0].forEach((val) => {
                                        this.vm.feeReceiptList.push(val);
                                    });
                                    this.makeLoadingFalse();
                                },
                                (error) => {
                                    this.makeLoadingFalse();
                                }
                            );
                        } else {
                            value[0].forEach((val) => {
                                this.vm.feeReceiptList.push(val);
                            });
                            this.makeLoadingFalse();
                        }
                    },
                    (error) => {
                        this.makeLoadingFalse();
                    }
                );
                this.vm.showReceipts = true;
            },
            (error) => {
                this.makeLoadingFalse();
            }
        );
        this.vm.loadMoreReceipts = true;
    }

    loadMoreReceipts() {
        this.vm.isReceiptListLoading = true;
        this.fetchReceiptsOfCount();
    }

    makeLoadingFalse() {
        if (this.vm.receiptCount <= 6) {
            this.vm.isLoading = false;
        } else {
            this.vm.isReceiptListLoading = false;
        }
    }
}
