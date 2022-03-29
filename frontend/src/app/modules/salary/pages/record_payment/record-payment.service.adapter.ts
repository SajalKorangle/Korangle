import { RecordPaymentComponent } from './record-payment.component';

export class RecordPaymentServiceAdapter {
    vm: RecordPaymentComponent;

    constructor() {}

    initializeAdapter(vm: RecordPaymentComponent): void {
        this.vm = vm;
    }

    // Server Handling - 1
    public getEmployeeList(): void {
        let data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            isNonSalariedEmployee: false,
        };
        this.vm.isInitialLoading = true;
        this.vm.employeeService.getEmployeeMiniProfileList(data, this.vm.user.jwt).then(
            (employeeList) => {
                this.vm.employeeList = employeeList.filter((employee) => {
                    return employee.dateOfLeaving === null;
                });
                this.vm.isInitialLoading = false;
            },
            (error) => {
                this.vm.isInitialLoading = false;
            }
        );
    }

    // Server Handling - 2
    public getEmployeeRecord(): void {
        // Get the employee Payment list
        // Get the employee Salary list

        let request_payment_data = {
            parentEmployee: this.vm.selectedEmployee.id,
        };

        let request_payslip_data = {
            parentEmployee: this.vm.selectedEmployee.id,
        };

        this.vm.isLoading = true;
        Promise.all([
            this.vm.salaryService.getEmployeePayslips(request_payslip_data, this.vm.user.jwt),
            this.vm.salaryService.getEmployeePaymentList(request_payment_data, this.vm.user.jwt),
        ]).then(
            (value) => {
                console.log(value);
                this.prepareEmployeeRecord(value);
                this.vm.employeeDetails = {
                    parentEmployee: this.vm.selectedEmployee.id,
                    amount: null,
                    remark: null,
                };
                this.vm.number = 10;
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    prepareEmployeeRecord(value: any): void {
        this.vm.employeeRecordList = [];
        value[0].forEach((record) => {
            this.addToEmployeeRecordList(record);
        });
        value[1].forEach((record) => {
            this.addToEmployeeRecordList(record);
        });
        this.sortEmployeeRecordList();
    }

    addToEmployeeRecordList(record: any): void {
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
        this.vm.employeeRecordList.splice(0, 0, object);
    }

    deleteFromEmployeeRecordList(record: any): void {
        let recordIndex = 0;
        this.vm.employeeRecordList.every((item, index) => {
            if (item.id === record.id) {
                recordIndex = index;
                return false;
            }
            return true;
        });
        this.vm.employeeRecordList.splice(recordIndex, 1);
    }

    sortEmployeeRecordList(): void {
        this.vm.employeeRecordList.sort((a, b) => {
            return b.date.toString().localeCompare(a.date.toString());
        });
    }

    // Server Handling - 3
    generateEmployeePayment(): void {
        if (this.vm.employeeDetails.amount === null || this.vm.employeeDetails.amount === '' || this.vm.employeeDetails.amount === 0) {
            alert('Amount can not be null or zero.');
            return;
        }
        console.log(this.vm.employeeDetails);
        this.vm.isLoading = true;
        this.vm.salaryService.createEmployeePayment(this.vm.employeeDetails, this.vm.user.jwt).then(
            (value) => {
                console.log(value);
                alert(value.message);
                this.vm.employeeDetails = {
                    parentEmployee: this.vm.selectedEmployee.id,
                    amount: null,
                    remark: null,
                };
                this.addToEmployeeRecordList(value.employeePayment);
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    deleteEmployeePayment(record: any): void {
        let data = {
            id: record.id,
        };
        this.vm.isLoading = true;
        this.vm.salaryService.deleteEmployeePayment(data, this.vm.user.jwt).then(
            (value) => {
                alert(value);
                this.deleteFromEmployeeRecordList(record);
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }
}
