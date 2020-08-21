import {UpdateAllComponent} from './update-all.component'

export class UpdateAllServiceAdapter {
    vm: UpdateAllComponent

    constructor() {}

    initializeAdapter(vm: UpdateAllComponent): void {
        this.vm = vm;
    }

    initializeData(): void{
        const student_full_profile_request_data = {
            schoolDbId: this.vm.user.activeSchool.dbId,
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };
        const class_section_request_data = {
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.isLoading = true;
        Promise.all([
            this.vm.classService.getClassSectionList(class_section_request_data, this.vm.user.jwt),
            this.vm.studentOldService.getStudentFullProfileList(student_full_profile_request_data, this.vm.user.jwt),
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, {parentSchool: this.vm.user.activeSchool.dbId}),
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, {parentStudent__parentSchool: this.vm.user.activeSchool.dbId})
        ]).then(value => {
            this.vm.isLoading = false;
            this.vm.initializeClassSectionList(value[0]);
            this.vm.initializeStudentFullProfileList(value[1]);
            this.vm.studentParameterList = value[2].map(x => ({...x, filterValues: JSON.parse(x.filterValues)}));
            this.vm.studentParameterValueList = value[3]
        }, error => {
            this.vm.isLoading = false;
        });
    }

    updateParameterValue = (student, parameter, value) => {
        let promise = null;

        let student_parameter_value = this.vm.studentParameterValueList.find(x => x.parentStudent === student.dbId && x.parentStudentParameter === parameter.id);

        if (!student_parameter_value) {
            if (value !== this.vm.NULL_CONSTANT) {
                student_parameter_value = {parentStudentParameter: parameter.id, value: value, parentStudent: student.dbId};
                promise = this.vm.studentService.createObject(this.vm.studentService.student_parameter_value, student_parameter_value);
            } else {
                return;
            }
        } else if (student_parameter_value.value !== value) {
            student_parameter_value.value = value;
            promise = this.vm.studentService.updateObject(this.vm.studentService.student_parameter_value, student_parameter_value);
        } else {
            return;
        }

        document.getElementById(parameter.id + '-' + student.dbId).classList.add('updatingField');
        if (parameter.type === this.vm.parameter_type_list[0]) {
            (<HTMLInputElement>document.getElementById(student.dbId + '-' + parameter.id)).disabled = true;
        }

        promise.then(val => {

            this.vm.studentParameterValueList = this.vm.studentParameterValueList.filter(x => x.id !== val.id);
            this.vm.studentParameterValueList.push(val);

            document.getElementById(parameter.id + '-' + student.dbId).classList.remove('updatingField');
            if (parameter.type === this.vm.parameter_type_list[0]) {
                (<HTMLInputElement>document.getElementById(student.dbId + '-' + parameter.id)).disabled = false;
            }

        }, error => {
            alert('Failed to update value')
        })
    }

}
