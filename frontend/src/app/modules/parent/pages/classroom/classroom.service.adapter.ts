import { ClassroomComponent } from './classroom.component';

export class ClassroomServiceAdapter {

    vm: ClassroomComponent;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
    }

    async initializeData() {
        this.vm.isLoading = true;

        const student_section_request = {
            parentStudent: this.vm.activeStudent.id,
            parentSession: this.vm.user.activeSchool.currentSessionDbId
        };

        const response = await Promise.all([
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}), // 0 
            this.vm.studentService.getObject(this.vm.studentService.student_section, student_section_request),  // 1
        ]);

        const currentSession = response[0].find((session) => session.id == this.vm.user.activeSchool.currentSessionDbId);
        const startDate = new Date(currentSession.startDate);
        const endDate = new Date(currentSession.endDate);
        const today = new Date();
        if (today > startDate && today < endDate) { // only if in current session
            this.vm.backendData.studentSection = response[1];
            const online_class_request = {
                parentClass: this.vm.backendData.studentSection.parentClass,
                parentDivision: this.vm.backendData.studentSection.parentDivision,
            };
            const onlineClass = await this.vm.onlineClassService.getObject(this.vm.onlineClassService.online_class, online_class_request);
            if (onlineClass) {
                this.vm.backendData.onlineClass = { ...onlineClass, configJSON: JSON.parse(onlineClass.configJSON) };
            }
        }

        this.vm.isLoading = false;
    }

    async initilizeMettingData(onlineClass) {
        this.vm.isLoading = true;
        const signature_request = {
            mettingNumber: onlineClass.mettingNumber,
            role: 0,
        };
        const response = await this.vm.onlineClassService.getObject(this.vm.onlineClassService.zoom_metting_signature, signature_request);

        this.vm.populateMettingParametersAndStart(onlineClass, response.signature, response.apiKey);

        this.vm.isLoading = false;
    }

}
