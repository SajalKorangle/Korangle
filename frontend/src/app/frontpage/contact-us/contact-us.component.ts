import {Component, OnInit} from '@angular/core';
import {CommonFunctions} from '@classes/common-functions';
import {VALIDATORS_REGX} from '@classes/regx-validators';
import {ContactUsServiceAdapter} from './contact-us.service.adapter';
import {ContactService} from '@services/modules/contact/contact.service';

@Component({
    selector: 'contact-us-component',
    templateUrl: './contact-us.component.html',
    providers: [ContactService],
    styleUrls: ['../components/contact-us-create-school/contact-us-create-school.component.css']
})
export class ContactUsComponent implements OnInit {

    serviceAdapter: ContactUsServiceAdapter;

    validators = VALIDATORS_REGX;

    // user entered variables
    contactDetails = {
        mobileNumber: '',
        firstName: '',
        lastName: '',
        schoolName: null,
        emailId: null,
    };

    stateKeeper = {
        isLoading: false
    };

    constructor(public contactService: ContactService) {
    }

    ngOnInit() {
        this.serviceAdapter = new ContactUsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
    }

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }

    isSubmitDisabled() {
        if (!this.validators.phoneNumber.test(this.contactDetails.mobileNumber) || this.contactDetails.firstName.trim().length < 2 ||
            this.contactDetails.lastName.trim().length < 2 || (this.contactDetails.emailId && this.contactDetails.emailId.trim().length > 0 &&
                !this.validators.email.test(this.contactDetails.emailId))) {
            return true;
        }
    }

    clearDetails() {
        this.contactDetails = {
            mobileNumber: '',
            firstName: '',
            lastName: '',
            schoolName: null,
            emailId: null,
        };
    }
}
