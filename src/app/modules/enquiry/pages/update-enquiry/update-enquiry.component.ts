import { Component, Input, OnInit } from '@angular/core';

import { EnquiryService } from '../../enquiry.service';
import { ClassService } from '../../../../services/class.service';

import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';

@Component({
  selector: 'update-enquiry',
  templateUrl: './update-enquiry.component.html',
  styleUrls: ['./update-enquiry.component.css'],
})

export class UpdateEnquiryComponent implements OnInit {

    @Input() user;

    classList: any;

    enquiryList: any;
    filteredEnquiryList: any;

    selectedEnquiry: any;

    currentEnquiry: any;

    myControl = new FormControl();

    isLoading = false;

    constructor (private enquiryService: EnquiryService,
                 private classService: ClassService) { }

    ngOnInit(): void {

        this.currentEnquiry = {};

        const data = {
            parentSchool: this.user.activeSchool.dbId,
        };

        Promise.all([
            this.classService.getClassList(this.user.jwt),
            this.enquiryService.getMiniEnquiryList(data, this.user.jwt),
        ]).then(value => {
            this.classList = value[0];
            this.enquiryList = value[1];
            this.filteredEnquiryList = this.myControl.valueChanges.pipe(
                map(value => typeof value === 'string' ? value: (value as any).enquirerName),
                map(value => this.filter(value))
            );
        });

    }

    filter(value: any): any {
        if (value === '') {
            return [];
        }
        return this.enquiryList.filter( enquiry => enquiry.enquirerName.toLowerCase().indexOf(value.toLowerCase()) === 0 );
    }

    displayFn(enquiry?: any) {
        if (enquiry) {
            return enquiry.enquirerName + ', ' + enquiry.dateOfEnquiry;
        } else {
            return '';
        }
    }

    getEnquiry(enquiry: any): void {

        const data = {
            id: enquiry.id,
        };

        this.isLoading = true;
        this.enquiryService.getEnquiry(data, this.user.jwt).then( enquiry => {
            this.isLoading = false;
            this.selectedEnquiry = enquiry;
            Object.keys(this.selectedEnquiry).forEach(key => {
                this.currentEnquiry[key] = this.selectedEnquiry[key];
            });
        }, error => {
            this.isLoading = false;
        });

    }

    updateEnquiry(): void {

        if (this.currentEnquiry.studentName === undefined || this.currentEnquiry.studentName === '') {
            alert('Name should be populated');
            return;
        }

        if (this.currentEnquiry.enquirerName === undefined || this.currentEnquiry.enquirerName === '') {
            alert('Father\'s Name should be populated');
            return;
        }

        let id = this.currentEnquiry.id;

        this.isLoading = true;
        this.enquiryService.updateEnquiry(this.currentEnquiry, this.user.jwt).then(message => {
            this.isLoading = false;
            alert(message);
            if (this.selectedEnquiry.id === id) {
                this.selectedEnquiry = this.currentEnquiry;
            }
        }, error => {
            this.isLoading = false;
        });

    }

    getClass(dbId: number): any {
        let result = null;
        this.classList.every(classs => {
            if (classs.dbId === dbId) {
                result = classs;
                return false;
            }
            return true;
        });
        return result;
    }

}
