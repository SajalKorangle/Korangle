import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";
import { MatDialog } from '@angular/material';

import { AssignEmployeeComponent } from '@modules/parent-support/component/assign-employee/assign-employee.component';
import { ManageAllComplaintsServiceAdapter } from './manage-all-complaints.service.adapter';

@Component({
    selector: 'app-manage-all-complaints',
    templateUrl: './manage-all-complaints.component.html',
    styleUrls: ['./manage-all-complaints.component.css']
})
export class ManageAllComplaintsComponent implements OnInit {
    user: any;
    isLoading: boolean;

    pageName: string = "showTables";

    studentList: any = [];
    complaintList: any = [];

    serviceAdapter: ManageAllComplaintsServiceAdapter;


    constructor(
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);

        this.serviceAdapter = new ManageAllComplaintsServiceAdapter();
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

    /* Open Filter Modal */
    openAssignEmployeeDialog(): void {
        const dialogRef = this.dialog.open(AssignEmployeeComponent, {
            data: {
                msg: "Hello",
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            // if (data && data.filtersData) {
            //     let filtersData = data.filtersData;
            //     if (this.whereToAdd === 'row') {  /* Row Filter */
            //         let returnData = this.getTableDataRow(filtersData);
            //         filtersData["answer"] = returnData.answer;
            //         filtersData["totalCount"] = returnData.totalCount;
            //         this.rowFilters.push(filtersData);
            //     } else if (this.whereToAdd === 'col') {  /* Column Filter */
            //         filtersData["totalCount"] = this.getTableDataColumn(filtersData);
            //         this.columnFilters.push(filtersData);
            //     }
            // } else {
            //     this.classSectionList.forEach((classs) => {
            //         classs.sectionList.forEach((section) => {
            //             section.selected = false;
            //         });
            //     });
            // }
            console.log("closed");
        });
    }  // Ends: openAddStatusDialog()

    openComplaint(complaint, idx) {
        this.pageName = "showComplaint";
    }
}
