import { OpenComplaintComponent } from './open-complaint.component';
import { isMobile } from '@classes/common';

export class OpenComplaintHtmlRenderer {

    vm: OpenComplaintComponent;

    constructor() { }

    /* Initialize Renderer */
    initializeRenderer(vm: OpenComplaintComponent): void {
        this.vm = vm;
    }  // Ends: initializeRenderer()

    /* Get Date-Time Info (hh:mm, dd-mm-yy) */
    getDateTimeInfo(createdAt) {
        let newDate: any = new Date(createdAt);

        /* Get Hour */
        let hour = newDate.getHours();
        let hourString = "";
        if (hour < 10) {
            hourString = "0" + hour;
        } else {
            hourString = "" + hour;
        }

        /* Get Minute */
        let minutes = newDate.getMinutes();
        let minutesString = "";
        if (minutes < 10) {
            minutesString = "0" + minutes;
        } else {
            minutesString = "" + minutes;
        }

        /* Get Day */
        let day = newDate.getDate();
        let dayString = "";
        if (day < 10) {
            dayString = "0" + day;
        } else {
            dayString = "" + day;
        }

        /* Get Year */
        let year = newDate.getFullYear();

        /* Get Month */
        let month = newDate.getMonth() + 1;
        let monthString = "";
        if (month < 10) {
            monthString = "0" + month;
        } else {
            monthString = "" + month;
        }

        let dateTimeInfo = "";
        dateTimeInfo = hourString + ":" + minutesString + ", " + dayString + "-" + monthString + "-" + (year % 100);
        return dateTimeInfo;
    }  // Ends: getDateTimeInfo()

    /* Get Date Info (dd-mm-yy) */
    getDateInfo(createdAt) {
        let newDate: any = new Date(createdAt);

        /* Get Day */
        let day = newDate.getDate();
        let dayString = "";
        if (day < 10) {
            dayString = "0" + day;
        } else {
            dayString = "" + day;
        }

        /* Get Year */
        let year = newDate.getFullYear();

        /* Get Month */
        let month = newDate.getMonth() + 1;
        let monthString = "";
        if (month < 10) {
            monthString = "0" + month;
        } else {
            monthString = "" + month;
        }

        let dateInfo = "";
        dateInfo = dayString + "-" + monthString + "-" + (year % 100);

        let today: any = new Date();
        let dateDiff: any = Math.round(Math.abs(today - newDate) / (1000 * 60 * 60 * 24));
        if (dateDiff == 0) {
            dateInfo = "Today";
        } else if (dateDiff == 1) {
            dateInfo = "Yesterday";
        } else if (dateDiff <= 3) {
            dateInfo = "" + (dateDiff) + " days ago";
        }
        return dateInfo;
    }  // Ends: getDateInfo()

    /* Get Author of Comment */
    getAuthorComment(comment) {
        if (comment.parentEmployee["id"]) {
            return comment.parentEmployee.name;
        }
        return comment.parentStudent.fathersName;
    }  // Ends: getAuthorComment()

     /* For mobile-browser */
    isMobileBrowser(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }  // Ends: isMobileBrowser()

    /* For mobile-application */
    isMobileApplication(): boolean {
        return isMobile();
    }  // Ends: isMobileApplication()
}
