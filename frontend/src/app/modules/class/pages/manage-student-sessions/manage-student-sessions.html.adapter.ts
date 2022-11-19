import { ManageStudentSessionsComponent } from "./manage-student-sessions.component";

export class ManageStudentSessionsHtmlAdapter {
    vm: ManageStudentSessionsComponent;

    constructor() {}

    initializeAdapter(vm: ManageStudentSessionsComponent): void {
        this.vm = vm;
    }

    // START: handle selection on student list from parent-student-filter
    handleStudentListSelection(studentDetailsList: any): void {
        this.vm.selectedStudent = studentDetailsList[0][0];
        this.vm.serviceAdapter.initializeData();
    }
    // END: handle selection on student list from parent-student-filter

    // START: handle the changing of classes for all the lower sessions if class is changed for a session
    handleClassChange(idx): void {
    let currClassIdx = this.vm.classList.findIndex((classObj) => classObj.id == this.vm.studentSessionList[idx].parentClass.id);
        for (let i = idx + 1; i < this.vm.studentSessionList.length; i++) {
            if (this.vm.studentSessionList[i].hasFeeReceiptOrDiscount == false) {
                let nextClass = currClassIdx + 1 < this.vm.classList.length ? this.vm.classList[currClassIdx + 1] : this.vm.classList[currClassIdx];
                this.vm.studentSessionList[i].parentClass = nextClass;
                currClassIdx++;
            } else {
                break;
            }
        }
    }
    // END: handle the changing of classes for all the lower sessions if class is changed for a session

    // START: handle the changing of divisions for all the lower sessions if division is changed for a session
    handleDivisionChange(idx): void {
        let currDivisionIdx = this.vm.sectionList.findIndex((sectionObj) => sectionObj.id == this.vm.studentSessionList[idx].parentDivision.id);
        for (let i = idx + 1; i < this.vm.studentSessionList.length; i++) {
            if (this.vm.studentSessionList[i].hasFeeReceiptOrDiscount == false) {
                this.vm.studentSessionList[i].parentDivision = this.vm.sectionList[currDivisionIdx];
            } else {
                break;
            }
        }
    }
    // END: handle the changing of divisions for all the lower sessions if division is changed for a session

    // START: handle if a session is removed from the list
    removeSession() {
        if (this.vm.studentSessionList.length > 0) {
            let lastSession = this.vm.studentSessionList[this.vm.studentSessionList.length - 1];
            if (lastSession.hasFeeReceiptOrDiscount == false) {
                this.vm.studentSessionList.pop();
            }
        }
    }
    // END: handle if a session is removed from the list

    // START: check if the new session button should appear
    enableNewSessionButton(): boolean {
        let lastStudentSession = this.vm.studentSessionList[this.vm.studentSessionList.length - 1];
        let firstSession = this.vm.sessionList[0];
        return lastStudentSession.parentSession.orderNumber > firstSession.orderNumber;
    }
    // END: check if the new session button should appear

    // START: add new session when new session button is clicked
    addStudentSession(): void {

        let lastSession = this.vm.studentSessionList[this.vm.studentSessionList.length - 1];
        let lastSessionIdx = this.vm.sessionList.findIndex((sessionObj) => sessionObj.id == lastSession.parentSession.id);
        let studentSessionFromBackendStudentSessionList = this.vm.backendStudentSessionList.find(backendStudentSessionObject => {
            return backendStudentSessionObject.parentSession == this.vm.sessionList[lastSessionIdx - 1];
        });
        if (studentSessionFromBackendStudentSessionList) { // if it already exists in backend then it should be populated as is.
            this.vm.studentSessionList.push({
                id: studentSessionFromBackendStudentSessionList.id,
                parentSession: this.vm.sessionList[lastSessionIdx - 1],
                parentClass: this.vm.classList.find(classObject => classObject.id == studentSessionFromBackendStudentSessionList.parentClass),
                parentDivision: this.vm.sectionList.find(sectionObject => sectionObject.id == studentSessionFromBackendStudentSessionList.parentDivision),
                hasFeeReceiptOrDiscount: false // This can be added as false otherwise the session couldn't have been removed in the first place.
            });
        } else { // if it is a new session w.r.t. backend as well then populate in the following manner.
            let lastClassIdx = this.vm.classList.findIndex((classObj) => classObj.id == lastSession.parentClass.id);
            let lastDivisionIdx = this.vm.sectionList.findIndex((divisionObj) => divisionObj.id == lastSession.parentDivision.id);
                this.vm.studentSessionList.push({
                parentSession: this.vm.sessionList[lastSessionIdx - 1],
                // populate with previous class, if already at the lowest class then populate with lowest class again.
                parentClass: lastClassIdx + 1 < this.vm.classList.length ? this.vm.classList[lastClassIdx + 1] : this.vm.classList[lastClassIdx],
                parentDivision: this.vm.sectionList[lastDivisionIdx],
                hasFeeReceiptOrDiscount: false
            });
        }

    }
    // END: add new session when new session button is clicked

    // START: save the changes made to the data
    saveStudentSessions() {
        this.vm.serviceAdapter.saveSessions();
    }
    // END: save the changes made to the data

    // Start: return whether to show update button or not
    showUpdateButton(): boolean {

        // Start :- Checking if a session is updated or added
        for (let index = 0; index < this.vm.studentSessionList.length; index++) {
            if (
                this.vm.dynamicValues.isSessionNew(this.vm.studentSessionList[index]) ||
                this.vm.dynamicValues.isSessionUpdated(this.vm.studentSessionList[index])
            ) {
                return true;
            }
        }
        // End :- Checking if a session is updated or added

        // Start :- Checking if a session is deleted
        for (let index = 0; index < this.vm.backendStudentSessionList.length; index++) {
            if (this.vm.studentSessionList.find(studentSessionObject => {
                return studentSessionObject.parentSession.id == this.vm.backendStudentSessionList[index].parentSession;
            }) == undefined) {
                return true;
            }
        }
        // End :- Checking if a session deleted

        return false;

    }
    // End: return whether to show update button or not

    // Start :- handle update Button click
    handleUpdateButtonClick() {
        this.vm.serviceAdapter.saveSessions();
    }
    // End :- handle update Button click

}