import { Component, OnInit } from "@angular/core";
import xlsx = require("xlsx");

import { DataStorage } from "@classes/data-storage";
import { GenericService } from "@services/generic/generic-service";
import { AddViaExcelServiceAdapter } from "./add-via-excel.service.adapter";
import { isMobile } from "../../../../classes/common";
import { ExcelService } from "../../../../excel/excel-service";

interface Parameter {
    name: string;
    field: string;
    filter: (any) => boolean;
    parse?: (any) => any;
    required?: boolean;
}

@Component({
    selector: "add-via-excel",
    templateUrl: "./add-via-excel.component.html",
    styleUrls: ["./add-via-excel.component.css"],
    providers: [GenericService, ExcelService],
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

    filterType: string = "all";

    parameters: Parameter[] = [
        {
            name: "None",
            field: "none",
            filter: () => true,
        },
        {
            name: "Book Number",
            field: "bookNumber",
            filter: (num) => {
                // The book number should be a number and should not been used before
                if (!num) {
                    return false;
                }
                if (isNaN(num) || isNaN(parseFloat(num))) return false;
                if (num < 0) return false;
                if (this.usedBookNumbers.includes(num)) return false;
                if (
                    this.bookList.filter((book) => book[this.mappedParameter.indexOf(this.parameters[1])] === num)
                        .length > 1
                )
                    return false;
                return true;
            },
            required: true,
        },
        {
            name: "Name",
            field: "name",
            filter: (name) => !!name,
            required: true,
        },
        {
            name: "Author",
            field: "author",
            filter: () => true,
        },
        {
            name: "Publisher",
            field: "publisher",
            filter: () => true,
        },
        {
            name: "Date of Purchase",
            field: "dateOfPurchase",
            filter: (inputText) => {
                if (!inputText) {
                    return true;
                }

                if (typeof inputText !== "string") {
                    return false;
                }

                let dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-](\d{4}|\d{2})$/;

                // Match the date format through regular expression
                if (inputText.match(dateformat)) {
                    //document.form1.text1.focus();

                    //Test which seperator is used '/' or '-'
                    let opera1 = inputText.split("/");
                    let opera2 = inputText.split("-");
                    let lopera1 = opera1.length;
                    let lopera2 = opera2.length;

                    // Extract the string into month, date and year
                    let pdate;
                    if (lopera1 > 1) {
                        pdate = inputText.split("/");
                    } else if (lopera2 > 1) {
                        pdate = inputText.split("-");
                    }
                    let dd = parseInt(pdate[0]);
                    let mm = parseInt(pdate[1]);
                    let yy = parseInt(pdate[2]);

                    if (yy < 100 && yy > 30) {
                        yy += 1900;
                    }
                    if (yy <= 30) {
                        yy += 2000;
                    }

                    // Create list of days of a month [assume there is no leap year by default]
                    let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    if (mm == 1 || mm > 2) {
                        if (dd > ListofDays[mm - 1]) {
                            return false;
                        }
                    }
                    if (mm == 2) {
                        var lyear = false;
                        if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
                            lyear = true;
                        }
                        if (lyear == false && dd >= 29) {
                            return false;
                        }
                        if (lyear == true && dd > 29) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    return false;
                }
            },
            parse: (inputText) => {
                let result = null;

                if (!inputText) {
                    return result;
                }

                if (typeof inputText !== "string") {
                    return result;
                }

                let dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-](\d{4}|\d{2})$/;

                // Match the date format through regular expression
                if (inputText.match(dateformat)) {
                    //Test which seperator is used '/' or '-'
                    let opera1 = inputText.split("/");
                    let opera2 = inputText.split("-");
                    let lopera1 = opera1.length;
                    let lopera2 = opera2.length;

                    // Extract the string into month, date and year
                    let pdate;
                    if (lopera1 > 1) {
                        pdate = inputText.split("/");
                    } else if (lopera2 > 1) {
                        pdate = inputText.split("-");
                    }
                    let dd = parseInt(pdate[0]);
                    let mm = parseInt(pdate[1]);
                    let yy = parseInt(pdate[2]);

                    if (yy < 100 && yy > 30) {
                        yy += 1900;
                    }
                    if (yy <= 30) {
                        yy += 2000;
                    }

                    result = yy.toString() + "/" + mm.toString() + "/" + dd.toString();
                }
                return result;
            },
        },
        {
            name: "Edition",
            field: "edition",
            filter: () => true,
        },
        {
            name: "Number of Pages",
            field: "numberOfPages",
            filter: (numPages) => {
                // if the number of pages is present, it should be a number
                if (!numPages) return true;
                if (isNaN(numPages) || isNaN(parseFloat(numPages))) return false;
                return true;
            },
            parse: (numPages) => {
                if (!numPages) return 0;
                else return parseInt(numPages);
            },
        },
        {
            name: "Printed Cost",
            field: "printedCost",
            filter: (cost) => {
                // if the cost is present, it should be a number
                if (!cost) return true;
                if (isNaN(cost) || isNaN(parseFloat(cost))) return false;
                return true;
            },
        },
        {
            name: "Cover Type",
            field: "coverType",
            filter: () => true,
        },
        {
            name: "Type of Book",
            field: "typeOfBook",
            filter: () => true,
        },
        {
            name: "Location",
            field: "location",
            filter: () => true,
        },
    ];

    constructor(public genericService: GenericService, public excelService: ExcelService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new AddViaExcelServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    getTotalMappedParameters() {
        return this.mappedParameter.filter((parameter) => parameter.name !== "None").length;
    }

    matchHeaders() {
        let headers = this.columnHeader;
        this.mappedParameter = [];
        for (let index = 0; index < headers.length; index++) {
            let header = headers[index];
            let parameter = this.parameters.find((parameter) => parameter.name === header);
            if (parameter) {
                this.mappedParameter[index] = parameter;
            } else {
                this.mappedParameter[index] = this.parameters[0];
            }
        }
    }

    checkRows() {
        this.errorCells = {};
        this.errorCount = 0;
        this.bookList.forEach((book, index) => {
            for (let cellIndex = 0; cellIndex < this.columnHeader.length; cellIndex++) {
                if (!this.mappedParameter[cellIndex].filter(book[cellIndex])) {
                    this.errorCells[`${index} ${cellIndex}`] = true;
                    this.errorCount++;
                }
            }
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
        return this.parameters.filter(
            (parameter) =>
                !this.mappedParameter.includes(parameter) ||
                parameter.name === "None" ||
                this.mappedParameter.indexOf(parameter) === i
        );
    }

    handleParameterSelection(event, index) {
        let parameter = this.parameters.find((parameter) => parameter.name === event);
        if (parameter) {
            this.mappedParameter[index] = parameter;
        }
        this.checkRows();
        this.checkRequiredColumns();
    }

    isRowVisible(i: number) {
        if (this.filterType === "all") return true;
        for (let j = 0; j < this.bookList[i].length; j++) {
            if (this.errorCells[`${i} ${j}`]) {
                return true;
            }
        }
        return false;
    }

    getVisibleRowCount() {
        let count = 0;
        for (let i = 0; i < this.bookList.length; i++) {
            if (this.isRowVisible(i)) {
                count++;
            }
        }
        return count;
    }

    handleExcelFile(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            if (!file.name.endsWith(".csv")) {
                alert("Only CSV files (.csv) are supported.");
                event.target.value = "";
                return;
            }
            // this.reader.readAsBinaryString(file);
            this.isLoading = true;
            this.excelService.getData(event, (result, file) => {
                this.bookList = result.data;
                this.bookList = this.bookList.filter((row) => row.length > 1);
                this.columnHeader = this.bookList.shift();
                this.matchHeaders();
                this.checkRows();
                this.checkRequiredColumns();
                this.hasFileSelected = true;
                this.isLoading = false;
            });
        }
    }

    clearData(event) {
        if (event) event.target.value = "";
        this.bookList = [];
        this.columnHeader = [];
        this.hasFileSelected = false;
        this.errorCells = {};
        this.errorCount = 0;
        this.mappedParameter = [];
        this.hasRequiredColumns = true;
    }

    downloadTemplate() {
        let headerRow = this.parameters.filter((param) => param.name !== "None").map((parameter) => parameter.name);
        let data = [headerRow];
        this.excelService.downloadFile(data, "BooksToAdd.csv");
    }

    async addBookList() {
        this.isLoading = true;
        if (confirm("Are you sure you want to add these books?")) {
            let res = await this.serviceAdapter.uploadBooks();
            if (res) {
                this.clearData(null);
                alert("Books added successfully!");
            }
        }
        this.isLoading = false;
    }

    //Checking if it is in mobile
    checkMobile(): any {
        return isMobile();
    }
}
