import { UpdateAllComponent } from './update-all.component';

export class UpdateAllServiceAdapter {
    vm: UpdateAllComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: UpdateAllComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {
        this.vm.isLoading = true;
        let employee_req_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        Promise.all([
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_req_data),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employee_parameter, { parentSchool: this.vm.user.activeSchool.dbId }),
            this.vm.employeeService.getObjectList(
                this.vm.employeeService.employee_parameter_value,
                { parentEmployee__parentSchool: this.vm.user.activeSchool.dbId }
            )
        ]).then(value => {
            // this.vm.employeeFullProfileList = value[0];
            this.initializeEmployeeFullProfileList(value[0]);
            console.log(this.vm.employeeFullProfileList);

            this.vm.employeeParameterList = value[1].map(x => ({ ...x, filterValues: JSON.parse(x.filterValues) }));
            this.vm.employeeParameterValueList = value[2];
            console.log('employee parameter list');
            console.dir(this.vm.employeeParameterList);
            console.log('employee parametter value list');
            console.log(this.vm.employeeParameterValueList);
            this.vm.isLoading = false;
        });
    }

    initializeEmployeeFullProfileList(value) {
        this.vm.employeeFullProfileList = value.filter((employee) => {
            return employee.dateOfLeaving === null;
        });
        let serialnumber = 0;
        this.vm.employeeFullProfileList.forEach((employee) => {
            employee.serialNumber = ++serialnumber;
        });
    }

    updateEmloyeeField(columnName: any, key: any, employee: any, newValue: any, inputType: any): void {
        let data = {
            id: employee['id'],
        };
        if (newValue != null && newValue.toString().trim() == '') {
            newValue = null;
        }
        if (newValue != null && this.vm.checkOnlyUppercaseFields(key)) { // to check in-case is some of the characters are lower case
            newValue = newValue.toString().toUpperCase(); // update them to upperCase
        }
        if (inputType == 'date' && newValue == null) {
            (<HTMLInputElement>document.getElementById(employee.id.toString() + key.toString())).value = '';
        }
        data[key] = newValue;
        if (employee[key] != newValue) {
            if (key == 'mobileNumber') {
                if (newValue == null || newValue.toString().length !== 10) {
                    alert('Mobile number should be 10 digits!');
                    (<HTMLInputElement>document.getElementById(employee.id.toString() + key.toString())).value = employee.mobileNumber;
                    return;
                }
            } else if (key == 'aadharNumber') {
                if (newValue != null && newValue.toString().length !== 12) {
                    alert('Aadhar number should be 12 digits!');
                    (<HTMLInputElement>document.getElementById(employee.id.toString() + key.toString())).value = employee.aadharNumber;
                    return;
                }
            } else if (key == 'panNumber') {
                if (newValue != null && newValue.toString().length !== 10) {
                    alert('Pan number should be 10 characters!');
                    (<HTMLInputElement>document.getElementById(employee.id.toString() + key.toString())).value = employee.panNumber;
                    return;
                }
            }  else if (key == 'pranNumber') {
                if (newValue != null && newValue.toString().length !== 12) {
                    alert('PRAN number should be 12 digits!');
                    (<HTMLInputElement>document.getElementById(employee.id.toString() + key.toString())).value = employee.pranNumber;
                    return;
                }
            } else if (key == 'bankIfscCode') {
                if (newValue != null && newValue.toString().length !== 11) {
                    alert('Bank IFSC Code should be 11 characters!');
                    (<HTMLInputElement>document.getElementById(employee.id.toString() + key.toString())).value = employee.bankIfscCode;
                    return;
                }
            } else if (key == 'fatherName') {
                if (newValue == null || newValue.trim() == "") {
                    alert('Father Name Cannot be Empty');
                    (<HTMLInputElement>document.getElementById(employee.id.toString() + key.toString())).value = employee.fatherName;
                    return;
                }
            } else if (key == 'name') {
                if (newValue == null || newValue.trim() == "") {
                    alert('Employee Name Cannot be Empty');
                    (<HTMLInputElement>document.getElementById(employee.id.toString() + key.toString())).value = employee.name;
                    return;
                }
            }else if (key == 'monthlySalary') {
                if (newValue != null && newValue > 2147483647) {
                    alert('Checkout the Monthly salary is greater than 9 digits');
                    (<HTMLInputElement>document.getElementById(employee.id.toString() + key.toString())).value = employee.monthlySalary;
                    return;
                }
            }

            if (newValue !== null && newValue.toString().trim() !== '') {
                if (key == 'aadharNumber' || key == 'mobileNumber' || key == 'panNumber' || key == 'employeeNumber'
                    || key == 'passportNumber' || key == 'bankAccountNumber' || key == 'epfAccountNumber' || key == 'pranNumber') {
                    let employeeWithSameValue = this.vm.employeeFullProfileList.find(emp => emp.id != employee.id && emp[key] ==
                        newValue.toString());
                    if (employeeWithSameValue) {
                        alert(columnName + ' already exists in ' + employeeWithSameValue.name + '\'s profile');
                        (<HTMLInputElement>document.getElementById(employee.id.toString() + key.toString())).value = employee[key];
                        return;
                    }
                }
            }

            document.getElementById(key + employee.id).classList.add('updatingField');
            if (inputType === 'text' || inputType === 'number' || inputType === 'date') {
                (<HTMLInputElement>document.getElementById(employee.id + key)).disabled = true;
            } else if (inputType === 'list') {
            }

            this.vm.employeeService.partiallyUpdateObject(this.vm.employeeService.employees, data).then(
                (response) => {
                    console.log(response);
                    if (response != null) {
                        employee[key] = newValue;
                        console.log(inputType);
                    } else {
                        alert('Not able to update ' + columnName + ' for value: ' + newValue);
                        (<HTMLInputElement>document.getElementById(employee.id.toString() + key.toString())).value = employee[key];
                    }
                    if (inputType === 'text' || inputType === 'number' || inputType === 'date') {
                        (<HTMLInputElement>document.getElementById(employee.id + key)).disabled = false;
                    } else if (inputType === 'list') {
                    }
                    document.getElementById(key + employee.id).classList.remove('updatingField');
                },
                (error) => {
                    alert('Server Error: Contact Admin');
                }
            );
        }
    }


    updateParameterValue = (employee, parameter, value) => {
        let promise = null;

        let employee_parameter_value = this.vm.employeeParameterValueList.find(x =>
            x.parentEmployee === employee.id && x.parentEmployeeParameter === parameter.id
        );

        if (!employee_parameter_value) {
            if (value !== this.vm.NULL_CONSTANT) {
                employee_parameter_value = { parentEmployeeParameter: parameter.id, value: value, parentEmployee: employee.id };
                promise = this.vm.employeeService.createObject(this.vm.employeeService.employee_parameter_value, employee_parameter_value);
            } else {
                return;
            }
        } else if (employee_parameter_value.value !== value) {
            employee_parameter_value.value = value;
            promise = this.vm.employeeService.updateObject(this.vm.employeeService.employee_parameter_value, employee_parameter_value);
        } else {
            return;
        }

        document.getElementById(parameter.id + '-' + employee.id).classList.add('updatingField');
        if (parameter.type === this.vm.parameter_type_list[0]) {
            (<HTMLInputElement>document.getElementById(employee.id + '-' + parameter.id)).disabled = true;
        }

        promise.then(val => {

            this.vm.employeeParameterValueList = this.vm.employeeParameterValueList.filter(x => x.id !== val.id);
            this.vm.employeeParameterValueList.push(val);

            document.getElementById(parameter.id + '-' + employee.id).classList.remove('updatingField');
            if (parameter.type === this.vm.parameter_type_list[0]) {
                (<HTMLInputElement>document.getElementById(employee.id + '-' + parameter.id)).disabled = false;
            }
            console.log('field updaetd');
            console.log(val);

        }, error => {
            alert('Failed to update value');
        });
    }

    check_document(value): boolean {
        let type = value.type;
        if (type !== 'image/jpeg' && type !== 'image/jpg' && type !== 'image/png' && type != 'application/pdf') {
            alert('Uploaded File should be either in jpg,jpeg,png or in pdf format');
            return false;
        }
        else {
            if (value.size / 1000000.0 > 5) {
                alert("File size should not exceed 5MB");
                return false;
            }
            else {
                return true;
            }
        }
    }

    updateParameterDocumentValue = (employee, parameter, value) => {
        let promise = null;
        console.log(value.target.files);
        let check = this.check_document(value.target.files[0]);
        if (check == true) {
            let text = document.getElementById(employee.id + '-' + parameter.id + '-text');
            text.innerHTML = "Updating...";
            let icon = document.getElementById(employee.id + '-' + parameter.id + '-icon');
            let employee_parameter_document_value = this.vm.employeeParameterValueList.find(x =>
                x.parentEmployee === employee.id && x.parentEmployeeParameter === parameter.id);
            let data = new FormData();
            data.append("parentEmployeeParameter", parameter.id);
            data.append("parentEmployee", employee.id);
            data.append("document_value", value.target.files[0]);
            data.append("document_size", value.target.files[0].size);
            if (!employee_parameter_document_value) {
                promise = this.vm.employeeService.createObject(this.vm.employeeService.employee_parameter_value, data);
            }
            else {
                data.append("id", employee_parameter_document_value.id);
                promise = this.vm.employeeService.updateObject(this.vm.employeeService.employee_parameter_value, data);
            }
            promise.then(val => {
                if (val) {
                    this.vm.employeeParameterValueList = this.vm.employeeParameterValueList.filter(x => x.id !== val.id);
                    this.vm.employeeParameterValueList.push(val);
                    document.getElementById(parameter.id + '-' + employee.id).classList.remove('updatingField');
                    text.innerHTML = "";
                }
                else {
                    text.innerHTML = "";
                }
            }, error => {
                alert('Failed to update value');
                text.innerHTML = "";
            });
        }
        else {
            document.getElementById(employee.id + '-' + parameter.id + '-text').innerHTML = '';
        }
    }

}
