import { Component, OnInit } from '@angular/core';

import { DataStorage } from '../../../../classes/data-storage';
import { Query } from '@services/generic/query';

@Component({
    selector: 'add-enquiry',
    templateUrl: './add-enquiry.component.html',
    styleUrls: ['./add-enquiry.component.css'],
})
export class AddEnquiryComponent implements OnInit {
    user: any;

    newEnquiry: any;

    classList: any;

    isLoading = false;

    constructor() {}

    async ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.newEnquiry = {};

        this.classList = await new Query()
            .getObjectList({'class_app': 'Class'});
    }

    async createEnquiry() {
        if (this.newEnquiry.enquirerName === undefined || this.newEnquiry.enquirerName === '') {
            alert("Enquirer's Name should be populated");
            return;
        }

        if (this.newEnquiry.studentName === undefined || this.newEnquiry.studentName === '') {
            alert("Student's Name should be populated");
            return;
        }

        if (this.newEnquiry.parentClass === undefined || this.newEnquiry.parentClass === '') {
            alert('Class should be populated');
            return;
        }

        this.newEnquiry.parentSchool = this.user.activeSchool.dbId;
        this.newEnquiry.parentEmployee = this.user.activeSchool.employeeId;

        this.isLoading = true;

        await new Query()
            .createObject({'enquiry_app': 'Enquiry'}, this.newEnquiry);

        alert('Enquiry created successfully');

        this.newEnquiry = {};

        this.isLoading = false;

    }
}
