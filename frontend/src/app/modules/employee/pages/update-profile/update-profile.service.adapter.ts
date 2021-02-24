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

    updateProfile(): void {
        
        this.vm.isLoading = true;
        let service_list = [];
        
        const employee_form_data= new FormData()
        const data = { ...this.vm.currentEmployee,content: JSON.stringify(this.vm.currentEmployee.content) };
        console.log(data)
        Object.keys(data).forEach(key => {
                if (key === 'profileImage') {
                    if(this.vm.profileImage!==null){
                    	employee_form_data.append(key, this.dataURLtoFile(this.vm.profileImage, 'profileImage.jpeg'));
                    }
                }
                else {
                    if (data[key]==null){
                        employee_form_data.append(key,"");
                    }
                    else{
                        employee_form_data.append(key,data[key]);
                    }
                }
            });

        //service_list.push(this.vm.employeeService.updateObject(this.vm.employeeService.employee,Employee_form_data));

       

        let generateList = [];
        let updateList = [];
        this.vm.currentEmployeeParameterValueList.forEach(x => {
            x.parentEmployee = this.vm.selectedEmployee.id;
        });
        this.vm.employeeParameterList.forEach(parameter => {
            if (this.vm.checkCustomFieldChanged(parameter)) {
                let temp_obj = this.vm.currentEmployeeParameterValueList.find(x => x.parentEmployeeParameter === parameter.id);
                if (temp_obj){
                    const data = { ...temp_obj}
                    const form_data = new FormData();
                    Object.keys(data).forEach(key => {
                        if (data[key]){
                            if (key =="document_name"|| key=="document_size"){}
                            else if (key=='document_value'){
                                form_data.append(key,this.dataURLtoFile(data[key],data['document_name']))
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

        Promise.all(service_list).then(value =>{
            Object.keys(value[0]).forEach(key =>{
                this.vm.selectedEmployee[key] = value[0][key];
            });
           
            
            this.vm.currentEmployeeParameterValueList = [];
            this.vm.employeeParameterValueList.filter(x => x.parentEmployee === this.vm.currentEmployee.id).forEach(item => {
                this.vm.currentEmployeeParameterValueList.push(this.vm.commonFunctions.copyObject(item))
            });
            
            this.vm.deleteList=[]
            this.vm.profileImage=null;
            alert('Employee: ' + this.vm.selectedEmployee.name + ' updated successfully');
            this.vm.isLoading = false;

        },error => {
            this.vm.profileImage=null;
            this.vm.isLoading = false;
        });
    }

    getEmployeeProfile(employeeId : any): void {
        this.vm.isLoading = true;
        let service_list = [];
        service_list.push(this.vm.employeeService.getObject(this.vm.employeeService.employees, {
            'id': employeeId,
        }));
        service_list.push(this.vm.employeeService.getObjectList(this.vm.employeeService.employee_parameter_value, {
            parentemployee: employeeId,
        }));
        Promise.all(service_list).then(value => {

            this.vm.currentEmployee = this.vm.commonFunctions.copyObject(value[0]);
            Object.keys(value[0]).forEach(key => {
                this.vm.selectedEmployee[key] = value[0][key];
            });

            // Copying the employee parameter values for reference
            this.vm.employeeParameterValueList = value[1];
            this.vm.currentEmployeeParameterValueList = [];
            this.vm.employeeParameterValueList.filter(x => x.parentemployee===employeeId).forEach(item=>{
                if (item.document_value){
                    let document_name = item.document_value.split("/")
                    document_name = document_name[document_name.length-1]
                    item.document_name = document_name
                }
            });

            console.log(this.vm.employeeParameterValueList)
            this.vm.employeeParameterValueList.filter(x => x.parentEmployee===employeeId).forEach(item => {
                this.vm.currentEmployeeParameterValueList.push(this.vm.commonFunctions.copyObject(item))
            });
            this.vm.isLoading = false;
        });
    }
}