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
    complaintCommentList: any = [];
    complaintList: any = [];

    constructor() { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);
    }

}
