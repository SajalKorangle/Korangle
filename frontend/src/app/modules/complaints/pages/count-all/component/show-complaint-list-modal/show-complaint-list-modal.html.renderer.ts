import { ShowComplaintListModalComponent } from './show-complaint-list-modal.component';

export class ShowComplaintListModalHtmlRenderer {

    vm: ShowComplaintListModalComponent;

    constructor() {
    }

    /* Initialize Renderer */
    initializeRenderer(vm: ShowComplaintListModalComponent): void {
        this.vm = vm;
    }  // Ends: initializeRenderer()

    getStudent(studentId) {
        let studentName = "Not Selected";

        this.vm.studentList.forEach((student) => {
            if (student["dbId"] == studentId) {
                studentName = student["name"];
            }
        });
        return studentName;
    }

    getComplaintType(complaintTypeId) {
        let complaintTypeName = "Not Selected";

        this.vm.complaintTypeList.forEach((complaintType) => {
            if (complaintType["id"] == complaintTypeId) {
                complaintTypeName = complaintType["name"];
            }
        });
        return complaintTypeName;
    }

    getStatus(statusId) {
        let statusName = "Not Selected";

        this.vm.studentList.forEach((status) => {
            if (status["id"] == statusId) {
                statusName = status["name"];
            }
        });
        return statusName;
    }
}
