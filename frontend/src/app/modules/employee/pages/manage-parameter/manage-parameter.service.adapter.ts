
import { ManageParameterComponent } from './manage-parameter.component';

export class ManageParameterServiceAdapter {

    vm: ManageParameterComponent;

    constructor() {}

    initializeAdapter(vm: ManageParameterComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {

        this.vm.isLoading = true;
        this.vm.employeeService.getObjectList(this.vm.employeeService.employee_parameter, {
            parentSchool: this.vm.user.activeSchool.dbId
        }).then(val => {
            this.vm.customParameterList = val;
            this.vm.isLoading = false;
        }, err => {
            this.vm.isLoading = false;
        })
    }

    saveParameter(): void {
        this.vm.isLoading = true;
        let service_list = [];
        const data = {...this.vm.currentParameter, filterValues: JSON.stringify(this.vm.currentParameter.filterValues)};
        if (this.vm.currentParameter.id) {
            service_list.push(this.vm.employeeService.updateObject(this.vm.employeeService.employee_parameter, data));
            if (this.vm.currentParameter.parameterType==this.vm.customParameterTypeList[1]) {
                this.vm.oldFilterValueList.filter(item => !this.vm.currentParameter.filterValues.includes(item)).forEach(item => {
                    service_list.push(this.vm.employeeService.deleteObjectList(this.vm.employeeService.employee_parameter_value, {
                        parentStudentParameter: this.vm.currentParameter.id,
                        value: item,
                    }));
                });
            }
        } else {
            service_list.push(this.vm.employeeService.createObject(this.vm.employeeService.employee_parameter, data));
        }
        Promise.all(service_list).then(val => {
            // Remove existing parameter
            this.vm.customParameterList = this.vm.customParameterList.filter(x => x.id!==val[0].id);
            // Push the updated value
            this.vm.customParameterList.push(val[0]);
            // Set the currentParameter to updated value
            this.vm.setActiveParameter(val[0]);
            this.vm.isLoading = false;
        }, err => {
            this.vm.isLoading = false;
        })
    }

    deleteParameter = () => {
        const parameter = this.vm.customParameterList.find(x => x.id === this.vm.currentParameter.id);
        if (!confirm(`Delete the ${this.vm.currentParameter.name} parameter?`)) {
            return;
        }
        this.vm.isLoading = true;
        this.vm.employeeService.deleteObject(this.vm.employeeService.employee_parameter, parameter).then(val => {
            this.vm.customParameterList = this.vm.customParameterList.filter(x => x.id !== parameter.id);
            this.vm.currentParameter = null;
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        })
    }

}
