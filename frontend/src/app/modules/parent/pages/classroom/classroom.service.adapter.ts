import { ClassroomComponent } from './classroom.component';

export class ClassroomServiceAdapter {

    vm: ClassroomComponent;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
    }

    async initializeData() {
        this.vm.isLoading = true;

        const online_class_request = {
            parentClass: this.vm.activeStudent.classDbId,
            // parentDivision: this.vm.activeStudent.
        };

        // const response = await Promise.all([
        //     this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_request),
        //     this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.online_class, {}),
        //     this.vm.classService.getObjectList(this.vm.classService.classs, {}),
        //     this.vm.classService.getObjectList(this.vm.classService.division, {}),
        // ]);

        this.vm.isLoading = false;
    }

    async initilizeMettingData(onlineClass) {
        this.vm.isLoading = true;
        const signature_request = {
            mettingNumber: onlineClass.mettingNumber,
            role: 1,
        };
        const response = await this.vm.onlineClassService.getObject(this.vm.onlineClassService.zoom_metting_signature, signature_request);

        this.vm.populateMettingParametersAndStart(onlineClass, response.signature, response.apiKey);

        this.vm.isLoading = false;
    }

}
