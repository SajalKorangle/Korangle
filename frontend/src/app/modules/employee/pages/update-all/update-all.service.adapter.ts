
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
        this.vm.employeeFullProfileList = value;
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
        // console.log(key);
        if (employee[key] != newValue) {
            // console.log('Prev Value: ' + student[key] + ', New Value: ' + newValue);
            // console.log('Type of prev: ' + typeof student[key] + ', Type of new: ' + typeof newValue);

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

            }else if (key == 'aadharNum') {
                if (newValue.toString().length!==12){
                    if (employee.aadharNum!=null) {
                        alert('Aadhar number should be 12 digits!');
                    }
                    (<HTMLInputElement> document.getElementById(employee.id.toString()+key.toString())).value=employee.aadharNum;
                    return;
                }else{
                    data['aadharNum'] = newValue;
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
