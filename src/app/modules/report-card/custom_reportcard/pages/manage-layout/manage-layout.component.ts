import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ChangeDetectorRef } from '@angular/core';

import { ManageLayoutServiceAdapter } from './manage-layout.service.adapter';
import {DataStorage} from "../../../../../classes/data-storage";

declare const $: any;

@Component({
    selector: 'app-manage-layout',
    templateUrl: './manage-layout.component.html',
    styleUrls: ['./manage-layout.component.css'],
    providers: [
    ],
})

export class ManageLayoutComponent implements OnInit {

    user;
    reportCardName:String = 'Report Card Name';

    studentDetailHeader = [
    ['Student Name',true],
    ['Father\'s Name',true],
    ['Mother\'s Name',true],
    ['Scholar No.',true],
    ['Aadhar No.',true],
    ['Roll No.',true],
    ['Date of birth',true],
    ['Category',true],
    ['Child SSMID',true],
    ['Family SSMID',true],
    ];
    
    serviceAdapter: ManageLayoutServiceAdapter;


    constructor(private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        console.log(this.user);
        this.serviceAdapter = new ManageLayoutServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }


    getSessionName(sessionId: any): any {
        let result = '';
        switch(sessionId) {
            case 1:
                result = 'Session 2017-18';
                break;
            case 2:
                result = 'Session 2018-19';
                break;
            case 3:
                result = 'Session 2019-20';
                break;
        }
        return result;
    }

    // Returns the studentDetailHeader which are set to true
    getFilteredStudentDetailHeader(){
        return this.studentDetailHeader.filter(item=>{
            if(item[1] == true){
                return true;
            }
            return false;
        })
    }


    // Drap and drop position
    drop(event: CdkDragDrop<string[]>) {
        console.log(event);
        moveItemInArray(this.studentDetailHeader, event.previousIndex, event.currentIndex);
    }

}
