
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
        this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, {
            parentSchool: this.vm.user.activeSchool.dbId
        }).then(val => {
            console.log(val)
            this.vm.customParameterList = val
            this.vm.isLoading = false
        }, err => {
            this.vm.isLoading = false
        })
    }

    saveParameter(): void {
        this.vm.isLoading = true
        let promise = null;
        const data = {...this.vm.currentParameter, filterValues: JSON.stringify(this.vm.currentParameter.filterValues)}
        if (this.vm.currentParameter.id){
            promise = this.vm.studentService.updateObject(this.vm.studentService.student_parameter, data)
        }else {
            promise = this.vm.studentService.createObject(this.vm.studentService.student_parameter, data)
        }
        promise.then(val => {
            // Remove existing parameter
            this.vm.customParameterList = this.vm.customParameterList.filter(x => x.id!==val.id)
            // Push the updated value
            this.vm.customParameterList.push(val)
            // Set the currentParameter to updated value
            this.vm.setActiveParameter(val)
            this.vm.isLoading = false
        }, err => {
            this.vm.isLoading = false
        })
    }

    deleteParameter = () => {
        const parameter = this.vm.customParameterList.find(x => x.id===this.vm.currentParameter.id)
        if(confirm(`Delete the ${this.vm.currentParameter.name} parameter?`))
        this.vm.studentService.deleteObject(this.vm.studentService.student_parameter, parameter).then(val => {
            this.vm.customParameterList = this.vm.customParameterList.filter(x => x.id!==parameter.id)
            this.vm.currentParameter = null
        })
    }

}
