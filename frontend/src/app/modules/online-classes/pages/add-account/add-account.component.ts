import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { AddAccountServiceAdapter } from './add-account.service.adapter';
import { AddAccountHtmlRenderer } from './add-account.html.renderer';
import { AddAccountUserInput } from './add-account.user.input';
import { AddAccountBackendData } from './add-account.backend.data';

import { OnlineClassService } from '@services/modules/online-class/online-class.service';
import { EmployeeService } from '@services/modules/employee/employee.service';

import { USER_PERMISSION_KEY, ADMIN_PERMSSION } from './add-account.permissions';

@Component({
    selector: 'add-account',
    templateUrl: './add-account.component.html',
    styleUrls: ['./add-account.component.css'],
    providers: [OnlineClassService, EmployeeService],
})

export class AddAccountComponent implements OnInit {

    user: any;

    serviceAdapter: AddAccountServiceAdapter;
    htmlRenderer: AddAccountHtmlRenderer;
    userInput: AddAccountUserInput;
    backendData: AddAccountBackendData;

    isLoading: boolean = true;

    constructor(public onlineClassService: OnlineClassService, public employeeService: EmployeeService) {
        console.log('this', this);
    }

    ngOnInit(): void {

        this.user = DataStorage.getInstance().getUser();

        this.userInput = new AddAccountUserInput();
        this.userInput.initialize(this);

        this.backendData = new AddAccountBackendData();
        this.backendData.initialize(this);

        this.htmlRenderer = new AddAccountHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new AddAccountServiceAdapter();
        this.serviceAdapter.initialize(this);
        this.serviceAdapter.initializeData();
    }

    dataLoadSetUp() {
        this.userInput.resetNewAccountInfo();
        this.isLoading = false;
    }

    newAccountInfoSanatyCheck(meetingNumber, passcode): boolean {
        if ((!meetingNumber) || (!passcode)) {  // check for all the fields
            alert("All fields are required");
            return false;
        }
        return true;
    }

    newAccountInfoSanatyCheckURL(meetingUrl): boolean {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '(((meet\\.google\\.)|(teams\\.live\\.))+[a-z]{2,})' + // domain name
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*') ; // port and path
        if (!meetingUrl) {  // check for all the fields
            alert("All fields are required");
            return false;
        }
        else if (!pattern.test(meetingUrl)) {
            alert("URL is not valid");
            return false;
        }
        return true;
    }

    hasAdminPermission(): boolean {
        if (this.backendData.inPagePermissionMappedByKey[USER_PERMISSION_KEY] == ADMIN_PERMSSION)
            return true;
        return false;
    }
}
