import { Component, OnInit } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";
import { TCLogbookServiceAdapter } from './tc-logbook.service.adapter';
import { TransferCertificateNew } from './../../../../services/modules/tc/models/transfer-certificate';
import { Student } from './../../../../services/modules/student/models/student';
import { StudentSection } from './../../../../services/modules/student/models/student-section';

import { TCService } from './../../../../services/modules/tc/tc.service';
import { StudentService } from './../../../../services/modules/student/student.service';
import { ClassService } from '@services/modules/class/class.service';
import { EmployeeService } from './../../../../services/modules/employee/employee.service';

interface CustomSSInterface extends StudentSection{
  parentStudentInstance: Student;
  tc: TransferCertificateNew;
}

@Component({
  selector: 'app-tc-logbook',
  templateUrl: './tc-logbook.component.html',
  styleUrls: ['./tc-logbook.component.css'],
  providers: [
    TCService,
    StudentService,
    ClassService,
    EmployeeService
  ]
})
export class TCLogbookComponent implements OnInit {

  user: any;

  tcList: Array<TransferCertificateNew>;
  
  employeesList: Array<any>;
  studentSectionList: Array<StudentSection>;
  studentList: Array<Student>;
  classList: Array<any>;
  divisionList: Array<any>;

  classSectionList: Array<any>;
  studentSestionWithTC: Array<CustomSSInterface>;

  serviceAdapter: TCLogbookServiceAdapter;
  isLoading = false;

  columnsList = {
    'certificateNo': true,
    'name': true,
    'scholarNo': false,
    'classSection': true,
    'fathersName': true,
    'status': true,
    'certificate': true,
    'generatedBy': false,
    'issuedBy': false,
    'cancelledBy': false,
    'issueDate': false,
    'leavingDate': false,
  }

  constructor(
    public tcService: TCService,
    public studentService: StudentService,
    public classService: ClassService,
    public employeeService: EmployeeService,
  ) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();

    this.serviceAdapter = new TCLogbookServiceAdapter(this);
    this.serviceAdapter.initializeData();
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

  selectAllClasses(): void{
    this.classSectionList.forEach(classSection => classSection.selected = true);
  }

  unselectAllClasses(): void{
    this.classSectionList.forEach(classSection => classSection.selected = false);
  }

  getFilteredStudentSectionList(): Array<CustomSSInterface> {
    return this.studentSestionWithTC.filter(ss => this.classSectionList.find(cs => cs.class.id == ss.parentClass && cs.section.id == ss.parentDivision).selected);
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

  getColumnKeys(): Array<string>{
    return Object.keys(this.columnsList);
  }

  getEmployeeName(empId): any{
    const emp = this.employeesList.find(e => e.id == empId);
    if (emp)
      return emp.name
    return '-';
  }

}
