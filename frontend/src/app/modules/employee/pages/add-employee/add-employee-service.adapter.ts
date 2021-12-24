
import { AddEmployeeComponent } from './add-employee.component';

export class AddEmployeeServiceAdapter {

    vm: AddEmployeeComponent;

    constructor() {}

    initializeAdapter(vm: AddEmployeeComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {

        this.vm.isLoading = true;
        this.vm.newEmployee = {};
        this.vm.newEmployeeSessionDetail = {};
        let data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            'fields__korangle': 'id,name,mobileNumber,employeeNumber,dataOfLeaving',
        };


        let module_data = {
            'parentBoard__or': this.vm.user.activeSchool.parentBoard,
            'parentBoard': 'null__korangle',
        };

        let task_data = {
            'parentBoard__or': this.vm.user.activeSchool.parentBoard,
            'parentBoard': 'null__korangle',
            'parentModule__parentBoard__or': this.vm.user.activeSchool.parentBoard,
            'parentModule__parentBoard': 'null__korangle',
        };

        Promise.all([
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, data),
            this.vm.teamService.getObjectList(this.vm.teamService.module, module_data),
            this.vm.teamService.getObjectList(this.vm.teamService.task, task_data),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employee_parameter, {parentSchool: this.vm.user.activeSchool.dbId}),
        ]).then(value => {
            console.log(value[0]);
            this.vm.employeeList = value[0];
            this.vm.employeeParameterList = value[3].map(x => ({...x, filterValues: JSON.parse(x.filterValues)}));
            this.vm.initializeModuleList(value[1], value[2]);

            for(let i = 0; i < this.vm.employeeParameterList.length; i++) {
                if(this.vm.employeeParameterList[i].parameterType == "DOCUMENT") {
                    this.vm.showToolTip.push(false);
                    this.vm.height.push(120);
                }
            }
            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }

    isSelected(task: any) {
        if (task.selected) {
            return task.id;
        }
    }

    grantAll() {
        this.vm.moduleList.forEach(module => {
            module.taskList.forEach(task => {
                task.selected = true;
            });
        });
    }


    createNewEmployee(): void {

        console.log("CREATE NEW EMPLOYEE CALLED");

        if (this.vm.newEmployee.name === undefined || this.vm.newEmployee.name === '') {
            alert('Name should be populated');
            return;
        }

        if (this.vm.newEmployee.fatherName === undefined || this.vm.newEmployee.fatherName === '') {
            alert('Father\'s Name should be populated');
            return;
        }

        if (this.vm.newEmployee.dateOfBirth === undefined || this.vm.newEmployee.dateOfBirth === '') {
            this.vm.newEmployee.dateOfBirth = null;
        }

        if (this.vm.newEmployee.dateOfJoining === undefined || this.vm.newEmployee.dateOfJoining === '') {
            this.vm.newEmployee.dateOfJoining = null;
        }

        if (this.vm.newEmployee.dateOfLeaving === undefined || this.vm.newEmployee.dateOfLeaving === '') {
            this.vm.newEmployee.dateOfLeaving = null;
        }

        if (this.vm.newEmployee.mobileNumber === undefined || this.vm.newEmployee.mobileNumber === '') {
            this.vm.newEmployee.mobileNumber = null;
            alert('Mobile number is required');
            return;
        } else if (this.vm.newEmployee.mobileNumber.toString().length != 10) {
            alert('Mobile number should be of 10 digits');
            return;
        } else {
            let selectedEmployee = null;
            this.vm.employeeList.forEach(employee => {
                if (employee.mobileNumber === this.vm.newEmployee.mobileNumber) {
                    selectedEmployee = employee;
                }
            });
            if (selectedEmployee) {
                alert('Mobile Number already exists in ' + selectedEmployee.name + '\'s profile');
                return;
            }
        }

        if (this.vm.newEmployee.aadharNumber != null
            && this.vm.newEmployee.aadharNumber.toString().length != 12) {
            alert("Aadhar No. should be 12 digits");
            return;
        }

        this.vm.newEmployee.parentSchool = this.vm.user.activeSchool.dbId;

        this.vm.isLoading = true;

        console.log(this.vm.newEmployee);
        this.vm.employeeService.createObject(this.vm.employeeService.employees, this.vm.newEmployee).then(response => {
                let post_data = {
                    parentEmployee: response.id,
                    parentSession: this.vm.user.activeSchool.currentSessionDbId,
                    paidLeaveNumber: this.vm.newEmployeeSessionDetail.paidLeaveNumber,
                };
                this.vm.employeeService.createObject(this.vm.employeeService.employee_session_detail, post_data).then(res => {
                    console.log(response);
                    let data = [];
                    this.vm.moduleList.forEach(module => {
                        module.taskList.forEach(task => {
                            if (task.selected) {
                                data.push({
                                    'parentEmployee': response.id,
                                    'parentTask': task.id,
                                });
                            }
                        });
                    });
                    this.vm.employeeService.createObjectList(this.vm.employeeService.employee_permissions, data).then(value => {
                        this.vm.moduleList.forEach(module => {
                            module.taskList.forEach(task => {
                                task.selected = false;
                            });
                        });

                        this.vm.currentEmployeeParameterValueList = this.vm.currentEmployeeParameterValueList.filter(x => {
                            return x.value !== null;
                        });
                        this.vm.currentEmployeeParameterValueList.forEach(x => {
                            x.parentEmployee = response.id;
                        });

                        let form_data_list = [];
                        this.vm.employeeParameterList.forEach(parameter => {
                            console.log('into the parameter');
                            console.dir(parameter);
                            console.log('end');
                            let temp_obj = this.vm.currentEmployeeParameterValueList.find(x => x.parentEmployeeParameter === parameter.id);
                            if (temp_obj) {
                                const data = { ...temp_obj};
                                const form_data = new FormData();
                                 Object.keys(data).forEach(key => {
                                     if (data[key]) {
                                         if (key == "document_name" || key == "document_size") {}
                                         else if (key == 'document_value') {
                                             form_data.append(key, this.dataURLtoFile(data[key], data['document_name']));
                                             form_data.append('document_size', data['document_size']);
                                            }
                                        else {
                                            form_data.append(key, data[key]);
                                        }
                                    }
                                });
                                form_data_list.push(form_data);
                            }
                        });

                        console.dir(form_data_list);
                        form_data_list.forEach(x => {
                            this.vm.employeeService.createObject(this.vm.employeeService.employee_parameter_value, x);
                        });

                        this.vm.isLoading = false;
                        alert('Employee Profile Created Successfully');
                        this.vm.newEmployee = {};
                        this.vm.newEmployeeSessionDetail = {};
                        this.vm.currentEmployeeParameterValueList = [];

                    });
                });
            }, error => {
                this.vm.isLoading = false;
                alert('Server Error: Contact admin');
            }
        );
    }


    dataURLtoFile(dataurl, filename) {
        try {
            const arr = dataurl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new File([u8arr], filename, {type: mime});
        } catch (e) {
            return null;
        }
    }



}
