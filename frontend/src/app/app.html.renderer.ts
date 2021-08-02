import { AppComponent } from './app.component';
import { CommonFunctions } from './classes/common-functions';

export class AppHtmlRenderer {

    vm: AppComponent;

    constructor() { }

    initialize(vm: AppComponent): void {
        this.vm = vm;
    }

    getExpiryStatement(): any {
        // 1. User exists, 2. Active School is present, 3. Active School has a date of expiry
        // 4. show only in desktop,
        // 5. User has assign task permission of the School, So that expiry statement is shown only to administrator,
        // 6. Date of Expiry is less than 10 days away
        if(this.vm.user
            && this.vm.user.activeSchool
            && this.vm.user.activeSchool.dateOfExpiry
            && !CommonFunctions.getInstance().isMobileMenu()
            && this.vm.userHasAssignTaskCapability()) {
            console.log('uptill here');
            let dateOfExpiryInDateObject = new Date(this.vm.user.activeSchool.dateOfExpiry+"T23:59:59");
            let todaysDate = new Date();
            if (parseInt(Math.abs(dateOfExpiryInDateObject-todaysDate)/(1000 * 60 * 60 * 24)) < 15) {
                return 'Your school will expire on ' + this.formatDate(dateOfExpiryInDateObject);
            }
        }
        return '';
    }

    formatDate(date): any {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

}
