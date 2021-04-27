import { ClassroomComponent } from './classroom.component';

export class ClassroomServiceAdapter {

    vm: ClassroomComponent;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
    }

    async initializeData() {
        this.vm.isLoading = true;

        const currentSession = (await this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}))
            .find(s => s.id == this.vm.user.activeSchool.currentSessionDbId);

        const startDate = new Date(currentSession.startDate);
        const endDate = new Date(currentSession.endDate);
        const today = new Date();
        if (!(today > startDate && today < endDate)) {
            this.vm.isActiveSession = false;
            this.vm.isLoading = false;
            return;
        }
        this.vm.isActiveSession = true;

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

    async initilizeMeetingData(onlineClass) {
        this.vm.isLoading = true;
        const signature_request = {
            meetingNumber: onlineClass.meetingNumber,
            role: 1,
        };
        const response = await this.vm.onlineClassService.getObject(this.vm.onlineClassService.zoom_meeting_signature, signature_request);

        this.vm.populateMeetingParametersAndStart(onlineClass, response.signature, response.apiKey);

        this.vm.isLoading = false;
    }

}
