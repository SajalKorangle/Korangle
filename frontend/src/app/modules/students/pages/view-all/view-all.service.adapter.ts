import {ViewAllComponent} from './view-all.component'

export class ViewAllServiceAdapter {
    vm: ViewAllComponent

    constructor () {}

    initializeAdapter (vm: ViewAllComponent): void {
        this.vm = vm
    }

    initializeData (): void {
        this.vm.isLoading = true;
        const student_full_profile_request_data = {
            schoolDbId: this.vm.user.activeSchool.dbId,
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };

        const class_section_request_data = {
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };

        const student_parameter_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const student_parameter_value_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
        };

        const bus_stop_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs,{}),
            this.vm.classService.getObjectList(this.vm.classService.division,{}),
            this.vm.studentOldService.getStudentFullProfileList(student_full_profile_request_data, this.vm.user.jwt),
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, student_parameter_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, student_parameter_value_data),
            this.vm.schoolService.getObjectList(this.vm.schoolService.bus_stop, bus_stop_data),
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {})
        ]).then(value => {
            value[0].forEach(classs => {
                classs.sectionList = value[1];
            });
            this.vm.initializeClassSectionList(value[0]);
            this.vm.initializeStudentFullProfileList(value[2]);
            this.vm.studentParameterList = value[3].map(x =>
                ({
                    ...x,
                    filterValues: JSON.parse(x.filterValues).map(x2 => ({name: x2, show: false})), showNone: false, filterFilterValues: ''
                })
            );
            this.vm.studentParameterValueList = value[4];
            this.vm.busStopList = value[5];
            this.vm.session_list = value[6];
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }
}
