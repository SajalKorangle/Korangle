import { Component, OnInit } from '@angular/core';

import { DataStorage } from '../../../../classes/data-storage';

import { GenericService } from '@services/generic/generic-service';
import { TrackEmployeeActivityServiceAdapter } from './track-employee-activity.service.adapter';

import { FilterModalComponent } from '@modules/activity/components/filter-modal/filter-modal.component';

import { MatDialog } from '@angular/material';


@Component({
    selector: 'app-track-employee-activity',
    templateUrl: './track-employee-activity.component.html',
    styleUrls: ['./track-employee-activity.component.css'],
    providers: [GenericService],
})
export class TrackEmployeeActivityComponent implements OnInit {
    user;
    isLoading: boolean = false;

    activityRecordList = [];
    // filteredActivityRecordList = [];
    // displayedRecordList = [];
    employeeList = [];
    taskList = [];

    startNumber: number = 0;    /* Starting Index of Records */
    endNumber: number = 0;    /* Ending Index of Records */
    numberOfRecordsPerPage: number = 10;    /* Records Per Page */
    totalRecords: number = 0;
    totalPages: number = 0;
    currentPage: number = 1;    /* Always >= 1 */

    timeSpanData = {};     /* dateFormat: "- None"  or  "StartDate to EndDate" */
    sortType = "";

    seachString = "";

    backgroundColorList = [];

    serviceAdapter: TrackEmployeeActivityServiceAdapter;

    constructor(
        public genericService: GenericService,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new TrackEmployeeActivityServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.timeSpanData["dateFormat"] = "- None";
    }

    /* Initialize Employee List */
    initializeEmployeeList(employeeList: any): void {
        this.employeeList = [];

        employeeList.forEach((employee) => {
            let tempEmployee = {};
            tempEmployee["name"] = employee["name"];
            tempEmployee["dbId"] = employee["id"];
            tempEmployee["selected"] = false;
            this.employeeList.push(tempEmployee);
        });
    }

    /* Initialize Task List */
    initializeTaskList(): void {
        this.taskList = [];
        let moduleList = this.user.activeSchool.moduleList;

        moduleList.forEach((module) => {
            let tempTaskList = module.taskList;
            let bgColor = this.getBackgroundColor();
            tempTaskList.forEach((task) => {
                let tempTask = {};
                tempTask["taskTitle"] = task["title"];
                tempTask["moduleTitle"] = module["title"];
                tempTask["taskDbId"] = task["dbId"];
                tempTask["moduleDbId"] = module["dbId"];
                tempTask["moduleIcon"] = module["icon"];
                tempTask["bgColor"] = bgColor;
                tempTask["selected"] = false;
                this.taskList.push(tempTask);
            });
        });
    }

    /* Initialize Total Records */
    initializeTotalRecords(employeeList: any) {
        this.totalRecords = 0;
        employeeList.forEach((employee) => {
            this.totalRecords += employee.record_count;
        });

        this.totalPages = Math.ceil(this.totalRecords/this.numberOfRecordsPerPage);
        this.endNumber = Math.min(this.numberOfRecordsPerPage, this.totalRecords);
        if(this.endNumber) {
            this.startNumber = 1;
        }
    }

    isMobile(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }

    /* Covert HEX color code to RGB color code */
    hexToRGBA(hex: string) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const alpha = "0.5";
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    /* Generate Random Color */
    getBackgroundColor(): string {
        let randomColor = "#4CAF50";
        while(true) {
            randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
            if(!this.backgroundColorList.includes(randomColor)) {
                break;
            }
        }
        this.backgroundColorList.push(randomColor);
        return this.hexToRGBA(randomColor);
    }

    /* Records Based on Current Page */
    getActivityRecordList() {
        this.endNumber = Math.min(10 * this.currentPage, this.totalRecords);
        this.startNumber = Math.min(10 * (this.currentPage - 1) + 1, this.endNumber);    /* If totalRecords == 0, ==> startNumber = 0 & endNumber = 0 */
        this.serviceAdapter.getRecordsFromFilters();
    }

    setCurrentPage(currentPage) {
        this.currentPage = currentPage;
        this.getActivityRecordList();
    }

    /* Go to Previous Page */
    previousPage() {
        if(this.currentPage > 1) {
            this.currentPage -= 1;
            this.getActivityRecordList();
        }
    }

    /* Go to Next Page */
    nextPage() {
        if(this.currentPage < this.totalPages) {
            this.currentPage += 1;
            this.getActivityRecordList();
        }
    }

    /* Selected Pages in Filter Modal */
    getPagesList() {
        let list = "";
        this.taskList.forEach((task) => {
            if(task.selected) {
                if(list == "") {
                    list = task.moduleTitle + " - " + task.taskTitle;
                } else {
                    list = list + ", " + task.moduleTitle + " - " + task.taskTitle;
                }
            }
        });

        if(list == "") {
            list = "- None";
        } else {
            list = "( " + list + " )";
        }
        return list;
    }

    /* Selected Employees in Filter Modal */
    getEmployeesList() {
        let list = "";
        this.employeeList.forEach((employee) => {
            if(employee.selected) {
                if(list == "") {
                    list = employee.name;
                } else {
                    list = list + ", " + employee.name;
                }
            }
        });

        if(list == "") {
            list = "- None";
        } else {
            list = "( " + list + " )";
        }
        return list;
    }

    /* Format: "-None"  or  "StarteDate to EndDate" */
    getTimeSpanData() {
        return this.timeSpanData["dateFormat"];
    }

    /* Newest or Oldest */
    getSortType() {
        if(this.sortType) {
            return ", " + this.sortType;
        }
        return "";
    }

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

        if(parseInt(date) === 1) {
            timeDate += "st ";
        } else if(parseInt(date) === 2) {
            timeDate += "nd ";
        } else if(parseInt(date) === 3) {
            timeDate += "rd ";
        } else {
            timeDate += "th ";
        }

        if(month == 1) {
            timeDate += "January ";
        } else if(month == 2) {
            timeDate += "February ";
        } else if(month == 3) {
            timeDate += "March ";
        } else if(month == 4) {
            timeDate += "April ";
        } else if(month == 5) {
            timeDate += "May ";
        } else if(month == 6) {
            timeDate += "June ";
        } else if(month == 7) {
            timeDate += "July ";
        } else if(month == 8) {
            timeDate += "August ";
        } else if(month == 9) {
            timeDate += "September ";
        } else if(month == 10) {
            timeDate += "October ";
        } else if(month == 11) {
            timeDate += "November ";
        } else if(month == 12) {
            timeDate += "December ";
        }

        timeDate += year;
        return timeDate;
    }
    /* End of getDateTime */

    /* Get Backgroung Color of Icon */
    getIconBGColor(taskId) {
        let color = "#4CAF50";
        this.taskList.forEach((task) => {
            if(task.taskDbId === taskId) {
                color = task.bgColor;
            }
        });
        return color;
    }

    /* Get Icon of Module */
    getIcon(taskId) {
        let icon = "";
        this.taskList.forEach((task) => {
            if(task.taskDbId === taskId) {
                icon = task.moduleIcon;
            }
        });
        return icon;
    }

    /* Get Employee of Record */
    getEmployeeName(employeeId) {
        let employeeName = "";
        this.employeeList.forEach((employee) => {
            if(employee.dbId === employeeId) {
                employeeName = employee.name;
            }
        });
        return employeeName;
    }

    /* Get Task of Record */
    getModuleTaskName(taskId) {
        let moduleTaskName = "";
        this.taskList.forEach((task) => {
            if(task.taskDbId === taskId) {
                moduleTaskName = task.moduleTitle + " - " + task.taskTitle;
            }
        });
        return moduleTaskName;
    }

    // getTaskListFromFilters() {
    //     let taskIdList = [];
    //     this.taskList.forEach((task) => {
    //         if(task.selected) {
    //             taskIdList.push(task.taskDbId);
    //         }
    //     });
    //
    //     let employeeIdList = [];
    //     this.employeeList.forEach((employee) => {
    //         if(employee.selected) {
    //             employeeIdList.push(employee.dbId);
    //         }
    //     });
    //
    //     this.filteredActivityRecordList = [];
    //     this.activityRecordList.forEach((record) => {
    //         let check = true;
    //         if(taskIdList.length && !taskIdList.includes(record.parentTask)) {
    //             check = false;
    //         }
    //         if(employeeIdList.length && !employeeIdList.includes(record.parentEmployee)) {
    //             check = false;
    //         }
    //         if(this.timeSpanData["dateFormat"] != "- None") {
    //             let createdAt = record.createdAt;
    //             let startDate = this.timeSpanData["dateFormat"].split(" ")[0];
    //             let endDate = this.timeSpanData["dateFormat"].split(" ")[2];
    //
    //             let [sDate, sMonth, sYear] = startDate.split("-");
    //             let [eDate, eMonth, eYear] = endDate.split("-");
    //
    //             sDate = parseInt(sDate);
    //             sMonth = parseInt(sMonth);
    //             sYear = parseInt(sYear);
    //
    //             eDate = parseInt(eDate);
    //             eMonth = parseInt(eMonth);
    //             eYear = parseInt(eYear);
    //
    //             let year = parseInt(createdAt[0] + createdAt[1] + createdAt[2] + createdAt[3]);
    //             let month = parseInt(createdAt[5] + createdAt[6]);
    //             let date = parseInt(createdAt[8] + createdAt[9]);
    //
    //             startDate = new Date(sYear, sMonth - 1, sDate);
    //             endDate = new Date(eYear, eMonth - 1, eDate);
    //             createdAt = new Date(year, month - 1, date);
    //
    //             if(startDate.getTime() > createdAt.getTime() || createdAt.getTime() > endDate.getTime()) {
    //                 check = false;
    //             }
    //         }
    //
    //         if(check) {
    //             this.filteredActivityRecordList.push(record);
    //         }
    //     });
    //
    //     this.currentPage = 1;
    //     if(this.sortType) {
    //         if(this.sortType[0] == 'N') {
    //             this.filteredActivityRecordList.sort(function(a, b) {
    //
    //                 let yearA = parseInt(a.createdAt[0] + a.createdAt[1] + a.createdAt[2] + a.createdAt[3]);
    //                 let monthA = parseInt(a.createdAt[5] + a.createdAt[6]);
    //                 let dateA = parseInt(a.createdAt[8] + a.createdAt[9]);
    //
    //                 let yearB = parseInt(b.createdAt[0] + b.createdAt[1] + b.createdAt[2] + b.createdAt[3]);
    //                 let monthB = parseInt(b.createdAt[5] + b.createdAt[6]);
    //                 let dateB = parseInt(b.createdAt[8] + b.createdAt[9]);
    //
    //                 if(yearA == yearB) {
    //                     if(monthA == monthB) {
    //                         return dateB - dateA;
    //                     }
    //                     return monthB - monthA;
    //                 }
    //                 return yearB - yearA;
    //             });
    //         } else {
    //             this.filteredActivityRecordList.sort(function(a, b) {
    //                 let yearA = parseInt(a[0] + a[1] + a[2] + a[3]);
    //                 let monthA = parseInt(a[5] + a[6]);
    //                 let dateA = parseInt(a[14] + a[15]);
    //
    //                 let yearB = parseInt(b[0] + b[1] + b[2] + b[3]);
    //                 let monthB = parseInt(b[5] + b[6]);
    //                 let dateB = parseInt(b[14] + b[15]);
    //
    //                 if(yearA == yearB) {
    //                     if(monthA == monthB) {
    //                         return dateA - dateB;
    //                     }
    //                     return monthA - monthB;
    //                 }
    //                 return yearA - yearB;
    //             });
    //         }
    //     }
    //     this.getActivityRecordList();
    // }

    debounce(func, timeout = 300){
        let timer;
        return (...args) => {
        clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
         };
    }

    applyFilters() {
        this.currentPage = 1;
        this.getActivityRecordList();
    }

    seachChanged = this.debounce(() => this.applyFilters());

    /* Open Filter Modal */
    openFilterDialog() {
        const dialogRef = this.dialog.open(FilterModalComponent, {
            data: {
                employeeList: this.employeeList,
                taskList: this.taskList,
                timeSpanData: this.timeSpanData,
                sortType: this.sortType,
            }
        });

        dialogRef.afterClosed().subscribe((data) => {
            if(data) {
                this.taskList = data.filtersData.taskList;
                this.employeeList = data.filtersData.employeeList;
                this.timeSpanData = data.filtersData.timeSpanData;
                this.sortType = data.filtersData.sortType;
                this.applyFilters();
            }
        });
    }
}
