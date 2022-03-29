import { ViewRecordComponent } from './view-record.component';

export class ViewRecordServiceAdapter {
    vm: ViewRecordComponent;

    constructor() {}

    initializeAdapter(vm: ViewRecordComponent): void {
        this.vm = vm;
    }

    // Server Handling - 1
    public getEmployeeList(): void {
        let data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            isNonSalariedEmployee: false,
        };
        this.vm.isLoading = true;
        Promise.all([
            this.vm.employeeService.getEmployeeMiniProfileList(data, this.vm.user.jwt),
            this.vm.salaryService.getSchoolPayslips(data, this.vm.user.jwt),
            this.vm.salaryService.getSchoolEmployeePaymentList(data, this.vm.user.jwt),
        ]).then(
            (value) => {
                console.log(value);
                this.vm.employeeList = value[0].filter((employee) => {
                    return employee.dateOfLeaving === null;
                });
                this.vm.employeeList.forEach((employee) => {
                    employee['recordList'] = [];
                    employee['number'] = 5;
                });
                this.prepareSchoolRecord(value[1], value[2]);
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    prepareSchoolRecord(payslipList: any, paymentList: any): void {
        payslipList.forEach((record) => {
            this.vm.employeeList.every((employee) => {
                if (employee.id === record.parentEmployee) {
                    this.addToEmployeeRecordList(employee, record);
                    return false;
                }
                return true;
            });
        });
        paymentList.forEach((record) => {
            this.vm.employeeList.every((employee) => {
                if (employee.id === record.parentEmployee) {
                    this.addToEmployeeRecordList(employee, record);
                    return false;
                }
                return true;
            });
        });
        this.vm.employeeList.forEach((employee) => {
            this.sortEmployeeRecordList(employee);
        });
    }

    addToEmployeeRecordList(employee: any, record: any): void {
        let object = {};
        if (record.month) {
            object = {
                id: record.id,
                date: record.dateOfGeneration,
                remark: 'Salary of ' + record.month + '-' + record.year + (record.remark ? '\n' + record.remark : ''),
                amount: record.amount,
                type: 'payslip',
            };
        } else {
            object = {
                id: record.id,
                date: record.dateOfPayment,
                remark: record.remark,
                amount: record.amount,
                type: 'payment',
            };
        }
        employee.recordList.splice(0, 0, object);
    }

    sortEmployeeRecordList(employee: any): void {
        employee.recordList.sort((a, b) => {
            return b.date.toString().localeCompare(a.date.toString());
        });
    }
}
