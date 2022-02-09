import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";
import { MatDialog } from '@angular/material';

import { AssignEmployeeComponent } from '@modules/parent-support/component/assign-employee/assign-employee.component';
import { ManageAllComplaintsServiceAdapter } from './manage-all-complaints.service.adapter';
import { ManageAllComplaintsHtmlRenderer } from './manage-all-complaints.html.renderer';

import { CommonFunctions } from "../../../../classes/common-functions";


@Component({
    selector: 'app-manage-all-complaints',
    templateUrl: './manage-all-complaints.component.html',
    styleUrls: ['./manage-all-complaints.component.css']
})
export class ManageAllComplaintsComponent implements OnInit {
    user: any;
    isLoading: boolean = true;
    NULL_CONSTANT: any = null;

    progress: number = 0;
    isProgress: boolean = true;
    isLoadMore: boolean = true;

    userPermission: boolean = false;
    pageName: string = "showTables";
    showFilterOptionComplaintType: boolean = false;
    showFilterOptionStatus: boolean = false;

    seachString: string = "";
    sortNewest: boolean = false;
    sortOldest: boolean = true;
    sortType: string = "-dateSent";

    startNumber: number = 1;    /* Starting Index of Records */
    endNumber: number = 50;    /* Ending Index of Records */
    numberOfComplaintsPerPage: number = 50;

    statusList: any = [];
    filterStatusList: any = [];
    employeeList: any = [];
    studentList: any = [];
    complaintList: any = [];
    schoolComplaintTypeIdList: any = [];
    searchedComplaintList: any = [];
    complaintTypeList: any = [];
    filterComplaintTypeList: any = [];

    defaultStatus: any = {};
    defaultStatusTitle: string = "Not Selected";
    openedComplaint: any = {};
    openedComplaintIdx: number;

    commentMessage: string = "";
    commentList: any = [];

    serviceAdapter: ManageAllComplaintsServiceAdapter;
    htmlRenderer: ManageAllComplaintsHtmlRenderer;


    constructor(
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);

        this.htmlRenderer = new ManageAllComplaintsHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);

        this.serviceAdapter = new ManageAllComplaintsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    /* Set Progress */
    setProgress(progress) {
        this.progress = progress;

        var el = document.getElementById("progress");
        console.log("Element: ", el);
        if (el) {
            el.style.width = this.progress + '%';
        }
    }  // Ends: setProgress()

    /* Sort Complaints (Newest First) */
    sortNewestClicked() {
        this.sortType = "-dateSent";
        this.sortOldest = true;
        this.sortNewest = false;
        this.loadComplaints();
    }  // Ends: sortNewestClicked()

    /* Sort Complaints (Oldest First) */
    sortOldestClicked() {
        this.sortType = "dateSent";
        this.sortOldest = false;
        this.sortNewest = true;
        this.loadComplaints();
    }  // Ends: sortOldestClicked()

    /* Select All Complaint Type */
    selectAllComplaintType() {
        this.filterComplaintTypeList.forEach((complaintType) => {
            complaintType["selected"] = true;
        });

        this.loadComplaints();
    }  // Ends: selectAllComplaintType()

    /* Unselect All Complaint Type */
    unselectAllComplaintType() {
        this.filterComplaintTypeList.forEach((complaintType) => {
            complaintType["selected"] = false;
        });

        this.loadComplaints();
    }  // Ends: unselectAllComplaintType()

    /* Select All Status */
    selectAllStatus() {
        this.filterStatusList.forEach((status) => {
            status["selected"] = true;
        });

        this.loadComplaints();
    }  // Ends: selectAllStatus()

    /* Unselect All Status */
    unselectAllStatus() {
        this.filterStatusList.forEach((status) => {
            status["selected"] = false;
        });

        this.loadComplaints();
    }  // Ends: unselectAllStatus()

    /* Status Filter Option Clicked */
    statusOptionClicked(status) {
        status.selected = !status.selected;
        console.log("Status Selected: ", status.selected);
        this.loadComplaints();
    }  // Ends: statusOptionClicked()

    /* Complaint Type Filter Option Clicked */
    complaintTypeOptionClicked(complaintType) {
        complaintType.selected = !complaintType.selected;
        console.log("Complaint Type Selected: ", complaintType.selected);
        this.loadComplaints();
    }  // Ends: complaintTypeOptionClicked()

    /* Load Complaints */
    loadComplaints() {
        this.startNumber = 1;
        this.endNumber = 50;
        this.complaintList = [];
        this.serviceAdapter.loadComplaints();
    }  // Ends: loadComplaints()

    /* Load More Clicked */
    loadMoreClick() {
        this.startNumber += this.numberOfComplaintsPerPage;
        this.endNumber += this.numberOfComplaintsPerPage;
        this.serviceAdapter.loadComplaints();
    }  // Ends: loadMoreClick()

    /* Check User Permission (Admin / Not Admin) */
    checkUserPermission(employeePermissionObject) {
        this.userPermission = employeePermissionObject.configJSON.includes("admin");
        console.log("User Permission: ", this.userPermission);
        this.serviceAdapter.initializeComplaintData();
    }  // Ends: checkUserPermission()

    /* Initialize Complaint Type list */
    initializeComplaintTypeList(complaintTypeList) {

        if (!complaintTypeList) {
            return;
        }

        this.complaintTypeList = [];
        complaintTypeList.forEach((complaintType) => {
            complaintType["selected"] = false;
            this.complaintTypeList.push(complaintType);
        });

        this.filterComplaintTypeList = CommonFunctions.getInstance().deepCopy(this.complaintTypeList);
    }  // Ends: initializeComplaintTypeList()

    /* Initialize Complaint list */
    initializeComplaintList(complaintList) {

        if (!complaintList) {
            return;
        }

        let length = this.complaintList.length;
        console.log("Length: ", length);

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

            if (complaintObject["parentSchoolComplaintStatus"]) {
                complaint["parentSchoolComplaintStatus"] = this.getStatus(complaintObject["parentSchoolComplaintStatus"]);
            } else {
                complaint["parentSchoolComplaintStatus"] = {};
            }

            this.complaintList.push(complaint);
        });

        for (let i = length; i < this.complaintList.length; i++) {
            this.serviceAdapter.getCommentComplaint(this.complaintList[i].id, i);
        }

        for (let i = length; i < this.complaintList.length; i++) {
            this.serviceAdapter.getStatusCompalintType(this.complaintList[i]["parentSchoolComplaintType"].id, i);
        }
        console.log("Complaint List: ", this.complaintList);
        this.isProgress = false;

        if (complaintList.length < 50) {
            this.isLoadMore = false;
        }
        this.searchedComplaintList = this.complaintList;
    }  // Ends: initializeComplaintList()

    /* Initialize Student Full Profile list */
    initializeStudentFullProfileList(studentList, studentSectionList) {

        if (!studentList) {
            return;
        }

        this.studentList = [];
        for (let i = 0; i < studentSectionList.length; i++) {
            for (let j = 0; j < studentList.length; j++) {
                if (studentSectionList[i].parentStudent === studentList[j].id) {

                    let student_data = {};
                    let student_object = studentList[j];
                    let student_section_object = studentSectionList;

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

    /* Initialize Status list */
    initializeStatusList(statusList) {

        if (!statusList) {
            return;
        }

        statusList.forEach((status) => {
            status["selected"] = false;
            this.statusList.push(status);
        });
        console.log("Status List: ", this.statusList);
        this.filterStatusList = CommonFunctions.getInstance().deepCopy(this.statusList);
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
        this.loadComplaints();
    }  // Ends: getSearchedComplaintList()

    seachChanged = this.debounce(() => this.getSearchedComplaintList());

    /* Open Filter Modal */
    openAssignEmployeeDialog(): void {
        const dialogRef = this.dialog.open(AssignEmployeeComponent, {
            data: {
                msg: "Hello",
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            console.log("closed");
        });
    }  // Ends: openAssignEmployeeDialog()

    /* Open Complaint */
    openComplaint(complaint, idx) {
        this.commentList = complaint.commentList;
        this.defaultStatus = complaint["parentSchoolComplaintStatus"];
        this.defaultStatusTitle = complaint["parentSchoolComplaintStatus"].name;
        this.openedComplaint = complaint;
        this.openedComplaintIdx = idx;
        this.pageName = "showComplaint";
        console.log("Opened Complaint: ", this.openedComplaint);
    }  // Ends: openComplaint()

    /* Update Complaint */
    sendCommentClicked() {
        console.log("Opened Complaint: ", this.openedComplaint);
        console.log("Default Status: ", this.defaultStatus);

        if (
            this.defaultStatus &&
            (   !this.openedComplaint["parentSchoolComplaintStatus"] ||
                (this.openedComplaint["parentSchoolComplaintStatus"] && this.openedComplaint["parentSchoolComplaintStatus"].id != this.defaultStatus.id)
            )
        ) {
            this.serviceAdapter.updateStatus();
        }

        if (this.commentMessage) {
            this.serviceAdapter.addComment();
        }
    }  // Ends: sendCommentClicked()

    /* Delete Complaint */
    deleteComplaint(complaint) {
        this.serviceAdapter.deleteComplaint(complaint);
    }  // Ends: deleteComplaint()
}
