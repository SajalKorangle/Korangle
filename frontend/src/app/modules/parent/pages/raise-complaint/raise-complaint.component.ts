import { Component, OnInit } from '@angular/core';
import { DataStorage } from "@classes/data-storage";

import { RaiseComplaintServiceAdapter } from './raise-complaint.service.adapter';
import { RaiseComplaintHtmlRenderer } from './raise-complaint.html.renderer';
import { DeleteModalComponent } from '@modules/parent/component/delete-modal/delete-modal.component';

import { MatDialog } from '@angular/material';


@Component({
    selector: 'app-raise-complaint',
    templateUrl: './raise-complaint.component.html',
    styleUrls: ['./raise-complaint.component.css']
})
export class RaiseComplaintComponent implements OnInit {
    user: any;
    isLoading: boolean = false;
    NULL_CONSTANT: any = null;

    pageName = "list-of-complaints";

    searchString: string = "";

    complaintTitle: string = "";
    complaintStudentName: string = "Select Student";
    complaintStudent: any = {};
    complaintComment: string = "";
    complaintList: any = [];

    complaintTypeName: string = "Select Complaint Type";
    complaintTypeDefaultText: string = "";
    complaintType: any = {};
    complaintTypeList: any = [];

    statusList: any = [];

    studentList: any = [];

    employeeList: any = [];

    defaultStatus: any = {};
    defaultStatusTitle: string = "None";
    openedComplaint: any = {};
    openedComplaintIdx: number;

    commentMessage: string = "";
    commentList: any = [];

    nullStudent = {
        dbId: null,
        fathersName: '',
        name: '',
        mobileNumber: null,
    };

    nullComplaintType = {
        id: null,
        defaultText: '',
        name: 'Select Complaint Type',
        parentSchoolComplaintStatusDefault: null,
        parentSchool: null,
    };

    nullStatus = {
        id: null,
        name: '',
        parentSchool: null,
    };

    nullEmployee = {
        id: null,
        name: null,
        mobileNumber: "",
    };

    serviceAdapter: RaiseComplaintServiceAdapter;
    htmlRenderer: RaiseComplaintHtmlRenderer;

    constructor(
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new RaiseComplaintServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlRenderer = new RaiseComplaintHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);
    }

    /* Initialize Complaint Details Back to Default */
    initializeComplaintData() {
        this.complaintTitle = "";
        this.complaintStudentName = "Select Student";
        this.complaintStudent = {};
        this.complaintTypeName = "Select Complaint Type";
        this.complaintTypeDefaultText = "";
        this.complaintType = {};
        this.complaintComment = "";
    }  // Ends: initializeComplaintData()

    /* Initialize Complaint List */
    initializeComplaintList(complaintList) {

        let length = this.complaintList.length;

        complaintList.forEach((complaintObject) => {

            let complaint = {};

            complaint["parentSchoolComplaintType"] = this.getParentComplaintType(complaintObject["parentSchoolComplaintType"]);
            complaint["id"] = complaintObject["id"];
            complaint["dateSent"] = complaintObject["dateSent"];
            complaint["parentEmployee"] = this.getEmployee(complaintObject["parentEmployee"]);
            complaint["applicableStatusList"] = [];
            complaint["employeeComplaintList"] = [];
            complaint["commentList"] = [];
            complaint["parentStudent"] = this.getParentStudent(complaintObject["parentStudent"]);
            complaint["title"] = complaintObject["title"];
            complaint["parentSchoolComplaintStatus"] = this.getStatus(complaintObject["parentSchoolComplaintStatus"]);
            this.complaintList.push(complaint);
        });

        /* Get Comments */
        for (let i = length; i < this.complaintList.length; i++) {
            this.serviceAdapter.getCommentComplaint(this.complaintList[i]["id"], i);
        }

        /* Get Applicable Status List */
        for (let i = length; i < this.complaintList.length; i++) {
            if (this.complaintList[i]["parentSchoolComplaintType"]["id"]) {
                this.serviceAdapter.getStatusCompalintType(this.complaintList[i]["parentSchoolComplaintType"].id, i);
            }
        }
    }  // Ends: initializeComplaintList()

    /* Initialize Student Full Profile List */
    initializeStudentFullProfileList(studentList, studentSectionList) {

        if (!studentSectionList) {
            return;
        }

        this.studentList = [];
        for (let i = 0; i < studentSectionList.length; i++) {
            for (let j = 0; j < studentList.length; j++) {
                if (studentSectionList[i].parentStudent === studentList[j].id) {

                    let student_data = {};
                    let student_object = studentList[j];

                    student_data['name'] = student_object.name;
                    student_data['dbId'] = student_object.id;
                    student_data['fathersName'] = student_object.fathersName;
                    student_data['mobileNumber'] = student_object.mobileNumber;

                    this.studentList.push(student_data);
                    break;
                }
            }
        }

    }  // Ends: initializeStudentFullProfileList()

    /* Initialize Status List */
    initializeStatusList(statusList) {

        if (!statusList) {
            return;
        }

        statusList.forEach((status) => {
            this.statusList.push(status);
        });
    }  // Ends: initializeStatusList()

    /* Initialize Employee List */
    initializeEmployeeList(employeeList: any): void {

        if (!employeeList) {
            return;
        }

        this.employeeList = [];
        employeeList.forEach((employee) => {
            let tempEmployee = {};
            tempEmployee["name"] = employee["name"];
            tempEmployee["id"] = employee["id"];
            tempEmployee["mobileNumber"] = employee["mobileNumber"];
            this.employeeList.push(tempEmployee);
        });
    }  // Ends: initializeEmployeeList()

    /* Get Parent Student */
    getParentStudent(parentStudent) {

        if (!parentStudent) {
            return this.nullStudent;
        }

        for (let i = 0; i < this.studentList.length; i++) {
            if (this.studentList[i].dbId == parentStudent) {
                return this.studentList[i];
            }
        }
        return this.nullStudent;
    }  // Ends: getParentStudent()

    /* Get Index of a Complaint */
    getComplaintIdx(complaintId) {
        for (let i = 0; i < this.complaintList.length; i++) {
            if (this.complaintList[i].id == complaintId) {
                return i;
            }
        }
        return -1;
    }  // Ends: getParentStudent()

    /* Get Parent Complaint */
    getParentComplaintType(parentSchoolComplaintType) {

        if (!parentSchoolComplaintType) {
            return this.nullComplaintType;
        }

        for (let i = 0; i < this.complaintTypeList.length; i++) {
            if (this.complaintTypeList[i].id == parentSchoolComplaintType) {
                return this.complaintTypeList[i];
            }
        }
        return this.nullComplaintType;
    }  // Ends: getParentComplaintType()

    /* Get Status */
    getStatus(id) {

        if (!id) {
            return this.nullStatus;
        }

        for (let i = 0; i < this.statusList.length; i++) {
            if (this.statusList[i].id == id) {
                return this.statusList[i];
            }
        }
        return this.nullStatus;
    }  // Ends: getStatus()

    /* Get Employee */
    getEmployee(id) {

        if (!id) {
            return this.nullEmployee;
        }

        for (let i = 0; i < this.employeeList.length; i++) {
            if (this.employeeList[i].id == id) {
                return this.employeeList[i];
            }
        }
        return this.nullEmployee;
    }  // Ends: getEmployee()

    /* Send Complaint */
    sendComplaint() {

        if (!this.complaintStudent["dbId"]) {
            alert("Please select the student.");
            return;
        }

        if (!this.complaintTitle.toString().trim()) {
            alert("Please enter the complaint title.");
            return;
        }

        if (!this.commentMessage.toString().trim()) {
            alert("Please enter your query.");
            return;
        }

        this.serviceAdapter.sendComplaint();
    }  // Ends: sendComplaint()

    updateStatus(status) {
        this.defaultStatusTitle = status.name;
        this.defaultStatus = status;
        this.serviceAdapter.updateStatus();
    }

    /* Update Complaint */
    updateComplaintClicked() {
        if (!this.commentMessage.toString().trim()) {
            alert("Please enter your query.");
        }
        this.serviceAdapter.addComplaintComment();
    }  // Ends: updateComplaintClicked()

    /* Open Complaint */
    openComplaint(complaint) {
        this.commentList = complaint.commentList;
        this.defaultStatus = complaint.parentSchoolComplaintStatus;
        this.defaultStatusTitle = complaint.parentSchoolComplaintStatus.name;
        this.openedComplaint = complaint;
        this.pageName = "open-complaint";

        if (!this.defaultStatusTitle) {
            this.defaultStatusTitle = "None";
        }
    }  // Ends: openComplaint()

    /* Delete Complaint */
    deleteComplaint(complaint) {
        const dialogRef = this.dialog.open(DeleteModalComponent, {
            data: {
                formatName: complaint.title,
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            if (data && data["operation"] && data["operation"] == "Delete") {
                this.serviceAdapter.deleteComplaint(complaint.id);
                this.complaintList.splice(this.getComplaintIdx(complaint.id), 1);
                this.initializeComplaintData();
                this.pageName = "list-of-complaints";
            }
        });
    }  // Ends: deleteComplaint()

    /* Refresh Complaint */
    refreshClicked() {
        this.serviceAdapter.refreshComplaint();
    }  // Ends: refreshClicked()

    /* Renotify Employee */
    renotifyClicked() {
        this.serviceAdapter.renotifyComplaint();
    }  // Ends: renotifyClicked()
}
