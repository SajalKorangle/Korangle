import { ClassroomComponent } from './classroom.component';

export class ClassroomServiceAdapter {

    vm: ClassroomComponent;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
    }

    async initializeData() {
        this.vm.isLoading = true;

        const class_subject_request = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            fields__korangle: ['parentClass', 'parentDivision']
        };

        const response = await Promise.all([
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_request),
            this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.online_class, {}),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
        ]);

        this.vm.backendData.classDivisionPermissions = response[0];
        this.vm.backendData.classList = response[2];
        this.vm.backendData.divisionList = response[3];

        this.vm.backendData.onlineClassList = response[1].filter(onlineClass => {
            return this.vm.backendData.classDivisionPermissions.find(classDivision => classDivision.parentClass == onlineClass.parentClass
                && classDivision.parentDivision == onlineClass.parentDivision) != undefined;
        }).map(onlineClass => { return { ...onlineClass, configJSON: JSON.parse(onlineClass.configJSON) }; });

        this.vm.isLoading = false;
    }

}
