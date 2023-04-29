import { Component, OnInit } from '@angular/core';

import { PrintService } from '../../../../print/print-service';
import { PRINT_ENQUIRY_LIST } from '../../../../print/print-routes.constants';
import { DataStorage } from '../../../../classes/data-storage';
import {CommonFunctions} from '@classes/common-functions';
import { ViewAllServiceAdapter } from './view-all.service.adapter';

@Component({
    selector: 'view-all',
    templateUrl: './view-all.component.html',
    styleUrls: ['./view-all.component.css'],
})
export class ViewAllComponent implements OnInit {
    user: any;

    enquiryList = [];

    classList = [];
    employeeList = [];

    selectedEmployee = null;
    filteredEmployeeList = [];

    selectedClass = null;
    filteredClassList = [];

    startDate = this.todaysDate();
    endDate = this.todaysDate();

    inPagePermissions: any;

    serviceAdapter: ViewAllServiceAdapter;

    isLoading = false;

    constructor(
        private printService: PrintService,
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new ViewAllServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

    }

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }

    todaysDate(): string {
        const d = new Date();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }

        return year + '-' + month + '-' + day;
    }

    getEmployeeName(employeeId: number): string {
        let employee = this.employeeList.find((employee) => {
            return employeeId == employee.id;
        });
        if (employee) {
            return employee.name;
        }
        return '';
    }

    getFilteredEmployeeList() {
        this.filteredEmployeeList = this.employeeList.filter((employee) => {
            return this.enquiryList
                .map((a) => a.parentEmployee)
                .filter((item, index, final) => {
                    return final.indexOf(item) == index;
                })
                .includes(employee.id);
        });

        return this.filteredEmployeeList;
    }

    getFilteredEnquiryList(): any {
        let tempList = this.enquiryList;
        if (this.selectedEmployee) {
            tempList = tempList.filter((enqList) => {
                return enqList.parentEmployee == this.selectedEmployee.id;
            });
        }

        if (this.selectedClass) {
            tempList = tempList.filter((enqList) => {
                return enqList.parentClass == this.selectedClass.id;
            });
        }
        return tempList;
    }

    printEnquiryList() {
        this.printService.navigateToPrintRoute(PRINT_ENQUIRY_LIST, {
            user: this.user,
            value: [this.getFilteredEnquiryList(), this.getFilteredClassList(), this.getFilteredEmployeeList()],
        });
    }

    getClassName(dbId: number): string {
        let className = '';
        this.classList.every((classs) => {
            if (classs.id === dbId) {
                className = classs.name;
                return false;
            }
            return true;
        });
        return className;
    }

    getFilteredClassList() {
        this.filteredClassList = this.classList.filter((className) => {
            return this.enquiryList
                .map((a) => a.parentClass)
                .filter((item, index, final) => {
                    return final.indexOf(item) == index;
                })
                .includes(className.id);
        });
        return this.filteredClassList;
    }

    isAdmin(): boolean {
        return !this.inPagePermissions || this.inPagePermissions.userType == 'Admin';
    }

}
