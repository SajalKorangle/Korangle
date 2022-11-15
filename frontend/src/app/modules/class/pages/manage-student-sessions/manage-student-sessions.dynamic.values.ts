import { ManageStudentSessionsComponent } from "./manage-student-sessions.component";

export class ManageStudentSessionsDynamicValues {
    vm: ManageStudentSessionsComponent;

    constructor() {}

    initializeAdapter(vm: ManageStudentSessionsComponent): void {
        this.vm = vm;
    }

    isSessionNew(studentSessionObject): boolean {
        return this.vm.backendStudentSessionList.find(backendStudentSessionObject => {
            if (backendStudentSessionObject.parentSession==studentSessionObject.parentSession.id) {
                return true;
            }
        }) == undefined;
    }

    isSessionUpdated(studentSessionObject): boolean {
        return this.vm.backendStudentSessionList.find(backendStudentSessionObject => {
            if (
                backendStudentSessionObject.parentSession==studentSessionObject.parentSession.id && (
                    backendStudentSessionObject.parentClass != studentSessionObject.parentClass.id ||
                    backendStudentSessionObject.parentDivision != studentSessionObject.parentDivision.id
                )
            ) {
                return true;
            }
        }) != undefined;
    }

}