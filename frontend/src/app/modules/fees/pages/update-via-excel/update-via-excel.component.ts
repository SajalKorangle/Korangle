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

    NUM_OF_COLUMNS_FOR_STUDENT_INFO = 5;

    classList = [];
    divisionList = [];
    feeTypeList = [];
    feeTypeColumnIndexMappedByFeeTypeId = {};
    studentSectionList = [];  // student data available in student session with key 'student'

    studentListMappedByClassDivision = {};  // structure: {classsid: {divisionId: [student1,...], ...}, ...}
    classDivisionSelectionMappedByClassDivision = {}; // structure: {classsid: {divisionId: Boolean, ...}, ...}
    studentFeeListMappedByStudent = {}; // structure: {parentStudentId: [studentFee,...], ...}
    studentsCount:number = 0;
    selectionCount:number = 0;

    excelDataFromUser: Array<Array<any>> = [];  //  Array of array
    errorRows = {}; //  format: {rowNumber: "<Error Mesage>", ...}
    errorCells = {};  //  format: {`row, colums`: "<Error Message>", ...}
    warningCells = {}; //  format: {`row, colums`: "<Warning Message>"}
    warningRowIndices: Set<number> = new Set();
    errorRowIndices: Set<number> = new Set();

    // If a fee type column doesn't have any data, it will not be added to below list.
    usefulFeeTypeExcelColumnIndexList: Array<number> = [];
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
            this.excelDataFromUser = xlsx.utils.sheet_to_json(ws, { header: 1 });
            this.excelDataFromUser.pop();  //  removing last row which is empty

            //Sanity Checks
            this.headersSanityCheck();
            this.removingEmptyOrAllZeroFeeTypeColumns();
            this.studentDataCorrespondenceSanityCheck(); // Checking whether backend student and excel student is matching or not.
            this.feeAmountSanityCheck();
            this.studentPreviousFeeSanityCheck();

            this.cleanUp();
        };
    }

    filterBy(newFilter: string): void{
        if (newFilter !== this.activeFilter) {
            switch (newFilter) {
            case 'all':
                this.filteredRows = this.excelDataFromUser.slice(1).map((d,i) => i + 1);
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
        this.filteredRows = this.excelDataFromUser.slice(1).map((d,i) => i+1);
        this.isLoading = false;
        this.isUploadable = this.errorCount() == 0;
    }

    clearExcelData(): void {
        this.excelDataFromUser = [];
        this.usefulFeeTypeExcelColumnIndexList = [];
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
                if (this.studentListMappedByClassDivision[Class.id][Division.id]) {
                  this.classDivisionSelectionMappedByClassDivision[Class.id][Division.id]= selectionStatus;
                }
            });
        });
        if (selectionStatus)
            this.selectionCount = this.studentsCount;
        else
            this.selectionCount = 0;
    }

    showSection(Class: any): boolean{
        return Object.keys(this.studentListMappedByClassDivision[Class.id]).length > 1;
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
        let headerRowPlusStudentListToBeDownloaded = [];  // to be downloaded

        let headersRow = ['Software ID', 'Scholar No.', 'Name', 'Father’s Name', 'Class'];
        this.feeTypeList.forEach(feeType => headersRow.push(feeType.name));
        headerRowPlusStudentListToBeDownloaded.push(headersRow);

        this.classList.forEach(Class => {
            this.divisionList.forEach(Division => {
                if (this.classDivisionSelectionMappedByClassDivision[Class.id][Division.id]) {
                    this.studentListMappedByClassDivision[Class.id][Division.id].forEach(({ student }) => {
                        let row = [student.id, student.scholarNumber, student.name, student.fathersName, `${Class.name} ${this.showSection(Class) ? ',' + Division.name : ''}`];

                        if (this.studentFeeListMappedByStudent[student.id]) { // if student fee exists
                            this.studentFeeListMappedByStudent[student.id].forEach(studentFee => {  // for every student fee
                                let feeTypeColumnIndex = this.feeTypeColumnIndexMappedByFeeTypeId[studentFee.parentFeeType];

                                if (studentFee.isAnnually)
                                    row[feeTypeColumnIndex] = studentFee.aprilAmount;
                                else {  //   if not annually compute total
                                    let annual_total = 0;
                                    INSTALLMENT_LIST.forEach(month => {
                                        annual_total += studentFee[month + 'Amount'];
                                    });
                                    row[feeTypeColumnIndex] = annual_total;
                                }
                            });
                        }

                        headerRowPlusStudentListToBeDownloaded.push(row);
                    });
                }
            })
        });

        let ws = xlsx.utils.aoa_to_sheet(headerRowPlusStudentListToBeDownloaded);
        let wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
        xlsx.writeFile(wb, 'Sheet.xlsx');
    }

    uploadSheet(event: any): void {
        if (event.target.files.length>0) {
            let file = event.target.files[0];
            this.reader.readAsBinaryString(file);
        }
    }

    removingEmptyOrAllZeroFeeTypeColumns(): void {
        let i=1, // starting the loop from student row and ignoring the header row of excel file.
            len = this.excelDataFromUser.length,
            ignoredColumns = this.excelDataFromUser[0].map((col,index) => index).slice(this.NUM_OF_COLUMNS_FOR_STUDENT_INFO); //  all fee columns
        let currRow;
        while (ignoredColumns.length != 0 && i < len) {
            currRow = this.excelDataFromUser[i];
            // even if there is a single student for which there is a valid student fee for uploading,
            // we are going to keep that column
            // that means we need to remove it from the ignored columns.
            // Where are we ignoring those cells/columns whose data is already present in backend?
            ignoredColumns.forEach((columnIndex, index) => {
                if (this.excelDataFromUser[i][columnIndex] && this.excelDataFromUser[i][columnIndex] != 0 && this.excelDataFromUser[i][columnIndex] != '')
                    delete ignoredColumns[index];
            });

            i += 1;
        }

        // Finally removing those columns of excel file, which have no data.
        this.usefulFeeTypeExcelColumnIndexList = this.excelDataFromUser[0].map((r,i) => i).slice(this.NUM_OF_COLUMNS_FOR_STUDENT_INFO);
        ignoredColumns.forEach(col => {
            delete this.usefulFeeTypeExcelColumnIndexList[col];
        });

        // Why do we require this line?
        // to remove all empty slots in array
        this.usefulFeeTypeExcelColumnIndexList = this.usefulFeeTypeExcelColumnIndexList.filter(col=>col!=undefined);
    }

    headersSanityCheck(): void {
        const headers = this.excelDataFromUser[0];
        let actualHeader = ['Software ID', 'Scholar No.', 'Name', 'Father’s Name', 'Class'];
        this.feeTypeList.forEach(feeType => actualHeader.push(feeType.name));
        const len = actualHeader.length;
        for (let i = 0; i < len; i += 1) {
            if (actualHeader[i] !== headers[i]) {
                this.newErrorCell(0,i,`Header Mismatch: Expected ${actualHeader[i]}`)
            }
        }
    }

    studentDataCorrespondenceSanityCheck(): void {
        let i, id, excelStudent, backendStudent, len = this.excelDataFromUser.length, Class, Division, ss;

        for (i = 1; i < len; i += 1) { // for every row in uploaded data
            backendStudent = undefined;
            excelStudent = this.excelDataFromUser[i];
            id = parseInt(excelStudent[0]);


            ss = this.studentSectionList.find(s => s.parentStudent === id);
            if (ss)
                backendStudent = ss.student;


            if (backendStudent === undefined) { // not found case
                this.newErrorRow(i, 'Student Not Found');
            }
            else {
                Class = this.classList.find(c=> c.id==ss.parentClass);
                Division = this.divisionList.find(d => d.id == ss.parentDivision);

                if (!excelStudent[4] || `${Class.name} ${this.showSection(Class) ? ',' + Division.name : ''}`.trim() != excelStudent[4].trim())
                    console.log('Error');
                    this.newErrorCell(i, 4, 'Invalid Class/Section Data');

                if (backendStudent.scholarNumber != excelStudent[1] && !(backendStudent.scholarNumber == "" && excelStudent[1] == undefined))
                    console.log('Error');
                    this.newErrorCell(i, 1, 'Scholar Number Mismatch');

                if (!excelStudent[2] || backendStudent.name.trim() !== excelStudent[2].trim()) {
                    console.log('Error');
                    this.newErrorCell(i, 2, 'Name Mismatch');
                }

                if (!excelStudent[3] || backendStudent.fathersName.trim() !== excelStudent[3].trim()) {
                    console.log('Error');
                    this.newErrorCell(i,3,'Father’s Name Mismatch')
                }
            }
        }
    }

    feeAmountSanityCheck(): void {
        let i,
            len = this.excelDataFromUser.length,
            numOfExcelColumns = this.excelDataFromUser[0].length;

        for (let j = this.NUM_OF_COLUMNS_FOR_STUDENT_INFO; j < numOfExcelColumns; j++) {
            if (!this.usefulFeeTypeExcelColumnIndexList.find(col => col == j))
                continue;

            for (i = 1; i < len; i++) {  //  for each row except header
                let parsedAmount, amount = this.excelDataFromUser[i][j];

                parsedAmount = parseFloat(amount);
                if (!isNaN(parsedAmount)) { // The case of '' (i.e. empty string) goes to if not else and should be handled.
                    if (parsedAmount < 0) {
                        console.log('Error');
                        this.newErrorCell(i, j, 'Negative Amount');
                    }
                    else if (parsedAmount != parseInt(amount)) {
                        this.excelDataFromUser[i][j] = Math.round(parsedAmount);
                        this.newWarningCell(i, j, 'Amount Rounded to nearest integer');
                    }
                } else {  //  not number Cell
                    if (amount && amount.trim() != '') {
                        console.log('Error');
                        this.newErrorCell(i, j, 'Amount must be an positive integer');
                    }
                    else {
                        this.newWarningCell(i, j, 'Empty cell set to 0');
                        this.excelDataFromUser[i][j] = 0;
                    }
                }
            }
        }
    }

    studentPreviousFeeSanityCheck(): void {
        this.excelDataFromUser.slice(1).forEach((uploadedRow,row) => {
            let [student_id] = uploadedRow;
            if (this.studentFeeListMappedByStudent[student_id]) {
                this.studentFeeListMappedByStudent[student_id].forEach(studentFee => {
                    let feeTypeColumnIndex = this.feeTypeColumnIndexMappedByFeeTypeId[studentFee.parentFeeType];
                    let annual_total = 0;
                    if (studentFee.isAnnually) {
                        annual_total = studentFee.aprilAmount;
                    }
                    else {
                        INSTALLMENT_LIST.forEach(month => {
                            annual_total += studentFee[month + 'Amount'];
                        });
                    }
                    if (parseInt(uploadedRow[feeTypeColumnIndex]) != annual_total) // What happens if parseInt gives error
                        console.log('Error');
                        this.newErrorCell(row + 1, feeTypeColumnIndex, 'Student Fee inconsistent with previous student fee');
                });
            }
        });
    }

}
