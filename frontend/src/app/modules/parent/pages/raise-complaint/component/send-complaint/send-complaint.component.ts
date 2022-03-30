import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SendComplaintHtmlRenderer } from './send-complaint.html.renderer';

@Component({
    selector: 'app-send-complaint',
    templateUrl: './send-complaint.component.html',
    styleUrls: ['./send-complaint.component.css']
})
export class SendComplaintComponent implements OnInit {
    @Input() user;
    @Input() complaintTypeList;
    @Input() studentList;
    @Output() changePageName = new EventEmitter<string>();
    @Output() initializeComplaintData = new EventEmitter<any>();
    @Output() sendComplaint = new EventEmitter<any>();

    nullComplaintType = {
        id: null,
        defaultText: '',
        name: 'Select Complaint Type',
        parentSchoolComplaintStatusDefault: null,
        parentSchool: null,
    };

    complaintTypeName: string = "Select Complaint Type";
    complaintTypeDefaultText: string = "";
    complaintType: any = this.nullComplaintType;

    complaintTitle: string = "";
    complaintStudentName: string = "Select Student";
    complaintStudent: any = {};
    commentMessage: string = "";


    htmlRenderer: SendComplaintHtmlRenderer;

    constructor(
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.htmlRenderer = new SendComplaintHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);
    }

    /* Change Page */
    changePage() {
        this.changePageName.emit("list-of-complaints");
    }  // Ends: changePage()

    /* Initialize Complaint Data */
    triggerInitializeComplaintData() {
        this.initializeComplaintData.emit();
    }  // Ends: triggerInitializeComplaintData()

    /* Send Complaint */
    triggerSendComplaint() {

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

        let response = [];
        response.push(this.complaintType);
        response.push(this.complaintTitle);
        response.push(this.commentMessage);
        response.push(this.complaintStudent);

        this.sendComplaint.emit(response);
    }  // Ends: triggerSendComplaint()
}
