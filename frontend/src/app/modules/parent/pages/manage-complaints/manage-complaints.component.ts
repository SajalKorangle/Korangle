import { Component, OnInit } from '@angular/core';
import { DataStorage } from "@classes/data-storage";

import { ManageComplaintsServiceAdapter } from './manage-complaints.service.adapter';
import { ManageComplaintsHtmlRenderer } from './manage-complaints.html.renderer';


@Component({
    selector: 'app-manage-complaints',
    templateUrl: './manage-complaints.component.html',
    styleUrls: ['./manage-complaints.component.css']
})
export class ManageComplaintsComponent implements OnInit {
    user: any;
    isLoading: boolean = false;
    NULL_CONSTANT: any = null;

    pageName = "list-of-complaints";

    seachString: string = "";

    complaintTitle: string = "";
    complaintStudentName: string = "Select Student";
    complaintStudent: any = {};
    complaintTypeName: string = "Select Complaint Type";
    complaintTypeDefaultText: string = "";
    complaintType: any = {};
    complaintComment: string = "";
    complaintList: any = [];
    searchedComplaintList: any = [];
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

    serviceAdapter: ManageComplaintsServiceAdapter;
    htmlRenderer: ManageComplaintsHtmlRenderer;

    constructor() { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);

        this.serviceAdapter = new ManageComplaintsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlRenderer = new ManageComplaintsHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);
    }

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
        for (let i = complaintList; i < this.complaintList.length; i++) {

            if (this.complaintList[i]["parentSchoolComplaintType"]["id"]) {
                this.serviceAdapter.getStatusCompalintType(this.complaintList[i]["parentSchoolComplaintType"].id, i);
            }
        }
        console.log("Complaint List: ", this.complaintList);
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

        console.log("Student List: ", this.studentList);
    }  // Ends: initializeStudentFullProfileList()

    /* Initialize Status List */
    initializeStatusList(statusList) {

        if (!statusList) {
            return;
        }

        statusList.forEach((status) => {
            this.statusList.push(status);
        });
        console.log("Status List: ", this.statusList);
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

    /* Update Complaint */
    updateComplaintClicked() {

        if (
            !this.openedComplaint.parentSchoolComplaintStatus["id"] ||
            (this.openedComplaint.parentSchoolComplaintStatus["id"] && this.openedComplaint.parentSchoolComplaintStatus.id != this.defaultStatus.id)
        ) {
            this.serviceAdapter.updateStatus();
        }

        if (!this.commentMessage) {
            alert("Please enter your query.");
            return;
        }

        this.serviceAdapter.addComplaintComment();
    }  // Ends: updateComplaintClicked()

    /* Open Complaint */
    openComplaint(complaint) {
        this.openedComplaint = complaint;
        this.commentList = complaint["commentList"];
        this.defaultStatus = complaint.parentSchoolComplaintStatus;
        this.defaultStatusTitle = complaint.parentSchoolComplaintStatus.name;

        if (!this.defaultStatusTitle) {
            this.defaultStatusTitle = "Not Applicable";
        }
    }  // Ends: openComplaint()

    /* Get Complaint Index */
    getComplaintIdx(complaint) {
        for (let i = 0; i < this.complaintList.length; i++) {
            if (this.complaintList[i].id == complaint.id) {
                return i;
            }
        }
        return -1;
    }  // Ends: getComplaintIdx()

    /* Delete Complaint */
    deleteComplaint(complaint) {

        let idx = this.getComplaintIdx(complaint);
        if (idx != -1) {
            this.complaintList.splice(idx, 1);
            this.serviceAdapter.deleteComplaint(complaint.id);
        }
        this.getSearchedComplaintList();
        this.pageName = "list-of-complaints";
    }  // Ends: deleteComplaint()

    /* Refresh Complaint */
    refreshClicked() {
        this.serviceAdapter.refreshComplaint();
    }  // Ends: refreshClicked()
}
