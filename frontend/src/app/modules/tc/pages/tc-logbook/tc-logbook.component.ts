import { Component, OnInit } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";
import { TCLogbookServiceAdapter } from './tc-logbook.service.adapter';
import { TransferCertificateNew } from './../../../../services/modules/tc/models/transfer-certificate';
import { Student } from './../../../../services/modules/student/models/student';
import { StudentSection } from './../../../../services/modules/student/models/student-section';

import { TCService } from './../../../../services/modules/tc/tc.service';
import { StudentService } from './../../../../services/modules/student/student.service';
import { ClassService } from '@services/modules/class/class.service';

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
    ClassService
  ]
})
export class TCLogbookComponent implements OnInit {

  user: any;

  tcList: Array<TransferCertificateNew>;
  
  studentSectionList: Array<StudentSection>;
  studentList: Array<Student>;
  classList: Array<any>;
  divisionList: Array<any>;

  // studentMappedByStudentId: { [key: number]: Student };
  studentSestionWithTC: Array<CustomSSInterface>;

  serviceAdapter: TCLogbookServiceAdapter;
  isLoading = false;

  constructor(
    public tcService: TCService,
    public studentService: StudentService,
    public classService: ClassService,
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

  getClass = id => this.classList.find(x => x.id===id)
  getDivision = id => this.divisionList.find(x => x.id === id)

}
