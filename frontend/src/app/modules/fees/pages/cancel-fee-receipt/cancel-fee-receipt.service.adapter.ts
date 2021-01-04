
import { CancelFeeReceiptComponent } from './cancel-fee-receipt.component';
import {EmitterService} from '@services/emitter.service';
import moment = require('moment');

export class CancelFeeReceiptServiceAdapter {

    vm: CancelFeeReceiptComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: CancelFeeReceiptComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {

        this.vm.isLoading = true;

        let employee_list = {
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs,{}),
            this.vm.classService.getObjectList(this.vm.classService.division,{}),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_list),
        ]).then(value => {

            this.vm.classList = value[0];
            this.vm.sectionList = value[1];
            this.vm.employeeList = value[2];
            this.vm.searchBy=this.vm.searchFilterList[0];

            this.vm.isLoading = false;

            EmitterService.get('cancel-receipt').subscribe(feeReceipt => {
          this.cancelFeeReceipt(feeReceipt);
        });
        }, error => {
            this.vm.isLoading = false;
        })
    }


    // Get Fee Receipt List
    getFeeReceiptList(): void {

        this.vm.isLoading = true;
        let fee_receipt_list = {};
        let sub_fee_receipt_list = {};
        //common for all searchFilter
        fee_receipt_list['parentSchool'] = this.vm.user.activeSchool.dbId;
        sub_fee_receipt_list['parentFeeReceipt__parentSchool'] = this.vm.user.activeSchool.dbId;

        if (this.vm.searchBy === this.vm.searchFilterList[0]) {
            fee_receipt_list['receiptNumber__or'] = this.vm.searchParameter;
            fee_receipt_list['chequeNumber'] = this.vm.searchParameter;
            sub_fee_receipt_list['parentFeeReceipt__receiptNumber__or'] = this.vm.searchParameter;
            sub_fee_receipt_list['parentFeeReceipt__chequeNumber'] = this.vm.searchParameter;
        } else if (this.vm.searchBy === this.vm.searchFilterList[1]) {
            fee_receipt_list['parentStudent__name'] = this.vm.searchParameter;
            sub_fee_receipt_list['parentFeeReceipt__parentStudent__name'] = this.vm.searchParameter;
        } else if (this.vm.searchBy === this.vm.searchFilterList[2]) {
            fee_receipt_list['parentStudent__mobileNumber'] = this.vm.searchParameter;
            sub_fee_receipt_list['parentFeeReceipt__parentStudent__mobileNumber'] = this.vm.searchParameter;
        }



        Promise.all([
            this.vm.feeService.getList(this.vm.feeService.fee_receipts, fee_receipt_list),
            this.vm.feeService.getList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list),
        ]).then(value => {

            console.log(value);

            this.vm.feeReceiptList = value[0];
            this.vm.feeReceiptList.sort(function (a, b) {
                // @ts-ignore
                return new Date(b.generationDateTime) - new Date(a.generationDateTime);
            });

            this.vm.subFeeReceiptList = value[1];

            let service_list = [];

            let student_list = {
                'id__in': [...new Set(value[0].filter(item => {
                    return !this.vm.studentList.find(student => {
                        return student.id == item.parentStudent;
                    })
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
                        return item2.parentSession == item
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

                    console.log(value2);

                    if (student_list.id__in.length != 0) {
                        this.vm.studentList = this.vm.studentList.concat(value2[0]);
                        value2 = value2.slice(1);
                    }

                    value2.forEach(item => {
                        this.vm.studentSectionList = this.vm.studentSectionList.concat(item);
                    });

                    this.vm.isLoading = false;
                }, error => {
                    this.vm.isLoading = false;
                });

            } else {
                this.vm.isLoading = false;
            }

        }, error => {
            this.vm.isLoading = false;
        })
        this.vm.showReceipts=true;
    }


    // Cancel Fee Receipt
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
