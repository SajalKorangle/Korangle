import {ViewAllComponent} from './view-all.component'
import {CommonFunctions} from '@classes/common-functions';

export class ViewAllServiceAdapter {
    vm: ViewAllComponent

    constructor () {}

    initializeAdapter (vm: ViewAllComponent): void {
        this.vm = vm
    }

    initializeData (): void {
        let data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
        };


        const employee_parameter_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const employee_parameter_value_data = {
            parentEmployee__parentSchool: this.vm.user.activeSchool.dbId,
        };


        Promise.all([
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, data),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employee_parameter, employee_parameter_data),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employee_parameter_value, employee_parameter_value_data),
        ]).then(value => {
            this.vm.employeeProfileList = value[0].filter(employee => {
                return employee.dateOfLeaving === null;
            });
            this.vm.initializeEmployeeProfileList(this.vm.employeeProfileList);
            console.dir(this.vm.employeeProfileList)
            this.vm.employeeParameterList = value[1].map(x =>
                ({
                    ...x,
                    filterValues: JSON.parse(x.filterValues).map(x2 => ({name: x2, show: false})), showNone: false, filterFilterValues: ''
                })
            );
            this.vm.employeeParameterValueList = value[2];
            this.vm.employeeParameterDocumentList = this.vm.employeeParameterList.filter(x => x.parameterType == 'DOCUMENT');
            this.vm.employeeParameterOtherList = this.vm.employeeParameterList.filter(x => x.parameterType !== 'DOCUMENT');
            
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }
}
