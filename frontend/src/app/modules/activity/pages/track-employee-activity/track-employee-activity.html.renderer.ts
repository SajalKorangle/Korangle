import { TrackEmployeeActivityComponent } from './track-employee-activity.component';

export class TrackEmployeeActivityHtmlRenderer {

    vm: TrackEmployeeActivityComponent;

    constructor() {
    }

    initializeRenderer(vm: TrackEmployeeActivityComponent): void {
        this.vm = vm;
    }

    /* Selected Pages in Modal */
    getPagesList() {
        let list = "";
        this.vm.taskList.forEach((task) => {
            if (task.selected) {
                if (list == "") {
                    list = task.moduleTitle + " - " + task.taskTitle;
                } else {
                    list = list + ", " + task.moduleTitle + " - " + task.taskTitle;
                }
            }
        });

        if (list == "") {
            list = "- None";
        } else {
            list = "( " + list + " )";
        }
        return list;
    }  // Ends: getPagesList()

    /* Selected Employees in Modal */
    getEmployeesList() {
        let list = "";
        this.vm.employeeList.forEach((employee) => {
            if (employee.selected) {
                if (list == "") {
                    list = employee.name;
                } else {
                    list = list + ", " + employee.name;
                }
            }
        });

        if (list == "") {
            list = "- None";
        } else {
            list = "( " + list + " )";
        }
        return list;
    }  // Ends: getEmployeesList()

    isMobile(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }

    /* Format: "-None"  or  "StarteDate to EndDate" */
    getTimeSpanData() {
        return this.vm.timeSpanData["dateFormat"];
    }  // Ends: getTimeSpanData()

    /* Newest or Oldest */
    getSortType() {
        if (this.vm.sortType) {
            return ", " + this.vm.sortType;
        }
        return "";
    }  // Ends: getSortType()

    /* Get Backgroung Color of Icon */
    getIconBGColor(taskId) {
        let color = "#4CAF50";
        this.vm.taskList.forEach((task) => {
            if (task.taskDbId === taskId) {
                color = task.bgColor;
            }
        });
        return color;
    }  // Ends: getIconBGColor()

    /* Get Icon of Module */
    getIcon(taskId) {
        let icon = "";
        this.vm.taskList.forEach((task) => {
            if (task.taskDbId === taskId) {
                icon = task.moduleIcon;
            }
        });
        return icon;
    }  // Ends: getIcon()

    /* Get Employee of Record */
    getEmployeeName(employeeId) {
        let employeeName = "";
        this.vm.employeeList.forEach((employee) => {
            if (employee.dbId === employeeId) {
                employeeName = employee.name;
            }
        });
        return employeeName;
    }  // Ends: getEmployeeName()

    /* Get Task of Record */
    getModuleTaskName(taskId) {
        let moduleTaskName = "";
        this.vm.taskList.forEach((task) => {
            if (task.taskDbId === taskId) {
                moduleTaskName = task.moduleTitle + " - " + task.taskTitle;
            }
        });
        return moduleTaskName;
    }  // Ends: getModuleTaskName()

    /* Time(hh:mm)  &&  Date(dd month_name year) */
    getDateTimeOfRecord(record) {
        let createdAt = new Date(record.createdAt);

        let hour = createdAt.getHours();
        let hourString = "";
        if (hour < 10) {
            hourString = "0" + hour;
        } else {
            hourString = "" + hour;
        }

        let minutes = createdAt.getMinutes();
        let minutesString = "";
        if (minutes < 10) {
            minutesString = "0" + minutes;
        } else {
            minutesString = "" + minutes;
        }

        let date = createdAt.getDate();
        let dateString = "";
        if (date < 10) {
            dateString = "0" + date;
        } else {
            dateString = "" + date;
        }

        let year = createdAt.getFullYear();
        let month = createdAt.getMonth() + 1;

        let timeDate = "";
        timeDate = hourString + ":" + minutesString + ", " + dateString;

        if (date === 1) {
            timeDate += "st ";
        } else if (date === 2) {
            timeDate += "nd ";
        } else if (date === 3) {
            timeDate += "rd ";
        } else {
            timeDate += "th ";
        }

        if (month == 1) {
            timeDate += "January ";
        } else if (month == 2) {
            timeDate += "February ";
        } else if (month == 3) {
            timeDate += "March ";
        } else if (month == 4) {
            timeDate += "April ";
        } else if (month == 5) {
            timeDate += "May ";
        } else if (month == 6) {
            timeDate += "June ";
        } else if (month == 7) {
            timeDate += "July ";
        } else if (month == 8) {
            timeDate += "August ";
        } else if (month == 9) {
            timeDate += "September ";
        } else if (month == 10) {
            timeDate += "October ";
        } else if (month == 11) {
            timeDate += "November ";
        } else if (month == 12) {
            timeDate += "December ";
        }

        timeDate += year;
        return timeDate;
    }  // Ends: getDateTimeOfRecord()
}
