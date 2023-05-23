import { Component, Input, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';
import { DataStorage } from '../../../../classes/data-storage';
import { DeleteEnquiryServiceAdapter } from './delete-enquiry.service.adapter';

@Component({
    selector: 'delete-enquiry',
    templateUrl: './delete-enquiry.component.html',
    styleUrls: ['./delete-enquiry.component.css'],
})
export class DeleteEnquiryComponent implements OnInit {
    @Input() user;

    classList: any;

    enquiryList: any;
    filteredEnquiryList: any;

    selectedEnquiry: any;

    myControl = new FormControl();

    inPagePermissions: any;

    serviceAdapter: DeleteEnquiryServiceAdapter;

    isLoading = false;

    constructor() {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new DeleteEnquiryServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

    }

    filter(value: any): any {
        if (value === '' || value == null) {
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

    getClass(id: number): any {
        let result = null;
        this.classList.every((classs) => {
            if (classs.id === id) {
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
