import {Component, OnInit} from '@angular/core';
import {ClassService} from '@services/modules/class/class.service';
import {DataStorage} from '@classes/data-storage';
import {TutorialsService} from '@services/modules/tutorials/tutorials.service';
import {ViewTutorialsServiceAdapter} from '@modules/parent/pages/view-tutorials/view-tutorials.service.adapter';
import {SubjectService} from '@services/modules/subject/subject.service';
import {StudentService} from '@services/modules/student/student.service';


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
    publishDate:any;
    studentSubjectList: any;
    serviceAdapter: ViewTutorialsServiceAdapter;
    classSubjectList = [];
    subjectList = [];
    videoUrl = null;
    showTutorialVideo = false;
    noTutorials=false;


    constructor(public subjectService: SubjectService,
                public classService: ClassService,
                public studentService: StudentService,
                public tutorialService: TutorialsService,) {
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new ViewTutorialsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }


    setTutorialVideo(): void {
        this.videoUrl=this.selectedTopic.link.replace('watch?v=', 'embed/');;
        this.publishDate=this.selectedTopic.generationDateTime;
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
