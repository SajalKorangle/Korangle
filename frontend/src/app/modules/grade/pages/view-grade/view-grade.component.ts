import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ViewGradeServiceAdapter } from './view-grade.service.adapter';
import { GradeService } from '../../../../services/modules/grade/grade.service';
import { StudentService } from '../../../../services/modules/student/student.service';
import { ClassService } from '../../../../services/modules/class/class.service';
import { DataStorage } from '../../../../classes/data-storage';
import { ExaminationService } from '@services/modules/examination/examination.service';

@Component({
    selector: 'app-view-grade',
    templateUrl: './view-grade.component.html',
    styleUrls: ['./view-grade.component.css'],
    providers: [GradeService, ClassService, StudentService, ExaminationService],
})
export class ViewGradeComponent implements OnInit {
    user;

    isLoading = false;
    isInitialLoading = false;
    showTestDetails = false;

    serviceAdapter: ViewGradeServiceAdapter;

    classList = [];
    sectionList = [];
    /*selectedClass = null ;
  selectedSection = null;*/
    filteredClassSectionList = [];
    selectedClassSection = null;
    gradeList = [];
    examinationList = [];
    selectedExamination = null;
    selectedGrade = null;
    studentList = [];

    constructor(
        public gradeService: GradeService,
        public examinationService: ExaminationService,
        public studentService: StudentService,
        public classService: ClassService,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new ViewGradeServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.showTestDetails = false;
        this.cdRef.detectChanges();
    }

    getFilteredStudentList(): any {
        return this.studentList.filter((student) => {
            return (
                student.studentSection.parentClass === this.selectedClassSection.class.id &&
                student.studentSection.parentDivision === this.selectedClassSection.section.id
            );
        });
    }

    /*selectClass(classs: any){
    this.selectedClass = classs;
    this.showTestDetails = false;
    this.selectedSection = this.sectionList[0].id
  }*/
}
