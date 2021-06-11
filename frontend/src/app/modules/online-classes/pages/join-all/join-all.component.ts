import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { JoinAllServiceAdapter } from './join-all.service.adapter';
import { JoinAllHtmlRenderer } from './join-all.html.renderer';

import { AccountInfo } from '@services/modules/online-class/models/account-info';
import { ClassSubject } from '@services/modules/subject/models/class-subject';
import { Subject } from '@services/modules/subject/models/subject';
import {OnlineClass} from '@services/modules/online-class/models/online-class';

import { SubjectService } from '@services/modules/subject/subject.service';
import { OnlineClassService } from '@services/modules/online-class/online-class.service';
import { ClassService } from '@services/modules/class/class.service';
import { SchoolService } from '@services/modules/school/school.service';

@Component({
    selector: 'join-all',
    templateUrl: './join-all.component.html',
    styleUrls: ['./join-all.component.css'],
    providers: [SubjectService, OnlineClassService, ClassService, SchoolService ],
})

export class JoinAllComponent implements OnInit {

    onlineClassList: Array<OnlineClass>;
    accountInfo: AccountInfo;
    classSubjectList: Array<ClassSubject>;
    subjectList: Array<Subject>;

    classList: Array<any>;
    divisionList: Array<any>;

    user: any;

    serviceAdapter: JoinAllServiceAdapter;
    htmlRenderer: JoinAllHtmlRenderer;

    userInput = {};
    backendData = {};
    isLoading: any;
    constructor ( public subjectService: SubjectService,
        public onlineClassService: OnlineClassService,
        public classService: ClassService,
        public schoolService: SchoolService,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.htmlRenderer = new JoinAllHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new JoinAllServiceAdapter();
        this.serviceAdapter.initialize(this);
        this.serviceAdapter.initializeData();
        console.log(this);
        
    }
    getAllCurrentClasses():any{
        this.onlineClassList.filter((onlineClass)=>{
            return this.IsOngoing(onlineClass) ;
        });
    }
    IsOngoing(onlineClass:any):boolean{
        let currentTime = new Date();
        return true;
    }
}
