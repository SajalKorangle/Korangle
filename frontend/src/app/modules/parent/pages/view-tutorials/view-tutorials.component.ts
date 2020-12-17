import {Component, OnInit} from '@angular/core';
import {SubjectOldService} from '@services/modules/subject/subject-old.service';
import {ClassService} from '@services/modules/class/class.service';
import {DataStorage} from '@classes/data-storage';
import {TutorialsService} from '@services/modules/tutorials/tutorials.service';
import {ViewTutorialsServiceAdapter} from '@modules/parent/pages/view-tutorials/view-tutorials.service.adapter';
import {StudentOldService} from '@services/modules/student/student-old.service';


@Component({
    selector: 'app-view-tutorials',
    templateUrl: './view-tutorials.component.html',
    styleUrls: ['./view-tutorials.component.css'],
    providers: [SubjectOldService, ClassService, StudentOldService, TutorialsService],
})
export class ViewTutorialsComponent implements OnInit {

    selectedTopic: any;
    selectedChapter: any;
    selectedSubject: any = [{name: null}];
    topicList = [];
    user: any;
    tutorialList: any;
    isLoading = false;
    studentSubjectList: any;
    serviceAdapter: ViewTutorialsServiceAdapter;
    classSubjectList = [];
    subjectList = [];
    videoUrl = null;
    showTutorialVideo = false;
    chapterList = [];


    constructor(public subjectService: SubjectOldService,
                public classService: ClassService,
                public studentService: StudentOldService,
                public tutorialService: TutorialsService,) {
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new ViewTutorialsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    populateTopic(): void {
        this.showTutorialVideo = false;
        this.topicList = this.selectedSubject.tutorialList.filter(t => {
            return t.chapter === this.selectedChapter;
        });
        console.log(this.topicList);
    }

    setTutorialVideo(): void {
        if (!this.selectedChapter) {
            alert('Select a chapter');
            return;
        }
        if (!this.selectedTopic) {
            alert('Select a topic');
            return;
        }
        this.videoUrl = this.videoUrl.replace('watch?v=', 'embed/');
        this.showTutorialVideo = true;
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
}
