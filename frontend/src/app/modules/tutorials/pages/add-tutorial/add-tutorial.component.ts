import { Component, OnInit } from '@angular/core';
import { ClassService } from '@services/modules/class/class.service';
import { AddTutorialServiceAdapter } from '@modules/tutorials/pages/add-tutorial/add-tutorial.service.adapter';
import { DataStorage } from '@classes/data-storage';
import { StudentService } from '@services/modules/student/student.service';
import { TutorialsService } from '@services/modules/tutorials/tutorials.service';
import { ModalVideoComponent } from '@basic-components/modal-video/modal-video.component';
import { MatDialog } from '@angular/material/dialog';
import { SubjectService } from '@services/modules/subject/subject.service';
import { UpdateService } from '../../../../update/update-service';

import { NotificationService } from '../../../../services/modules/notification/notification.service';
import { SmsService } from 'app/services/modules/sms/sms.service';
import { UserService } from 'app/services/modules/user/user.service';
import { SmsOldService } from 'app/services/modules/sms/sms-old.service';
import { AddTutorialHtmlRenderer } from '@modules/tutorials/pages/add-tutorial/add-tutorial.html.renderer';
import { AddTutorialUserInput } from '@modules/tutorials/pages/add-tutorial/add-tutorial.user.input';
import { AddTutorialBackendData } from '@modules/tutorials/pages/add-tutorial/add-tutorial.backend.data';

@Component({
    selector: 'app-add-tutorial',
    templateUrl: './add-tutorial.component.html',
    styleUrls: ['./add-tutorial.component.css'],
    providers: [
        SubjectService,
        ClassService,
        StudentService,
        TutorialsService,
        NotificationService,
        SmsService,
        UserService,
        SmsOldService,
    ],
})
export class AddTutorialComponent implements OnInit {

    user: any;

    serviceAdapter: AddTutorialServiceAdapter;
    htmlRenderer: AddTutorialHtmlRenderer;
    userInput: AddTutorialUserInput;
    backendData:AddTutorialBackendData;

    subjectList: any;
    tutorialList = [];
    classSubjectList: any;
    currentClassStudentList: any;
    classSectionSubjectList: any;
    
    editable = false;
    tutorialEditing = false;

    youtubeRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
    decimalRegex = /^-?[0-9]*\.?[0-9]$/;
    youtubeIdMatcher = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|vi|e(?:mbed)?)\/|\S*?[?&]v=|\S*?[?&]vi=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    createMessage = 'A new tutorial has been created in the Subject <subject>; Chapter <tutorialChapter>; Topic <tutorialTopic>';
    deleteMessage = 'The following tutorial has been deleted -\n Topic <tutorialTopic>; Subject <subject>; Chapter <tutorialChapter>';
    editMessage = 'The following tutorial has been edited -\n Topic <tutorialTopic>; Subject <subject>; Chapter <tutorialChapter>';
    settings: any;
    smsBalance: any;

    updateService: any;

    constructor(
        public subjectService: SubjectService,
        public classService: ClassService,
        public studentService: StudentService,
        public tutorialService: TutorialsService,
        public dialog: MatDialog,
        public notificationService: NotificationService,
        public smsService: SmsService,
        public userService: UserService,
        public smsOldService: SmsOldService
    ) {}

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.updateService = new UpdateService(this.notificationService, this.userService, this.smsService);

        this.htmlRenderer = new AddTutorialHtmlRenderer();
        this.htmlRenderer.initializeAdapter(this);

        this.userInput = new AddTutorialUserInput();
        this.userInput.initializeAdapter(this);
        
        this.backendData = new AddTutorialBackendData();
        this.backendData.initializeAdapter(this);

        this.serviceAdapter = new AddTutorialServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
    }


    getParentClassSubject(): number {
        const classSub = this.backendData.classSubjectList.filter((classSubject) => {
            if (
                classSubject.parentClass == this.userInput.selectedSection.parentClass &&
                classSubject.parentDivision == this.userInput.selectedSection.id &&
                classSubject.parentSubject == this.userInput.selectedSubject.parentSubject
            ) {
                return classSubject;
            }
        });
        return classSub[0].id;
    }


}
