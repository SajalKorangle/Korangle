import { ClassSectionSession } from "../backtrack-student.models";
import { ClassSectionModalComponent } from "./class-section-modal.component";

export class ClassSectionModalHtmlAdapter {

    vm: ClassSectionModalComponent;

    constructor() {}

    initialize(vm: ClassSectionModalComponent) { this.vm = vm; }

    // START: handle if a session is removed from the list
    removeSession() {
        this.vm.student.classSectionSessionList.pop();
    }
    // END: handle if a session is removed from the list

    // START: handle the changing of classes for all the lower sessions if class is changed for a session
    handleClassChange(idx: number) {
        let classIdx = this.vm.classList.findIndex(x => x.id == this.vm.student.classSectionSessionList[idx].class.id);
        for (idx = idx + 1; idx < this.vm.student.classSectionSessionList.length; idx++) {
            if (classIdx + 1 < this.vm.classList.length) {
                classIdx++;
            }
            this.vm.student.classSectionSessionList[idx].class = this.vm.classList[classIdx];
        }
        // this.saveChanges();
    }
    // END: handle the changing of classes for all the lower session if class is changed for a session

    // START: handle the changing of divisions for all the lower sessions if division is changed for a session
    handleSectionChange(idx: number) {
        let sectionIdx = this.vm.sectionList.findIndex(x => x.id == this.vm.student.classSectionSessionList[idx].section.id);
        for (idx = idx + 1; idx < this.vm.student.classSectionSessionList.length; idx++) {
            this.vm.student.classSectionSessionList[idx].section = this.vm.sectionList[sectionIdx];
        }
        // this.saveChanges();
    }
    // END: handle the changing of divisions for all the lower sessions if division is changed for a session

    // START: check if new session button should be enabled or not
    enableNewSessionButton() {
        return this.vm.student.classSectionSessionList[this.vm.student.classSectionSessionList.length - 1].session.orderNumber
            > this.vm.sessionList[0].orderNumber;
    }
    // END: check if new session button should be enabled or not

    // START: add new session when newSession Button is clicked
    addBacktrackSession() {

        this.vm.student.classSectionSessionList.push({
            class: this.vm.classList[0],
            section: this.vm.sectionList[0],
            session: this.vm.sessionList[
                this.vm.sessionList.findIndex(session => {
                    return session.id
                        == this.vm.student.classSectionSessionList[this.vm.student.classSectionSessionList.length - 1].session.id;
                }) - 1
            ]
        });
        this.handleClassChange(this.vm.student.classSectionSessionList.length -   2);
        this.handleSectionChange(this.vm.student.classSectionSessionList.length - 2);

    }
    // END: add new session when newSession Button is clicked

    /* Close Clicked */
    closeClicked(): void {
        this.vm.dialogRef.close();
    }  // Ends: closeClicked()

}