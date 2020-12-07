import { Component, OnInit } from '@angular/core';
import xlsx = require('xlsx');

import { UpdateViaExcelServiceAdapter } from './update-via-excel.service.adapter';

import {DataStorage} from '../../../../classes/data-storage';
import { StudentService } from './../../../../services/modules/student/student.service';
import { ClassService } from './../../../../services/modules/class/class.service';
import { FeeService} from './../../../../services/modules/fees/fee.service'
import {INSTALLMENT_LIST} from "../../classes/constants";

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
  studentSessionList = [];  // student data available in student session with key 'student'

  structuredStudent = {};  // structure: {classsid: {divisionId: [student1,...], ...}, ...}
  structuredSelection = {}; // structure: {classsid: {divisionId: Boolean, ...}, ...}
  structuredStudentFee = {}; // structure: {parentStudentId: [studentFee,...], ...}
  studentsCount:number = 0;
  selectionCount:number = 0;

  uploadedData: Array<Array<any>> = [];  //  Array of array
  errorRows = {}; //  format: {rowNumber: "<Error Mesage>", ...}
  errorCells = {};  //  format: {`row, colums`: "<Error Message>", ...}
  warningCells = {}; //  format: {`row, colums`: "<Warning Message>"}
  warningRowIndices: Set<number> = new Set();
  errorRowIndices: Set<number> = new Set();
  
  filteredColumns: Array<number> = [];
  filteredRows: Array<number> = []; // Doesn't contains header row
  
  activeFilter: string = 'all';
  isLoading: boolean = false;
  isUploadable: boolean = false;

  reader: FileReader = new FileReader();

  serviceAdapter: UpdateViaExcelServiceAdapter;

  constructor(public studentService: StudentService, public classService: ClassService, public feeService: FeeService) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new UpdateViaExcelServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();

    this.reader.onload = (e: any) => {
      this.isLoading = true;
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: xlsx.WorkBook = xlsx.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: xlsx.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.clearExcelData();  // clear previous data if any
      this.uploadedData = xlsx.utils.sheet_to_json(ws, { header: 1 });
      this.uploadedData.pop();  //  removing last row which is empty
  
      //Sanity Checks
      this.headersSanityCheck();
      this.removeAllZeroColumns();
      this.studentDataCorrespondenceSanityCheck();
      this.feeAmountSanityCheck();
      this.studentPreviousFeeSanityCheck();
  
      this.cleanUp();
    };
  }

  filterBy(newFilter: string): void{
    if (newFilter !== this.activeFilter) {
      switch (newFilter) {
        case 'all':
          this.filteredRows = this.uploadedData.slice(1).map((d, i) => i + 1);
          this.activeFilter = newFilter;
          break;
        case 'errors':
          this.filteredRows = Array.from(this.errorRowIndices).sort((a:number, b: number)=>a-b);
          this.activeFilter = newFilter;
          break;
        case 'warnings':
          this.filteredRows = Array.from(this.warningRowIndices).sort((a:number, b:number)=>a-b);
          this.activeFilter = newFilter;
          break;
      }
    }
  }

  cleanUp(): void{
    this.warningRowIndices.delete(0);  // 0th row(header) is always rendered
    this.errorRowIndices.delete(0);
    this.filteredRows = this.uploadedData.slice(1).map((d, i) => i+1);
    this.isLoading = false;
    this.isUploadable = this.errorCount() == 0;
  }

  clearExcelData(): void {
    this.uploadedData = [];
    this.filteredColumns = [];
    this.filteredRows = [];
    this.errorRows = {};
    this.errorCells = {};
    this.warningCells = {};
    this.errorRowIndices.clear();
    this.warningRowIndices.clear();
    this.activeFilter = 'all';
  }

  newErrorCell(row: number, col: number, msg: string): void {
    this.errorCells[`${row},${col}`] = msg;
    this.errorRowIndices.add(row);
  }

  newErrorRow(row: number, msg: string): void {
    this.errorRows[row] = msg;
    this.errorRowIndices.add(row);
  }

  newWarningCell(row: number, col: number, msg: string): void {
    this.warningCells[`${row},${col}`] = msg;
    this.warningRowIndices.add(row);
  }

  updateAllClassesSelection(selectionStatus: boolean): void { //  sekect all or desclect all
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

  errorCount() {
    return Object.keys(this.errorCells).length + Object.keys(this.errorRows).length;
  }

  warningCount() {
    return Object.keys(this.warningCells).length;
  }

  uploadToServer(): void{
    this.serviceAdapter.uploadStudentFeeData();
  }

  downloadSheetTemplate(): void {
    let Data = [];  // to be downloaded
    
    let headersRow = ['Software ID', 'Scholar No.', 'Name', 'Father’s Name', 'Class'];
    this.feeTypeList.forEach(feeType => headersRow.push(feeType.name));
    Data.push(headersRow);

    let structuredFeeType = {}; // for accessing index of feeType by feeType.id
    this.feeTypeList.forEach((feeType, index) => {
      structuredFeeType[feeType.id] = index;
    })

    this.classList.forEach(Class => {
      this.divisionList.forEach(Division => {
        if (this.structuredSelection[Class.id][Division.id]) {
          this.structuredStudent[Class.id][Division.id].forEach(({ student }) => {
            let row = [student.id, student.scholarNumber, student.name, student.fathersName, `${Class.name} ${this.showSection(Class) ? ',' + Division.name : ''}`]
            
            if (this.structuredStudentFee[student.id]) { // if student fee exists
              this.structuredStudentFee[student.id].forEach(studentFee => {  // for every student fee
                let index = structuredFeeType[studentFee.parentFeeType];
               
                if (studentFee.isAnnually)
                  row[index + 5] = studentFee.aprilAmount;  //  fill in appropiate row, index + 5 because first five cells contains students data
                else {  //   if not anually compute total
                  let annual_total = 0;
                  INSTALLMENT_LIST.forEach(month => {
                    annual_total += studentFee[month + 'Amount'];
                  })
                  row[index + 5] = annual_total;
                }
              });
            }

            Data.push(row);
          });
        }
      })
    });

    let ws = xlsx.utils.aoa_to_sheet(Data);
    let wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'Sheet.xlsx');
  }

  uploadSheet(event: any): void{
    if (event.target.files.length>0) {
      let file = event.target.files[0];
      this.reader.readAsBinaryString(file);
    }
  }

  removeAllZeroColumns(): void{
    let i=1, len = this.uploadedData.length, ignoredColumns = this.uploadedData[0].slice(5).map((col, index) => index + 5); //  all fee columns
    let currRow;
    while (ignoredColumns.length != 0 && i < len) {
      currRow = this.uploadedData[i];
      ignoredColumns.forEach((columnIndex, index) => {
        if (this.uploadedData[i][columnIndex] && this.uploadedData[i][columnIndex] != 0 && this.uploadedData[i][columnIndex] != '')
          delete ignoredColumns[index];
      });

      i += 1;
    }

    this.filteredColumns = this.uploadedData[0].map((r, i) => i);
    ignoredColumns.forEach(col => {
      delete this.filteredColumns[col];
    });
    this.filteredColumns = this.filteredColumns.filter(col=>col!=undefined);
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
      student = undefined;
      providedStudent = this.uploadedData[i];
      id = parseInt(providedStudent[0]);
      
      
      ss = this.studentSessionList.find(s => s.parentStudent === id);
      if (ss)
        student = ss.student;
      

      if (student === undefined) { // not found case
        this.newErrorRow(i, 'Student Not Found');
      }
      else {

        Class = this.classList.find(c=> c.id==ss.parentClass);
        Division = this.divisionList.find(d => d.id == ss.parentDivision);

        if (!providedStudent[4] || `${Class.name} ${this.showSection(Class) ? ',' + Division.name : ''}`.trim() != providedStudent[4].trim())
          this.newErrorCell(i, 4, 'Invalid Class/Section Data');

        if (student.scholarNumber != providedStudent[1] && !(student.scholarNumber == "" && providedStudent[1] == undefined)) 
          this.newErrorCell(i, 1, 'Scholar Number Mismatch');

        if (!providedStudent[2] || student.name.trim() !== providedStudent[2].trim()) {
          this.newErrorCell(i, 2, 'Name Mismatch');
        }

        if (!providedStudent[3] || student.fathersName.trim() !== providedStudent[3].trim()) {
          this.newErrorCell(i,3,'Father’s Name Mismatch')
        }
      }
    }
  }

  feeAmountSanityCheck(): void {
    let i, pastIndex, len = this.uploadedData.length, currData, rowLen = this.uploadedData[0].length;
    
    for (let j = 5; j < rowLen; j++){
      if (!this.filteredColumns.find(col => col == j))
        continue;
        
      for (i = 1; i < len; i++){  //  for Each row
        let parsedAmount, amount = this.uploadedData[i][j];
        
        parsedAmount = parseFloat(amount)
        if (!isNaN(parsedAmount)) {
          if (parsedAmount < 0) {
            this.newErrorCell(i, j, 'Negavtive Amount');
          }
          else if (parsedAmount != parseInt(amount)) {
            this.uploadedData[i][j] = Math.round(parsedAmount);
            this.newWarningCell(i, j, 'Amount Rounded to nearest integer');
          }
        } else {  //  not number Cell
          if (amount && amount.trim() != '') {
            this.newErrorCell(i, j, 'Amount must be an positive integer');  
          }
          else {
            this.newWarningCell(i, j, 'Empty cell set to 0');
            this.uploadedData[i][j] = 0;
          }
        }
      }
    }
  }

  studentPreviousFeeSanityCheck(): void {
    let structuredFeeType = {};
    this.feeTypeList.forEach((feeType, index) => {
      structuredFeeType[feeType.id] = index;
    });

    this.uploadedData.slice(1).forEach((uploadedRow, row) => {
      let [student_id] = uploadedRow;
      if (this.structuredStudentFee[student_id]) {
        this.structuredStudentFee[student_id].forEach(studentFee => {
          let index = structuredFeeType[studentFee.parentFeeType];
          if (studentFee.isAnnually) {
            if (parseInt(uploadedRow[index + 5]) != studentFee.aprilAmount)
              this.newErrorCell(row + 1, index + 5, 'Student Fee inconsistant with previous student fee');
          }
          else {
            let annual_total = 0;
            INSTALLMENT_LIST.forEach(month => {
              annual_total += studentFee[month + 'Amount'];
            })
            if (parseInt(uploadedRow[index + 5]) != annual_total)
            this.newErrorCell(row + 1, index + 5, 'Student Fee inconsistant with previous student fee');
          }
        });
      }
        
    })
  }

  removePreviousFeeDataFromSheet(): void {
    let structuredFeeType = {}; //  storing the index of each feeType for quick access
    this.feeTypeList.forEach((feeType, index) => {
      structuredFeeType[feeType.id] = index;
    });

    this.uploadedData.slice(1).forEach((uploadedRow, row) => {
      let [student_id] = uploadedRow;
      if (this.structuredStudentFee[student_id]) {
        this.structuredStudentFee[student_id].forEach(studentFee => {
          let index = structuredFeeType[studentFee.parentFeeType];
          delete this.uploadedData[row+1][index + 5];
        });
      }
    })
  }

}
