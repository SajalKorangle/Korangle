
import { TotalCollectionComponent } from './total-collection.component';
import {EmitterService} from '@services/emitter.service';

export class TotalCollectionServiceAdapter {

    vm: TotalCollectionComponent;

    constructor() {
    }

    // Data

    initializeAdapter(vm: TotalCollectionComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {

        this.vm.isInitialLoading = true;

        let fee_type_list = {
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        let employee_list = {
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.fee_type, fee_type_list),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_list),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.schoolService.getObjectList(this.vm.schoolService.board, {}),
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {})
        ]).then(value => {

            this.vm.feeTypeList = value[0]
            this.vm.employeeList = value[1];
            this.vm.classList = value[2];
            this.vm.sectionList = value[3];
            this.vm.boardList = value[4];
            this.vm.sessionList = value[5]

            this.vm.isInitialLoading = false;
        }, error => {
            this.vm.isInitialLoading = false;
        });

        EmitterService.get('cancel-receipt').subscribe(feeReceipt => {
          this.cancelFeeReceipt(feeReceipt);
        });
    }


    // Get Fee Collection List
    getFeeCollectionList(): void {

        this.vm.isLoading = true;

        let fee_receipt_list = {
            'generationDateTime__gte': this.vm.startDate + ' 00:00:00%2B05:30',
            'generationDateTime__lte': this.vm.endDate + ' 23:59:59%2B05:30',
            'parentSchool': this.vm.user.activeSchool.dbId
        };

        let sub_fee_receipt_list = {
            'parentFeeReceipt__generationDateTime__gte': this.vm.startDate + ' 00:00:00%2B05:30',
            'parentFeeReceipt__generationDateTime__lte': this.vm.endDate + ' 23:59:59%2B05:30',
            'parentFeeReceipt__parentSchool': this.vm.user.activeSchool.dbId
        };

        this.vm.initializeSelection();

        Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.fee_receipts, fee_receipt_list),
            this.vm.feeService.getObjectList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list),
        ]).then(value => {

            this.vm.feeReceiptList = value[0].sort((a, b) => {
                return b.receiptNumber - a.receiptNumber
            });
            ;
            this.vm.subFeeReceiptList = value[1];

            let service_list = [];

            let student_list = {
                'id__in': [...new Set(value[0].filter(item => {
                    return !this.vm.studentList.find(student => {
                        return student.id == item.parentStudent;
                    });
                }).map(item => item.parentStudent))],
            };

            if (student_list.id__in.length != 0) {
                service_list.push(this.vm.studentService.getObjectList(this.vm.studentService.student, student_list));
            }

            let tempList = value[0].map(item => item.parentSession);
            tempList.filter((item, index) => {
                return tempList.indexOf(item) == index;
            }).forEach(item => {

                let student_section_list = {
                    'parentSession': item,
                    'parentStudent__in': [...new Set(value[0].filter(item2 => {
                        return item2.parentSession == item;
                    }).map(item2 => item2.parentStudent).filter(item2 => {
                        return !this.vm.studentSectionList.find(studentSection => {
                            return studentSection.parentSession == item && studentSection.parentStudent == item2;
                        });
                    }))],
                };

                if (student_section_list.parentStudent__in.length != 0) {
                    service_list.push(this.vm.studentService.getObjectList(this.vm.studentService.student_section,
                        student_section_list),)
                }

            });

            if (service_list.length > 0) {

                Promise.all(service_list).then(value2 => {

                    if (student_list.id__in.length != 0) {
                        this.vm.studentList = this.vm.studentList.concat(value2[0]);
                        value2 = value2.slice(1);
                    }

                    value2.forEach(item => {
                        this.vm.studentSectionList = this.vm.studentSectionList.concat(item);
                    });

                    this.initializeFilteredLists();
                    this.vm.isLoading = false;
                }, error => {
                    this.vm.isLoading = false;
                })

            } else {
                this.initializeFilteredLists();
                this.vm.isLoading = false;
            }

        }, error => {
            this.vm.isLoading = false;
        });

    }

    initializeFilteredLists(): void {

        // Filtered Class Section List
        this.vm.filteredClassSectionList = this.vm.feeReceiptList.map(fee => {
            return this.vm.getClassAndSection(fee.parentStudent, fee.parentSession);
        }).filter((item, index, final) => {
            return final.findIndex(item2 => item2.classs.id == item.classs.id
                && item2.section.id == item.section.id) == index;
        }).sort((a, b) => {
            if (a.classs.orderNumber == b.classs.orderNumber) {
                return a.section.orderNumber - b.section.orderNumber;
            } else {
                return a.classs.orderNumber - b.classs.orderNumber;
            }
        });

        // Filtered Employee List
        this.vm.filteredEmployeeList = this.vm.employeeList.filter(employee => {
            return this.vm.feeReceiptList.map(a => a.parentEmployee).filter((item, index, final) => {
                return final.indexOf(item) == index;
            }).includes(employee.id);
        });

        // Filtered Mode of Payment List
        this.vm.filteredModeOfPaymentList = [...new Set(this.vm.feeReceiptList.map(a => a.modeOfPayment))].filter(a => {
            return a != null;
        });


        //Filtered Fee Type list
        this.vm.filteredFeeTypeList = this.vm.feeTypeList.filter(feeType => {
            return this.vm.subFeeReceiptList.find(subFeeReceipt => {
                return subFeeReceipt.parentFeeType == feeType.id;
            }) != undefined;
        });

    }



    cancelFeeReceipt(feeReceipt: any): void {

        this.vm.isLoading = true;

        let fee_receipt_object = {
            'id': feeReceipt.id,
            'cancelled': true,
            'cancelledBy':this.vm.user.activeSchool.employeeId,
            'cancelledRemark':feeReceipt.cancelledRemark,
            'cancelledDateTime':new Date(),
        };

        let student_fee_list = this.vm.subFeeReceiptList.filter(subFeeReceipt => {
            return subFeeReceipt.parentFeeReceipt == feeReceipt.id;
        }).map(item => {
            let tempObject = {
                'id': item.parentStudentFee,
                'cleared': false,
            };
            this.vm.installmentList.forEach(installment => {
                if (item[installment+'Amount'] && item[installment+'Amount']>0) {
                    tempObject[installment+'ClearanceDate'] = null;
                }
            });
            return tempObject;
        });

        Promise.all([
            this.vm.feeService.partiallyUpdateObject(this.vm.feeService.fee_receipts, fee_receipt_object),
            // this.vm.feeService.partiallyUpdateObjectList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list),
            this.vm.feeService.partiallyUpdateObjectList(this.vm.feeService.student_fees, student_fee_list),
        ]).then(value => {

            alert('Fee Receipt is cancelled');

            this.vm.feeReceiptList.find(item => {
                return item.id == feeReceipt.id;
            }).cancelled = true;

            /*this.vm.subFeeReceiptList.filter(item => {
                return item.parentFeeReceipt == feeReceipt.id;
            }).forEach(item => {
                item.cancelled = true;
            });*/

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }

}
