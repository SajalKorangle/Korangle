import { ShowComplaintListModalComponent } from './show-complaint-list-modal.component';

export class ShowComplaintListModalHtmlRenderer {

    vm: ShowComplaintListModalComponent;

    constructor() { }

    /* Initialize Renderer */
    initializeRenderer(vm: ShowComplaintListModalComponent): void {
        this.vm = vm;
    }  // Ends: initializeRenderer()

    /* Get Student Name */
    getStudentName(studentId) {
        let studentName = "";

        this.vm.studentList.forEach((student) => {
            if (student["dbId"] == studentId) {
                studentName = student["name"];
            }
        });
        return studentName;
    }  // Ends: getStudentName()

    /* Get Complaint Type Name */
    getComplaintType(complaintTypeId) {
        let complaintTypeName = "None";

        this.vm.complaintTypeList.forEach((complaintType) => {
            if (complaintType["id"] == complaintTypeId) {
                complaintTypeName = complaintType["name"];
            }
        });
        return complaintTypeName;
    }  // Ends: getComplaintType()

    /* Get Status Name */
    getStatus(statusId) {
        let statusName = "None";

        this.vm.statusList.forEach((status) => {
            if (status["id"] == statusId) {
                statusName = status["name"];
            }
        });
        return statusName;
    }  // Ends: getStatus()
}
