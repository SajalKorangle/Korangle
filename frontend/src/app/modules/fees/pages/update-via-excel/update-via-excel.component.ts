import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

import { UpdateViaExcelServiceAdapter } from './update-via-excel.service.adapter';

import {DataStorage} from '../../../../classes/data-storage';
import { StudentService } from './../../../../services/modules/student/student.service';
import { ClassService } from './../../../../services/modules/class/class.service';

@Component({
  selector: 'app-update-via-excel',
  templateUrl: './update-via-excel.component.html',
  styleUrls: ['./update-via-excel.component.css'],
  providers: [StudentService, ClassService]
})
export class UpdateViaExcelComponent implements OnInit {

  user;

  classList = [];
  divisionList = [];

  structuredStudent = {};  // structure = {classId: {classSecions: [Students], ...}, ...}
  structuredSelection = {};
  studentsCount = 0;
  selectionCount = 0;

  isLoading = false;

  serviceAdapter: UpdateViaExcelServiceAdapter;

  constructor(public studentService: StudentService, public classService: ClassService) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new UpdateViaExcelServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
  }

  structuringForStudents(classIds: any, divisionIds: any): void {
    classIds.forEach(classId => {
      this.structuredStudent[classId] = {};
      this.structuredSelection[classId] = {};
      divisionIds.forEach(divisionId => {
        this.structuredStudent[classId][divisionId] = [];
        this.structuredSelection[classId][divisionId] = false;
      });
    });
    console.log('students structured: ', this.structuredStudent);
    console.log('selection students: ', this.structuredSelection);
  }

  populateStudents(studentSectionList: any): void {
    studentSectionList.forEach(studentSelection => {
      let ClassId, DivisionId;
      ClassId = studentSelection.parentClass;
      DivisionId = studentSelection.parentDivision;
      this.structuredStudent[ClassId][DivisionId].push(studentSelection)
    });
    this.studentsCount = studentSectionList.length;
    this.removeEmptySections();
  }

  removeEmptySections(): void{
    this.classList.forEach(Class => {
      this.divisionList.forEach(Division => {
        if (this.structuredStudent[Class.id][Division.id].length === 0) {
          delete this.structuredStudent[Class.id][Division.id];
          delete this.structuredSelection[Class.id][Division.id];
        }
      })
    })
  }

  updateAllClassesSelection(selectionStatus: boolean): void {
    this.classList.forEach(Class => {
      this.divisionList.forEach(Division => {
        if (this.structuredStudent[Class.id][Division.id]) {
          this.structuredSelection[Class.id][Division.id]= selectionStatus;
        }
      })
    })
    if (selectionStatus)
      this.selectionCount = this.studentsCount;
    else
      this.selectionCount = 0;
  }
  
  showSection(Class: any): boolean{
    return Object.keys(this.structuredStudent[Class.id]).length > 1;
  }

  downloadSheetTemplate(): void {
    let data = [['ID', 'Name', 'Father’s Name', 'Class', 'Section']];

    this.classList.forEach(Class => {
      this.divisionList.forEach(Division => {
        if (this.structuredSelection[Class.id][Division.id]) {
          this.structuredStudent[Class.id][Division.id].forEach(({student}) => {
            let row = [student.id, student.name, student.fathersName, Class.name, this.showSection(Class)?Division.name:null]
            data.push(row);
          });
        }
      })
    });
    console.log(data);

    let ws = XLSX.utils.aoa_to_sheet(data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Sheet.xlsx');
  }

  uploadSheet(event: any): void{
    if (event.target.files.length>0) {
      let file = event.target.files[0];
      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
  
        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
  
        /* save data */
        let data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        console.log('read data: ', data);
      };
      reader.readAsBinaryString(file);
    }
  }

  logMessage(log: any): void{
    console.log(log);
  }
}
