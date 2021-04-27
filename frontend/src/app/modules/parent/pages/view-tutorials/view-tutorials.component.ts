import {Component, OnInit, ViewChild, Input} from '@angular/core';
import { ClassService } from '@services/modules/class/class.service';
import { DataStorage } from '@classes/data-storage';
import { TutorialsService } from '@services/modules/tutorials/tutorials.service';
import { ViewTutorialsServiceAdapter } from '@modules/parent/pages/view-tutorials/view-tutorials.service.adapter';
import { SubjectService } from '@services/modules/subject/subject.service';
import { StudentService } from '@services/modules/student/student.service';
import {ViewTutorialsHtmlRenderer} from '@modules/parent/pages/view-tutorials/view-tutorials.html.renderer';

@Component({
    selector: 'app-view-tutorials',
    templateUrl: './view-tutorials.component.html',
    styleUrls: ['./view-tutorials.component.css'],
    providers: [SubjectService, ClassService, StudentService, TutorialsService],
})
export class ViewTutorialsComponent implements OnInit {
    
    user: any;

    serviceAdapter: ViewTutorialsServiceAdapter;
    htmlRenderer: ViewTutorialsHtmlRenderer;
    
    filteredStudentSubject = [];

    youtubeIdMatcher = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|vi|e(?:mbed)?)\/|\S*?[?&]v=|\S*?[?&]vi=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    
    userInput = {
        selectedTopic: {} as any,
        selectedChapter: {} as any,
        selectedSubject: {} as any
    }

    backendData = {
        examinationList: [],
        studentSubjectList: [],
        classTestList: [],
        studentTestList: [],
        studentProfile: {} as any, 
        tutorialList: [],
        classSubjectList: [],
        subjectList: []
    }
    
    stateKeeper = {
        isLoading: false,
        isIFrameLoading: true,
    }

    constructor(
        public subjectService: SubjectService,
        public classService: ClassService,
        public studentService: StudentService,
        public tutorialService: TutorialsService
    ) {}

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.htmlRenderer = new ViewTutorialsHtmlRenderer();
        this.htmlRenderer.initializeAdapter(this);

        this.serviceAdapter = new ViewTutorialsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);

    }

}
