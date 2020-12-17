import {Component, Input, OnInit} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import { StudentService } from '../../../../services/modules/student/student.service';
import { SubjectService } from '../../../../services/modules/subject/subject.service';
import { ClassService } from '../../../../services/modules/class/class.service';
import { HomeworkService } from '../../../../services/modules/homework/homework.service';
import { CheckHomeworkServiceAdapter } from './check-homework.service.adapter';
import {NotificationService} from '../../../../services/modules/notification/notification.service';
import {SmsService} from '../../../../services/modules/sms/sms.service';
import {SmsOldService} from '../../../../services/modules/sms/sms-old.service';
import {UserService} from '../../../../services/modules/user/user.service';


@Component({
  selector: 'check-homework',
  templateUrl: './check-homework.component.html',
  styleUrls: ['./check-homework.component.css'],
    providers: [
        SubjectService,
        StudentService,
        ClassService,
        HomeworkService,
        NotificationService,
        UserService,
        SmsService,
        SmsOldService,
    ],
})

export class CheckHomeworkComponent implements OnInit {

    // @Input() user;
    user: any;

    serviceAdapter: CheckHomeworkServiceAdapter;
    isInitialLoading: any;
    isLoading: any;
    
    STUDENT_LIMITER = 200;
    notif_usernames = [];

    classSectionHomeworkList: any;
    selectedClassSection: any;
    selectedSubject: any;
    selectedHomework: any;
    currentHomework: any;
    studentList: any;

    studentHomeworkList: any;

    homeworkReport: any;

    HOMEWORK_STATUS = [
        'GIVEN',
        'SUBMITTED',
        'CHECKED',
        'ASKED FOR RESUBMISSION',
    ]
    
    constructor( 
        public classService: ClassService,
        public subjectService: SubjectService,
        public studentService: StudentService,
        public homeworkService: HomeworkService,
        public notificationService: NotificationService,
        public userService: UserService,
        public smsService: SmsService,
        public smsOldService: SmsOldService,
    ){ }
    // Server Handling - Initial
    ngOnInit(): void {
        this.currentHomework = null;
        this.isLoading = false;
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new CheckHomeworkServiceAdapter;
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    changeClassSection(): any{
        this.selectedSubject = this.selectedClassSection.subjectList[0];
        this.selectedHomework = this.selectedSubject.homeworkList[0];
    }

    changeSubject(): any{
        this.selectedHomework = this.selectedSubject.homeworkList[0];
    }

    displayDateTime(date: any, time: any): any{
        let str='';
        let tempStr ='';

        if(date == null){
            str = 'No deadline';
            return str;
        }
        for(let i =0; i<date.length; i++){
            if(date[i] == '-'){
                str = '-' + tempStr + str;
                tempStr = '';

            }
            else{
                tempStr+= date[i];
            }
        }
        str = tempStr + str;
        str = str +  ' ; ';
        for(let i =0;i<5;i++){
            str = str + time[i];
        }
        
        return str;
    }

    getButtonClass(status: any): any {
        let classs = "btn";
        switch (status) {
            case this.HOMEWORK_STATUS[3]:
                classs += " btn-danger";
                break;
            case this.HOMEWORK_STATUS[2]:
                classs += " btn-success";
                break;
            case this.HOMEWORK_STATUS[1]:
                classs += " btn-warning";
                break;
            case this.HOMEWORK_STATUS[0]:
                classs += " btn-secondary";
                break;
        }
        return classs;
    }

    changeStudentHomeworkStatus(temp: any): void {
        if(!temp.status) {
            temp.status = this.HOMEWORK_STATUS[0];
            return;
        }
        let counter = 0;
        for (let i = 0; i < 4; ++i) {
            if (this.HOMEWORK_STATUS[i] === temp.status) {
                counter = i;
                break;
            }
        }
        let nextCounter = (counter+1)%(this.HOMEWORK_STATUS.length);
        if(nextCounter == 0){
            nextCounter = (counter+2)%(this.HOMEWORK_STATUS.length);
        }
        temp.status = this.HOMEWORK_STATUS[nextCounter];
    }

    getButtonString(status: any): any {
        let str = "";
        switch (status) {
            case this.HOMEWORK_STATUS[3]:
                str += "R";
                break;
            case this.HOMEWORK_STATUS[2]:
                str += "C";
                break;
            case this.HOMEWORK_STATUS[1]:
                str += "S";
                break;
            case this.HOMEWORK_STATUS[0]:
                str += "G";
                break;
        }
        return str;
    }
}
