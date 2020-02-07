
import { ViewPaymentComponent } from './view-payment.component';

export class ViewPaymentServiceAdapter {

    vm: ViewPaymentComponent;

    constructor() {}

    initializeAdapter(vm: ViewPaymentComponent): void {
        this.vm = vm;
    }

    // Server Handling - 1
    /*public getEmployeeList(): void {
        let data =  {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        this.vm.isInitialLoading = true;
        this.vm.employeeService.getEmployeeMiniProfileList(data, this.vm.user.jwt).then(employeeList => {
            this.vm.employeeList = employeeList;
            this.vm.isInitialLoading = false;
        }, error => {
            this.vm.isInitialLoading = false;
        });
    }*/

    // Server Handling - 2
    public getEmployeeRecord(): void {
        // Get the employee Payment list
        // Get the employee Salary list

        let request_payment_data = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
        };

        let request_payslip_data = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
        };

        this.vm.isLoading = true;
        Promise.all([
            this.vm.salaryService.getEmployeePayslips(request_payslip_data, this.vm.user.jwt),
            this.vm.salaryService.getEmployeePaymentList(request_payment_data, this.vm.user.jwt),
        ]).then(value => {
            console.log(value);
            this.prepareEmployeeRecord(value);
            this.vm.number = 10;
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }

    prepareEmployeeRecord(value: any): void {
        this.vm.recordList = [];
        value[0].forEach(record => {
            this.addToEmployeeRecordList(record);
        });
        value[1].forEach(record => {
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
                remark: 'Salary of ' + record.month + '-' + record.year + (record.remark?'\n' + record.remark:'') ,
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
        this.vm.recordList.splice(0,0,object);
    }

    sortEmployeeRecordList(): void {
        this.vm.recordList.sort((a,b) => {
            return b.date.toString().localeCompare(a.date.toString());
        });
    }

}