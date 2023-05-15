import { Component, Input, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';
import { DataStorage } from '../../../../classes/data-storage';
import { UpdateEnquiryServiceAdapter } from './update-enquiry.service.adapter';

@Component({
    selector: 'update-enquiry',
    templateUrl: './update-enquiry.component.html',
    styleUrls: ['./update-enquiry.component.css'],
})
export class UpdateEnquiryComponent implements OnInit {
    user: any;

    classList: any;

    enquiryList: any;
    filteredEnquiryList: any;

    selectedEnquiry: any;

    currentEnquiry: any;

    myControl = new FormControl();

    inPagePermissions: any;

    serviceAdapter: UpdateEnquiryServiceAdapter;

    isLoading = false;

    constructor() {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.currentEnquiry = {};

        this.serviceAdapter = new UpdateEnquiryServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

    }

    filter(value: any): any {
        if (value === '') {
            return [];
        }
        return this.enquiryList.filter((enquiry) => enquiry.enquirerName.toLowerCase().indexOf(value.toLowerCase()) === 0);
    }

    displayFn(enquiry?: any) {
        if (enquiry) {
            return enquiry.enquirerName + ', ' + enquiry.dateOfEnquiry;
        } else {
            return '';
        }
    }

    getClass(dbId: number): any {
        let result = null;
        this.classList.every((classs) => {
            if (classs.id === dbId) {
                result = classs;
                return false;
            }
            return true;
        });
        return result;
    }

    isAdmin(): boolean {
        return !this.inPagePermissions || this.inPagePermissions.userType == 'Admin';
    }

}
