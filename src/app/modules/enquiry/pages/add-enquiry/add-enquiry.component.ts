import {Component, OnInit} from '@angular/core';

import { ClassService } from '../../../../services/class.service';
import { EnquiryService } from '../../enquiry.service';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'add-enquiry',
  templateUrl: './add-enquiry.component.html',
  styleUrls: ['./add-enquiry.component.css'],
})

export class AddEnquiryComponent implements OnInit {

    user: any;

    newEnquiry: any;

    classList: any;

    isLoading = false;

    constructor (private enquiryService: EnquiryService,
                 private classService: ClassService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.newEnquiry = {};

        this.classService.getClassList(this.user.jwt).then(classList => {
            this.classList = classList;
        });

    }

    createEnquiry(): void {

        if (this.newEnquiry.enquirerName === undefined || this.newEnquiry.enquirerName === '') {
            alert('Enquirer\'s Name should be populated');
            return;
        }

        if (this.newEnquiry.studentName === undefined || this.newEnquiry.studentName === '') {
            alert('Student\'s Name should be populated');
            return;
        }

        if (this.newEnquiry.parentClass === undefined || this.newEnquiry.parentClass === '') {
            alert('Class should be populated');
            return;
        }

        this.newEnquiry.parentSchool = this.user.activeSchool.dbId;
        this.newEnquiry.parentEmployee = this.user.activeSchool.employeeId;

        this.isLoading = true;

        this.enquiryService.createEnquiry(this.newEnquiry, this.user.jwt).then(message => {
                this.isLoading = false;
                alert(message);
                this.newEnquiry = {};
            }, error => {
                this.isLoading = false;
            }
        );
    }

}
