
import {CreateSchoolComponent} from './create-school.component';

export class CreateSchoolServiceAdapter {

    vm: CreateSchoolComponent;

    constructor() {}

    initializeAdapter(vm: CreateSchoolComponent): void {
        this.vm = vm;
    }

    // Server Handling - 1
    public initializeData(): void {

        this.vm.isLoading = true;
        this.vm.schoolService.getObjectList(this.vm.schoolService.board,{}).then(value => {
            this.vm.boardList = value;
            this.vm.schoolProfile.parentBoard = this.vm.boardList[0].id;
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
        this.vm.schoolOldService.createSchoolProfile(data,this.vm.user.jwt).then(value => {
            console.log(value.message);
            let request_employee_data = this.prepareSchoolEmployeeData(value.id);
            let task_data = {
                'parentBoard__or': data.parentBoard,
                'parentBoard': 'null__korangle',
                'parentModule__parentBoard__or': data.parentBoard,
                'parentModule__parentBoard': 'null__korangle',
            };
            Promise.all([
                this.vm.employeeService.createEmployeeProfile(request_employee_data, this.vm.user.jwt),
                // this.vm.teamOldService.get_task_list(this.vm.user.jwt),
                this.vm.teamService.getObjectList(this.vm.teamService.task, task_data),
            ]).then(value => {
                console.log(value);
                let request_employee_permission_data = this.prepareEmployeePermissionData(value[0].id, value[1]);
                this.vm.employeeService.addEmployeePermissionList(request_employee_permission_data, this.vm.user.jwt).then(value => {
                    alert('School created successfully, Logout and login again to see changes');
                    this.vm.isLoading = false;
                }, error => {
                    this.vm.isLoading = false;
                });
            });
        });
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

    getPincodeDetails(): void {

        if (!this.vm.schoolProfile.pincode || this.vm.schoolProfile.pincode.toString().length != 6) {
            return;
        }

        this.vm.pincodeService.getDetailsFromPincode(this.vm.schoolProfile.pincode.toString()).then(pincodeList=> {
            if (pincodeList && pincodeList.length > 0) {

                this.vm.villageCityList = pincodeList.map(a => a.Name);

                this.vm.schoolProfile.villageCity = pincodeList[0].Name;
                this.vm.schoolProfile.block = pincodeList[0].Block;
                this.vm.schoolProfile.district = pincodeList[0].District;
                this.vm.schoolProfile.state = pincodeList[0].State;

            }
        }, error => {
            console.log("Error");
        });

    }

}