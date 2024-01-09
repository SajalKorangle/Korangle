import { CancelDiscountComponent } from './cancel-discount.component';

export class CancelDiscountServiceAdapter {
    vm: CancelDiscountComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: CancelDiscountComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoading = true;

        let employee_list = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_list),
        ]).then(
            (value) => {
                this.vm.classList = value[0];
                this.vm.sectionList = value[1];
                this.vm.employeeList = value[2];

                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    // Get Discount List
    getDiscountList(): void {
        this.vm.isLoading = true;

        let discount_list = {
            parentSchool: this.vm.user.activeSchool.dbId,
            discountNumber: this.vm.searchParameter,
        };

        let sub_discount_list = {
            parentDiscount__parentSchool: this.vm.user.activeSchool.dbId,
            parentDiscount__discountNumber: this.vm.searchParameter,
        };

        Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.discounts, discount_list),
            this.vm.feeService.getObjectList(this.vm.feeService.sub_discounts, sub_discount_list),
        ]).then(
            (value) => {

                this.vm.discountList = value[0];
                this.vm.subDiscountList = value[1];

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
                                                return studentSection.parentSession == item && studentSection.parentStudent == item2;
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

                            this.vm.isLoading = false;
                        },
                        (error) => {
                            this.vm.isLoading = false;
                        }
                    );
                } else {
                    this.vm.isLoading = false;
                }
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    // Cancel Discount
    cancelDiscount(discount: any): void {
        this.vm.isLoading = true;

        let discount_object = {
            id: discount.id,
            cancelled: true,
        };

        Promise.all([
            this.vm.feeService.partiallyUpdateObject(this.vm.feeService.discounts, discount_object)
        ]).then(value => {
            alert('Discount is cancelled');

            this.vm.discountList.find((item) => {
                return item.id == discount.id;
            }).cancelled = true;

            this.vm.isLoading = false;
        });
    }
}
