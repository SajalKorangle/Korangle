import { Component, OnInit } from '@angular/core';
import { DataStorage } from "@classes/data-storage";

import { ManageComplaintsServiceAdapter } from './manage-complaints.service.adapter';


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

    constructor() { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);

        this.serviceAdapter = new ManageComplaintsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    isMobile() {
        if(window.innerWidth > 991) {
            return false;
        }
        return true;
    }

    initializeComplaintList(complaintList) {
        this.complaintList = [];
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

            if(complaintObject["parentSchoolComplaintStatus"]) {
                complaint["parentSchoolComplaintStatus"] = this.getStatus(complaintObject["parentSchoolComplaintStatus"]);
            } else {
                complaint["parentSchoolComplaintStatus"] = {};
            }

            this.complaintList.push(complaint);
        });

        for(let i = 0; i < this.complaintList.length; i++) {
            this.serviceAdapter.getCommentComplaint(this.complaintList[i]["id"], i);
        }

        for(let i = 0; i < this.complaintList.length; i++) {
            this.serviceAdapter.getStatusCompalintType(this.complaintList[i]["parentSchoolComplaintType"].id, i);
        }
        console.log("Complaint List: ", this.complaintList);
    }

    initializeComplaint(complaintObject) {
        let complaint = {};
        complaint["parentSchoolComplaintType"] = this.getParentComplaint(complaintObject["parentSchoolComplaintType"]);
        complaint["id"] = complaintObject["id"];
        complaint["dateSent"] = complaintObject["dateSent"];
        complaint["parentEmployee"] = this.getEmployee(complaintObject["parentEmployee"]);
        complaint["applicableStatusList"] = [];
        complaint["commentList"] = [];
        complaint["parentStudent"] = this.getParentStudent(complaintObject["parentStudent"]);
        complaint["title"] = complaintObject["title"];

        if(complaintObject["parentSchoolComplaintStatus"]) {
            complaint["parentSchoolComplaintStatus"] = this.getStatus(complaintObject["parentSchoolComplaintStatus"]);
        } else {
            complaint["parentSchoolComplaintStatus"] = {};
        }

        this.complaintList.push(complaint);
        this.serviceAdapter.getCommentComplaint(complaintObject["id"], this.complaintList.length - 1);
        this.serviceAdapter.getStatusCompalintType(complaintObject["parentSchoolComplaintType"], this.complaintList.length - 1);
        console.log("Complaint List: ", this.complaintList);
    }

    initializeStudentFullProfileList(studentList, studentSectionList) {
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
    }

    initializeStatusList(statusList) {
        statusList.forEach((status) => {
            this.statusList.push(status);
        });
        console.log("Status List: ", this.statusList);
    }

    /* Initialize Employee List */
    initializeEmployeeList(employeeList: any): void {
        this.employeeList = [];

        employeeList.forEach((employee) => {
            let tempEmployee = {};
            tempEmployee["name"] = employee["name"];
            tempEmployee["id"] = employee["id"];
            this.employeeList.push(tempEmployee);
        });
    }

    getParentStudent(parentStudent) {
        for(let i = 0; i < this.studentList.length; i++) {
            if(this.studentList[i].dbId == parentStudent) {
                return this.studentList[i];
            }
        }
    }

    getParentComplaint(parentSchoolComplaintType) {
        for(let i = 0; i < this.complaintTypeList.length; i++) {
            if(this.complaintTypeList[i].id == parentSchoolComplaintType) {
                return this.complaintTypeList[i];
            }
        }
    }

    getStatus(id) {
        let nullStatus = {
            id: null,
            name: '',
            parentSchool: null,
        };

        if(!id) {
            return nullStatus;
        }

        for(let i = 0; i < this.statusList.length; i++) {
            if(this.statusList[i].id == id) {
                return this.statusList[i];
            }
        }
        return nullStatus;
    }

    getEmployee(id) {
        let nullEmployee = {
            id: null,
            name: null,
        };

        if(!id) {
            return nullEmployee;
        }

        for(let i = 0; i < this.employeeList.length; i++) {
            if(this.employeeList[i].id == id) {
                return this.employeeList[i];
            }
        }
        return nullEmployee;
    }

    getDateTimeInfo(createdAt) {
        let newDate = new Date(createdAt);

        let hour = newDate.getHours();
        let hourString = "";
        if(hour < 10) {
            hourString = "0" + hour;
        } else {
            hourString = "" + hour;
        }

        let minutes = newDate.getMinutes();
        let minutesString = "";
        if(minutes < 10) {
            minutesString = "0" + minutes;
        } else {
            minutesString = "" + minutes;
        }

        let date = newDate.getDate();
        let dateString = "";
        if(date < 10) {
            dateString = "0" + date;
        } else {
            dateString = "" + date;
        }

        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let monthString = "";
        if(month < 10) {
            monthString = "0" + month;
        } else {
            monthString = "" + month;
        }

        let dateTimeInfo = "";
        dateTimeInfo = hourString + ":" + minutesString + ", " + dateString + "-" + monthString + "-" + year;
        return dateTimeInfo;
    }

    getDateInfo(createdAt) {
        let newDate = new Date(createdAt);

        let date = newDate.getDate();
        let dateString = "";
        if(date < 10) {
            dateString = "0" + date;
        } else {
            dateString = "" + date;
        }

        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let monthString = "";
        if(month < 10) {
            monthString = "0" + month;
        } else {
            monthString = "" + month;
        }

        let dateInfo = "";
        dateInfo = dateString + "-" + monthString + "-" + year;
        return dateInfo;
    }

    sendComplaint() {

        if(!this.complaintType["id"]) {
            alert("Please select the complaint type.");
            return;
        }

        if(!this.complaintStudent["dbId"]) {
            alert("Please select the student.");
            return;
        }

        if(!this.complaintTitle) {
            alert("Please enter the complaint title.");
            return;
        }

        if(!this.commentMessage) {
            alert("Please enter your query.");
            return;
        }

        this.serviceAdapter.sendComplaint();
    }

    updateComplaintClicked() {
        if(!this.openedComplaint.parentSchoolComplaintStatus["id"] || (this.openedComplaint.parentSchoolComplaintStatus["id"] && this.openedComplaint.parentSchoolComplaintStatus.id != this.defaultStatus.id)) {
            this.serviceAdapter.updateStatus();
        }

        if(!this.commentMessage) {
            alert("Please enter your query.");
            return;
        }

        this.serviceAdapter.addComplaintComment(this.openedComplaint);
    }

    openComplaint(complaint) {
        this.openedComplaint = complaint;
        this.commentList = complaint["commentList"];
        if(complaint.parentSchoolComplaintStatus) {
            this.defaultStatus = complaint.parentSchoolComplaintStatus;
            this.defaultStatusTitle = complaint.parentSchoolComplaintStatus.name;
        }
    }

    getAuthorComment(comment) {
        if(comment.parentEmployee["id"]) {
            return comment.parentEmployee.name;
        }
        return (this.user.first_name + " " + this.user.last_name);
    }
}
