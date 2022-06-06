import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";
import { MatDialog } from '@angular/material';

import { AssignEmployeeModalComponent } from '@modules/complaints/pages/manage-complaints/component/assign-employee-modal/assign-employee-modal.component';
import { ManageComplaintsServiceAdapter } from './manage-complaints.service.adapter';
import { ManageComplaintsHtmlRenderer } from './manage-complaints.html.renderer';
import { DeleteTableModalComponent } from '@modules/complaints/component/delete-table-modal/delete-table-modal.component';

import { CommonFunctions } from "../../../../classes/common-functions";


@Component({
    selector: 'app-manage-complaints',
    templateUrl: './manage-complaints.component.html',
    styleUrls: ['./manage-complaints.component.css']
})
export class ManageComplaintsComponent implements OnInit {
    user: any;
    isLoading: boolean = true;
    NULL_CONSTANT: any = null;

    progress: number = 0;
    isProgress: boolean = true;
    progressInterval: any;
    isLoadMore: boolean = true;

    userPermission: boolean = false;  /* Admin or Employee */
    pageName: string = "showTables";
    showFilterOptionComplaintType: boolean = false;
    showFilterOptionStatus: boolean = false;

    searchString: string = "";
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
    searchedComplaintList: any = [];
    complaintTypeList: any = [];
    filterComplaintTypeList: any = [];

    defaultStatus: any = {};
    defaultStatusTitle: string = "None";
    openedComplaint: any = {};
    openedComplaintIdx: number;

    commentMessage: string = "";
    commentList: any = [];

    serviceAdapter: ManageComplaintsServiceAdapter;
    htmlRenderer: ManageComplaintsHtmlRenderer;


    constructor(
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.htmlRenderer = new ManageComplaintsHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);

        this.serviceAdapter = new ManageComplaintsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    /* Progress Bar Set-Interval Function */
    setProgressInterval() {
        if (this.progress >= 100) {
            clearInterval(this.progressInterval);
            this.loadComplaints();
        } else {
            if (this.user.section.subRoute != "manage_complaints") {
                clearInterval(this.progressInterval);
            } else {
                this.progress++;
            }
        }
    }  // Ends: setProgressInterval()

    /* Starts Progress Bar */
    startProgressBar() {
        this.pageName = "showTables";
        this.progress = 1;
        this.progressInterval = setInterval(() => this.setProgressInterval(), 600);  /* 60 seconds full time */
    }  // Ends: startProgressBar()

    startNewProgressBar() {
        clearInterval(this.progressInterval);
        this.startProgressBar();
    }

    /* Done Icon Clicked (Fetch Complaints) */
    doneIconClicked() {
        this.progress = 0;
        clearInterval(this.progressInterval);
        this.loadComplaints();
    }  // Ends: doneIconClicked()

    /* Sort Complaints (Newest First) */
    sortNewestClicked() {
        this.sortType = "-dateSent";
        this.sortOldest = true;
        this.sortNewest = false;
        this.startNewProgressBar();
    }  // Ends: sortNewestClicked()

    /* Sort Complaints (Oldest First) */
    sortOldestClicked() {
        this.sortType = "dateSent";
        this.sortOldest = false;
        this.sortNewest = true;
        this.startNewProgressBar();
    }  // Ends: sortOldestClicked()

    /* Status Filter Option Clicked */
    statusOptionClicked(status) {
        status.selected = !status.selected;
        this.startNewProgressBar();
    }  // Ends: statusOptionClicked()

    /* Complaint Type Filter Option Clicked */
    complaintTypeOptionClicked(complaintType) {
        complaintType.selected = !complaintType.selected;
        this.startNewProgressBar();
    }  // Ends: complaintTypeOptionClicked()

    /* Load Complaints */
    loadComplaints() {
        this.complaintList = [];
        this.startNumber = 1;
        this.endNumber = this.numberOfComplaintsPerPage;
        this.isLoadMore = true;
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

        if (this.userPermission) {
            this.serviceAdapter.initializeComplaintDataAdmin();
        } else {
            this.serviceAdapter.initializeComplaintDataEmployee();
        }
    }  // Ends: checkUserPermission()

    /* Initialize Complaint Type list */
    initializeComplaintTypeList(complaintTypeList) {

        if (!complaintTypeList) {
            return;
        }

        let nullComplaintType = {
            id: null,
            defaultText: '',
            name: '',
            parentSchoolComplaintStatusDefault: null,
            parentSchool: null,
            selected: false,
        };

        this.complaintTypeList = [];
        this.complaintTypeList.push(nullComplaintType);

        complaintTypeList.forEach((complaintType) => {
            complaintType["selected"] = false;
            this.complaintTypeList.push(complaintType);
        });

        // this.filterComplaintTypeList = CommonFunctions.getInstance().deepCopy(this.complaintTypeList);
    }  // Ends: initializeComplaintTypeList()

    /* Initialize Address-TO-Employee List (If Complaint-Type is Null) */
    initializeEmployeeComplaintList(employeeComplaintList, idx) {
        employeeComplaintList.forEach((employeeComplaint) => {
            let employee = this.getEmployee(employeeComplaint.parentEmployee);
            employee["selected"] = true;

            if (employee["name"]) {
                this.complaintList[idx]["employeeComplaintList"].push(employee);
            }
        });
    }  // Ends: initializeEmployeeComplaintList()

    /* Initialize Complaint list */
    initializeComplaintList(complaintList) {

        if (!complaintList) {
            return;
        }

        this.complaintList = [];

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

        for (let i = 0; i < this.complaintList.length; i++) {
            this.serviceAdapter.getCommentComplaint(this.complaintList[i].id, i);
        }

        for (let i = 0; i < this.complaintList.length; i++) {
            if (this.complaintList[i]["parentSchoolComplaintType"]["id"]) {
                this.serviceAdapter.getStatusCompalintType(this.complaintList[i]["parentSchoolComplaintType"].id, i);
            }
        }

        for (let i = 0; i < this.complaintList.length; i++) {
            this.serviceAdapter.getEmployeeCompalint(this.complaintList[i].id, i);
        }

        if (complaintList.length < this.numberOfComplaintsPerPage) {
            this.isLoadMore = false;
        }
        // this.searchedComplaintList = this.complaintList;
        this.startNewProgressBar();
    }  // Ends: initializeComplaintList()

    findComplaint(complaintId) {
        let found = false;
        this.complaintList.forEach((complaint) => {
            if (complaint["id"] == complaintId) {
                found = true;
            }
        });

        return found;
    }

    /* Add New Complaints */
    addNewComplaints(complaintList) {

        if (!complaintList) {
            return;
        }

        let length = this.complaintList.length;

        complaintList.forEach((complaintObject) => {
            if (!this.findComplaint(complaintObject["id"])) {
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
            }
        });

        for (let i = length; i < this.complaintList.length; i++) {
            this.serviceAdapter.getCommentComplaint(this.complaintList[i].id, i);
        }

        for (let i = length; i < this.complaintList.length; i++) {
            if (this.complaintList[i]["parentSchoolComplaintType"]["id"]) {
                this.serviceAdapter.getStatusCompalintType(this.complaintList[i]["parentSchoolComplaintType"].id, i);
            }
        }

        for (let i = length; i < this.complaintList.length; i++) {
            this.serviceAdapter.getEmployeeCompalint(this.complaintList[i].id, i);
        }

        if (complaintList.length < this.numberOfComplaintsPerPage) {
            this.isLoadMore = false;
        }
        // this.searchedComplaintList = this.complaintList;
        this.startNewProgressBar();
    }  // Ends: addNewComplaints()

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

    }  // Ends: initializeStudentFullProfileList()

    /* Initialize Status list */
    initializeStatusList(statusList) {

        if (!statusList) {
            return;
        }

        let nullStatus = {
            id: null,
            name: '',
            parentSchool: null,
            selected: false,
        };

        if (this.statusList.length == 0) {
            this.statusList.push(nullStatus);
        }

        statusList.forEach((status) => {
            status["selected"] = false;
            this.statusList.push(status);
        });
        // this.filterStatusList = CommonFunctions.getInstance().deepCopy(this.statusList);
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
    getParentComplaintType(parentSchoolComplaintType) {

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
    }  // Ends: getParentComplaintType()

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

    /* Get Searched Complaint List */
    getSearchedComplaintList() {
        this.loadComplaints();
    }  // Ends: getSearchedComplaintList()

    /* Open Filter Modal */
    openAssignEmployeeDialog(complaint, idx): void {
        clearInterval(this.progressInterval);
        const dialogRef = this.dialog.open(AssignEmployeeModalComponent, {
            data: {
                employeeList: CommonFunctions.getInstance().deepCopy(this.employeeList),
                openedComplaint: CommonFunctions.getInstance().deepCopy(complaint),
                employeeComplaintList: complaint.employeeComplaintList,
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            if (data && data["newlyAssignedEmployeeList"]) {
                let newlyAssignedEmployeeList = data["newlyAssignedEmployeeList"];
                this.serviceAdapter.addNewlyAssignedEmployee(complaint, newlyAssignedEmployeeList, idx);
            }

            if (data && data["employeeComplaintList"]) {
                complaint.employeeComplaintList = data["employeeComplaintList"];
            }

            if (data && data["removeEmployeeList"]) {
                let removeEmployeeList = data["removeEmployeeList"];

                let deleteData = {};
                let employeeIdList = [];
                let complaintIdList = [];
                removeEmployeeList.forEach(element => {
                    employeeIdList.push(element.parentEmployee);
                    complaintIdList.push(element.parentComplaint);
                });

                deleteData["parentEmployee__in"] = employeeIdList;
                deleteData["parentComplaint__in"] = complaintIdList;
                this.serviceAdapter.removeAssignedEmployee(deleteData);
            }
            this.startProgressBar();
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

        if (!this.defaultStatusTitle) {
            this.defaultStatusTitle = "None";
        }
        clearInterval(this.progressInterval);
    }  // Ends: openComplaint()

    updateStatus(status) {
        this.defaultStatusTitle = status.name;
        this.defaultStatus = status;
        this.serviceAdapter.updateStatus();
    }

    /* Update Complaint */
    sendCommentClicked() {
        if (!this.commentMessage) {
            alert("Please enter your query.");
        }
        this.serviceAdapter.addComment();
    }  // Ends: sendCommentClicked()

    /* Delete Complaint */
    deleteComplaint(complaint) {
        const dialogRef = this.dialog.open(DeleteTableModalComponent, {
            data: {
                formatName: complaint.title,
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            if (data && data["operation"] && data["operation"] == "Delete") {
                this.serviceAdapter.deleteComplaint(complaint);
            }
        });
    }  // Ends: deleteComplaint()
}
