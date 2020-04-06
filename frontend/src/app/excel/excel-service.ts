import {Injectable} from '@angular/core';
// import { utils, WorkSheet, WorkBook, read } from 'xlsx';
import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
import { parse } from 'papaparse';

type AOA = any[][];

@Injectable()
export class ExcelService {

    csvOptions = {
        nullToEmptyString: true,
    };

    constructor() { }

    /*downloadFile(data: any, fileName: any): void {
        // generate worksheet
        const ws: WorkSheet = utils.aoa_to_sheet(data);

        // generate workbook and add the worksheet
        const wb: WorkBook = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Sheet1');

        // save to file
        writeFile(wb, fileName);
    }*/

    downloadFile(data: any, fileName: string): void {
        fileName = fileName.substring(0, fileName.length - 4);
        new Angular5Csv(data, fileName, this.csvOptions);
    }

    /*getData(event: any): any {
        // read workbook
        const bstr: string = event.target.result;
        const wb: WorkBook = read(bstr, {type: 'binary'});

        // grab first sheet
        const wsname: string = wb.SheetNames[0];
        const ws: WorkSheet = wb.Sheets[wsname];

        // save data
        return <AOA>(utils.sheet_to_json(ws, {header: 1}));
    }*/

    getData(event: any, callBackFunction: any): void {
        parse(event.target.files[0], {
            header: false,
            skipEmptyLines: false,
            complete: callBackFunction,
        });
    }

}
