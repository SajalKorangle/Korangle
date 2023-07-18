import { FilterModalComponent } from './filter-modal.component';

export class FilterModalHtmlRenderer {

    vm: FilterModalComponent;

    constructor() {
    }

    initializeRenderer(vm: FilterModalComponent): void {
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

    /* Format: "-None"  or  "StartDate to EndDate" */
    getTimeSpanData() {
        let startDate, endDate;
        let timeSpanData = {};
        timeSpanData["dateFormat"] = "- None";
        if (this.vm.startDate && this.vm.endDate) {
            if (this.vm.startDate == "sDate") {   // Start Date Type: startDate
                if (!this.vm.sDate) {
                    timeSpanData["dateFormat"] = "- None";
                    return timeSpanData;
                }

                let [year, month, date] = this.vm.sDate.split("-");
                let newDate = "";
                newDate = date + "-" + month + "-" + year;
                startDate = newDate;
                timeSpanData["startDateType"] = "sDate";

            } else if (this.vm.startDate == "dayOne") {   // Start Date Type: 1st day of month
                let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
                [month, date, year] = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString("en-US").split("/");

                let newDate = "";
                if (parseInt(date) < 10) {
                    newDate = "0" + date + "-" + month + "-" + year;
                } else {
                    newDate = date + "-" + month + "-" + year;
                }
                startDate = newDate;
                timeSpanData["startDateType"] = "dayOne";

            } else if (this.vm.startDate == "startDays") {   // Start Date Type: days ago

                let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
                var result = new Date(parseInt(year), parseInt(month) - 1, parseInt(date));
                result.setDate(result.getDate() - this.vm.startDays);
                [month, date, year] = result.toLocaleDateString("en-US").split("/");

                let newDate = "";
                if (parseInt(date) < 10) {
                    newDate = "0" + date + "-" + month + "-" + year;
                } else {
                    newDate = date + "-" + month + "-" + year;
                }
                startDate = newDate;
                timeSpanData["startDateType"] = "startDays" + this.vm.startDays;
            }

            if (this.vm.endDate == "eDate") {   // End Date Type: endDate
                if (!this.vm.eDate) {
                    timeSpanData["dateFormat"] = "- None";
                    return timeSpanData;
                }

                let [year, month, date] = this.vm.eDate.split("-");
                let newDate = "";
                newDate = date + "-" + month + "-" + year;
                endDate = newDate;
                timeSpanData["endDateType"] = "eDate";

            } else if (this.vm.endDate == "today") {   // End Date Type: today
                let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");

                let newDate = "";
                if (parseInt(date) < 10) {
                    newDate = "0" + date + "-" + month + "-" + year;
                } else {
                    newDate = date + "-" + month + "-" + year;
                }
                endDate = newDate;
                timeSpanData["endDateType"] = "today";

            } else if (this.vm.endDate == "endDays") {   // End Date Type: days ago

                let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
                var result = new Date(parseInt(year), parseInt(month) - 1, parseInt(date));
                result.setDate(result.getDate() - this.vm.endDays);
                [month, date, year] = result.toLocaleDateString("en-US").split("/");

                let newDate = "";
                if (parseInt(date) < 10) {
                    newDate = "0" + date + "-" + month + "-" + year;
                } else {
                    newDate = date + "-" + month + "-" + year;
                }
                endDate = newDate;
                timeSpanData["endDateType"] = "endDays" + this.vm.endDays;
            }

            let dateFormat = startDate + " to " + endDate;
            timeSpanData["dateFormat"] = dateFormat;
            return timeSpanData;
        }
        return timeSpanData;
    }  // Ends: getTimeSpanData()

    /* Newest or Oldest */
    getSortType() {
        if (this.vm.sortType) {
            return ", " + this.vm.sortType;
        }
        return "";
    }  // Ends: getSortType()
}
