import { Component, OnInit } from '@angular/core';
import xlsx = require('xlsx');

import { DataStorage } from "@classes/data-storage";
import { GenericService } from '@services/generic/generic-service';
import { AddViaExcelServiceAdapter } from './add-via-excel.service.adapter';
import { Book } from '@modules/library/models/book';

interface Parameter {
    name: string;
    field: string;
    filter: (any) => boolean;
    required?: boolean;
}

@Component({
    selector: 'add-via-excel',
    templateUrl: './add-via-excel.component.html',
    styleUrls: ['./add-via-excel.component.css'],
    providers: [GenericService],
})

export class AddViaExcelComponent implements OnInit {

    user: any;
    isLoading: boolean = false;

    serviceAdapter: AddViaExcelServiceAdapter;

    usedBookNumbers: Number[] = [];
    columnHeader: Array<any> = [];
    bookList: Array<Array<any>> = [];
    errorCells = {};
    errorCount = 0;
    hasRequiredColumns: boolean = false;
    mappedParameter: Parameter[] = [];
    hasFileSelected: boolean = false;

    reader: FileReader = new FileReader();

    parameters: Parameter[] = [
        {
            name: "None",
            field: "none",
            filter: () => true
        },
        {
            name: "Book Number",
            field: "bookNumber",
            filter: (num) => {
                // The book number should be a number and should not been used before
                if (!num) return false;
                if (isNaN(num) || isNaN(parseFloat(num))) return false;
                if (num < 0) return false;
                if (this.usedBookNumbers.includes(num)) return false;
                if (this.bookList.filter((book) => book[this.mappedParameter.indexOf(this.parameters[1])] === num).length > 1) return false;
                return true;
            },
            required: true
        },
        {
            name: "Name",
            field: "name",
            filter: (name) => !!name,
            required: true
        },
        {
            name: "Author",
            field: "author",
            filter: () => true
        },
        {
            name: "Publisher",
            field: "publisher",
            filter: () => true
        },
        {
            name: "Date of Purchase",
            field: "dateOfPurchase",
            filter: (date) => {
                // if the date is present, it should be a valid date
                if (!date) return true;
                if (isNaN(Date.parse(date))) return false;
                return true;
            }
        },
        {
            name: "Edition",
            field: "edition",
            filter: () => true
        },
        {
            name: "Number of Pages",
            field: "numberOfPages",
            filter: (numPages) => {
                // if the number of pages is present, it should be a number
                if (!numPages) return true;
                if (isNaN(numPages) || isNaN(parseFloat(numPages))) return false;
                return true;
            }
        },
        {
            name: "Printed Cost",
            field: "printedCost",
            filter: (cost) => {
                // if the cost is present, it should be a number
                if (!cost) return true;
                if (isNaN(cost) || isNaN(parseFloat(cost))) return false;
                return true;
            }
        },
        {
            name: "Cover Type",
            field: "coverType",
            filter: () => true
        },
        {
            name: "Type of Book",
            field: "typeOfBook",
            filter: () => true
        },
        {
            name: "Location",
            field: "location",
            filter: () => true
        }
    ];

    constructor (public genericService: GenericService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new AddViaExcelServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.reader.onload = (e: any) => {
            this.isLoading = true;
            // read workbook
            const bstr: string = e.target.result;
            const wb: xlsx.WorkBook = xlsx.read(bstr, { type: 'binary' });

            // grab first sheet
            const wsname: string = wb.SheetNames[0];
            const ws: xlsx.WorkSheet = wb.Sheets[wsname];

            // save data
            this.bookList = [];
            this.bookList = xlsx.utils.sheet_to_json(ws, { header: 1 });

            // // remove empty rows
            while (!this.bookList[this.bookList.length - 1].reduce((a, b) => a || b, false)) {
                this.bookList.pop();
            }

            // // if blank file is uploaded
            if (this.bookList.length === 0) {
                this.hasFileSelected = false;
                this.isLoading = false;
                return;
            }

            this.columnHeader = this.bookList.shift();

            this.matchHeaders();
            this.checkRows();
            this.checkRequiredColumns();

            this.hasFileSelected = true;
            this.isLoading = false;
        };
    }

    getTotalMappedParameters() {
        return this.mappedParameter.filter((parameter) => parameter.name !== "None").length;
    }

    matchHeaders() {
        let headers = this.columnHeader;
        this.mappedParameter = [];
        headers.forEach((header, index) => {
            let parameter = this.parameters.find((parameter) => parameter.name === header);
            if (parameter) {
                this.mappedParameter[index] = parameter;
            } else {
                this.mappedParameter[index] = this.parameters[0];
            }
        });
    }

    checkRows() {
        this.errorCells = {};
        this.errorCount = 0;
        this.bookList.forEach((book, index) => {
            book.forEach((cell, cellIndex) => {
                if (!this.mappedParameter[cellIndex].filter(cell)) {
                    this.errorCells[`${index} ${cellIndex}`] = true;
                    this.errorCount++;
                }
            });
        });
    }

    checkRequiredColumns() {
        this.hasRequiredColumns = true;
        this.parameters.forEach((parameter) => {
            if (parameter.required && !this.mappedParameter.includes(parameter)) {
                this.hasRequiredColumns = false;
                return false;
            }
        });
    }

    getAvailableParameters(i) {
        return this.parameters.filter((parameter) => (
            !this.mappedParameter.includes(parameter) ||
            parameter.name === "None" ||
            this.mappedParameter.indexOf(parameter) === i
        ));
    }

    handleParameterSelection(event, index) {
        let parameter = this.parameters.find((parameter) => parameter.name === event);
        if (parameter) {
            this.mappedParameter[index] = parameter;
        }
        this.checkRows();
        this.checkRequiredColumns();
    }

    handleExcelFile(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.reader.readAsBinaryString(file);
        }
    }

    downloadTemplate() {
        let headerRow = this.parameters.map((parameter) => parameter.name);
        let data = [headerRow];
        let ws = xlsx.utils.aoa_to_sheet(data);
        let wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
        xlsx.writeFile(wb, "BooksToAdd.xlsx");
    }

    addBookList() {
        alert("Under Construction!!!");
    }
}
