
import { CancelFeeReceiptComponent } from './cancel-fee-receipt.component';

export class CancelFeeReceiptServiceAdapter {

    vm: CancelFeeReceiptComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: CancelFeeReceiptComponent): void {
        this.vm = vm;
    }

    copyObject(object: any): any {
        let tempObject = {};
        Object.keys(object).forEach(key => {
            tempObject[key] = object[key];
        });
        return tempObject;
    }

    //initialize data
    initializeData(): void {

        this.vm.isLoading = true;

        let employee_list = {
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.classService.getClassList(this.vm.user.jwt),
            this.vm.classService.getSectionList(this.vm.user.jwt),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_list),
        ]).then(value => {

            this.vm.classList = value[0];
            this.vm.sectionList = value[1];
            this.vm.employeeList = value[2];

            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        })
    }


    // Get Fee Receipt List
    getFeeReceiptList(): void {

        this.vm.isLoading = true;

        let fee_receipt_list = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'receiptNumber__or': this.vm.searchParameter,
            'checkNumber': this.vm.searchParameter,
        };

        let sub_fee_receipt_list = {
            'parentFeeReceipt__parentSchool': this.vm.user.activeSchool.dbId,
            'parentFeeReceipt__receiptNumber__or': this.vm.searchParameter,
            'parentFeeReceipt__checkNumber': this.vm.searchParameter,
        };

        Promise.all([
            this.vm.feeService.getList(this.vm.feeService.fee_receipts, fee_receipt_list),
            this.vm.feeService.getList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list),
        ]).then(value => {

            console.log(value);

            this.vm.feeReceiptList = value[0];
            this.vm.subFeeReceiptList = value[1];

            let service_list = [];

            let student_fee_list = {
                'id__in': [...new Set(value[1].filter(item => {
                    return !this.vm.studentFeeList.find(studentFee => {
                        return studentFee.id == item.parentStudentFee;
                    })
                }).map(item => item.parentStudentFee))],
            };

            if (student_fee_list.id__in.length != 0) {
                service_list.push(this.vm.feeService.getObjectList(this.vm.feeService.student_fees, student_fee_list));
            }

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

                    if (student_fee_list.id__in.length != 0) {
                        this.vm.studentFeeList = this.vm.studentFeeList.concat(value2[0]);
                        value2 = value2.slice(1);
                    }

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
                })

            } else {
                this.vm.isLoading = false;
            }

        }, error => {
            this.vm.isLoading = false;
        })

    }


    // Cancel Fee Receipt
    cancelFeeReceipt(feeReceipt: any): void {

        this.vm.isLoading = true;

        let fee_receipt_object = {
            'id': feeReceipt.id,
            'cancelled': true,
        };

        let sub_fee_receipt_list = this.vm.subFeeReceiptList.filter(subFeeReceipt => {
            return subFeeReceipt.parentFeeReceipt == feeReceipt.id;
        }).map(item => {
            return {
                'id': item.id,
                'cancelled': true,
            }
        });

        Promise.all([
            this.vm.feeService.partiallyUpdateObject(this.vm.feeService.fee_receipts, fee_receipt_object),
            this.vm.feeService.partiallyUpdateObjectList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list),
        ]).then(value => {

            alert('Fee Receipt is cancelled');

            this.vm.feeReceiptList.forEach(item => {
                item.cancelled = true;
            });

            this.vm.subFeeReceiptList.filter(item => {
                return item.parentFeeReceipt == feeReceipt.id;
            }).forEach(item => {
                item.cancelled = true;
            });

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }

}