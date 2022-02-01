import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { AddComplaintServiceAdapter } from './add-complaint.service.adapter';


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

    seachStudentString: string = "";
    searchedStudentList: any = [];

    selectedStudent: any = {};
    fatherName: string = "";
    comment: string = "";
    complaintTitle: string = "";
    complaintTypeName: string = "Select Complaint Type";
    complaintType: any = {};
    complaintTypeList: any = [];

    serviceAdapter: AddComplaintServiceAdapter;

    constructor() { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);

        this.serviceAdapter = new AddComplaintServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    isMobile() {
        if(window.innerWidth > 991) {
            return false;
        }
        return true;
    }

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

        console.log("Student List: ", this.studentList);
    }

    initializeStudentData(student) {
        this.selectedStudent = student;
        this.fatherName = this.selectedStudent.fathersName;
        this.seachStudentString = this.selectedStudent.name;
    }

    initializeComplaintData() {
        this.seachStudentString = "";
        this.searchedStudentList = [];
        this.selectedStudent = {};
        this.fatherName = "";
        this.comment = "";
        this.complaintTitle = "";
        this.complaintTypeName = "Select Complaint Type";
        this.complaintType = {};
    }

    /* Debouncing */
    debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
        clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
         };
    }

    searchStudentList() {
        this.searchedStudentList = [];
        if(!this.seachStudentString) {
            return ;
        }

        this.studentList.forEach((student) => {
            if (student.name.toLowerCase().indexOf(this.seachStudentString.toLowerCase()) === 0) {
                this.searchedStudentList.push(student);
            }
        });
        console.log("Searched Student List: ", this.searchedStudentList);
    }

    seachStudentChanged = this.debounce(() => this.searchStudentList());

    sendComplaintClicked() {
        console.log("Student: ", this.seachStudentString);
        console.log("Father: ", this.fatherName);
        console.log("complaint Type: ", this.complaintTypeName);
        console.log("Title: ", this.complaintTitle);
        console.log("Comment: ", this.comment);

        if(!this.fatherName) {
            alert("Please select the student.");
            return;
        }

        if(!this.complaintTypeName) {
            alert("Please select the complaint type.");
            return;
        }

        if(!this.complaintTitle) {
            alert("Please enter the complaint title.");
            return;
        }

        if(!this.comment) {
            alert("Please enter your query.");
            return;
        }

        this.searchedStudentList = [];
        this.serviceAdapter.addComplaint();
    }
}
