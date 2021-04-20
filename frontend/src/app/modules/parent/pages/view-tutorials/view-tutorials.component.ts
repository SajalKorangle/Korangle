import { Component, OnInit } from '@angular/core';
import { ClassService } from '@services/modules/class/class.service';
import { DataStorage } from '@classes/data-storage';
import { TutorialsService } from '@services/modules/tutorials/tutorials.service';
import { ViewTutorialsServiceAdapter } from '@modules/parent/pages/view-tutorials/view-tutorials.service.adapter';
import { SubjectService } from '@services/modules/subject/subject.service';
import { StudentService } from '@services/modules/student/student.service';
import moment = require('moment');

@Component({
    selector: 'app-view-tutorials',
    templateUrl: './view-tutorials.component.html',
    styleUrls: ['./view-tutorials.component.css'],
    providers: [SubjectService, ClassService, StudentService, TutorialsService],
})
export class ViewTutorialsComponent implements OnInit {
    selectedTopic: any;
    selectedChapter: any;
    selectedSubject: any;
    user: any;
    isLoading = false;
    publishDate: any;
    studentSubjectList: any;
    serviceAdapter: ViewTutorialsServiceAdapter;
    classSubjectList = [];
    subjectList = [];
    videoUrl = null;
    showTutorialVideo = false;
    noTutorials = false;
    filteredStudentSubject = [];
    youtubeIdMatcher = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|vi|e(?:mbed)?)\/|\S*?[?&]v=|\S*?[?&]vi=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    isIFrameLoading = true;
    loadCount = 0;
    limit = 2;

    constructor(
        public subjectService: SubjectService,
        public classService: ClassService,
        public studentService: StudentService,
        public tutorialService: TutorialsService
    ) {}

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new ViewTutorialsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    setTutorialVideo(): void {
        this.isIFrameLoading = !(
            this.videoUrl == 'https://youtube.com/embed/' + this.selectedTopic.link.match(this.youtubeIdMatcher)[1] &&
            this.showTutorialVideo
        );
        this.videoUrl = 'https://youtube.com/embed/' + this.selectedTopic.link.match(this.youtubeIdMatcher)[1];
        this.publishDate = moment(this.selectedTopic.generationDateTime).format('Do - MMMM - YYYY');
        if (!this.selectedChapter) {
            alert('Select a chapter');
            return;
        }
        if (!this.selectedTopic) {
            alert('Select a topic');
            return;
        }
        this.showTutorialVideo = true;
    }

    getSubjectName(subject: any): any {
        let result = '';
        this.subjectList.every((subj) => {
            if (subj.id === subject.parentSubject) {
                result = subj.name;
                return false;
            }
            return true;
        });
        return result;
    }

    listenEvent(event: any) {
        this.loadCount++;
        if (this.loadCount == this.limit) {
            this.isIFrameLoading = false;
            this.loadCount = 0;
        }
    }

    handleSubjectSelection(event: any) {
        this.selectedSubject = event;
        this.showTutorialVideo = false;
        this.videoUrl = '';
        this.limit = 2;
        this.selectedChapter = {};
    }

    handleChapterSelection(event: any) {
        this.selectedChapter = event;
        this.videoUrl = '';
        this.limit = 2;
        this.showTutorialVideo = false;
        this.selectedTopic = {};
    }

    handleTopicSelection(event: any) {
        this.selectedTopic = event;
        if (this.showTutorialVideo) {
            this.limit = 1;
        }
        this.setTutorialVideo();
    }
}
