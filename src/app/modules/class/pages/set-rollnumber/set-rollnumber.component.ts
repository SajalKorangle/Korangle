import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SetRollnumberServiceAdapter} from './set-rollnumber.service.adapter';
import {ClassService} from '../../../../services/modules/class/class.service';
import {StudentService} from '../../../../services/modules/student/student.service';
import {DataStorage} from '../../../../classes/data-storage';
import {CommonFunctions} from '../../../../classes/common-functions';

@Component({
  selector: 'app-set-rollnumber',
  templateUrl: './set-rollnumber.component.html',
  styleUrls: ['./set-rollnumber.component.css'],
  providers: [ ClassService, StudentService ],
})

export class SetRollnumberComponent implements OnInit {

  user;

  // isLoading = false;
  isInitialLoading = false;
  showTestDetails = false;

  serviceAdapter: SetRollnumberServiceAdapter;

  classList = [];
  sectionList = [];
  filteredStudents = [];
  selectedClass = null ;
  selectedSection = null;
  studentList = [];
  selectedOption = null;
  prefix = null;
  minDigits = null;


  constructor(public studentService: StudentService,
              public classService : ClassService,
              private cdRef: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.user = DataStorage.getInstance().getUser();

    this.serviceAdapter = new SetRollnumberServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
  }

  detectChanges(): void {
    this.showTestDetails = false;
    this.cdRef.detectChanges();
  }

  isMobileMenu(): boolean {
    return CommonFunctions.getInstance().isMobileMenu();
  }

  containsStudent(classs, section){
    return this.studentList.find(student => {
      return student['studentSection'].parentClass == classs.id
        && student['studentSection'].parentDivision == section.id
    }) != undefined ;
  }

  showSectionName(classs: any): boolean {
    let sectionLength = 0;
    this.sectionList.every(section => {
      if (this.containsStudent(classs,section)) {
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

  getFilteredStudentList(): any {
    return this.studentList.filter(student => {
      return student.studentSection.parentClass == this.selectedClass
          && student.studentSection.parentDivision == this.selectedSection
    }).sort(function(a, b){
      var x = a.name.toLowerCase();
      var y = b.name.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    });
  }

  selectOption(value: any){
    this.selectedClass = value[0].id;
    this.selectedSection = value[1].id;
    this.selectedOption = value;
    console.log(value);
    this.showTestDetails = false;
  }


  autogenerate(){
      if(this.minDigits>10){
        alert('Digits more than 10 are not allowed');
        this.minDigits = null;
        return;
      } else if (this.minDigits<0){
        alert('Digits less than 0 are not allowed');
        this.minDigits = null;
        return;
      }

      if(this.prefix==null && this.minDigits==null){
        let count = 1;
        this.getFilteredStudentList().forEach(student => {
          student['studentSection'].newRollNumber = count++;
        });
      }
      else if(this.prefix == null && this.minDigits !=null){
        if(this.minDigits == 0){
          let count = 1;
          this.getFilteredStudentList().forEach(student => {
            student['studentSection'].newRollNumber = this.prefix + count++;
          })
        }
        else{
          let zeros = '0';
          zeros = zeros.repeat(this.minDigits-1);
          let count = 0;
          this.getFilteredStudentList().forEach(student => {
            count = count + 1;
            if(count.toString().length < this.minDigits){
              student['studentSection'].newRollNumber = (zeros + count).slice(-this.minDigits);
            }
            else{
              student['studentSection'].newRollNumber = this.prefix + count;
            }
          });
        }
      }

      else if(this.prefix != null && this.minDigits == null){
        let count = 0;
        this.getFilteredStudentList().forEach(student => {
          count = count+ 1;
          student['studentSection'].newRollNumber = this.prefix + count;
        });
      }

      else if(this.prefix != null && this.minDigits != null){
        if(this.minDigits == 0){
          let count = 1;
          this.getFilteredStudentList().forEach(student => {
            student['studentSection'].newRollNumber = this.prefix + count++;
          })
        }
        else{
          let zeros = '0';
          zeros = zeros.repeat(this.minDigits-1);
          let count = 0;
          this.getFilteredStudentList().forEach(student => {
            count = count + 1;
            if(count.toString().length < this.minDigits){
              student['studentSection'].newRollNumber = this.prefix + (zeros + count).slice(-this.minDigits);
            }
            else{
              student['studentSection'].newRollNumber = this.prefix + count;
            }
          })
        }
      }
      this.minDigits = null;
      this.prefix = null;
  }

}
