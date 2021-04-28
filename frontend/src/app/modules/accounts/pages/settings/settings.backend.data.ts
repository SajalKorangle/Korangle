export class SettingsBackendData{
    employeeList: Array<any> = [];
    employeeAmountPermissionList: Array<any> = [];

    getEmployeePermission(employee: any): void {
        return this.employeeAmountPermissionList.find(ep => ep.parentEmployee == employee.id);
    }

    getEmployee(id: number) {
        return this.employeeList.find(e => e.id == id);
    }
}