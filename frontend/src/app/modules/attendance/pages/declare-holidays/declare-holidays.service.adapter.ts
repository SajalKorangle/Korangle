import { DeclareHolidaysComponent } from './declare-holidays.component';

export class DeclareHolidaysServiceAdapter {
    vm: DeclareHolidaysComponent;

    informationMessageType: any;

    constructor() {}
    // Data

    initializeAdapter(vm: DeclareHolidaysComponent): void {
        this.vm = vm;
    }

    initializeData(): void {
        this.vm.isLoading = true;

        let request_student_data = {
            schoolDbId: this.vm.user.activeSchool.dbId,
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };

        const request_employee_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            isNonSalariedEmployee: false,
        };

        Promise.all([
            this.vm.studentService.getClassSectionStudentList(request_student_data, this.vm.user.jwt),
            this.vm.employeeService.getEmployeeMiniProfileList(request_employee_data, this.vm.user.jwt),
        ]).then(
            (value) => {
                this.vm.initializeClassSectionStudentList(value[0]);
                this.vm.initializeEmployeeList(value[1]);
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    declareHoliday(): void {
        let student_data = this.vm.prepareStudentAttendanceStatusListData();
        let employee_data = this.vm.prepareEmployeeAttendanceStatusListData();

        if (student_data.length === 0 && employee_data.length === 0) {
            alert('Nothing to update');
            return;
        }

        this.vm.isLoading = true;
        Promise.all([
            //old services
            this.vm.attendanceService.recordStudentAttendance(student_data, this.vm.user.jwt),
            this.vm.attendanceService.recordEmployeeAttendance(employee_data, this.vm.user.jwt),
        ]).then(
            (response) => {
                this.vm.isLoading = false;
                alert('Holidays recorded successfully');
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    deleteAttendance(): void {
        if (!confirm('Are you sure, you want to delete all the attendance records for selected persons and dates')) {
            return;
        }

        let studentList = this.vm.getStudentIdList();
        let employeeList = this.vm.getEmployeeIdList();
        let service_list = [];

        if (studentList.length === 0 && employeeList.length === 0) {
            alert('Nothing to delete');
            return;
        }

        this.vm.isLoading = true;
        if (studentList.length != 0) {
            let student_data = {
                parentStudent__in: studentList,
                dateOfAttendance__gte: this.vm.startDate,
                dateOfAttendance__lte: this.vm.endDate,
            };

            //new attendance service
            service_list.push(this.vm.attendanceService2.deleteObjectList(this.vm.attendanceService2.student_attendance, student_data));
        }

        if (employeeList.length != 0) {
            let employee_data = {
                parentEmployee__in: employeeList,
                dateOfAttendance__gte: this.vm.startDate,
                dateOfAttendance__lte: this.vm.endDate,
            };

            //new attendance service
            service_list.push(this.vm.attendanceService2.deleteObjectList(this.vm.attendanceService2.employee_attendance, employee_data));
        }

        Promise.all(service_list).then(
            (value) => {
                this.vm.isLoading = false;
                alert('All records for the selected dates are deleted');
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }
}
