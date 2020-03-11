import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ViewGradeServiceAdapter} from './view-grade.service.adapter';
import {GradeService} from '../../../../services/modules/grade/grade.service';
import {StudentService} from '../../../../services/modules/student/student.service';
import {ClassService} from '../../../../services/modules/class/class.service';
import {DataStorage} from '../../../../classes/data-storage';

@Component({
  selector: 'app-view-grade',
  templateUrl: './view-grade.component.html',
  styleUrls: ['./view-grade.component.css'],
  providers:[
    GradeService,
    ClassService,
    StudentService
  ]
})
export class ViewGradeComponent implements OnInit {

  user;

  isLoading = false;
  isInitialLoading = false;
  showTestDetails = false;

  serviceAdapter: ViewGradeServiceAdapter;

  classList = [];
  sectionList = [];
  selectedClass = null ;
  selectedSection = null;
  gradeList = [];
  selectedGrade = null;
  studentList = [];
  noStudentPresent = false;

  constructor(public gradeService:GradeService,
              public studentService: StudentService,
              public classService : ClassService,
              private cdRef: ChangeDetectorRef,) { }

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
    return this.studentList.filter(student => {
      return student.studentSection.parentClass == this.selectedClass
          && student.studentSection.parentDivision == this.selectedSection;
    });
  }

  selectClass(classs: any){
    this.selectedClass = classs;
    this.showTestDetails = false;
    this.selectedSection = this.sectionList[0].id
  }

}
