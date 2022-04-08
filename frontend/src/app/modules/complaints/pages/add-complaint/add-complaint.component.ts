import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { AddComplaintServiceAdapter } from './add-complaint.service.adapter';
import { AddComplaintHtmlRenderer } from './add-complaint.html.renderer';


@Component({
    selector: 'app-add-complaint',
    templateUrl: './add-complaint.component.html',
    styleUrls: ['./add-complaint.component.css']
})
export class AddComplaintComponent implements OnInit {
    user:any;
    isLoading: boolean;
    NULL_CONSTANT: any = null;

    nullComplaintType: any = {
        id: null,
        defaultText: "",
        name: "Select Complaint Type",
        parentSchool: null,
        parentSchoolComplaintStatusDefault: null,
    };

    isStudentListLoading: boolean = false;

    selectedStudent: any = {};
    comment: string = "";
    complaintTitle: string = "";
    complaintTypeName: string = "Select Complaint Type";
    complaintType: any = {};
    complaintTypeList: any = [];

    serviceAdapter: AddComplaintServiceAdapter;
    htmlRenderer: AddComplaintHtmlRenderer;

    constructor() { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new AddComplaintServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlRenderer = new AddComplaintHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);
    }

    /* Initialize Selected Student Data */
    initializeStudentData(student) {
        this.selectedStudent = student;
    }  // Ends: initializeStudentData()

    /* Initialize Complaint Data */
    initializeComplaintData() {
        this.selectedStudent = {};
        this.comment = "";
        this.complaintTitle = "";
        this.complaintTypeName = "Select Complaint Type";
        this.complaintType = {};
    }  // Ends: initializeComplaintData()

    /* Send Complaint */
    sendComplaintClicked() {

        if (!this.selectedStudent["id"]) {
            alert("Please select the student.");
            return;
        }

        if (!this.complaintTitle.toString().trim()) {
            alert("Please enter the complaint title.");
            return;
        }

        if (!this.comment.toString().trim()) {
            alert("Please enter your query.");
            return;
        }

        this.serviceAdapter.addComplaint();
    }  // Ends: sendComplaintClicked()
}
