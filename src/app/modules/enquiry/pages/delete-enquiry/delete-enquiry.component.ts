import { Component, Input, OnInit } from '@angular/core';

import { EnquiryService } from '../../enquiry.service';
import { ClassService } from '../../../../services/class.service';

import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';


@Component({
    selector: 'delete-enquiry',
    templateUrl: './delete-enquiry.component.html',
    styleUrls: ['./delete-enquiry.component.css'],
})

export class DeleteEnquiryComponent implements OnInit {

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
                map(value => typeof value === 'string' ? value:(value==null?value:value.enquirerName)),
                map(value => this.filter(value))
            );
        });

    }

    filter(value: any): any {
        if (value === '' || value==null) {
            return [];
        }
        return this.enquiryList.filter( enquiry => enquiry.studentName.toLowerCase().indexOf(value.toLowerCase()) === 0 );
    }

    displayFn(enquiry?: any) {
        if (enquiry) {
            return enquiry.studentName + ', ' + enquiry.dateOfEnquiry;
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


    deleteEnquiry(): void {

        let id = this.currentEnquiry.id;

        this.isLoading = true;
        this.enquiryService.deleteEnquiry(this.currentEnquiry, this.user.jwt).then(message => {
            this.isLoading = false;
            alert(message);
            this.selectedEnquiry=null;
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
