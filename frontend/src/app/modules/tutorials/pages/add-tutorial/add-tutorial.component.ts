import {Component, OnInit} from '@angular/core';
import {ClassService} from '@services/modules/class/class.service';
import {AddTutorialServiceAdapter} from '@modules/tutorials/pages/add-tutorial/add-tutorial.service.adapter';
import {DataStorage} from '@classes/data-storage';
import {StudentService} from '@services/modules/student/student.service';
import {TutorialsService} from '@services/modules/tutorials/tutorials.service';
import {ModalVideoComponent} from '@basic-components/modal-video/modal-video.component';
import {MatDialog} from '@angular/material/dialog';
import {SubjectService} from '@services/modules/subject/subject.service';
import { UpdateService } from '../../../../update/update-service'

import { NotificationService } from '../../../../services/modules/notification/notification.service'
import { SmsService } from 'app/services/modules/sms/sms.service';
import { UserService } from 'app/services/modules/user/user.service';
import { SmsOldService } from 'app/services/modules/sms/sms-old.service';

@Component({
    selector: 'app-add-tutorial',
    templateUrl: './add-tutorial.component.html',
    styleUrls: ['./add-tutorial.component.css'],
    providers: [SubjectService, ClassService, StudentService, TutorialsService, NotificationService,SmsService, UserService, SmsOldService],

})
export class AddTutorialComponent implements OnInit {

    serviceAdapter: AddTutorialServiceAdapter;
    user: any;
    selectedClass: any;
    selectedSubject = null;
    subjectList: any;
    tutorialList = [];
    showTutorialDetails = false;
    isLoading = false;
    classSubjectList: any;
    newTutorial: any;
    editable = false;
    tutorialEditing = false;
    previewBeforeAddTutorialUrl: string;
    classSectionSubjectList: any;
    selectedSection: any;
    isAddDisabled = true;
    tutorialUpdating = false;
    editedTutorial: any;
    showPreview = false;
    topicAlreadyPresent = false;
    youtubeRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
    decimalRegex = /^-?[0-9]*\.?[0-9]$/;
    youtubeIdMatcher=/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|vi|e(?:mbed)?)\/|\S*?[?&]v=|\S*?[?&]vi=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;



    createMessage = 'A new tutorial has been created in the Subject <subject>; Chapter <tutorialChapter>; Topic <tutorialTopic>';
    deleteMessage = 'The following tutorial has been deleted -\n Topic <tutorialTopic>; Subject <subject>; Chapter <tutorialChapter>';
    editMessage = 'The following tutorial has been edited -\n Topic <tutorialTopic>; Subject <subject>; Chapter <tutorialChapter>';
    settings: any;
    smsBalance: any;

    currentClassStudentList: any;
    noSubjects: boolean;

    updateService: any;

    constructor(public subjectService: SubjectService,
                public classService: ClassService,
                public studentService: StudentService,
                public tutorialService: TutorialsService,
                private dialog: MatDialog,
                public notificationService: NotificationService,
                public smsService: SmsService,
                public userService: UserService,
                public smsOldService: SmsOldService) {
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.updateService = new UpdateService(this.notificationService, this.userService, this.smsService);

        this.serviceAdapter = new AddTutorialServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    getSubjectName(subject: any): any {
        let result = '';
        this.subjectList.every(subj => {
            if (subj.id === subject.parentSubject) {
                result = subj.name;
                return false;
            }
            return true;
        });
        return result;
    }

    initializeNewTutorial(): void {
        this.newTutorial = {
            'id': null,
            'parentClassSubject': this.getParentClassSubject(),
            'chapter': null,
            'topic': null,
            'link': null,
            'editable': false,
            'orderNumber': 0,
        };
    }

    getParentClassSubject(): number {
        const classSub = this.serviceAdapter.classSubjectList.filter(classSubject => {
            if (classSubject.parentClass == this.selectedSection.parentClass && classSubject.parentDivision == this.selectedSection.id && classSubject.parentSubject == this.selectedSubject.parentSubject) {
                return classSubject;
            }
        });
        return classSub[0].id;
    }

    showPreviewVideo(tutorial: any): void {
        this.dialog.open(ModalVideoComponent, {
            height: '80vh',
            width: '80vw',
            data: {
                videoUrl: "https://youtube.com/embed/"+tutorial.link.match(this.youtubeIdMatcher)[1],
            }
        });
    }


     checkEnableAddButton() {
        const tutorial = this.newTutorial;
        this.topicAlreadyPresent = tutorial.topic && this.tutorialList.some(t => t.chapter === tutorial.chapter && t.topic === tutorial.topic.trim());

        if (!tutorial.link || tutorial.link.trim() == '') {
            this.isAddDisabled = true;
            this.showPreview = false;
            return;
        }

        if (this.youtubeRegex.test(tutorial.link.trim())) {
            if (tutorial.link.startsWith('www.')) {
                tutorial.link = 'https://' + tutorial.link;
            }
            this.previewBeforeAddTutorialUrl = "https://youtube.com/embed/"+tutorial.link.match(this.youtubeIdMatcher)[1];
            this.showPreview = true;
            if (!tutorial.chapter || tutorial.chapter.trim() == '') {
                this.isAddDisabled = true;
                return;
            } else if (!tutorial.topic || tutorial.topic.trim() == '' || this.tutorialList.some(t => t.chapter === tutorial.chapter && t.topic === tutorial.topic.trim())) {
                this.isAddDisabled = true;
                return;
            } else {
                this.topicAlreadyPresent = false;
                this.isAddDisabled = false;
                this.topicAlreadyPresent = false;
            }
        } else {
            this.showPreview = false;
            this.isAddDisabled = true;
        }
    }
}
