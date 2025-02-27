import { Component, OnInit } from '@angular/core';
import { ClassService } from '@services/modules/class/class.service';
import { AddTutorialServiceAdapter } from '@modules/tutorials/pages/add-tutorial/add-tutorial.service.adapter';
import { DataStorage } from '@classes/data-storage';
import { StudentService } from '@services/modules/student/student.service';
import { TutorialsService } from '@services/modules/tutorials/tutorials.service';
import { MatDialog } from '@angular/material/dialog';
import { SubjectService } from '@services/modules/subject/subject.service';
import { MessageService } from '@services/message-service';

import { NotificationService } from '../../../../services/modules/notification/notification.service';
import { SmsService } from 'app/services/modules/sms/sms.service';
import { UserService } from 'app/services/modules/user/user.service';
import { SmsOldService } from 'app/services/modules/sms/sms-old.service';
import { AddTutorialHtmlRenderer } from '@modules/tutorials/pages/add-tutorial/add-tutorial.html.renderer';
import {INFORMATION_TYPE_LIST} from '@classes/constants/information-type';
import {EmployeeService} from '@services/modules/employee/employee.service';
import {ADMIN_PERMSSION, USER_PERMISSION_KEY} from '@modules/online-classes/pages/add-account/add-account.permissions';
import {TCService} from '@services/modules/tc/tc.service';

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
        EmployeeService,
        TCService
    ],
})
export class AddTutorialComponent implements OnInit {

    user: any;

    serviceAdapter: AddTutorialServiceAdapter;
    htmlRenderer: AddTutorialHtmlRenderer;

    tutorialList = [];
    classSubjectList = [];
    currentClassStudentList = [];
    classSectionSubjectList = [];

    youtubeRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
    decimalRegex = /^-?[0-9]*\.?[0-9]$/;
    youtubeIdMatcher = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|vi|e(?:mbed)?)\/|\S*?[?&]v=|\S*?[?&]vi=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    smsBalance: any;

    messageService: any;

    dataForMapping =  {} as any;

    backendData = {
        classList: [],
        sectionList: [],
        classSubjectList: [],
        subjectList: [],
        fullStudentList: [],
        currentClassStudentSectionList: [],
        fullStudentSectionList: [],
        inPagePermissionMappedByKey: {} as any,
    };

    userInput = {
        newTutorial: {} as any,
        selectedSection: {} as any,
        editedTutorial: {} as any,
        selectedSubject: {} as any,
    };

    stateKeeper = {
        isLoading: false,
        tutorialUpdating: false,
        isTutorialDetailsLoading: false,
        isIFrameLoading: true,
        subjectChangedButNotGet: true,
        editable: false,
        tutorialEditing: false,
    };

    TUTORIAL_CREATION_ID = 12;
    TUTORIAL_UPDATION_ID = 13;
    TUTORIAL_DELETION_ID = 14;

    constructor(
        public subjectService: SubjectService,
        public classService: ClassService,
        public studentService: StudentService,
        public tutorialService: TutorialsService,
        public dialog: MatDialog,
        public notificationService: NotificationService,
        public smsService: SmsService,
        public userService: UserService,
        public smsOldService: SmsOldService,
        public employeeService: EmployeeService,
        public tcService: TCService
    ) {}

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.messageService = new MessageService(this.notificationService, this.userService, this.smsService);

        this.htmlRenderer = new AddTutorialHtmlRenderer();
        this.htmlRenderer.initializeAdapter(this);

        this.serviceAdapter = new AddTutorialServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
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

    initializeNewTutorial(): void {
        this.userInput.newTutorial = {
            id: null,
            chapter: null,
            topic: null,
            link: null,
            orderNumber: 0,
        };
    }

    hasAdminPermission(): boolean {
        return this.backendData.inPagePermissionMappedByKey[USER_PERMISSION_KEY] == ADMIN_PERMSSION;
    }

}
