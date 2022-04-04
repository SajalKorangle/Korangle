import {ContactUsComponent} from './contact-us.component';

export class ContactUsServiceAdapter {
    vm: ContactUsComponent;
    recaptcha: any;

    constructor() {
    }

    // Data

    initializeAdapter(vm: ContactUsComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {
    }

    // creating contact details
    async submitDetails() {
        this.vm.stateKeeper.isLoading = true;
        const response = await this.vm.contactService.createObject(this.vm.contactService.contact_details, this.vm.contactDetails);
        console.log(response);
        if (response.status == 'success') {
            alert('Your details have been submitted, we will contact you soon');
            this.vm.clearDetails();
        } else if (response.status == 'failure') {
            alert('Contact Creation Failed, Try again');
        }
        this.vm.stateKeeper.isLoading = false;
    }

}