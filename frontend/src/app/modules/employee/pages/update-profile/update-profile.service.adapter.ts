import {UpdateProfileComponent} from './update-profile.component'
import { toInteger } from 'lodash'

export class UpdateProfileServiceAdapter {
    vm: UpdateProfileComponent
    constructor () {}

    initializeAdapter (vm: UpdateProfileComponent) : void {
        this.vm = vm
    }

    initializeData (): void {
        console.log('init')
        this.vm.isLoading = true
        Promise.all([
            this.vm.employeeService.getObjectList(this.vm.employeeService.employee_parameter, {parentSchool: this.vm.user.activeSchool.dbId}),
        ]).then(value => {
            this.vm.employeeParameterList = value[0].map(x => ({...x, filterValues: JSON.parse(x.filterValues)}));
            console.log('different custom parameter')
            console.dir(this.vm.employeeParameterList)
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        })
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

    getEmployeeProfile(employee: any): void {

        const data = {
            id: employee.id,
        };

        const session_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentEmployee: employee.id,
        };

        this.vm.isLoading = true;
        Promise.all([
            this.vm.employeeService.getObject(this.vm.employeeService.employees,data),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employee_session_detail, session_data),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employee_parameter_value,{parentEmployee: employee.id,})
        ]).then(value => {
            console.dir(value[0])
            this.vm.selectedEmployeeProfile = value[0];
            Object.keys(this.vm.selectedEmployeeProfile).forEach(key => {
                this.vm.currentEmployeeProfile[key] = this.vm.selectedEmployeeProfile[key];

            });
            this.vm.selectedEmployeeSessionProfile = value[1];
            Object.keys(this.vm.selectedEmployeeSessionProfile).forEach(key => {
                this.vm.currentEmployeeSessionProfile[key] = this.vm.selectedEmployeeSessionProfile[key];
            });
                this.vm.employeeParameterValueList = value[2];
                this.vm.currentEmployeeParameterValueList = [];
                this.vm.employeeParameterValueList.forEach(item=>{
                    if (item.document_value){
                        let document_name = item.document_value.split("/")
                        document_name = document_name[document_name.length-1]
                        item.document_name = document_name
                    }
                });

                this.vm.employeeParameterValueList.forEach(item => {                 
                    let tempObject = {}
                    Object.keys(item).forEach(key => {
                        tempObject[key] = item[key];
                    });
                    this.vm.currentEmployeeParameterValueList.push(tempObject)
                });
                this.vm.isLoading = false;
            
        }, error => {
            this.vm.isLoading = false;
        });

    }

    updateEmployeeProfile(): void {

        if (this.vm.currentEmployeeProfile.name === undefined || this.vm.currentEmployeeProfile.name === '') {
            alert('Name should be populated');
            return;
        }

        if (this.vm.currentEmployeeProfile.fatherName === undefined || this.vm.currentEmployeeProfile.fatherName === '') {
            alert('Father\'s Name should be populated');
            return;
        }

        if (this.vm.currentEmployeeProfile.dateOfBirth === undefined || this.vm.currentEmployeeProfile.dateOfBirth === '') {
            this.vm.currentEmployeeProfile.dateOfBirth = null;
        }

        if (this.vm.currentEmployeeProfile.dateOfJoining === undefined || this.vm.currentEmployeeProfile.dateOfJoining === '') {
            this.vm.currentEmployeeProfile.dateOfJoining = null;
        }

        if (this.vm.currentEmployeeProfile.dateOfLeaving === undefined || this.vm.currentEmployeeProfile.dateOfLeaving === '') {
            this.vm.currentEmployeeProfile.dateOfLeaving = null;
        }

        if (this.vm.currentEmployeeProfile.mobileNumber === undefined || this.vm.currentEmployeeProfile.mobileNumber === '') {
            this.vm.currentEmployeeProfile.mobileNumber = null;
            alert('Mobile number is required.');
            return;
        } else if (this.vm.currentEmployeeProfile.mobileNumber.toString().length != 10) {
            alert('Mobile number should be 10 digits');
            return;
        } else {
            let selectedEmployee = null;
            this.vm.employeeList.forEach(employee => {
                if (employee.mobileNumber === this.vm.currentEmployeeProfile.mobileNumber
                    && employee.id !== this.vm.currentEmployeeProfile.id) {
                    selectedEmployee = employee;
                }
            });
            if (selectedEmployee) {
                alert('Mobile Number already exists in '+selectedEmployee.name+'\'s profile');
                return;
            }
        }

        if (this.vm.currentEmployeeProfile.aadharNumber != null
            && this.vm.currentEmployeeProfile.aadharNumber.toString().length != 12) {
            alert("Aadhar No. should be 12 digits");
            return;
        }
        const employee_form_data= new FormData()       
        const data = { ...this.vm.currentEmployeeProfile,content: JSON.stringify(this.vm.currentEmployeeProfile.content) };
        Object.keys(data).forEach(key => {
                if (key === 'profileImage' ) {
                    if(this.vm.currentEmployeeProfile.profileImage){
                        employee_form_data.append(key, this.dataURLtoFile(this.vm.currentEmployeeProfile.profileImage, 'profileImage.jpeg'));
                    }
                } else {
                    if (data[key]==this.vm.NULL_CONSTANT){
                        employee_form_data.append(key,"");
                    }
                    else{
                        employee_form_data.append(key,data[key]);
                    }
                }
            });  
        this.vm.isLoading = true;
        Promise.all([
            this.vm.employeeService.updateObject(this.vm.employeeService.employees,employee_form_data),
            (this.vm.currentEmployeeSessionProfile.id==null?
                this.vm.employeeService.createObject(this.vm.employeeService.employee_session_detail,this.vm.currentEmployeeSessionProfile[0])
                    :this.vm.employeeService.updateObject(this.vm.employeeService.employee_session_detail,this.vm.currentEmployeeSessionProfile[0])
            )
        ]).then(value => {
            this.vm.isLoading = false;
            console.log('e')
            console.log(value[0])
            this.vm.selectedEmployeeProfile.profileImage = value[0].profileImage;
            this.vm.currentEmployeeProfile.profileImage = value[0].profileImage;

        let generateList = [];
        let updateList = [];
        let service_list = [];
        this.vm.currentEmployeeParameterValueList.forEach(x => {
            x.parentEmployee = this.vm.currentEmployeeProfile.id;
        });
        this.vm.employeeParameterList.forEach(parameter => {
            console.log('parameter')
            console.dir(parameter)
            if (this.vm.checkCustomFieldChanged(parameter)) {
                let temp_obj = this.vm.currentEmployeeParameterValueList.find(x => x.parentEmployeeParameter === parameter.id);
                if (temp_obj){
                    const data = { ...temp_obj}
                    const form_data = new FormData();
                    Object.keys(data).forEach(key => {
                        if (data[key]){
                            if (key =="document_name"|| key=="document_size"){}
                            else if (key=='document_value'){
                                form_data.append(key,this.vm.dataURLtoFile(data[key],data['document_name']))
                                form_data.append('document_size',data['document_size'])
                            }
                            else {
                                form_data.append(key,data[key])   
                            }
                        }
                        else{
                            form_data.append(key,"")
                        } 
                    })
                    if (temp_obj.id) {
                        updateList.push(form_data)
                    } else if (!temp_obj.id) {
                        generateList.push(form_data)
                    }
                }
            }
        });
        
        if (generateList.length) {
            generateList.forEach(x => {
                service_list.push(this.vm.employeeService.createObject(this.vm.employeeService.employee_parameter_value,x))
            })
        }

        if (updateList.length) {
            updateList.forEach(x => {
                service_list.push(this.vm.employeeService.updateObject(this.vm.employeeService.employee_parameter_value,x))

            })
        }

        if(this.vm.deleteList.length){
            this.vm.deleteList.forEach(x =>{
                service_list.push(this.vm.employeeService.deleteObject(this.vm.employeeService.employee_parameter_value,{'id':x.id}))
            })
        }
            alert('Employee profile updated successfully');
            this.vm.selectedEmployeeProfile = this.vm.currentEmployeeProfile;
            this.vm.selectedEmployeeSessionProfile = this.vm.currentEmployeeSessionProfile;
        }, error => {
            this.vm.isLoading = false;
        });

    }

   
}