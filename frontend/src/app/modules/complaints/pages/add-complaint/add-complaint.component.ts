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

    studentList: any = [];

    searchStudentString: string = "";
    searchedStudentList: any = [];

    selectedStudent: any = {};
    fatherName: string = "";
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

    /* Initialize Student Full Profile List */
    initializeStudentFullProfileList(studentList, studentSectionList) {
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

                    this.studentList.push(student_data);
                    break;
                }
            }
        }

    }  // Ends: initializeStudentFullProfileList()

    /* Initialize Selected Student Data */
    initializeStudentData(student) {
        this.selectedStudent = student;
        this.fatherName = this.selectedStudent.fathersName;
        this.searchStudentString = this.selectedStudent.name;
    }  // Ends: initializeStudentData()

    /* Initialize Complaint Data */
    initializeComplaintData() {
        this.searchStudentString = "";
        this.searchedStudentList = [];
        this.selectedStudent = {};
        this.fatherName = "";
        this.comment = "";
        this.complaintTitle = "";
        this.complaintTypeName = "Select Complaint Type";
        this.complaintType = {};
    }  // Ends: initializeComplaintData()

    /* Debouncing */
    debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
        clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
         };
    }  // Ends: debounce()

    /* Get Searched Student List */
    searchStudentList() {
        this.searchedStudentList = [];
        if (!this.searchStudentString) {
            return ;
        }

        this.studentList.forEach((student) => {
            if (student.name.toLowerCase().indexOf(this.searchStudentString.toLowerCase()) === 0) {
                this.searchedStudentList.push(student);
            }
        });
    }  // Ends: searchStudentList()

    searchStudentChanged = this.debounce(() => this.searchStudentList());

    /* Send Complaint */
    sendComplaintClicked() {

        if (!this.selectedStudent["dbId"]) {
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

        this.searchedStudentList = [];
        this.serviceAdapter.addComplaint();
    }  // Ends: sendComplaintClicked()
}
