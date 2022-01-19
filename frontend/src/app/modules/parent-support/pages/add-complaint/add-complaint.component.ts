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

    initializeStudentFullProfileList(studentList, studentSectionList) {
        this.studentList = [];
        for (let i = 0; i < studentSectionList.length; i++) {
            for (let j = 0; j < studentList.length; j++) {
                if (studentSectionList[i].parentStudent === studentList[j].id) {

                    let student_data = {};
                    let student_object = studentList[j];
                    let student_section_object = studentSectionList;

                            // if (student_object.profileImage) {
                            //     student_data['profileImage'] = student_object.profileImage;
                            // } else {
                            //     student_data['profileImage'] = this.vm.NULL_CONSTANT;
                            // }

                    student_data['name'] = student_object.name;
                    student_data['dbId'] = student_object.id;
                    student_data['fathersName'] = student_object.fathersName;
                            // student_data['mobileNumber'] = student_object.mobileNumber;
                            // student_data['secondMobileNumber'] = student_object.secondMobileNumber;
                            // student_data['dateOfBirth'] = student_object.dateOfBirth;
                            // student_data['remark'] = student_object.remark;
                            // student_data['rollNumber'] = student_section_object.rollNumber;
                            // student_data['scholarNumber'] = student_object.scholarNumber;
                            // student_data['motherName'] = student_object.motherName;
                            // student_data['gender'] = student_object.gender;
                            // student_data['caste'] = student_object.caste;
                            // student_data['category'] = student_object.newCategoryField;
                            // student_data['religion'] = student_object.newReligionField;
                            // student_data['fatherOccupation'] = student_object.fatherOccupation;
                            // student_data['address'] = student_object.address;
                            // student_data['familySSMID'] = student_object.familySSMID;
                            // student_data['childSSMID'] = student_object.childSSMID;
                            // student_data['bankName'] = student_object.bankName;
                            // student_data['bankIfscCode'] = student_object.bankIfscCode;
                            // student_data['bankAccountNum'] = student_object.bankAccountNum;
                            // student_data['aadharNum'] = student_object.aadharNum;
                            // student_data['bloodGroup'] = student_object.bloodGroup;
                            // student_data['fatherAnnualIncome'] = student_object.fatherAnnualIncome;
                            // student_data['rte'] = student_object.rte;
                            // student_data['parentTransferCertificate'] = student_object.parentTransferCertificate;
                            // student_data['dateOfAdmission'] = student_object.dateOfAdmission;

                            // if (student_object.currentBusStop) {
                            //     student_data['busStopDbId'] = student_object.currentBusStop;
                            // } else {
                            //     student_data['busStopDbId'] = this.vm.NULL_CONSTANT;
                            // }
                            //
                            // if (student_object.admissionSession) {
                            //     student_data['admissionSessionDbId'] = student_object.admissionSession;
                            // } else {
                            //     student_data['admissionSessionDbId'] = this.vm.NULL_CONSTANT;
                            // }
                            //
                            // if (student_object.parentAdmissionClass) {
                            //     student_data['parentAdmissionClass'] = student_object.parentAdmissionClass;
                            // }

                            // student_data['sectionDbId'] = student_section_object.parentDivision;
                            // student_data['sectionName'] = value[1].find(section => section.id == student_section_object.parentDivision).name;
                            // student_data['className'] = value[0].find(classs => classs.id == student_section_object.parentClass).name;
                            // student_data['classDbId'] = student_section_object.parentClass;
                    this.studentList.push(student_data);
                    break;
                }
            }
        }

        console.log("Student List: ", this.studentList);
    }

    initializeStudentData(student) {
        this.selectedStudent = student;
        this.searchedStudentList = [];
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
    }  // Ends: debounce()

    seachStudentChanged = this.debounce(() => this.searchStudent());

    /* Search Student */
    searchStudent() {
        console.log("Searching Student Executed: ", this.seachStudentString);
        // this.serviceAdapter.searchStudent();
        this.searchStudentList();
    }  // Ends: searchStudentName()

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
    }

    sendComplaintClicked() {
        console.log("Student: ", this.seachStudentString);
        console.log("Father: ", this.fatherName);
        console.log("complaint Type: ", this.complaintTypeName);
        console.log("Title: ", this.complaintTitle);
        console.log("Comment: ", this.comment);
        this.serviceAdapter.addComplaint();
    }
}
