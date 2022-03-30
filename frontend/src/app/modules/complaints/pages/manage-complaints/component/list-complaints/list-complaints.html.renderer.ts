import { ListComplaintsComponent } from './list-complaints.component';

export class ListComplaintsHtmlRenderer {

    vm: ListComplaintsComponent;

    constructor() { }

    /* Initialize Renderer */
    initializeRenderer(vm: ListComplaintsComponent): void {
        this.vm = vm;
    }  // Ends: initializeRenderer()

    /* Get Primary Color */
    getPrimaryColor() {
        return 'rgba(76, 175, 80, 0.2)';
    }  // Ends: getPrimaryColor()

    /* Get Secondary Color */
    getSecondaryColor() {
        let bgColor = "1976D2";
        switch (this.vm.user.activeSchool.secondaryThemeColor) {
            case 'primary':
                bgColor = '1976D2';
                break;

            case 'secondary':
                bgColor = '424242';
                break;

            case 'accent':
                bgColor = '82B1FF';
                break;

            case 'error':
                bgColor = 'FF5252';
                break;

            case 'info':
                bgColor = '2196F3';
                break;

            case 'success':
                bgColor = '4CAF50';
                break;

            case 'warning':
                bgColor = 'FFC107';
                break;
        }

        bgColor = '#' + bgColor;
        return bgColor;
    }  // Ends: getSecondaryColor()

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

    /* Get Assigned Employee Name List */
    getAssignedEmployeeName(employeeComplaintList) {
        let employeeName = "";
        let length = employeeComplaintList.length;

        for (let i = 0; i < length; i++) {
            employeeName += employeeComplaintList[i].name;
            if (i < length - 1) {
                employeeName += ", ";
            }
        }

        return employeeName;
    }  // Ends: getAssignedEmployeeName()
}
