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
        let createdAt = record.createdAt;
        let timeDate = "";
        let hour = createdAt[11] + createdAt[12];
        let minutes = createdAt[14] + createdAt[15];

        let year = createdAt[0] + createdAt[1] + createdAt[2] + createdAt[3];
        let month = parseInt(createdAt[5] + createdAt[6]);
        let date = createdAt[8] + createdAt[9];

        timeDate = hour + ":" + minutes + ", " + date;

        if (parseInt(date) === 1) {
            timeDate += "st ";
        } else if (parseInt(date) === 2) {
            timeDate += "nd ";
        } else if (parseInt(date) === 3) {
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
