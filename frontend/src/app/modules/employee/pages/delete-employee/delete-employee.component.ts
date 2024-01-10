import { Component, OnInit } from '@angular/core';
import { EmployeeOldService } from '../../../../services/modules/employee/employee-old.service';
import { EmployeeService } from '../../../../services/modules/employee/employee.service';
import { DataStorage } from '../../../../classes/data-storage';
import { DeleteEmployeeServiceAdapter } from './delete-employee.service.adapter';
import { AttendanceService } from '../../../../services/modules/attendance/attendance.service';
import { SalaryService } from '../../../../services/modules/salary/salary-service';
import { FeeService } from '../../../../services/modules/fees/fee.service';
import { SubjectService } from '../../../../services/modules/subject/subject.service';

@Component({
    selector: 'app-delete-employee',
    templateUrl: './delete-employee.component.html',
    styleUrls: ['./delete-employee.component.css'],
    providers: [EmployeeOldService, EmployeeService, FeeService, SalaryService, AttendanceService, SubjectService],
})
export class DeleteEmployeeComponent implements OnInit {
    user;

    isLoading = true;
    selectedEmployee = null;
    selectedEmployeeFeeReceiptList = null;
    selectedEmployeeDiscountList = null;
    selectedEmployeeClassSubjectList = null;
    selectedEmployeeIssuedBooks = 0;

    serviceAdapter: DeleteEmployeeServiceAdapter;

    constructor(
        public employeeOldService: EmployeeOldService,
        public employeeService: EmployeeService,
        public attendanceService: AttendanceService,
        public salaryService: SalaryService,
        public feeService: FeeService,
        public subjectService: SubjectService
    ) {}

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new DeleteEmployeeServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    isCurrentlyLoggedIn() {
        if (this.selectedEmployee.mobileNumber == this.user.username) {
            return true;
        }
        return false;
    }

    //this.isLoading will be true untill the search bar is loaded
    isLoadingDone(employeeList: any) {
        if (employeeList != null) {
            this.isLoading = false;
        }
    }
}
