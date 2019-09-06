
import {CreateSchoolComponent} from './create-school.component';

export class CreateSchoolServiceAdapter {

    vm: CreateSchoolComponent;

    constructor() {}

    initializeAdapter(vm: CreateSchoolComponent): void {
        this.vm = vm;
    }

    // Server Handling - 1
    public getModuleList(): void {
        this.vm.isLoading = true;
        this.vm.teamService.getLatestModuleList(this.vm.user.jwt).then(moduleList => {
            this.vm.moduleList = moduleList;
            console.log(this.vm.moduleList);
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }

    // Server Handling - 2
    public createSchool(data: any): void {
        // alert('Functionality yet to be implemented');
        console.log(data);
        if (!data.name || data.name == "" || data.name.length > 15) {
            alert('Name length should be b/w 1 to 15 characters');
            return;
        }
        if (!data.parentBoard) {
            alert('Board should be populated');
            return;
        }
        if (!data.medium) {
            alert('Medium should be populated');
            return;
        }
        if (!data.printName) {
            data.printName = "-";
        }
        if (!data.diseCode) {
            data.diseCode = "-";
        }
        if (!data.registrationNumber) {
            data.registrationNumber = "-";
        }
        if (!data.address) {
            data.address = "-";
        }
        if (!data.affiliationNumber) {
            data.affiliationNumber = null;
        }
        data.mobileNumber = this.vm.user.username;
        data.primaryThemeColor = "green";
        data.secondaryThemeColor = "warning";
        data.complexFeeStructure = false;
        data.currentSession = 3;
        data.smsId = "KORNGL";
        if (data.printName && data.printName.length > 15) {
            data.headerSize = "BIG";
        } else {
            data.headerSize = "SMALL";
        }
        this.vm.isLoading = true;
        this.vm.schoolService.createSchoolProfile(data,this.vm.user.jwt).then(value => {
            console.log(value.message);
            let request_access_data = this.prepareSchoolAccessData(value.id);
            let request_employee_data = this.prepareSchoolEmployeeData(value.id);
            Promise.all([
                this.vm.teamService.create_school_access_batch(request_access_data, this.vm.user.jwt),
                this.vm.employeeService.createEmployeeProfile(request_employee_data, this.vm.user.jwt),
                this.vm.teamService.get_task_list(this.vm.user.jwt),
            ]).then(value => {
                console.log(value);
                let request_employee_permission_data = this.prepareEmployeePermissionData(value[1].id, value[2]);
                this.vm.employeeService.addEmployeePermissionList(request_employee_permission_data, this.vm.user.jwt).then(value => {
                    alert('School created successfully, Logout and login again to see changes');
                    this.vm.isLoading = false;
                }, error => {
                    this.vm.isLoading = false;
                });
            });
        });
    }

    prepareSchoolAccessData(schoolDbId: number): any {
        let data_list = [];
        this.vm.moduleList.forEach(module => {
            let tempData = {
                parentModule: module.id,
                parentSchool: schoolDbId,
            };
            data_list.push(tempData);
        });
        return data_list;
    }

    prepareSchoolEmployeeData(schoolDbId: number): any {
        let employee = {
            name: this.vm.user.first_name+" "+this.vm.user.last_name,
            fatherName: "-",
            mobileNumber: this.vm.user.username,
            parentSchool: schoolDbId,
            dateOfBirth: null,
            dateOfJoining: null,
            dateOfLeaving: null,
        };
        return employee;
    }

    prepareEmployeePermissionData(employeeId: number, taskList: any): any {
        let data_list = [];
        taskList.forEach(task => {
            let tempData = {
                parentEmployee: employeeId,
                parentTask: task.id,
            };
            data_list.push(tempData);
        });
        return data_list;
    }

}