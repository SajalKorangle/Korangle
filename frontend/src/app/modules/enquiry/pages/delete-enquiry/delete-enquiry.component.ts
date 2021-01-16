import { Component, Input, OnInit } from '@angular/core';

import { EnquiryOldService } from "../../../../services/modules/enquiry/enquiry-old.service";
import { ClassService } from '@services/modules/class/class.service';

import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';
import {DataStorage} from "../../../../classes/data-storage";


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

    myControl = new FormControl();

    isLoading = false;

    constructor (private enquiryService: EnquiryOldService,
                 private classService: ClassService) { }

    ngOnInit(): void {

        this.user = DataStorage.getInstance().getUser();

        const data = {
            parentSchool: this.user.activeSchool.dbId,
        };

        Promise.all([
            this.classService.getObjectList(this.classService.classs, {}),
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
        }, error => {
            this.isLoading = false;
        });

    }


    deleteEnquiry(): void {

        this.isLoading = true;
        this.enquiryService.deleteEnquiry(this.selectedEnquiry, this.user.jwt).then(message => {
            this.enquiryList = this.enquiryList.filter(enquiry => {
                return enquiry.id != this.selectedEnquiry.id;
            });
            this.selectedEnquiry=null;
            this.isLoading = false;
            alert(message);
        }, error => {
            this.isLoading = false;
        });

    }



    getClass(id: number): any {
        let result = null;
        this.classList.every(classs => {
            if (classs.id === id) {
                result = classs;
                return false;
            }
            return true;
        });
        return result;
    }

}
