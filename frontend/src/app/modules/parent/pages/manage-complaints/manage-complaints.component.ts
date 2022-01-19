import { Component, OnInit } from '@angular/core';
import { DataStorage } from "@classes/data-storage";

@Component({
    selector: 'app-manage-complaints',
    templateUrl: './manage-complaints.component.html',
    styleUrls: ['./manage-complaints.component.css']
})
export class ManageComplaintsComponent implements OnInit {
    user: any;

    pageName = "list-of-complaints";

    seachString: string = "";

    complaintParentName: string = "";
    complaintDateSent: string = "";
    complaintType: string = "Select Complaint Type";
    complaintStudentName: string = "Select Student";
    complaintParentContactNumber: string = "";
    complaintTitle: string = "";
    complaintStatus: string = "";
    complaintComment: string = "";
    complaintCommentList: any = [];
    complaintList: any = [];

    constructor() { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);
    }

    sendComplaint() {
        this.complaintParentName = this.user.first_name + " " + this.user.last_name;
        // this.complaintDateSent = new Date();
        this.complaintParentContactNumber = this.user.username;
        this.complaintStatus = "Unresolved";

        let complaint = {};
        complaint["complaintParentName"] = this.complaintParentName;
        complaint["complaintDateSent"] = this.complaintDateSent;
        complaint["complaintParentContactNumber"] = this.complaintParentContactNumber;
        complaint["complaintStatus"] = this.complaintStatus;
        complaint["complaintType"] = this.complaintType;
        complaint["complaintStudentName"] = this.complaintStudentName;
        complaint["complaintParentName"] = this.complaintParentName;
        complaint["complaintTitle"] = this.complaintTitle;
        complaint["complaintCommentList"] = [this.complaintComment];

        this.complaintList.push(complaint);
    }

    openComplaint(complaint) {
        this.complaintParentName = complaint["complaintParentName"];
        this.complaintDateSent = complaint["complaintDateSent"];
        this.complaintParentContactNumber = complaint["complaintParentContactNumber"];
        this.complaintStatus = complaint["complaintStatus"];
        this.complaintType = complaint["complaintType"];
        this.complaintStudentName = complaint["complaintStudentName"];
        this.complaintParentName = complaint["complaintParentName"];
        this.complaintTitle = complaint["complaintTitle"];
        this.complaintComment = complaint["complaintCommentList"][0];
    }

}
