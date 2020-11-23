import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

import { UpdateViaExcelServiceAdapter } from './update-via-excel.service.adapter';

import {DataStorage} from '../../../../classes/data-storage';
import { StudentService } from './../../../../services/modules/student/student.service';
import { ClassService } from './../../../../services/modules/class/class.service';
import { FeeService} from './../../../../services/modules/fees/fee.service'
import { empty } from 'rxjs';

@Component({
  selector: 'app-update-via-excel',
  templateUrl: './update-via-excel.component.html',
  styleUrls: ['./update-via-excel.component.css'],
  providers: [StudentService, ClassService, FeeService]
})
export class UpdateViaExcelComponent implements OnInit {

  user;

  classList = [];
  divisionList = [];
  feeTypeList = [];
  studentList = [];

  structuredStudent = {};  // structure = {classId: {classSecions: [Students], ...}, ...}
  structuredSelection = {};
  studentsCount = 0;
  selectionCount = 0;

  uploadedData = [];  //  Array of array
  errorRows = []; //  format: [rowNumber,Error Mesage]
  errorCells = [];  //  format: [row, colums, Error Message]
  warningRows = []; //  format: [rowNumber,Warning Mesage]
  warningCells = []; //  format: [row, colums, Warning Message]

  dataIsUploadable = false;
  isLoading = false;

  serviceAdapter: UpdateViaExcelServiceAdapter;

  constructor(public studentService: StudentService, public classService: ClassService, public feeService: FeeService) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new UpdateViaExcelServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
  }

  populateFeeType(feeTypeList): void{
    this.feeTypeList = feeTypeList.sort((a, b) => a.orderNumber - b.orderNumber);
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
    let data = [];
    
    let headersRow = ['Software ID', 'Scholar No.', 'Name', 'Father’s Name', 'Class'];
    this.feeTypeList.forEach(feeType => headersRow.push(feeType.name));
    data.push(headersRow);

    this.classList.forEach(Class => {
      this.divisionList.forEach(Division => {
        if (this.structuredSelection[Class.id][Division.id]) {
          this.structuredStudent[Class.id][Division.id].forEach(({student}) => {
            let row = [student.id, student.scholarNumber, student.name, student.fathersName, `${Class.name} ${this.showSection(Class) ? ','+Division.name : ''}`]
            data.push(row);
          });
        }
      })
    });

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
        this.clearExcelData();
        this.uploadedData = XLSX.utils.sheet_to_json(ws, { header: 1 });
        this.uploadedData.pop();
        console.log('uploaded Data: ', this.uploadedData);
        //Sanity Checks
        this.headersSanityCheck();
        this.studentDataCorrespondenceSanityCheck();
        this.feeAmountSanityCheck();
      };
      reader.readAsBinaryString(file);
    }
  }

  headersSanityCheck(): void {
    const headers = this.uploadedData[0];
    let actualHeader = ['Software ID', 'Scholar No.', 'Name', 'Father’s Name', 'Class'];
    this.feeTypeList.forEach(feeType => actualHeader.push(feeType.name));
    const len = actualHeader.length;
    for (let i = 0; i < len; i += 1){
      if (actualHeader[i] !== headers[i])
        this.errorCells.push([0, i, `Header Mismatch: Expected ${actualHeader[i]}`]);
    }
  }

  studentDataCorrespondenceSanityCheck(): void {
    let i, id, providedStudent, student, len = this.uploadedData.length, Class, Division;

    for (i = 1; i < len; i += 1){ // for every row in uploaded data
      [student, Class, Division] = [undefined, undefined, undefined];
      providedStudent = this.uploadedData[i];
      id = parseInt(providedStudent[0]);

      const [C, D] = providedStudent[4].split(','); //extracting class and divison as C and D
      Class = this.classList.find(c => c.name.trim() === C.trim()); 

      // Extracting student from class and section
      if (Class) {
        if (D) {
          Division = this.divisionList.find(d => d.name.trim() === D.trim());
          if (Division)
            student = this.structuredStudent[Class.id][Division.id].find(ss => ss.student.id === id).student;
        }
        else {
          student = Reflect.ownKeys(this.structuredStudent[Class.id]).map(k=>this.structuredStudent[Class.id][k])[0].find(ss => ss.student.id === id).student;  // till map function is the implementation of Object.values() since it's not supported
        }
      }
  
      if(student === undefined){
        this.errorCells.push([i, 4, 'Class/Section Mismatch']);
        console.log('Class Section Mismatch');
        student = this.studentList.find(s => s.id === id);
      }

      if (student === undefined)  // not found case
        this.errorRows.push([i, 'Student Not Found'])
      else {

        if (student.scholarNumber != providedStudent[1] && student.scholarNumber !== "" && providedStudent[1] !== undefined) {
          this.errorCells.push([i, 1, 'Scholar Number Mismatch']);
          console.log(`Scholar No. data mismatch at row ${i+1}`);
        }

        if (student.name.trim() !== providedStudent[2].trim()) {
          this.errorCells.push([i, 2, 'Name Mismatch']);
          console.log(`Name data mismatch at row ${i+1}`);
        }

        if (student.fathersName.trim() !== providedStudent[3].trim()) {
          this.errorCells.push([i, 3, 'Father’s Name Mismatch']);
          console.log(`Father’s Name data mismatch at row ${i+1}`)
        }
      }
    }
  }

  feeAmountSanityCheck(): void {
    let i, j, len = this.uploadedData.length, currData, parsedAmount;
    for (i = 1; i < len; i++){  //  for Each row
      currData = this.uploadedData[i];
      currData.slice(5).forEach((amount, index) => {
        parsedAmount = parseFloat(amount)
        if (!isNaN(parsedAmount)) {
          if (parsedAmount < 0) {
            this.errorCells.push([i,index+5, 'Negavtive Amount'])
          }
          else if (parsedAmount != parseInt(amount)) {
            currData[index + 5] = Math.round(parsedAmount);
            this.warningCells.push([i, index + 5, 'Amount Rounded to nearest integer']);
          }
        } else {  //  empty cell case
          // currData[index + 5] = 0;
          // this.warningCells.push([i, index + 5, 'Empty Amount set to 0']);
        }
      });
    }
  }

  feeIsNotUploadedSanityCheck(): void {
    
  }

  clearExcelData(): void {
    this.uploadedData = [];
    this.errorRows = [];
    this.errorCells = [];
    this.warningRows = [];
    this.warningCells = [];
  }

  logMessage(log: any): void{
    console.log(log);
  }
}
