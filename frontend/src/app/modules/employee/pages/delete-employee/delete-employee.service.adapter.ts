import { DeleteEmployeeComponent } from './delete-employee.component';
import { Query } from '@services/generic/query';

export class DeleteEmployeeServiceAdapter {
    vm: DeleteEmployeeComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: DeleteEmployeeComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {}

    getEmployeeDetails(employee: any) {
        this.vm.isLoading = true;
        let request_employee_data = {
            id: employee.id,
        };
        let fee_receipt_data = {
            parentEmployee: employee.id,
            cancelled: 'false__boolean',
        };

        let discount_data = {
            parentEmployee: employee.id,
            cancelled: 'false__boolean',
        };
        let class_subject_data = {
            parentEmployee: employee.id,
            // If employee have to be deleted from session only
            // 'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };
        let issuedBooksQuery = new Query()
            .filter({
                parentEmployee: employee.id,
                depositTime: null
            })
            .setFields('id').getObjectList({ library_app: "BookIssueRecord" });
        Promise.all([
            this.vm.employeeService.getObject(this.vm.employeeService.employees, request_employee_data),
            this.vm.feeService.getObjectList(this.vm.feeService.fee_receipts, fee_receipt_data),
            this.vm.feeService.getObjectList(this.vm.feeService.discounts, discount_data),
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_data),
            issuedBooksQuery
        ]).then(
            (value) => {
                console.log(value);
                this.vm.selectedEmployee = value[0];
                this.vm.selectedEmployeeFeeReceiptList = value[1];
                this.vm.selectedEmployeeDiscountList = value[2];
                this.vm.selectedEmployeeClassSubjectList = value[3];
                this.vm.selectedEmployeeIssuedBooks = value[4].length;
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    deleteEmployee() {
        if (!confirm('Are you sure, you want to delete this employee')) {
            return;
        }
        console.log(this.vm.selectedEmployee);

        let delete_employee_data = {
            id: this.vm.selectedEmployee.id,
        };
        this.vm.employeeService.deleteObject(this.vm.employeeService.employees, delete_employee_data).then(
            (val) => {
                this.vm.selectedEmployee['deleted'] = true;
                alert('Employee has been deleted successfully');
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }
}
