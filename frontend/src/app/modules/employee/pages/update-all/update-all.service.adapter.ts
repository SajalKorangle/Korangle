
import {UpdateAllComponent} from './update-all.component';

export class UpdateAllServiceAdapter {

    vm: UpdateAllComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: UpdateAllComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {
        this.vm.isLoading = true;
        let employee_req_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
        };
        Promise.all([
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees,employee_req_data)
        ]).then(value => {
            // this.vm.employeeFullProfileList = value[0];
            this.initializeEmployeeFullProfileList(value[0]);
            console.log(this.vm.employeeFullProfileList);
            this.vm.isLoading = false;
        })
    }

    initializeEmployeeFullProfileList(value){
        this.vm.employeeFullProfileList = value.filter(employee=>{
            return employee.dateOfLeaving === null;
        });
        let serialnumber = 0;
        this.vm.employeeFullProfileList.forEach(employee=>{
            employee.serialNumber = ++serialnumber;
        })
    }

    updateEmloyeeField(key: any, employee: any, newValue: any, inputType: any): void {
        console.log(employee[key],newValue,inputType);
        let data = {
            'id': employee['id'],
        };
        data[key] = newValue;
        console.log(data);
        if (employee[key] != newValue) {

            if (key == 'mobileNumber') {
                if (newValue.toString().length!==10){
                    if (employee.mobileNumber!=null) {
                        alert('Mobile number should be 10 digits!');
                    }
                    (<HTMLInputElement> document.getElementById(employee.id.toString()+key.toString())).value=employee.mobileNumber;
                    return;
                }else{
                    data['mobileNumber'] = newValue;
                }

            }else if (key == 'aadharNumber') {
                if (newValue.toString().length!==12){
                    if (employee.aadharNumber!=null) {
                        alert('Aadhar number should be 12 digits!');
                    }
                    (<HTMLInputElement> document.getElementById(employee.id.toString()+key.toString())).value=employee.aadharNumber;
                    return;
                }else{
                    data['aadharNumber'] = newValue;
                }
            }else if (key == 'panNumber') {
                if (newValue.toString().length!==10){
                    if (employee.panNumber!=null) {
                        alert('Pan number should be 10 digits!');
                    }
                    (<HTMLInputElement> document.getElementById(employee.id.toString()+key.toString())).value=employee.panNumber;
                    return;
                }else{
                    data['panNumber'] = newValue;
                }
            }

            document.getElementById(key + employee.id).classList.add('updatingField');
            if (inputType === 'text' || inputType === 'number' || inputType === 'date') {
                (<HTMLInputElement>document.getElementById(employee.id + key)).disabled = true;
            } else if (inputType === 'list') {

            }

            this.vm.employeeService.partiallyUpdateObject(this.vm.employeeService.employees, data).then(
                response => {
                    console.log(response);
                    if (response!=null) {
                        employee[key] = newValue;
                        document.getElementById(key + employee.id).classList.remove('updatingField');
                        console.log(inputType);
                        if (inputType === 'text' || inputType === 'number' || inputType === 'date') {
                            (<HTMLInputElement>document.getElementById(employee.id + key)).disabled = false;
                        } else if (inputType === 'list') {

                        }
                    } else {
                        alert('Not able to update ' + key + ' for value: ' + newValue);
                    }
                }, error => {
                    alert('Server Error: Contact Admin');
                }
            );
        }
    }

}
