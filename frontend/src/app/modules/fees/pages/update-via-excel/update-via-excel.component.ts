import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

import { UpdateViaExcelServiceAdapter } from './update-via-excel.service.adapter';

import {DataStorage} from '../../../../classes/data-storage';
import { StudentService } from './../../../../services/modules/student/student.service';
import { ClassService } from './../../../../services/modules/class/class.service';
import { FeeService} from './../../../../services/modules/fees/fee.service'

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
  errorRows = {}; //  format: {rowNumber:Error Mesage, ...}
  errorCells = {};  //  format: {`row, colums`: Error Message, ...}
  warningRows = {}; //  format: {rowNumber:Warning Mesage, ...}
  warningCells = {}; //  format: {`row, colums`: Warning Message}
  warningRowIndices = new Set();
  errorRowIndices = new Set();

  filteredRows = [];
  activeFilter = 'all';
  isLoading = false;

  serviceAdapter: UpdateViaExcelServiceAdapter;

  constructor(public studentService: StudentService, public classService: ClassService, public feeService: FeeService) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new UpdateViaExcelServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
  }

  filterBy(newFilter): void{
    if (newFilter !== this.activeFilter) {
      switch (newFilter) {
        case 'all':
          this.filteredRows = this.uploadedData.slice(1).map((d, i) => i + 1);
          this.activeFilter = newFilter;
          break;
        case 'errors':
          this.filteredRows = Array.from(this.errorRowIndices).sort((a,b)=>a-b);
          this.activeFilter = newFilter;
          break;
        case 'warnings':
          this.filteredRows = Array.from(this.warningRowIndices).sort((a,b)=>a-b);
          this.activeFilter = newFilter;
          break;
      }
    }
  }

  cleanUp(): void{
    this.warningRowIndices.delete(0);
    this.errorRowIndices.delete(0);
    this.filteredRows = this.uploadedData.slice(1).map((d, i) => i+1);
    this.isLoading = false;
  }

  newErrorCell(row, col, msg): void {
    this.errorCells[`${row},${col}`] = msg;
    this.errorRowIndices.add(row);
  }

  newErroRow(row, msg): void {
    this.errorRows[row] = msg;
    this.errorRowIndices.add(row);
  }

  newWarningCell(row, col, msg): void {
    this.warningCells[`${row},${col}`] = msg;
    this.warningRowIndices.add(row);
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
        this.isLoading = true;
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

        this.cleanUp();
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
      if (actualHeader[i] !== headers[i]) {
        this.newErrorCell(0,i,`Header Mismatch: Expected ${actualHeader[i]}`)
      }
    }
  }

  studentDataCorrespondenceSanityCheck(): void {
    let i, id, providedStudent, student, len = this.uploadedData.length, Class, Division, ss;

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
            ss = this.structuredStudent[Class.id][Division.id].find(s => s.student.id === id);
          student = ss ? ss.student : undefined;
        }
        else {
          ss = Reflect.ownKeys(this.structuredStudent[Class.id]).map(k=>this.structuredStudent[Class.id][k])[0].find(s => s.student.id === id);  // till map function is the implementation of Object.values() since it's not supported
          student = ss ? ss.student : undefined;
        }
      }
  
      if(student === undefined){
        student = this.studentList.find(s => s.id === id);
        if (student) {
          this.newErrorCell(i,4,'Class/Section Mismatch')
        }
      }

      if (student === undefined) { // not found case
        this.newErroRow(i, 'Student Not Found');
      }
      else {

        if (student.scholarNumber != providedStudent[1] && student.scholarNumber !== "" && providedStudent[1] !== undefined) {
          this.newErrorCell(i,1,'Scholar Number Mismatch');
        }

        if (student.name.trim() !== providedStudent[2].trim()) {
          this.newErrorCell(i, 2, 'Name Mismatch');
        }

        if (student.fathersName.trim() !== providedStudent[3].trim()) {
          this.newErrorCell(i,3,'Father’s Name Mismatch')
        }
      }
    }
  }

  feeAmountSanityCheck(): void {
    let i, pastIndex, len = this.uploadedData.length, currData, parsedAmount;
    for (i = 1; i < len; i++){  //  for Each row
      currData = this.uploadedData[i];
      pastIndex = 0;
      currData.slice(5).forEach((amount, index) => {
        while (index > pastIndex) {
          currData[pastIndex + 5] = 0;
          this.newWarningCell(i, pastIndex + 5, 'Empty cell set to 0');
          pastIndex += 1;
        }
        pastIndex += 1;
        parsedAmount = parseFloat(amount)
        if (!isNaN(parsedAmount)) {
          if (parsedAmount < 0) {
            this.newErrorCell(i, index + 5, 'Negavtive Amount');
          }
          else if (parsedAmount != parseInt(amount)) {
            currData[index + 5] = Math.round(parsedAmount);
            this.newWarningCell(i, index + 5, 'Amount Rounded to nearest integer');
          }
        } else {  //  not number Cell
          this.newErrorCell(i, index + 5, 'Amount must be an positive integer');
        }
      });
      this.uploadedData[i] = currData;
    }
  }

  feeIsNotUploadedSanityCheck(): void {
    
  }

  errorCount() {
    return Reflect.ownKeys(this.errorCells).length + Reflect.ownKeys(this.errorRows).length;
  }

  warningCount() {
    return Reflect.ownKeys(this.warningCells).length + Reflect.ownKeys(this.warningRows).length;
  }

  clearExcelData(): void {
    this.uploadedData = [];
    this.errorRows = {};
    this.errorCells = {};
    this.warningRows = {};
    this.warningCells = {};
    this.errorRowIndices.clear();
    this.warningRowIndices.clear();
    this.activeFilter = 'all';
  }

  uploadToServer(): any{}

  logMessage(log: any): void{
    console.log(log);
  }
}
