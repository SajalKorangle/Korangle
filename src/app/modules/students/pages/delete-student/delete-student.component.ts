import { Component, OnInit } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';
import { VehicleService } from '../../../vehicle/vehicle.service';
import { ClassService } from '../../../../services/class.service';
import { FeeService } from '../../../../services/fee.service';
import { Classs } from '../../../../classes/classs';
import { Section } from '../../../../classes/section';
import { Student } from '../../../../classes/student';
import { StudentOldService } from '../../student-old.service';
import { BusStopService } from '../../../../services/bus-stop.service';
import { StudentService } from '../../../../services/student.service';




@Component({
  selector: 'app-delete-student',
  templateUrl: './delete-student.component.html',
  styleUrls: ['./delete-student.component.css'],
  providers: [FeeService, StudentOldService, BusStopService, StudentService],
})
export class DeleteStudentComponent implements OnInit {

  user;

  selectedClass: Classs;
  selectedSection: Section;
  selectedStudent: Student;

  // Data from Parent Student Filter
  classList = [];
  sectionList = [];
  studentSectionList = [];

  selectStudent = {};
  selectedStudentSectionList = [];
  showDetails = false;

  classSectionStudentList: Classs[] = [];

  currentStudent: Student = new Student();

  busStopList = [];

  studentFeeReciept = [];
  sessionCount: number;
  countCheck = 2;

  isLoading = false;

  constructor(private studentService: StudentOldService,
    private busStopService: BusStopService,
    public feeService: FeeService,
    private newStudentService: StudentService) { }

  changeSelectedSectionToFirst(): void {
    this.selectedSection = this.selectedClass.sectionList[0];
    this.changeSelectedStudentToFirst();
  }

  changeSelectedStudentToFirst(): void {
    this.selectedStudent = this.selectedSection.studentList[0];
    this.currentStudent.copy(this.selectedStudent);
  }

  ngOnInit(): void {
    this.user = DataStorage.getInstance().getUser();

    const data = {
      sessionDbId: this.user.activeSchool.currentSessionDbId,
      schoolDbId: this.user.activeSchool.dbId,
    };

    this.studentService.getClassSectionStudentList(data, this.user.jwt).then(
      classSectionStudentList => {
        classSectionStudentList.forEach(classs => {
          const tempClass = new Classs();
          tempClass.name = classs.name;
          tempClass.dbId = classs.dbId;
          classs.sectionList.forEach(section => {
            const tempSection = new Section();
            tempSection.name = section.name;
            tempSection.dbId = section.dbId;
            section.studentList.forEach(student => {
              const tempStudent = new Student();
              tempStudent.name = student.name;
              tempStudent.dbId = student.dbId;
              tempSection.studentList.push(tempStudent);
            });
            tempClass.sectionList.push(tempSection);
          });
          this.classSectionStudentList.push(tempClass);
        });
        if (this.classSectionStudentList.length > 0) {
          this.selectedClass = this.classSectionStudentList[0];
          this.changeSelectedSectionToFirst();
        } else {
          alert('Student needs to be added first, before profile updation');
        }

      }  
    );

    const dataForBusStop = {
      schoolDbId: this.user.activeSchool.dbId,
    };

    this.busStopService.getBusStopList(dataForBusStop, this.user.jwt).then(busStopList => {
      this.busStopList = busStopList;
    });
  }

  getStudentProfile(selectStudent: any): void {
    this.isLoading = true;
    const data = {
      studentDbId: selectStudent.id,
      sessionDbId: this.user.activeSchool.currentSessionDbId
    };
    this.studentService.getStudentProfile(data, this.user.jwt).then(
      student => {
        this.isLoading = false;
        const breakLoop = false;
        if (selectStudent.id === student.dbId) {
          this.selectedStudent.copy(student);
          this.currentStudent.copy(student);
          console.log(this.selectedStudent);
          this.checkMultipleSession()
          this.studentFeeList()
        }
      }, error => {
        this.isLoading = false;
      }
    );
  }

  handleDetailsFromParentStudentFilter(details: any): void {
    this.classList = details.classList;
    this.sectionList = details.sectionList;
    this.studentSectionList = details.studentSectionList;
  }

  handleStudentListSelection(studentList: any): void {
    this.selectStudent = studentList[0];
    this.getStudentProfile(this.selectStudent);
    this.showDetails = true;
  }

  //To Check students exists in multiple sessions or not
  checkMultipleSession(): void{
    let data = {
      'id': this.selectedStudent.dbId
    }
    this.newStudentService.getObject(this.newStudentService.student_multiple_session_check, data).then( res => {
      this.sessionCount = res.session_count
    })
  }

  //To check that student claimed atleast one Fee Reciept  
  studentFeeList(): void{
    let student_fee_data = {
      'parentStudent': this.selectedStudent.dbId,
      'parentSession': this.user.activeSchool.currentSessionDbId,
    };    
    this.feeService.getList(this.feeService.student_fees, student_fee_data)
      .then(res => {
        this.studentFeeReciept = res;
      })
  }

  deleteProfile(): void {
    if (!confirm('Are you sure you want to delete ' + this.currentStudent.name + '\'s profile.')) {
      return;
    }
    this.isLoading = true;
    this.studentService.deleteStudentProfile(this.currentStudent.dbId, this.user.jwt).then(data => {
      alert(data['message']);
      this.isLoading = false;

      if (data['studentDbId'] === 0) {
        return;
      }

      let studentIndex = 0;
      this.selectedSection.studentList.forEach((student, index) => {
        if (student.dbId === data['studentDbId']) {
          studentIndex = index;
        }
      });
      this.selectedSection.studentList.splice(studentIndex, 1);
      if (this.selectedSection.studentList.length > 0) {
        this.changeSelectedStudentToFirst();
      } else {
        let sectionIndex = 0;
        this.selectedClass.sectionList.forEach((section, index) => {
          if (section.dbId === this.selectedSection.dbId) {
            sectionIndex = index;
          }
        });
        this.selectedClass.sectionList.splice(sectionIndex, 1);
        if (this.selectedClass.sectionList.length > 0) {
          this.changeSelectedSectionToFirst();
        } else {
          let classIndex = 0;
          this.classSectionStudentList.forEach((classs, index) => {
            if (classs.dbId === this.selectedClass.dbId) {
              classIndex = index;
            }
          });
          this.classSectionStudentList.splice(classIndex, 1);
          if (this.classSectionStudentList.length > 0) {
            this.selectedClass = this.classSectionStudentList[0];
            this.changeSelectedSectionToFirst();
          } else {
            alert('No students left, you can add more students from \'New Student\' section');
            this.selectedClass = null;
            this.selectedSection = null;
            this.selectedStudent = null;
          }
        }
      }
    }, error => {
      this.isLoading = false;
      alert('Server Error: Contact admin');
    });
  }

  getBusStopName(busStopDbId: any) {
    let stopName = 'None';
    if (busStopDbId !== null) {
      this.busStopList.forEach(busStop => {
        if (busStop.dbId == busStopDbId) {
          stopName = busStop.stopName;
          console.log(stopName);
          return;
        }
      });
    }
    return stopName;
  }

  checkFieldChanged(selectedValue, currentValue): boolean {
    if (selectedValue !== currentValue && !(selectedValue == null && currentValue === '')) {
      return true;
    }
    return false;
  }

  checkLength(value: any) {
    if (value && value.toString().length > 0) {
      return true;
    }
    return false;
  }

  checkRight(value: any, rightValue: number) {
    if (value && value.toString().length === rightValue) {
      return true;
    }
    return false;
  }

  getSessionName(dbId: number): string {
    if (dbId = 1) {
      return 'Session 2017-18';
    } else if (dbId = 2) {
      return 'Session 2018-19';
    } else if (dbId = 3) { }
    return '';
  }

}
