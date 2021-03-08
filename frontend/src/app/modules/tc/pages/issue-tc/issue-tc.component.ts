import { Component, OnInit } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";
import { IssueTCServiceAdapter } from './issue-tc.service.adapter';
import { TransferCertificateNew } from './../../../../services/modules/tc/models/transfer-certificate';
import { Student } from './../../../../services/modules/student/models/student';
import { StudentSection } from './../../../../services/modules/student/models/student-section';

import { TCService } from './../../../../services/modules/tc/tc.service';
import { StudentService } from './../../../../services/modules/student/student.service';
import { ClassService } from '@services/modules/class/class.service';
import { FeeService } from './../../../../services/modules/fees/fee.service';

interface CustomSSInterface extends StudentSection{
  parentStudentInstance: Student;
  tc: TransferCertificateNew;
}

@Component({
  selector: 'app-issue-tc',
  templateUrl: './issue-tc.component.html',
  styleUrls: ['./issue-tc.component.css'],
  providers: [
    TCService,
    StudentService,
    ClassService,
    FeeService,
  ]
})
export class IssueTCComponent implements OnInit {

  user: any;

  certificateNumberSearchInput: string = '';
  studentNameSearchInput: string = '';

  tcList: Array<TransferCertificateNew>;

  studentSectionList: Array<StudentSection>;
  studentList: Array<Student>;
  classList: Array<any>;
  divisionList: Array<any>;

  classSectionList: Array<any>;
  studentSestionWithTC: Array<CustomSSInterface>;

  serviceAdapter: IssueTCServiceAdapter;
  isLoading = false;

  constructor(
    public tcService: TCService,
    public studentService: StudentService,
    public classService: ClassService,
    public feeService: FeeService,
  ) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new IssueTCServiceAdapter(this);
    this.serviceAdapter.initilizeData();
    console.log('comp: ', this)
  }

  populateClassSectionList(classList, divisionList):void {
    this.classSectionList = [];
    classList.forEach(classs => {
        divisionList.forEach(division => {
            if (this.studentSectionList.find(studentSection => {
                    return studentSection.parentClass == classs.id
                        && studentSection.parentDivision == division.id;
                }) != undefined) {
                this.classSectionList.push({
                    class: classs,
                    section: division,
                    selected: false
                });
            }
        });
    });

    const divisionPerClassCount = {}; // count of divisions in each class
    this.classSectionList.forEach(cs => {
      if (divisionPerClassCount[cs.class.id])
        divisionPerClassCount[cs.class.id] += 1;
      else
        divisionPerClassCount[cs.class.id] = 1;
    });

    this.classSectionList = this.classSectionList.map(cs => { // showDivision based of division count per class
      if (divisionPerClassCount[cs.class.id] == 1) {
        return { ...cs, showDivision: false };
      } else {
        return { ...cs, showDivision: true };
      }
    })
  }

  populateStudentSectionWithTC(): void{
    this.studentSestionWithTC = this.tcList.map(tc => {
      const studentId = tc.parentStudent;
      const ss = this.studentSectionList.find(ss => ss.parentStudent == studentId);
      return {
        ...ss,
        tc: this.tcList.find(tc => tc.parentStudent == ss.parentStudent),
        parentStudentInstance: this.studentList.find(s => s.id == ss.parentStudent),
      };
    });
  }

  getClassSectionName = (classId, divisionId) => {
    const classSection = this.classSectionList.find(cs => cs.class.id == classId && cs.section.id == divisionId);
    if (classSection.showDivision) {
      return classSection.class.name + ', ' + classSection.section.name;
    }
    else {
      return classSection.class.name;
    }
  }

  getFilteredStudentSectionList() {
    return this.studentSestionWithTC.filter(ss =>
      ss.tc.certificateNumber.toString().startsWith(this.certificateNumberSearchInput)
      && ss.parentStudentInstance.name.startsWith(this.studentNameSearchInput)
    )
  }

}
