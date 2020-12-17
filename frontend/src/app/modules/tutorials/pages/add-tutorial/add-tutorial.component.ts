import {Component, OnInit} from '@angular/core';
import {SubjectOldService} from '@services/modules/subject/subject-old.service';
import {ClassService} from '@services/modules/class/class.service';
import {AddTutorialServiceAdapter} from '@modules/tutorials/pages/add-tutorial/add-tutorial.service.adapter';
import {DataStorage} from '@classes/data-storage';
import {StudentService} from '@services/modules/student/student.service';
import {TutorialsService} from '@services/modules/tutorials/tutorials.service';
import {ModalVideoComponent} from '@basic-components/modal-video/modal-video.component';
import {MatDialog} from '@angular/material/dialog';
import {StudentOldService} from '@services/modules/student/student-old.service';

@Component({
    selector: 'app-add-tutorial',
    templateUrl: './add-tutorial.component.html',
    styleUrls: ['./add-tutorial.component.css'],
    providers: [SubjectOldService,StudentOldService, ClassService, StudentService, TutorialsService],

})
export class AddTutorialComponent implements OnInit {

    serviceAdapter: AddTutorialServiceAdapter;
    user: any;
    selectedClass: any;
    selectedSubject = null;
    subjectList: any;
    tutorialList = [];
    showTutorialDetails = false;
    filteredSubjectList: any;
    isLoading = false;
    classSubjectList: any;
    newTutorial: any;
    editable = false;
    showPreview = false;
    previewBeforeAddTutorialUrl: string;
    classSectionSubjectList: any;
    selectedSection: any;
    isDisabled=true;
    tutorialUpdating=false;

    constructor(public subjectService: SubjectOldService,
                public classService: ClassService,
                public studentService: StudentService,
                public tutorialService: TutorialsService,
                private dialog: MatDialog,
                public  studentOldService:StudentOldService) {
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

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
            'orderNumber':0,
        };
    }

    getParentClassSubject(): number {
        const classSub = this.serviceAdapter.classSubjectList.filter(classSubject => {
            if (classSubject.parentClass == this.selectedClass.id && classSubject.parentDivision == this.selectedClass.selectedSection.id && classSubject.parentSubject == this.selectedSubject.parentSubject) {
                return classSubject;
            }
        });
        return classSub[0].id;
    }

    showPreviewVideo(tutorial: any): void {
        this.user.videoUrl = tutorial.link.replace('watch?v=', 'embed/');
        this.dialog.open(ModalVideoComponent, {
            height: '80vh',
            width: '80vw',
        });
    }
showSectionName(classs: any): boolean {
        let sectionLength = 0;
        classs.sectionList.every(section => {
            if (section.containsStudent) {
                ++sectionLength;
            }
            if (sectionLength > 1) {
                return false;
            } else {
                return true;
            }
        });
        return sectionLength > 1;
    }

    unselectAllClasses(): void {
        this.classSectionSubjectList.forEach(
            classs => {
                classs.sectionList.forEach(section => {
                    section.selected = false;
                });
            }
        );
    }

}
