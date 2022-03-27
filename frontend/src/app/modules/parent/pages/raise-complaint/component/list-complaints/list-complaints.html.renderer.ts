import { ListComplaintsComponent } from './list-complaints.component';

export class ListComplaintsHtmlRenderer {

    vm: ListComplaintsComponent;

    constructor() { }

    /* Initialize Renderer */
    initializeRenderer(vm: ListComplaintsComponent): void {
        this.vm = vm;
    }  // Ends: initializeRenderer()

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
}
