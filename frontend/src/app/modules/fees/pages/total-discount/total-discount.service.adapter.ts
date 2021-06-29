import { TotalDiscountComponent } from './total-discount.component';

export class TotalDiscountServiceAdapter {
    vm: TotalDiscountComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: TotalDiscountComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isInitialLoading = true;

        let fee_type_list = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        let employee_list = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.fee_type, fee_type_list),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_list),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
        ]).then(
            (value) => {
                this.vm.feeTypeList = value[0];
                this.vm.employeeList = value[1];
                this.vm.classList = value[2];
                this.vm.sectionList = value[3];

                this.vm.isInitialLoading = false;
            },
            (error) => {
                this.vm.isInitialLoading = false;
            }
        );
    }

    // Get Fee Collection List
    getDiscountCollectionList(): void {
        this.vm.isLoading = true;

        let discount_list = {
            generationDateTime__gte: this.vm.startDate + ' 00:00:00+05:30',
            generationDateTime__lte: this.vm.endDate + ' 23:59:59+05:30',
            parentSchool: this.vm.user.activeSchool.dbId,
            cancelled: 'false__boolean',
        };

        let sub_discount_list = {
            parentDiscount__generationDateTime__gte: this.vm.startDate + ' 00:00:00+05:30',
            parentDiscount__generationDateTime__lte: this.vm.endDate + ' 23:59:59+05:30',
            parentDiscount__parentSchool: this.vm.user.activeSchool.dbId,
            parentDiscount__cancelled: 'false__boolean',
        };

        Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.discounts, discount_list),
            this.vm.feeService.getObjectList(this.vm.feeService.sub_discounts, sub_discount_list),
        ]).then(
            (value) => {
                this.vm.discountList = value[0].sort((a, b) => {
                    return b.discountNumber - a.discountNumber;
                });
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
}
