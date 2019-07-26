import {Component, Input, OnInit} from '@angular/core';

import { EnquiryService } from '../../enquiry.service';
import { ClassService } from '../../../../services/class.service';
import {PrintService} from "../../../../print/print-service";
import {PRINT_ENQUIRY_LIST} from "../../../../print/print-routes.constants";
import { EmployeeService } from '../../../employee/employee.service';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
    selector: 'view-all',
    templateUrl: './view-all.component.html',
    styleUrls: ['./view-all.component.css'],
    providers: [EmployeeService],
})

export class ViewAllComponent implements OnInit {

    user: any;

    enquiryList = [];

    classList = [];
    employeeList = []; 

    startDate = this.todaysDate();
    endDate = this.todaysDate();

    isLoading = false;

    constructor(private enquiryService: EnquiryService,
                private classService: ClassService,
                private printService: PrintService,
                private employeeService: EmployeeService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        let data = {
            parentSchool: this.user.activeSchool.dbId
        };

        Promise.all([
            this.classService.getClassList(this.user.jwt),
            this.employeeService.getEmployeeProfileList(data, this.user.jwt)
        ]).then(res => {
            this.classList = res[0];
            this.employeeList = res[1];
        });
    }

    todaysDate(): string {
        const d = new Date();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) { month = '0' + month; }
        if (day.length < 2) { day = '0' + day; }

        return year + '-' + month + '-' + day;
    }

    getEnquiryList(): void {

        let data = {
            startDate: this.startDate,
            endDate: this.endDate,
            parentSchool: this.user.activeSchool.dbId,
        };

        this.isLoading = true;
        this.enquiryService.getEnquiryList(data, this.user.jwt).then(enquiryList => {
            this.isLoading = false;
            this.enquiryList = enquiryList;
        }, error => {
            this.isLoading = false;
        });

    }

    getEmployeeName(employeeId: number): string {
        let employee = this.employeeList.find(employee => {
            return employeeId == employee.id;
        });
        if (employee) {
            return employee.name;
        }
        return '';
    }

    printEnquiryList(){
        this.printService.navigateToPrintRoute(PRINT_ENQUIRY_LIST, {user: this.user, value: [this.enquiryList,this.classList]});
    }

    getClassName(dbId: number): string {
        let className = '';
        this.classList.every(classs => {
            if (classs.dbId === dbId) {
                className = classs.name;
                return false;
            }
            return true;
        });
        return className;
    }

}
