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

    seachString: string = "";

    complaintTitle: string = "";
    complaintStudentName: string = "Select Student";
    complaintStudent: any = {};
    complaintComment: string = "";
    complaintList: any = [];
    searchedComplaintList: any = [];

    complaintTypeName: string = "Select Complaint Type";
    complaintTypeDefaultText: string = "";
    complaintType: any = {};
    complaintTypeList: any = [];

    statusList: any = [];

    studentList: any = [];

    employeeList: any = [];

    defaultStatus: any = {};
    defaultStatusTitle: string = "Not Selected";
    openedComplaint: any = {};
    openedComplaintIdx: number;

    commentMessage: string = "";
    commentList: any = [];

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

            complaint["parentSchoolComplaintType"] = this.getParentComplaint(complaintObject["parentSchoolComplaintType"]);
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
        this.searchedComplaintList = this.complaintList;
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

        let nullStudent = {
            dbId: null,
            fathersName: '',
            name: '',
            mobileNumber: null,
        };

        if (!parentStudent) {
            return nullStudent;
        }

        for (let i = 0; i < this.studentList.length; i++) {
            if (this.studentList[i].dbId == parentStudent) {
                return this.studentList[i];
            }
        }
        return nullStudent;
    }  // Ends: getParentStudent()

    /* Get Parent Complaint */
    getParentComplaint(parentSchoolComplaintType) {

        let nullComplaintType = {
            id: null,
            defaultText: '',
            name: '',
            parentSchoolComplaintStatusDefault: null,
            parentSchool: null,
        };

        if (!parentSchoolComplaintType) {
            return nullComplaintType;
        }

        for (let i = 0; i < this.complaintTypeList.length; i++) {
            if (this.complaintTypeList[i].id == parentSchoolComplaintType) {
                return this.complaintTypeList[i];
            }
        }
        return nullComplaintType;
    }  // Ends: getParentComplaint()

    /* Get Status */
    getStatus(id) {
        let nullStatus = {
            id: null,
            name: '',
            parentSchool: null,
        };

        if (!id) {
            return nullStatus;
        }

        for (let i = 0; i < this.statusList.length; i++) {
            if (this.statusList[i].id == id) {
                return this.statusList[i];
            }
        }
        return nullStatus;
    }  // Ends: getStatus()

    /* Get Employee */
    getEmployee(id) {
        let nullEmployee = {
            id: null,
            name: null,
            mobileNumber: "",
        };

        if (!id) {
            return nullEmployee;
        }

        for (let i = 0; i < this.employeeList.length; i++) {
            if (this.employeeList[i].id == id) {
                return this.employeeList[i];
            }
        }
        return nullEmployee;
    }  // Ends: getEmployee()

    /* Debouncing */
    debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
        clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
         };
    }  // Ends: debounce()

    /* Get Searched Complaint List */
    getSearchedComplaintList() {
        this.searchedComplaintList = [];
        let seachString = this.seachString.trim();

        this.complaintList.forEach((complaint) => {
            if (complaint.parentStudent.name.toLowerCase().includes(seachString.toLowerCase())) { /* Check for student name */
                this.searchedComplaintList.push(complaint);
            } else if (complaint.title.toLowerCase().includes(seachString.toLowerCase())) { /* Check for complaint title */
                this.searchedComplaintList.push(complaint);
            } else if (
                complaint.parentSchoolComplaintType["name"] &&
                complaint.parentSchoolComplaintType.name.toLowerCase().includes(seachString.toLowerCase())
            ) { /* Check for complaint type */
                this.searchedComplaintList.push(complaint);
            }
        });
    }  // Ends: getSearchedComplaintList()

    seachChanged = this.debounce(() => this.getSearchedComplaintList());

    /* Send Complaint */
    sendComplaint() {

        if (!this.complaintStudent["dbId"]) {
            alert("Please select the student.");
            return;
        }

        if (!this.complaintTitle) {
            alert("Please enter the complaint title.");
            return;
        }

        if (!this.commentMessage) {
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
        if (!this.commentMessage) {
            alert("Please enter your query.");
        }
        this.serviceAdapter.addComplaintComment();
    }  // Ends: updateComplaintClicked()

    /* Open Complaint */
    openComplaint(complaint, idx) {
        this.commentList = complaint.commentList;
        this.defaultStatus = complaint.parentSchoolComplaintStatus;
        this.defaultStatusTitle = complaint.parentSchoolComplaintStatus.name;
        this.openedComplaint = complaint;
        this.openedComplaintIdx = idx;
        this.pageName = "open-complaint";

        if (!this.defaultStatusTitle) {
            this.defaultStatusTitle = "Not Applicable";
        }
    }  // Ends: openComplaint()

    /* Delete Complaint */
    deleteComplaint(complaint, idx) {
        const dialogRef = this.dialog.open(DeleteModalComponent, {
            data: {
                formatName: complaint.title,
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            if (data && data["operation"] && data["operation"] == "Delete") {
                this.serviceAdapter.deleteComplaint(complaint.id);
                this.complaintList.splice(idx, 1);
                this.getSearchedComplaintList();
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
