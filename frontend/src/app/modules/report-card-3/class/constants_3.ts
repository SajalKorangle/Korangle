// import { DesignReportCardCanvasAdapter } from './../report-card-3/pages/design-report-card/design-report-card.canvas.adapter'; // this is causing cyclic dependency, solve later by moving common things at upper level
import {ATTENDANCE_STATUS_LIST} from '@modules/attendance/classes/constants';
import { data } from 'jquery';
import { bindCallback } from 'rxjs';
interface DesignReportCardCanvasAdapter{
    [key: string]: any;
}

const FormulaParser = require('hot-formula-parser').Parser;

// Utility Functions ---------------------------------------------------------------------------

function numberToVariable(n: number): string {  // used to convert layer id to a unique variabla name
    // converts decimal number to base 26; 0-25 is encoded as A-Z
    let variable = '';
    let temp;

    do {
        temp = n % 26;
        variable = String.fromCharCode(65 + temp)+variable;
        n = Math.floor(n / 26);
    } while (n > 0);

    return variable
}

function getNumberInWords(numerical: number): string {  // mapping of 1 to 99 in words
    switch (numerical) {
        case 1: return 'One';
        case 2: return 'Two';
        case 3: return 'Three';
        case 4: return 'Four';
        case 5: return 'Five';
        case 6: return 'Six';
        case 7: return 'Seven';
        case 8: return 'Eight';
        case 9: return 'Nine';
        case 10: return 'Ten';
        case 11: return 'Eleven';
        case 12: return 'Twelve';
        case 13: return 'Thirteen';
        case 14: return 'Fourteen';
        case 15: return 'Fifteen';
        case 16: return 'Sixteen';
        case 17: return 'Seventeen';
        case 18: return 'Eighteen';
        case 19: return 'Nineteen';
        case 20: return 'Twenty';
        case 21: return 'Twenty One';
        case 22: return 'Twenty Two';
        case 23: return 'Twenty Three';
        case 24: return 'Twenty Four';
        case 25: return 'Twenty Five';
        case 26: return 'Twenty Six';
        case 27: return 'Twenty Seven';
        case 28: return 'Twenty Eight';
        case 29: return 'Twenty Nine';
        case 30: return 'Thirty';
        case 31: return 'Thirty One';
        case 32: return 'Thirty Two';
        case 33: return 'Thirty Three';
        case 34: return 'Thirty Four';
        case 35: return 'Thirty Five';
        case 36: return 'Thirty Six';
        case 37: return 'Thirty Seven';
        case 38: return 'Thirty Eight';
        case 39: return 'Thirty Nine';
        case 40: return 'Forty';
        case 41: return 'Forty One';
        case 42: return 'Forty Two';
        case 43: return 'Forty Three';
        case 44: return 'Forty Four';
        case 45: return 'Forty Five';
        case 46: return 'Forty Six';
        case 47: return 'Forty Seven';
        case 48: return 'Forty Eight';
        case 49: return 'Forty Nine';
        case 50: return 'Fifty';
        case 51: return 'Fifty One';
        case 52: return 'Fifty Two';
        case 53: return 'Fifty Three';
        case 54: return 'Fifty Four';
        case 55: return 'Fifty Five';
        case 56: return 'Fifty Six';
        case 57: return 'Fifty Seven';
        case 58: return 'Fifty Eight';
        case 59: return 'Fifty Nine';
        case 60: return 'Sixty';
        case 61: return 'Sixty One';
        case 62: return 'Sixty Two';
        case 63: return 'Sixty Three';
        case 64: return 'Sixty Four';
        case 65: return 'Sixty Five';
        case 66: return 'Sixty Six';
        case 67: return 'Sixty Seven';
        case 68: return 'Sixty Eight';
        case 69: return 'Sixty Nine';
        case 70: return 'Seventy';
        case 71: return 'Seventy One';
        case 72: return 'Seventy Two';
        case 73: return 'Seventy Three';
        case 74: return 'Seventy Four';
        case 75: return 'Seventy Five';
        case 76: return 'Seventy Six';
        case 77: return 'Seventy Seven';
        case 78: return 'Seventy Eight';
        case 79: return 'Seventy Nine';
        case 80: return 'Eighty';
        case 81: return 'Eighty One';
        case 82: return 'Eighty Two';
        case 83: return 'Eighty Three';
        case 84: return 'Eighty Four';
        case 85: return 'Eighty Five';
        case 86: return 'Eighty Six';
        case 87: return 'Eighty Seven';
        case 88: return 'Eighty Eight';
        case 89: return 'Eighty Nine';
        case 90: return 'Ninety';
        case 91: return 'Ninety One';
        case 92: return 'Ninety Two';
        case 93: return 'Ninety Three';
        case 94: return 'Ninety Four';
        case 95: return 'Ninety Five';
        case 96: return 'Ninety Six';
        case 97: return 'Ninety Seven';
        case 98: return 'Ninety Eight';
        case 99: return 'Ninety Nine';
        default: return '';
    }
}

function getMarksInWords(num: number): string{  // converts numbers from 0 to 99999 in words
    // used in conversion of marks to words
    num = Math.floor(num);
    if (num == 0) {
        return 'Zero';
    }
    let unitTens = getNumberInWords(num % 100);
    num = Math.floor(num/100);
    let hundreds = getNumberInWords(num % 10);
    num = Math.floor(num/10);
    let thousands = getNumberInWords(num % 100);
    return `${thousands?thousands+' Thousand ':''}${hundreds?hundreds+' Hundred ':''}${unitTens}`
}

function getYear(year: number): string {   // converts year number in words
    if (year < 2000) {
        return getNumberInWords(Math.floor(year / 100))
            + ' ' + getNumberInWords(year % 100);
    } else {
        return 'Two Thousand ' + getNumberInWords(year % 100);
    }
}

function getDateReplacements(date: any): { [key: string]: string } {
    // maps components(day, month , year) of given date to different available format

    // Calculating dddValue
    const s = ['th', 'st', 'nd', 'rd'];
    const v = date.getDate() % 100;
    const dddValue = date.getDate() + (s[(v - 20) % 10] || s[v] || s[0]);

    // Calculating ddddValue
    let ddddValue;
    switch (date.getDate()) {
        case 1:
            ddddValue = 'First';
            break;
        case 2:
            ddddValue = 'Second';
            break;
        case 3:
            ddddValue = 'Third';
            break;
        case 4:
            ddddValue = 'Fourth';
            break;
        case 5:
            ddddValue = 'Fifth';
            break;
        case 6:
            ddddValue = 'Sixth';
            break;
        case 7:
            ddddValue = 'Seventh';
            break;
        case 8:
            ddddValue = 'Eighth';
            break;
        case 9:
            ddddValue = 'Ninth';
            break;
        case 10:
            ddddValue = 'Tenth';
            break;
        case 11:
            ddddValue = 'Eleventh';
            break;
        case 12:
            ddddValue = 'Twelfth';
            break;
        case 13:
            ddddValue = 'Thirteenth';
            break;
        case 14:
            ddddValue = 'Fourteenth';
            break;
        case 15:
            ddddValue = 'Fifteenth';
            break;
        case 16:
            ddddValue = 'Sixteenth';
            break;
        case 17:
            ddddValue = 'Seventeenth';
            break;
        case 18:
            ddddValue = 'Eighteenth';
            break;
        case 19:
            ddddValue = 'Nineteenth';
            break;
        case 20:
            ddddValue = 'Twentieth';
            break;
        case 21:
            ddddValue = 'Twenty First';
            break;
        case 22:
            ddddValue = 'Twenty Second';
            break;
        case 23:
            ddddValue = 'Twenty Third';
            break;
        case 24:
            ddddValue = 'Twenty Fourth';
            break;
        case 25:
            ddddValue = 'Twenty Fifth';
            break;
        case 26:
            ddddValue = 'Twenty Sixth';
            break;
        case 27:
            ddddValue = 'Twenty Seventh';
            break;
        case 28:
            ddddValue = 'Twenty Eighth';
            break;
        case 29:
            ddddValue = 'Twenty Ninth';
            break;
        case 30:
            ddddValue = 'Thirtieth';
            break;
        case 31:
            ddddValue = 'Thirty First';
            break;
    }

    // Calculating mmmmValue
    let mmmmValue;
    switch (date.getMonth()) {
        case 0: mmmmValue = 'January'; break;
        case 1: mmmmValue = 'February'; break;
        case 2: mmmmValue = 'March'; break;
        case 3: mmmmValue = 'April'; break;
        case 4: mmmmValue = 'May'; break;
        case 5: mmmmValue = 'June'; break;
        case 6: mmmmValue = 'July'; break;
        case 7: mmmmValue = 'August'; break;
        case 8: mmmmValue = 'September'; break;
        case 9: mmmmValue = 'October'; break;
        case 10: mmmmValue = 'November'; break;
        case 11: mmmmValue = 'December'; break;
    }

    const replacements = {
        '<d>': date.getDate().toString(),
        '<dd>': ('0' + date.getDate()).slice(-2),
        '<ddd>': dddValue,
        '<dddd>': ddddValue,
        '<m>': (date.getMonth() + 1).toString(),
        '<mm>': ('0' + (date.getMonth() + 1)).slice(-2),
        '<mmm>': mmmmValue.toString().substr(0, 3),
        '<mmmm>': mmmmValue,
        '<yy>': date.getFullYear().toString().slice(-2),
        '<yyy>': date.getFullYear(),
        '<yyyy>': getYear(date.getFullYear())
    };

    return replacements;
}

// CANVAS DESIGN TOOL ------------------------------------------------------------------------


//Constants -------------------------------------- 

//Page Resolutions ---------------------------------------------
export const mm_IN_ONE_INCH: number = 24.5;
export const DPI_LIST: number[] = [ // standard DPIs
    600,
    300,
    200,
    100,
    72,
    50
];

export interface PageResolution{    
    resolutionName: string;
    orientation: string  // p: potrait, l:landscape
    aspectRatio: number;    // width/height
    mm: {
        height: number;
        width: number;
    }
    getHeightInPixel(dpi: number): number;  // returns height in pixels given dpi as argument
    getWidthInPixel(dpi: number): number;
    getCorrospondingWidth(height: number): number;  // returns width given height while maintaining aspect ratio
    getCorrospondingHeight(width: number): number;
}

export function getStructeredPageResolution(resolutionName:string, mmHeight:number, mmWidth:number, orientation:string='p'): PageResolution {
    let aspectRatio = mmWidth / mmHeight;
    return {
        resolutionName,
        aspectRatio,
        orientation,
        mm: {
            height: mmHeight,
            width: mmWidth,
        },
        getHeightInPixel: (dpi: number) => {
            return (mmHeight * dpi) / mm_IN_ONE_INCH;
        },
        getWidthInPixel: (dpi: number):number=> {
            return (mmWidth * dpi) / mm_IN_ONE_INCH;
        },
        getCorrospondingHeight: (width: number) => width/aspectRatio,
        getCorrospondingWidth: (height: number) => height*aspectRatio,
    }
}

export const PAGE_RESOLUTIONS: PageResolution[] = [ // standard page resolutions
    getStructeredPageResolution('A3', 420, 297),
    getStructeredPageResolution('A4', 297, 210),
    getStructeredPageResolution('A5', 210, 148),
    getStructeredPageResolution('A6', 148, 105),
    getStructeredPageResolution('Custom', 100, 100)
];

export const CUSTOM_PAGE_RESOLUTION_INDEX: number = PAGE_RESOLUTIONS.length-1;

export const permissibleClickError = 4;    // in pixels

export const DATA_SOUCE_TYPE = [    // used in all canvas layers
    'N/A',  // no data source, constant eement
    'DATA'  // data source availabel, get data from the provided data source
]

export const DEFAULT_BACKGROUND_COLOR = '#ffffff'; // white
export const DEFAULT_TEXT_COLOR = '#000000'; // black


export const ATTENDANCE_TYPE_LIST = [
    'Present',
    'Absent',
    'Total Record',
];

export const EXAMINATION_TYPE_LIST = [
    'Marks', 
    'Grades', 
    'Remarks',
];

export const MARKS_TYPE_LIST = [
    'Marks Obtained',
    'Maximum Marks',
];

export const TEST_TYPE_LIST = [
    null,
    'Oral',
    'Written',
    'Theory',
    'Practical',
];

export const VERTICAL_ALIGNMENT_LIST = [
    'Top',
    'Middle',
    'Bottom',
    'Normal',
];

export const HORIZONTAL_ALIGNMENT_LIST = [
    'Left',
    'Right',
    'Center',
];

export const MARKS_NOT_AVAILABLE_CORROSPONDING_INT = -1;
export var DEFAULT_MAXIMUM_MARKS = 100;
export const DEFAULT_PASSING_MARKS = 40;

//Layers--------------------------------------

// To be implemented by all Canvas Layers
export interface Layer{
    // contains definition all class variables to be implemented by any canvas layer
    constructor: any;   // constructor of class
    id: number;
    displayName: string;    // layer name displayed to user
    LAYER_TYPE: string; // Type description for JSON parsing
    error: boolean;
    x: number;  // distance in pixels from left edge of canvas
    y: number;  // distance in pixels from top edge of canvas
    isLocked: boolean; // if element is locked on the canvas 
    parameterToolPannels: string[]; // list of right pannel parameter toolbar
    dataSourceType: string;    // options: DATA_SOURCE_TYPE, if 'N/A', all data of layer is constant; if 'DATA' use source class variable to get data 
    source?: { [key: string]: any };   // object containing information about the source of data, stores reference of element from PARAMETER_LIST
    ca: DesignReportCardCanvasAdapter;  // canvas adapter,
    layerDataUpdate(): void;    // gets data of layer if dataSourceType is 'DATA', 
    updatePosition(dx: number, dy: number): void;
    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean;  // draws layer to canavs or schedules redraw after some time if layer is not ready yet
    isClicked(mouseX: number, mouseY: number): boolean; // given clicked x and y if this layer is clicked or not
    scale(scaleFactor: number): void;   // scales all parameters of layer by given scale factor, used while zooming, fullscreen etc.
    getDataToSave(): {[object:string]:any};   // retunn data to be saved to database

    updateTextBoxMetrics?(): void;  // update bounding box imformation of text layer
    dateFormatting?(): void;    // formats data according to selectd format

    image?: HTMLImageElement;   // for CanvasImage Layer
    uri?: string;
    aspectRatio?: number;    
    maintainAspectRatio?: boolean; 

    rowsList?: Array<TableRow>; // for CanvasTable Layer
    columnsList?: Array<TableColumn>;
    rowCount?: number;
    columnCount?: number;
    cells?: any;
    selectedCells?: any;

    text?: string;  // for CanvasText Layer
    height?: number;
    width?: number;
    verticalAlignment?: string;
    horizontalAlighment?: string;
    textBoxMetrx?: {    // text bounding box nformation
        boundingBoxLeft: number,
        boundingBoxRight: number,
        boundingBoxTop: number,
        boundingBoxBottom: number,
    };
    fontStyle?: { [key: string]: any };
    underline?: boolean;
    dateFormat?: string; // for Canavs Date   // format of date, check getDateReplacements(date) function for details 
    date?: Date;
    startDate?: Date;   // for Attendance 
    endDate?: Date;
    parentExamination?: any;
    parentSubject?: any;
    testType?: string;
    marksType?: string;
    decimalPlaces?: number;
    factor?: number;
    marks?: number;
    formula?:string;
};

export class BaseLayer {    // this layer is inherited by all canvas layers
    id: number = null;
    static maxID: number = 0;   // for auto incrementing id

    error: boolean = false;
    x: number = 0;
    y: number = 0;
    alternateText: string = 'N/A';
    displayName: string; 
    LAYER_TYPE: string;
    parameterToolPannels: string[] = ['position', 'settings'];  // position right toolbar pannel is present in all layers
    isLocked: boolean;
    dataSourceType: string = 'N/A';
    source?: {[key:string]: any};

    ca: DesignReportCardCanvasAdapter;  // canvas adapter

    constructor(ca: DesignReportCardCanvasAdapter) { 
        this.ca = ca;
        BaseLayer.maxID += 1;
        this.id = BaseLayer.maxID;
        this.isLocked = false;
    }

    initilizeSelf(attributes:object): void{ // initilizes all class variables according to provided initial parameters data as object
        Object.entries(attributes).forEach(([key, value]) => this[key] = value);
        BaseLayer.maxID = Math.max(BaseLayer.maxID, this.id);   // always keeping static maxID maximum of all layers
        if (this.dataSourceType == DATA_SOUCE_TYPE[1] && this.source && !this.source.getValueFunc) {
            this.source = this.ca.vm.htmlAdapter.parameterList.find(el => el.key == this.source.key && el.field.fieldStructureKey == this.source.field.fieldStructureKey);
            if (!this.source)
                this.error = true;
        }
    }

    updatePosition(dx = 0, dy = 0):void {
        if(this.isLocked){
            return ;
        }
        else {
            this.x += dx;
            this.y += dy;
        }
    }

    getDataToSave(): {[object:string]:any} {   // common data to be saved in database
        let savingData: any = {
            id: this.id,
            displayName: this.displayName,
            LAYER_TYPE: this.LAYER_TYPE,
            x: this.x * this.ca.pixelTommFactor,  // converting pixels to mm
            y: this.y * this.ca.pixelTommFactor,
            dataSourceType: this.dataSourceType,
        }
        return savingData;
    }
}

export class CanvasImage extends BaseLayer implements Layer{  // Canvas Image Layer
    displayName: string = 'Image'; 

    image: HTMLImageElement = null;    // not included in content json data
    uri: string;
    height: number = null;
    width: number = null;
    aspectRatio: any = null;    
    maintainAspectRatio = true; 

    constructor(attributes: object, ca: DesignReportCardCanvasAdapter) {
        super(ca);  // parent constructor
        this.parameterToolPannels.push('image');

        this.image = new Image();
        
        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'IMAGE';
        this.layerDataUpdate();
    }

    initilizeSelf(attributes:object): void{
        super.initilizeSelf(attributes);
        if (this.height && this.width && (!this.aspectRatio)) { // calculate aspect ratio if height and width is available
            this.aspectRatio = this.width / this.height;
        }
    }

    layerDataUpdate(): void{
         
        if (this.dataSourceType == DATA_SOUCE_TYPE[1]) {
            const DATA = this.ca.vm.DATA;
            this.uri = this.source.getValueFunc(DATA)+'?javascript=';
        }
       
        const canvasWidth = this.ca.canvasWidth, canvasHeight = this.ca.canvasHeight;
            
        let getHeightAndWidth = () => {
            if (!this.height && !this.width) {
                this.height = this.image.height;
                this.width = this.image.width;
                this.aspectRatio = this.width / this.height;

                if (this.height > canvasHeight) {
                    this.height = canvasHeight; // so that image does not exceeds canvas boundry
                    this.width = this.aspectRatio * this.height;    // maintaining aspect ratio
                }
                if (this.width > canvasWidth) {
                    this.width = canvasWidth; // so that image does not exceeds canvas boundry
                    this.height = this.width / this.aspectRatio;    // maintaining aspect ratio
                }
            }
        }
           
        this.image.onload = () => {
            getHeightAndWidth();
        }
        this.image.onerror = () => {
            this.error = true;
        }
        this.image.setAttribute('crossOrigin', 'anonymous');  
        this.image.src = this.uri;
        
        // this.height = 20/this.ca.pixelTommFactor;
        // this.width = this.aspectRatio*this.height;
    }

    updateHeight(newHeight: number) {
        this.height = newHeight;
        if (this.maintainAspectRatio) {
            this.width = this.aspectRatio * this.height;
        }
    }

    updateWidth(newWidth: number) {
        this.width = newWidth;
        if (this.maintainAspectRatio) {
            this.height = this.width / this.aspectRatio;
        }
    }
    
    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        if (this.error)    // id error the don't draw
            return true;
        
        if (this.image.complete && this.image.naturalHeight > 0) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            return true;    // Drawn successfully on canvas
        }
        scheduleReDraw();   // draw again after some time
        return false;   // Canvas Drawing failed, scheduled redraw for later
    }

    isClicked(mouseX: number, mouseY: number): boolean {
        return (mouseX > this.x - permissibleClickError
            && mouseX < this.x + this.width + permissibleClickError
            && mouseY > this.y - permissibleClickError
            && mouseY < this.y+this.height+permissibleClickError)
    }

    scale(scaleFactor: number): void{
        this.x *= scaleFactor;
        this.y *= scaleFactor;
        this.height *= scaleFactor;
        this.width *= scaleFactor;
    }

    getDataToSave(): {[object:string]:any} {
        let savingData = super.getDataToSave();
        savingData = {
            ...savingData,
            height: this.height * this.ca.pixelTommFactor,
            width: this.width * this.ca.pixelTommFactor,
            maintainAspectRatio: this.maintainAspectRatio,
        };
        if (this.dataSourceType == DATA_SOUCE_TYPE[0]) {
            savingData.uri = this.uri;
        } else {    // if data source store source of data
            savingData.source = { ...this.source };
            delete savingData.source.layerType;
        }
        return savingData;
    }
}

export class TableRow{
    height: number = 10;    // in mm 
}

export class TableColumn{
    width: number = 30;     // in mm
}

export class CanvasTable extends BaseLayer implements Layer{
    displayName: string = 'Table';

    rowsList: Array<TableRow> = [];
    columnsList: Array<TableColumn> = [];
    rowCount: number = 0;
    columnCount: number = 0;
    selectedCells: any;

    height: number = 0; // computed from rowsList and columnsList
    width: number = 0;

    cells: any;

    tableStyle:{[key:string]: any} = {
        strokeStyle: 'black',
        lineWidth: 2,
    };

    constructor(attributes: object, ca: DesignReportCardCanvasAdapter) {
        super(ca);
        this.parameterToolPannels.push('table');
        
        this.x = 50 / ca.pixelTommFactor;
        this.y = 50 / ca.pixelTommFactor;
        this.tableStyle.lineWidth = 0.5 / ca.pixelTommFactor;
        this.selectedCells = [];
        this.selectedCells.push({
            'row': 0,
            'column': 0,
        })

        this.initilizeSelf(attributes);
        this.layerDataUpdate();
        this.updateTableMetrix();

        this.LAYER_TYPE = 'TABLE';
    }

    initilizeSelf(attributes:object): void {
        super.initilizeSelf(attributes);
        console.log(attributes);
        this.rowCount = Math.max(this.rowCount, this.rowsList.length);  // if rowCount is less that this.rowList.length that update rowCount accordingly
        this.columnCount = Math.max(this.columnCount, this.columnsList.length);
        while (this.rowsList.length < this.rowCount) {  // rowCount is greater that the rows in rowsList then add rows in rowList
            let newTableRow = new TableRow;
            newTableRow.height /= this.ca.pixelTommFactor;  // converting mm to pixels
            this.rowsList.push(newTableRow);
        }
        while (this.columnsList.length < this.columnCount) {
            let newTableRowColumn = new TableColumn;
            newTableRowColumn.width /= this.ca.pixelTommFactor; // converting mm to pixels
            this.columnsList.push(newTableRowColumn);
        }

        if(attributes['cells'] == undefined){
            this.cells = new Array(this.rowCount);
            for(let i=0;i<this.rowCount; i++){
                this.cells[i] = new Array(this.columnCount);
                for(let j=0;j<this.columnCount; j++){
                    this.cells[i][j] = {
                        'topBorder': {
                            'visible': true,
                            'lineWidth':2,
                            'strokeStyle': 'black',
                        },
                        'bottomBorder': {
                            'visible': true,
                            'lineWidth':2,
                            'strokeStyle': 'black',
                        },
                        'leftBorder': {
                            'visible': true,
                            'lineWidth':2,
                            'strokeStyle': 'black',
                        },
                        'rightBorder': {
                            'visible': true,
                            'lineWidth':2,
                            'strokeStyle': 'black',
                        },
                        'cellBackground': '#ffffff',
                    }
                }
            }
        }
        else{
            this.cells = attributes['cells'];
            for(let i=0;i<this.rowCount; i++){
                for(let j=0;j<this.columnCount; j++){
                    this.cells[i][j].topBorder.lineWidth *= this.ca.pixelTommFactor;
                    this.cells[i][j].bottomBorder.lineWidth *= this.ca.pixelTommFactor;
                    this.cells[i][j].leftBorder.lineWidth *= this.ca.pixelTommFactor;
                    this.cells[i][j].rightBorder.lineWidth *= this.ca.pixelTommFactor;
                }
            }
        }

    }

    layerDataUpdate(): void {
    }


    updateTableMetrix(): void{  // computing height and width of table from its rows and columns
        this.height = 0;
        this.width = 0;

        this.rowsList.forEach(tableRow => {
            this.height += tableRow.height;
        });

        this.columnsList.forEach(tableColumn => {
            this.width += tableColumn.width;
        })
    }

    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        let pointerX = this.x;
        let pointerY = this.y;

        // ctx.strokeRect(pointerX, pointerY, this.width, this.height);    // outer boundry
        // ctx.beginPath();

        // for (let i = 0; i < this.rowsList.length - 1; i++){ // horizontal lines
        //     pointerY += this.rowsList[i].height;
        //     ctx.moveTo(pointerX, pointerY);
        //     ctx.lineTo(pointerX + this.width, pointerY);
        // }

        // pointerY = this.y;
        // for (let i = 0; i < this.columnsList.length - 1; i++){  // vertical lines
        //     pointerX += this.columnsList[i].width;
        //     ctx.moveTo(pointerX, pointerY);
        //     ctx.lineTo(pointerX, pointerY+this.height);
        // }
        // ctx.closePath();
        // ctx.stroke();

        for(let i=0;i<this.rowCount; i++){
            for(let j=0;j<this.columnCount; j++){
                if(this.cells[i][j].cellBackground != null){
                    ctx.beginPath();
                    ctx.rect(pointerX, pointerY, this.columnsList[j].width, this.rowsList[i].height);       // cells background
                    ctx.fillStyle = this.cells[i][j].cellBackground;
                    ctx.fill();
                } 
                pointerX += this.columnsList[j].width;
            }
            pointerX = this.x;
            pointerY += this.rowsList[i].height;
        }

        pointerX = this.x;
        pointerY = this.y;
        for(let j=0;j<this.rowsList.length; j++){
            for(let i=0;i <this.columnsList.length; i++){
                
                let temp1 = this.cells[j][i].topBorder.lineWidth;
                let temp2 = this.cells[j][i].bottomBorder.lineWidth;
                if(i>0){
                    temp1 = Math.min(temp1, this.cells[j][i-1].topBorder.lineWidth);
                    temp2 = Math.min(temp2, this.cells[j][i-1].bottomBorder.lineWidth);
                }
                temp1 = temp1 / 2;
                temp2 = temp2 / 2;
                if(this.cells[j][i].leftBorder.visible == true){
                    ctx.beginPath();
                    ctx.moveTo(pointerX, pointerY - temp1);
                    ctx.lineTo(pointerX, pointerY+this.rowsList[j].height - temp2);          // vertical lines
                    ctx.lineWidth = this.cells[j][i].leftBorder.lineWidth;
                    ctx.strokeStyle = this.cells[j][i].leftBorder.strokeStyle;
                    ctx.stroke();       
                }                                                                     
                pointerX += this.columnsList[i].width;
            }
            pointerX = this.x;
            pointerY += this.rowsList[j].height;
        }

        pointerX = this.x + this.width;
        pointerY = this.y;
        for(let i=0;i<this.rowsList.length; i++){
            
            let temp1 = this.cells[i][this.columnCount-1].topBorder.lineWidth;
            let temp2 = this.cells[i][this.columnCount-1].bottomBorder.lineWidth;
            temp1 = temp1 / 2;
            temp2 = temp2 / 2;
            if(this.cells[i][this.columnCount-1].rightBorder.visible == true){
                ctx.beginPath();
                ctx.lineWidth = this.cells[i][this.columnCount-1].rightBorder.lineWidth;
                ctx.strokeStyle = this.cells[i][this.columnCount-1].rightBorder.strokeStyle;       // last vertical line
                ctx.moveTo(pointerX, pointerY - temp1); 
                ctx.lineTo(pointerX, pointerY + this.rowsList[i].height + temp2);  
                ctx.stroke();     
                
            }    
            pointerY += this.rowsList[i].height;
        }

        pointerX = this.x;
        pointerY = this.y;
        for(let j=0;j<this.columnsList.length; j++){
            for(let i=0;i <this.rowsList.length; i++){
                let temp1 = this.cells[i][j].leftBorder.lineWidth;
                let temp2 = this.cells[i][j].leftBorder.lineWidth;
                if(i>0){
                    temp1 = Math.min(temp1, this.cells[i-1][j].leftBorder.lineWidth);
                    temp2 = Math.min(temp2, this.cells[i-1][j].rightBorder.lineWidth);
                }
                temp1 = temp1 / 2;
                temp2 = temp2 / 2;
                if(this.cells[i][j].topBorder.visible == true){
                    ctx.beginPath();
                    ctx.lineWidth = this.cells[i][j].topBorder.lineWidth;
                    ctx.strokeStyle = this.cells[i][j].topBorder.strokeStyle;
                    ctx.moveTo(pointerX - temp1, pointerY);
                    ctx.lineTo(pointerX + this.columnsList[j].width - temp2, pointerY);          // horizontal lines
                    ctx.stroke();      
                }   
                pointerY += this.rowsList[i].height;
            }
            pointerY = this.y;
            pointerX += this.columnsList[j].width;
        }

        pointerY = this.y + this.height;
        pointerX = this.x;
        for(let i=0;i<this.columnsList.length; i++){
            let temp1 = this.cells[this.rowCount-1][i].leftBorder.lineWidth;
            let temp2 = this.cells[this.rowCount-1][i].rightBorder.lineWidth;
            temp1 = temp1 / 2;
            temp2 = temp2 / 2;
            if(this.cells[this.rowCount-1][i].bottomBorder.visible == true){
                ctx.beginPath();
                ctx.lineWidth = this.cells[this.rowCount-1][i].bottomBorder.lineWidth;
                ctx.strokeStyle = this.cells[this.rowCount-1][i].bottomBorder.strokeStyle;           // last horizontal line
                ctx.moveTo(pointerX - temp1, pointerY);
                ctx.lineTo(pointerX + this.columnsList[i].width + temp2, pointerY);
                ctx.stroke();        
            }        
            pointerX += this.columnsList[i].width;
        }

        ctx.closePath();

        return true;    // Drawn successfully on canvas
    }

    isClicked(mouseX: number, mouseY: number): boolean {
        let result = (mouseX > this.x - permissibleClickError
            && mouseX < this.x + this.width + permissibleClickError
            && mouseY > this.y - permissibleClickError
            && mouseY < this.y + this.height + permissibleClickError);
        return result;
    }

    scale(scaleFactor: number): void {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
        this.tableStyle.lineWidth *= scaleFactor;

        this.rowsList.forEach(row => {
            row.height *= scaleFactor;
        });

        this.columnsList.forEach(column => {
            column.width *= scaleFactor;
        });

        for(let i=0;i<this.rowCount; i++){
            for(let j=0;j<this.columnCount; j++){
                this.cells[i][j].topBorder.lineWidth *= scaleFactor;
                this.cells[i][j].bottomBorder.lineWidth *= scaleFactor;
                this.cells[i][j].leftBorder.lineWidth *= scaleFactor;
                this.cells[i][j].rightBorder.lineWidth *= scaleFactor;
            }
        }

        this.updateTableMetrix();
    }

    getDataToSave(): {[object:string]:any} {
        let savingData = super.getDataToSave();
        savingData = {
            ...savingData,
            rowsList: [],
            columnsList: [],
            tableStyle: {...this.tableStyle},
            cells: JSON.parse(JSON.stringify(this.cells)),
        };
        savingData.tableStyle.lineWidth *= this.ca.pixelTommFactor;
        this.rowsList.forEach(row => {
            let rowCopy = { ...row };
            rowCopy.height *= this.ca.pixelTommFactor;
            savingData.rowsList.push(rowCopy);
        });
        this.columnsList.forEach(columns => {
            let columnCopy = { ...columns };
            columnCopy.width *= this.ca.pixelTommFactor;
            savingData.columnsList.push(columnCopy);
        });
        return savingData;
    }
};

class ShapeBaseLayer extends BaseLayer{
    shapeStyle: {
        lineWidth: number,
        strokeStyle: string,
    } = {
            lineWidth: 2,
            strokeStyle: '#000000',
    }

    constructor(ca: DesignReportCardCanvasAdapter) { 
        super(ca);
        this.shapeStyle.lineWidth = 0.5 / ca.pixelTommFactor;
    }

    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean { 
        Object.entries(this.shapeStyle).forEach(([key, value]) => ctx[key] = value);
        return true;
    }

    getDataToSave() {
        let savingData = super.getDataToSave();
        savingData = {
            ...savingData,
            shapeStyle: this.shapeStyle
        }
        return savingData;
    }

}

export class CanvasLine extends ShapeBaseLayer implements Layer{
    displayName: string = 'Line';    
    
    length: number = 40;
    orientation: number = 0;

    constructor(attributes: object, ca: DesignReportCardCanvasAdapter) {
        super(ca);
        this.parameterToolPannels.push('shape');
        
        this.x = 20/ca.pixelTommFactor;
        this.y = 20/ca.pixelTommFactor;
        this.length = 40 / ca.pixelTommFactor;
        
        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'LINE';
        this.layerDataUpdate();
        
    }

    layerDataUpdate(): void {
        return ;
    }

    updateLength(newlength: any){
        this.length = newlength;
    }

    updateOrientation(newOrientation : any){
        this.orientation = newOrientation;
    }

    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        super.drawOnCanvas(ctx, scheduleReDraw);
        ctx.beginPath()
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + (this.length*Math.cos((this.orientation*Math.PI)/180)), this.y+ (this.length*Math.sin((this.orientation*Math.PI)/180)));
        ctx.stroke();
        return true;    // Drawn successfully on canvas
    }

    isClicked(mouseX: number, mouseY: number): boolean {   // reiterate if click is not working
        // Distance between the clicked point and the two points is used here
        // if sum of the distance between the clicked points and the two points, with the difference of the length of line is in permissible range, we will return true 
        // temp1. temp2 is distance between clicked point and the two points
        
        let distanceFromXYEnd = Math.sqrt(((mouseX - this.x)*(mouseX - this.x)) + ((mouseY - this.y)*(mouseY - this.y)));
        let distanceFromOppositeEnd = Math.sqrt(((mouseX - (this.x + (this.length*Math.cos((this.orientation*Math.PI)/180))))*(mouseX - (this.x + (this.length*Math.cos((this.orientation*Math.PI)/180))))) + ((mouseY - (this.y+ (this.length*Math.sin((this.orientation*Math.PI)/180))))*(mouseY - (this.y+ (this.length*Math.sin((this.orientation*Math.PI)/180))))));
        
        return ((distanceFromXYEnd + distanceFromOppositeEnd - this.length) <= permissibleClickError+this.shapeStyle.lineWidth/2);

    }

    scale(scaleFactor: number): void {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
        this.length *= scaleFactor;
        this.shapeStyle.lineWidth *= scaleFactor;
    }

    getDataToSave() {
        let savingData = super.getDataToSave();
        savingData = {
            ...savingData,
            length: this.length*this.ca.pixelTommFactor,
            orientation: this.orientation,
        };
 
        return { ...savingData };
    }

}


export class CanvasRectangle extends ShapeBaseLayer implements Layer{
    displayName: string = 'Rectangle';    
    
    ca: DesignReportCardCanvasAdapter;
    length: any = 30;
    width: any = 20;

    constructor(attributes: object, ca: DesignReportCardCanvasAdapter, initilize:boolean = true) {
        super(ca);
        this.parameterToolPannels.push('shape');
        
        this.x = 20/ca.pixelTommFactor;
        this.y = 20/ca.pixelTommFactor;
        this.length = 30/ca.pixelTommFactor;
        this.width = 20 / ca.pixelTommFactor;

        if (initilize) {
            this.initilizeSelf(attributes);
            this.layerDataUpdate();
        }

        this.LAYER_TYPE = 'RECTANGLE';

    }

    layerDataUpdate(): void {
        return ;
    }


    updateLength(newlength: any){
        this.length = newlength;
    }

    updateWidth(newWidth: any){
        this.width = newWidth;
    }
    
    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        super.drawOnCanvas(ctx, scheduleReDraw);
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.length, this.width);
        ctx.stroke();
        return true;    // Drawn successfully on canvas
    }

    isClicked(mouseX: number, mouseY: number): boolean {    // reiterate if click is not working
        return ((mouseX > this.x - permissibleClickError //top line 
            && mouseX < this.x + this.length + permissibleClickError
            && mouseY > this.y - permissibleClickError
            && mouseY < this.y + permissibleClickError) || 
            (mouseX > this.x - permissibleClickError // bottom line
            && mouseX < this.x + this.length + permissibleClickError
            && mouseY > this.y + this.width - permissibleClickError
            && mouseY < this.y + this.width +  permissibleClickError) || 
            (mouseX > this.x - permissibleClickError // left line
            && mouseX < this.x + permissibleClickError
            && mouseY > this.y - permissibleClickError
            && mouseY < this.y + this.width + permissibleClickError) || 
            (mouseX > this.x + this.length - permissibleClickError // right line
            && mouseX < this.x + this.length + permissibleClickError
            && mouseY > this.y - permissibleClickError
            && mouseY < this.y + this.width + permissibleClickError))
    }

    scale(scaleFactor: number): void {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
        this.length *= scaleFactor;
        this.width *= scaleFactor;
        this.shapeStyle.lineWidth *= scaleFactor;
    }

    getDataToSave() {
        let savingData = super.getDataToSave();
        savingData = {
            ...savingData,
            length: this.length*this.ca.pixelTommFactor,
            width: this.width*this.ca.pixelTommFactor,
        }

        return { ...savingData };
    }

}

export class CanvasCircle extends ShapeBaseLayer implements Layer{
    displayName: string = 'Circle';    
    
    radius: number = 20;
    
    constructor(attributes: object, ca: DesignReportCardCanvasAdapter, initilize:boolean=true) {
        super(ca);
        this.parameterToolPannels.push('shape');

        this.x = 50/ca.pixelTommFactor;
        this.y = 50/ca.pixelTommFactor;
        this.radius = 20/ca.pixelTommFactor;

        if (initilize) {
            this.initilizeSelf(attributes);
            this.LAYER_TYPE = 'CIRCLE';
            this.layerDataUpdate();
        }
    }

    layerDataUpdate(): void {
        return ;
    }

    updateRadius(newRadius: any){
        this.radius = newRadius;
    }

    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        super.drawOnCanvas(ctx, scheduleReDraw);
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        return true;    // Drawn successfully on canvas
    }

    isClicked(mouseX: number, mouseY: number): boolean {   // reiterate if click is not working
        // return true;
        return (
            Math.sqrt(((mouseX - this.x)*(mouseX - this.x)) + ((mouseY - this.y)*(mouseY - this.y))) <= (this.radius + permissibleClickError) &&
            Math.sqrt(((mouseX - this.x)*(mouseX - this.x)) + ((mouseY - this.y)*(mouseY - this.y))) >= (this.radius - permissibleClickError)
        )
    }

    scale(scaleFactor: number): void {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
        this.radius *= scaleFactor;
        this.shapeStyle.lineWidth *= scaleFactor;
    }

    getDataToSave() {
        let savingData = super.getDataToSave();
        savingData = {
            ...savingData,
            radius: this.radius*this.ca.pixelTommFactor,
        }

        return { ...savingData };
    }

}

export class CanvasRoundedRectangle extends ShapeBaseLayer implements Layer{
    displayName: string = 'Rounded Rectangle';    
    
    length: number;
    width: number;
    radius: number;

    constructor(attributes: object, ca: DesignReportCardCanvasAdapter) {
        super(ca);
        this.parameterToolPannels.push('shape');

        this.x = 20/ca.pixelTommFactor;
        this.y = 20/ca.pixelTommFactor;
        this.length = 30/ca.pixelTommFactor;
        this.width = 20/ca.pixelTommFactor;
        this.radius = 5/ca.pixelTommFactor;

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'ROUNDED-RECTANGLE';
        this.layerDataUpdate();

    }

    layerDataUpdate(): void {
        return ;
    }

    updateLength(newlength: any){
        this.length = newlength;
    }

    updateWidth(newWidth: any){
        this.width = newWidth;
    }

    updateRadius(newRadius: any){
        this.radius = newRadius;
    }
    
    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        super.drawOnCanvas(ctx, scheduleReDraw);
        ctx.beginPath();
        ctx.moveTo(this.x + this.radius, this.y);
        ctx.lineTo(this.x + this.width - this.radius, this.y);
        ctx.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + this.radius);
        ctx.lineTo(this.x + this.width, this.y + this.length - this.radius);
        ctx.quadraticCurveTo(this.x + this.width, this.y + this.length, this.x + this.width - this.radius, this.y + this.length);
        ctx.lineTo(this.x + this.radius, this.y + this.length);
        ctx.quadraticCurveTo(this.x, this.y + this.length, this.x, this.y + this.length - this.radius);
        ctx.lineTo(this.x, this.y + this.radius);
        ctx.quadraticCurveTo(this.x, this.y, this.x + this.radius, this.y);
        ctx.stroke();
        return true;    // Drawn successfully on canvas
    }

    isClicked(mouseX: number, mouseY: number): boolean {    // reiterate if click is not working
        return ((mouseX > this.x - permissibleClickError //top line 
            && mouseX < this.x + this.length + permissibleClickError
            && mouseY > this.y - permissibleClickError
            && mouseY < this.y + permissibleClickError) || 
            (mouseX > this.x - permissibleClickError // bottom line
            && mouseX < this.x + this.length + permissibleClickError
            && mouseY > this.y + this.width - permissibleClickError
            && mouseY < this.y + this.width +  permissibleClickError) || 
            (mouseX > this.x - permissibleClickError // left line
            && mouseX < this.x + permissibleClickError
            && mouseY > this.y - permissibleClickError
            && mouseY < this.y + this.width + permissibleClickError) || 
            (mouseX > this.x + this.length - permissibleClickError // right line
            && mouseX < this.x + this.length + permissibleClickError
            && mouseY > this.y - permissibleClickError
            && mouseY < this.y + this.width + permissibleClickError))
    }

    scale(scaleFactor: number): void {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
        this.length *= scaleFactor;
        this.width *= scaleFactor;
        this.radius *= scaleFactor;
        this.shapeStyle.lineWidth *= scaleFactor;
    }

    getDataToSave() {
        let savingData = super.getDataToSave();
        savingData = {
            ...savingData,
            length: this.length*this.ca.pixelTommFactor,
            width: this.width*this.ca.pixelTommFactor,
            radius: this.radius*this.ca.pixelTommFactor,
        }

        return { ...savingData };
    }

}


export class CanvasSquare extends CanvasRectangle implements Layer{
    displayName: string = 'Square';    
    
    constructor(attributes: object, ca: DesignReportCardCanvasAdapter) {
        super(attributes, ca, false);


        this.x = 20/ca.pixelTommFactor;
        this.y = 20/ca.pixelTommFactor;
        this.length = 20/ca.pixelTommFactor;
        this.width = this.length;

        this.initilizeSelf(attributes);
        this.layerDataUpdate();

        this.LAYER_TYPE = 'SQUARE';
    }

    updateLength(newlength: any){
        this.length = newlength;
        this.width = this.length;
    }

}

export class CanvasText extends BaseLayer implements Layer{
    displayName: string = 'Text';
    text: string = 'Lorem Ipsum';    
    textBoxMetrx: {
        boundingBoxLeft: number,
        boundingBoxRight: number,
        boundingBoxTop: number,
        boundingBoxBottom: number,
    } = {
        boundingBoxLeft: null,
        boundingBoxRight: null,
        boundingBoxTop: null,
        boundingBoxBottom: null,
    };


    ctx = this.ca.virtualContext;
    // clicked: boolean;
    fontStyle: { [key: string]: string } = {
        fillStyle: DEFAULT_TEXT_COLOR,
        font: ' normal 12px Arial',
    };
    underline: boolean = false;
    verticalAlignment: string;
    horizontalAlignment: string;

    constructor(attributes: object, ca: DesignReportCardCanvasAdapter, initilize:boolean=true) {
        super(ca);
        this.parameterToolPannels.push('text');
        
        this.x = 50 / ca.pixelTommFactor;
        this.y = 50 / ca.pixelTommFactor;
        this.underline = false;
        this.horizontalAlignment = HORIZONTAL_ALIGNMENT_LIST[0];
        this.verticalAlignment = VERTICAL_ALIGNMENT_LIST[3];
        this.fontStyle.font = ` normal ${6 / ca.pixelTommFactor}px Arial`;

        if (initilize) {    // initilize is sent as false is this class is super class of some other layer, in that case child class handles this block
            this.initilizeSelf(attributes);
            this.layerDataUpdate();
        }
        this.LAYER_TYPE = 'TEXT';
    }

    layerDataUpdate(): void {
        const DATA = this.ca.vm.DATA;
        if (this.dataSourceType == 'DATA') {
            if (this.error) {
                this.text = this.alternateText;
            } else {
                let value = this.source.getValueFunc(DATA);
                this.text = value ? value : this.alternateText;
            }
        }
        this.changeLayerName();
        
        this.updateTextBoxMetrics();
    }

    changeLayerName(): void{
        if(this.text != this.alternateText){
            let maxLength = Math.min(this.text.length, 10);
            this.displayName = '';
            for(let i=0;i<maxLength; i++){
                this.displayName += this.text[i];
            }
            if(maxLength < this.text.length){
                this.displayName += '...';
            }
        }
    }

    updateTextBoxMetrics = ():void=>{
        const ctx = this.ca.virtualContext;
        Object.entries(this.fontStyle).forEach(([key, value]) => ctx[key] = value); 
        let textMetrix = ctx.measureText(this.text);
        this.textBoxMetrx = {
            boundingBoxLeft: textMetrix.actualBoundingBoxLeft,
            boundingBoxRight: textMetrix.actualBoundingBoxRight,
            boundingBoxTop: textMetrix.actualBoundingBoxAscent,
            boundingBoxBottom: textMetrix.actualBoundingBoxDescent,
        };
    }

    drawUnderline():void{
        if(this.underline){
            this.ctx.beginPath()
            this.ctx.moveTo(this.x + this.textBoxMetrx.boundingBoxLeft, this.y);
            this.ctx.lineTo(this.x + this.textBoxMetrx.boundingBoxRight, this.y);
            this.ctx.stroke();
        }
        return ;
    }

    // drawSelectionHighlight():void{
    //     if(this.clicked){
    //         console.log('clicked');
    //         this.ctx.setLineDash([5, 5]);
    //         this.ctx.strokeStyle = 'blue';
    //         this.ctx.beginPath();
    //         this.ctx.rect(this.x - this.textBoxMetrx.boundingBoxLeft - permissibleClickError, this.y - this.textBoxMetrx.boundingBoxTop - permissibleClickError, this.textBoxMetrx.boundingBoxLeft + this.textBoxMetrx.boundingBoxRight + 2*permissibleClickError, this.textBoxMetrx.boundingBoxTop + this.textBoxMetrx.boundingBoxBottom + permissibleClickError);
    //         this.ctx.stroke();
    //     }
    // }

    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        Object.entries(this.fontStyle).forEach(([key, value])=> ctx[key] = value);  // applying font styles
        
        if(this.verticalAlignment == VERTICAL_ALIGNMENT_LIST[0]){
            ctx.textBaseline = 'top'
        }
        else if(this.verticalAlignment == VERTICAL_ALIGNMENT_LIST[1]){
            ctx.textBaseline = 'middle';
        }
        else if(this.verticalAlignment == VERTICAL_ALIGNMENT_LIST[2]){
            ctx.textBaseline = 'bottom';
        }
        else if(this.verticalAlignment == VERTICAL_ALIGNMENT_LIST[3]){
            ctx.textBaseline = 'alphabetic';
        }
        if(this.horizontalAlignment == HORIZONTAL_ALIGNMENT_LIST[0]){
            ctx.textAlign = 'left'
        }
        else if(this.horizontalAlignment == HORIZONTAL_ALIGNMENT_LIST[1]){
            ctx.textAlign = 'right';
        }
        else if(this.horizontalAlignment == HORIZONTAL_ALIGNMENT_LIST[2]){
            ctx.textAlign = 'center';
        }
        ctx.fillText(this.text, this.x, this.y);
        this.drawUnderline();
        // this.drawSelectionHighlight();

        return true;    // Drawn successfully on canvas
    }

    isClicked(mouseX: number, mouseY: number): boolean {    // reiterate if click is not working
        // if((mouseX > this.x - this.textBoxMetrx.boundingBoxLeft - permissibleClickError
        //     && mouseX < this.x + this.textBoxMetrx.boundingBoxRight + permissibleClickError
        //     && mouseY > this.y - this.textBoxMetrx.boundingBoxTop - permissibleClickError
        //     && mouseY < this.y + this.textBoxMetrx.boundingBoxBottom + permissibleClickError)){
        //         this.drawSelectionHighlight();
        //         return true;

        // }
        // return false;
        // this.clicked = (mouseX > this.x - this.textBoxMetrx.boundingBoxLeft - permissibleClickError
        //     && mouseX < this.x + this.textBoxMetrx.boundingBoxRight + permissibleClickError
        //     && mouseY > this.y - this.textBoxMetrx.boundingBoxTop - permissibleClickError
        //     && mouseY < this.y + this.textBoxMetrx.boundingBoxBottom + permissibleClickError)
        // return this.clicked;
        return (mouseX > this.x - this.textBoxMetrx.boundingBoxLeft - permissibleClickError
            && mouseX < this.x + this.textBoxMetrx.boundingBoxRight + permissibleClickError
            && mouseY > this.y - this.textBoxMetrx.boundingBoxTop - permissibleClickError
            && mouseY < this.y + this.textBoxMetrx.boundingBoxBottom + permissibleClickError)
    }

    scale(scaleFactor: number): void {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
        const [italics, fontWeight, fontSize, font] = this.fontStyle.font.split(' ');
        let newFontSize = parseFloat(fontSize.substr(0, fontSize.length - 2));
        newFontSize *= scaleFactor;
        this.fontStyle.font = [italics, fontWeight, newFontSize + 'px', font].join(' ');
        this.updateTextBoxMetrics();
    }

    getDataToSave(): { [object: string]: any } {
        let savingData = super.getDataToSave();

        const [italics, fontWeight, fontSize, ...font]:any[] = this.fontStyle.font.split(' ');

        savingData = {
            ...savingData,
            fontSize: parseFloat(fontSize.substr(0, fontSize.length - 2))*this.ca.pixelTommFactor,
            italics,
            fontWeight,
            font: font.join(' '),
            underline: this.underline,
            fillStyle: this.fontStyle.fillStyle,
            verticalAlignment: this.verticalAlignment,
            horizontalAlignment: this.horizontalAlignment,
        }
        if (this.dataSourceType == DATA_SOUCE_TYPE[0]) {
            savingData.text = this.text;
        } else {
            savingData.source = { ...this.source };
            delete savingData.source.layerType;
        }
        return savingData;
    }

}




export class CanvasDate extends CanvasText implements Layer{
    displayName: string = 'Date';
    date: Date = new Date();
    dateFormat: string = '<dd>/<mm>/<yyy>';

    constructor(attributes: object, ca: DesignReportCardCanvasAdapter) {
        super(attributes, ca, false);
        this.parameterToolPannels.push('date')

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'DATE';
        this.layerDataUpdate();
    }

    layerDataUpdate(): void {
        if (this.dataSourceType == 'DATA') {
            const DATA = this.ca.vm.DATA;
            this.date = new Date(this.source.getValueFunc(DATA));
        }

        this.dateFormatting();
        this.changeLayerName();

        this.updateTextBoxMetrics();
    }

    dateFormatting(): void{
        const dateReplacements:{[key:string]: string}  = getDateReplacements(this.date);
        let dateValue = this.dateFormat;
        Object.entries(dateReplacements).forEach(([dataReplacementKey, dateReplacementvalue]) => {
            dateValue = dateValue.replace(dataReplacementKey, dateReplacementvalue);
        });
        this.text = dateValue;
    }

    getDataToSave(): { [object: string]: any } {
        let savingData = super.getDataToSave();
        delete savingData.text;
        savingData = {
            ...savingData,
            'dateFormat': this.dateFormat
        }
        if (this.dataSourceType == DATA_SOUCE_TYPE[0]) {
            savingData.date = this.date;
        } // else part is alreday handled in super.getDataToSave call
        return savingData;
    }

}

// export class CanvasGroup extends BaseLayer implements Layer{
//     layers: Array<Layer> = [];
//     height: number = 0;
//     width: number = 0;
//     locked: boolean = false;

//     constructor(attributes: object, ca: DesignReportCardCanvasAdapter, initilize:boolean=true) {
//         super(ca);
//         this.parameterToolPannels.push('group');

//         if (initilize) {
//             this.initilizeSelf(attributes);
//             this.layerDataUpdate();
//         }
//         this.LAYER_TYPE = 'GROUP';
//     }

//     layerDataUpdate(): void {
//     }

//     drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
//         return true;
//     }

//     isClicked(mouseX: number, mouseY: number): boolean {    // reiterate if click is not working
//         if (this.locked) {
//             let anyLayerClicked: boolean = false;
//             this.layers.forEach((layer: Layer) => {
//                 anyLayerClicked = anyLayerClicked || layer.isClicked(mouseX, mouseY);
//             });
//             return anyLayerClicked;
//         } 
//         return false;
//     }

//     scale(scaleFactor: number): void {
//     }

//     getDataToSave():object {
//         // To be implemented
//         return {};
//     }
// }

export class AttendanceLayer extends CanvasText implements Layer{
    displayName: string = 'Attendance';
    startDate: Date = new Date();
    endDate: Date = new Date();

    dataSourceType: string = 'DATA';
    source: {[key:string]: any};    // required attribute

    constructor(attributes: object, ca: DesignReportCardCanvasAdapter) {
        super(attributes, ca, false);
        this.parameterToolPannels.push('attendance');

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'ATTENDANCE';
        this.layerDataUpdate();
    }

    layerDataUpdate(): void {
        const DATA = this.ca.vm.DATA;
        this.text = this.source.getValueFunc(DATA, this.startDate, this.endDate);   // check PARAMETER_LIST with field = attendance
        this.updateTextBoxMetrics();
    }

    getDataToSave(): { [object: string]: any } {
        let savingData = super.getDataToSave();
        delete savingData.text;
        savingData = {
            ...savingData,
            startDate: this.startDate,
            endDate: this.endDate,
        }
        return savingData;
    }
}

export class GradeLayer extends CanvasText implements Layer{
    displayName: string = 'Grade';
    parentExamination: any = null;
    subGradeId: any = null;

    dataSourceType: string = 'DATA';
    source: { [key: string]: any };    // required attribute
    
    constructor(attributes: object, ca: DesignReportCardCanvasAdapter) {
        super(attributes, ca, false);
        this.parameterToolPannels.push('grade');

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'GRADE';
        this.layerDataUpdate();
    }

    layerDataUpdate(): void {
        const DATA = this.ca.vm.DATA;
        if (this.parentExamination && this.subGradeId) {
            this.text = this.source.getValueFunc(this.ca.vm.DATA, this.parentExamination, this.subGradeId);
            this.error = false;
        } else {
            this.text = this.alternateText;
            this.error = true;
        }
        this.updateTextBoxMetrics();
    }

    getDataToSave(): { [object: string]: any } {
        let savingData = super.getDataToSave();
        delete savingData.text;
        savingData = {
            ...savingData,
            parentExamination: this.parentExamination,
            subGradeId: this.subGradeId,
        }
        return savingData;
    }

}

export class RemarkLayer extends CanvasText implements Layer{
    displayName: string = 'Examination Remark';
    parentExamination: any = null;

    dataSourceType: string = 'DATA';
    source: { [key: string]: any };    // required attribute
    
    constructor(attributes: object, ca: DesignReportCardCanvasAdapter) {
        super(attributes, ca, false);
        this.parameterToolPannels.push('remark');

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'REMARK';
        this.layerDataUpdate();
    }

    layerDataUpdate(): void {
        const DATA = this.ca.vm.DATA;
        if (this.parentExamination) {
            this.text = this.source.getValueFunc(this.ca.vm.DATA, this.parentExamination);
            this.error = false;
        } else {
            this.text = this.alternateText;
            this.error = true;
        }
        this.updateTextBoxMetrics();
    }

    getDataToSave(): { [object: string]: any } {
        let savingData = super.getDataToSave();
        delete savingData.text;
        savingData = {
            ...savingData,
            parentExamination: this.parentExamination,
        }
        return savingData;
    }

}

export class GradeRule{
    lowerMarks: number = 0;
    upperMarks: number = 100;
    lowerInclusion: boolean = true;
    upperInclusion: boolean = true;
    gradeValue: string = 'A';

    
    constructor(attributes: object = {}) { 
        this.initilizeSelf(attributes);
    }
    initilizeSelf(attributes:object): void{
        Object.entries(attributes).forEach(([key, value]) => this[key] = value);
    }

    belongsToGrade(marks: number):boolean {
        if (((this.lowerInclusion && this.lowerMarks <= marks)
                || (!this.lowerInclusion && this.lowerMarks < marks))
                && ((this.upperInclusion && this.upperMarks >= marks)
                || (!this.upperInclusion && this.upperMarks > marks))) {
            return true;
        }
        return false;
    }
};

export class GradeRuleSet{
    id: number;
    name: string;

    gradeRules: Array<GradeRule> = [new GradeRule()];

    static maxID = 0;

    constructor(attributes: object = {}) {
        GradeRuleSet.maxID++;
        this.id = GradeRuleSet.maxID;
        this.initilizeSelf(attributes);
    }

    initilizeSelf(attributes:object): void{
        Object.entries(attributes).forEach(([key, value]) => this[key] = value);
        GradeRuleSet.maxID = Math.max(GradeRuleSet.maxID, this.id);   // always keeping static maxID maximum of all layers
        if (!this.name) {
            this.name = 'Grade Rule Set - ' + this.id;
        }
    }

    getDataToSave(): { [object: string]: any } {
        let savingData = {
            id: this.id,
            name: this.name,
            gradeRules: []
        };
        this.gradeRules.forEach(gradeRule => {
            let gradeRuleCopy = { ...gradeRule };
            savingData.gradeRules.push(gradeRuleCopy);
        });
        return savingData;
    }
}

export class MarksLayer extends CanvasText implements Layer{
    displayName: string = 'Marks';

    dataSourceType: string = 'DATA';
    source: { [key: string]: any };    // required attribute

    marks: number = null;
    decimalPlaces: number = 1;
    factor: number = 1;
    parentExamination: any = null;
    parentSubject: any = null;
    testType: string = null;
    marksType: string = MARKS_TYPE_LIST[0];
    inWords: boolean = false;
    
    gradeRuleSet: GradeRuleSet;

    constructor(attributes: object, ca: DesignReportCardCanvasAdapter) {
        super(attributes, ca, false);
        this.parameterToolPannels.push('marks');

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'MARKS';
        this.layerDataUpdate();          
    }

    layerDataUpdate(): void {
        if (this.parentExamination && this.parentSubject) {
            let gradeValue:string = null;
            this.marks = this.source.getValueFunc(
                this.ca.vm.DATA,
                this.parentExamination,
                this.parentSubject,
                this.testType,
                this.marksType) * this.factor;
            if (this.gradeRuleSet) {
                this.gradeRuleSet.gradeRules.forEach((gradeRule: GradeRule) => {
                    if (gradeRule.belongsToGrade(this.marks))
                        gradeValue = gradeRule.gradeValue;
                });
            }
            if (gradeValue) {
                this.text = gradeValue;
            }
            else {
                if (this.inWords) {
                    this.text = this.marks != -1 ? getMarksInWords(this.marks) : this.alternateText;
                } else {
                    this.text = this.marks != -1 ? this.marks.toFixed(this.decimalPlaces) : this.alternateText;
                }
            }
            this.error = false;
        } else {
            this.text = this.alternateText;
            this.error = true;
        }
        this.updateTextBoxMetrics();
    }

    getDataToSave(): { [object: string]: any } {
        let savingData = super.getDataToSave();
        delete savingData.text;
        savingData = {
            ...savingData,
            decimalPlaces: this.decimalPlaces,
            factor: this.factor,
            parentExamination: this.parentExamination,
            parentSubject: this.parentSubject,
            testType: this.testType,
            marksType: this.marksType,
            inWords: this.inWords,
        }
        if (this.gradeRuleSet) {
            savingData.gradeRuleSet = this.gradeRuleSet.id;
        }
        return savingData;
    }

}

export function getParser(layers: Layer[]) {
    const PARSER = new FormulaParser();
    // setCustomFunctionsInParser(PARSER);
    layers.forEach((layer: Layer) => {
        if (layer && (layer.LAYER_TYPE == 'MARKS' || layer.LAYER_TYPE == 'FORMULA')) {
            PARSER.setVariable(numberToVariable(layer.id), layer.marks);
        }
    });
    return PARSER;
}

export class Formula extends CanvasText implements Layer{
    displayName: string = 'Formula';

    formula: string= '';
    decimalPlaces: number = 1;
    marks: number = null;
    inWords: boolean = false;
    gradeRuleSet: GradeRuleSet;

    constructor(attributes: object, ca: DesignReportCardCanvasAdapter) {
        super(attributes, ca, false);
        this.parameterToolPannels.push('formula');

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'FORMULA';
        this.layerDataUpdate();          
    }

    layerDataUpdate(): void {
        if (this.formula.length > 0) {
            let formulaCopy: string = this.formula;
            let indexOfLayerIdNextDigit: number = formulaCopy.search(/#[0-9]+/);
            while (indexOfLayerIdNextDigit != -1) { // converting all #layerId to a unique variables

                indexOfLayerIdNextDigit++;   // moving ahead of # symbol
                let nextDigit: string = formulaCopy[indexOfLayerIdNextDigit];
                let layerId: string | number = '';
            
                while (!isNaN(parseInt(nextDigit))) {
                    layerId += nextDigit;
                    indexOfLayerIdNextDigit += 1;
                    nextDigit = formulaCopy[indexOfLayerIdNextDigit];
                }
                layerId = parseInt(layerId);
                formulaCopy = formulaCopy.replace('#' + layerId, numberToVariable(layerId));

                indexOfLayerIdNextDigit = formulaCopy.search(/#[0-9]+/)
            }

            const parser = getParser(this.ca.layers);
            let result = parser.parse(formulaCopy);
            if (result.error) {
                this.text = result.error;
            } else {
                this.marks = Number(result.result)
                let gradeValue:string = null;
            
                if (this.gradeRuleSet) {
                    this.gradeRuleSet.gradeRules.forEach((gradeRule: GradeRule) => {
                        if (gradeRule.belongsToGrade(this.marks))
                            gradeValue = gradeRule.gradeValue;
                    });
                }
                if (gradeValue) {
                    this.text = gradeValue;
                }
                else if(this.inWords){
                    this.text = this.marks >=0 ? getMarksInWords(this.marks) : this.alternateText;
                }
                else{
                    this.text = this.marks >=0 ? this.marks.toFixed(this.decimalPlaces) : this.alternateText;
                }
            }
        } else {
            this.text = 'Write Formula'
        }
        this.updateTextBoxMetrics();
    }

    getDataToSave(): { [object: string]: any } {
        let savingData = super.getDataToSave();
        delete savingData.text;
        savingData = {
            ...savingData,
            formula: this.formula,
            inWords: this.inWords,
            decimalPlaces:this.decimalPlaces,
        }
        return savingData;
    }

}

export class Result extends CanvasText implements Layer{
    displayName: string = 'Result';

    marksLayers: (MarksLayer|Formula)[] = []; 
    rules: {passingMarks: number[], remarks: string[], colorRule:any[]} = {passingMarks:[], remarks:['PASS'], colorRule:['#008000']};

    constructor(attributes: object, ca: DesignReportCardCanvasAdapter) {
        super(attributes, ca, false);
        this.parameterToolPannels.push('result');

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'RESULT';
        this.layerDataUpdate();          
    }

    layerDataUpdate(): void {
        let numberOfFailedSubjects = 0;
        this.marksLayers.forEach((layer: MarksLayer | Formula, index: number) => {
            if (!layer.marks || layer.marks < this.rules.passingMarks[index]) {
                numberOfFailedSubjects++;
            } 
        });
        this.text = this.rules.remarks[numberOfFailedSubjects];
        this.fontStyle.fillStyle = this.rules.colorRule[numberOfFailedSubjects];
        this.updateTextBoxMetrics();
    }

    getDataToSave(): { [object: string]: any } {
        let savingData = super.getDataToSave();
        delete savingData.text;
        savingData = {
            ...savingData,
            marksLayers: this.marksLayers.map(layer => layer.id),
            rules: {...this.rules},
        }
        return savingData;
    }

}




// BUSINESS------------------------------------------------------------------------------------

// Note: The fieldStructureKey values will be saved in database
// so you can not change fieldStructureKey values at a later stage.

class FieldStructure {

    static getStructure(displayFieldName: any, fieldStructureKey: any): any {
        return {
            displayFieldName: displayFieldName,
            fieldStructureKey: fieldStructureKey,
        }
    }

}

// Different field types have different way of getting their values
export const FIELDS = {
    STUDENT: FieldStructure.getStructure('Student', 'student'),
    STUDENT_SESSION: FieldStructure.getStructure('Student Session', 'student_session'),
    STUDENT_CUSTOM: FieldStructure.getStructure('Student Custom', 'student_custom'),
    SCHOOL: FieldStructure.getStructure('School', 'school'),
    EXAMINATION: FieldStructure.getStructure('Examination', 'examination'),
    ATTENDANCE: FieldStructure.getStructure('Attendance', 'attendance'),
};




// Parameters--------------------------------------

export interface ParameterAsset{
    key: string,
    field: string,
    layerType: any,
    displayParameterNameFunc: any
    getValueFunc: any
};

class ParameterStructure {

    static getStructure(key: any, field: any, layerType: any, displayParameterNameFunc: any, getValueFunc: any): any {

        let finalGetValueFunc;
        finalGetValueFunc = getValueFunc;

        return {
            key: key,
            field: field,
            layerType: layerType,
            displayParameterNameFunc: displayParameterNameFunc,
            getValueFunc: finalGetValueFunc,
        };

    }

}

class StudentParameterStructure {

    // Variable name is the parameter key

    static getStructure(displayName: any, variableName: any, layerType:any = CanvasText): any {
        return ParameterStructure.getStructure(
            variableName, 
            FIELDS.STUDENT,
            layerType,
            () => {   
                return displayName;
            },
            (dataObject) => {
                return dataObject.data.studentList.find(x => x.id === dataObject.studentId)[variableName];
            });
    }

}


class StudentSessionParameterStructure {

    // Variable name is the parameter key

    static getStructure(displayName: any, variableName: any, getValueFunc: any, layerType:any = CanvasText): any {
        return ParameterStructure.getStructure(
            variableName,
            FIELDS.STUDENT_SESSION,
            layerType,
            () => {
                return displayName;
            },
            getValueFunc);
    }

}

class SchoolParameterStructure {

    // Variable name is the parameter key


    static getStructure(displayName: any, variableName: any, layerType:any = CanvasText): any {
        return ParameterStructure.getStructure(
            variableName,
            FIELDS.SCHOOL,
            layerType,
            () => {
                return displayName;
            },
            (dataObject) => dataObject.data.school[variableName]);
    }

}

class AttendanceParameterStructure {

    // Data Type is the parameter key

    static getStructure(variableType: any): any {

        return ParameterStructure.getStructure(
            variableType,
            FIELDS.ATTENDANCE,
            AttendanceLayer,
            () => {
                return variableType;
            },
            (dataObject, startDate, endDate) => {
                let filteredAttendence = dataObject.data.attendanceList.filter(attendance => {
                    if (attendance.parentStudent === dataObject.studentId) {
                        const dateOfAttendance = new Date(attendance.dateOfAttendance);
                        return dateOfAttendance >= startDate
                            && dateOfAttendance <= endDate;
                    }
                    return false;
                });
                return filteredAttendence.reduce((total, attendance) => {
                    switch (variableType) {
                        case ATTENDANCE_TYPE_LIST[0]:
                            return total + (attendance.status === ATTENDANCE_STATUS_LIST[0] ? 1 : (attendance.status === ATTENDANCE_STATUS_LIST[3] ? 0.5 : 0));
                        case ATTENDANCE_TYPE_LIST[1]:
                            return total + (attendance.status === ATTENDANCE_STATUS_LIST[1] ? 1 : 0);
                        case ATTENDANCE_TYPE_LIST[2]:
                            return total + (attendance.status !== ATTENDANCE_STATUS_LIST[2] ? 1 : 0);
                    }
                    return 0;
                }, 0);
            }
        );
    }
}

export class StudentCustomParameterStructure {

    // Student Parameter Id is the parameter key

    static getStructure(studentParameterName: any, studentParameterId:any, layerType = CanvasText): any {
        return ParameterStructure.getStructure(
            studentParameterName,
            FIELDS.STUDENT_CUSTOM,
            layerType,
            () => {
                return studentParameterName;
            },
            (dataObject) => {
                const studentParameterValue = dataObject.data.studentParameterValueList.find(x =>
                    (x.parentStudentParameter === studentParameterId && x.parentStudent === dataObject.studentId)
                );
                if (studentParameterValue !== undefined) {
                    return studentParameterValue.value;
                } else {
                    return 'N/A';
                }
            });
    }

}

class ExaminationParameterStructure {

    // Data Type is the parameter key

    static getStructure(variableType: any, getValueFunc:any, layerType:any = CanvasText): any {

        return ParameterStructure.getStructure(
            variableType,
            FIELDS.EXAMINATION,
            layerType,
            (dataObject) => {
                return variableType;
            },
            getValueFunc
        );
    }

    static getMarks(dataObject:any, parentExamination:any, parentSubject:any, testType:string):number {  
        const student_test_object = dataObject.data.studentTestList.find(studentTest => {
            return studentTest.parentExamination === parentExamination
                && studentTest.parentSubject === parentSubject
                && studentTest.testType === testType
                && studentTest.parentStudent === dataObject.studentId
        });
        if (student_test_object !== undefined && !isNaN(student_test_object.marksObtained)) {
            return student_test_object.marksObtained;
        } else {
            return MARKS_NOT_AVAILABLE_CORROSPONDING_INT;
        }  
    }

    static getMaximumMarks(dataObject:any, parentExamination:any, parentSubject:any, testType:string):number {
        const test_object = dataObject.data.testList.find(test => {
            return test.parentExamination === parentExamination
                && test.parentSubject === parentSubject
                && test.testType === testType
                && test.parentClass === dataObject.data.studentSectionList.find(item =>
                    item.parentStudent === dataObject.studentId).parentClass
                && test.parentDivision === dataObject.data.studentSectionList.find(item =>
                    item.parentStudent === dataObject.studentId).parentDivision
        });
        if (test_object !== undefined && !isNaN(test_object.maximumMarks)) {
            return test_object.maximumMarks;
        } else {
            return DEFAULT_MAXIMUM_MARKS;
        }
    }
}

export const PARAMETER_LIST = [

    // key -> <FIELD_NAME>-<PARAMETER_NAME>
    // field -> From above mentioned Field L
    // dataType -> From above mentioned Parameter Type List
    // displayName -> For parameter recognition by user on front end side
    // getValueFunc -> it is function to get the value of the parameter from data variable

    /* Student Field */
    /* Done */
    //// Name, Father's Name, Mother's Name, Mobile No., Second Mobile No., Scholar No.,
    //// Address, Profile Image, Gender, Caste, Category, Religion, Father Occupation, Family SSMID,
    //// Child SSMID, Bank Name, Bank Ifsc code, Bank Account No., Aadhar No., Blood Group,
    //// Father Annual Income, RTE, Date Of Birth, Date of Admission
    /* Remaining */
    ////  Bus Stop, Admission Session
    StudentParameterStructure.getStructure(`Name`, 'name'),
    StudentParameterStructure.getStructure(`Father's Name`, 'fathersName'),
    StudentParameterStructure.getStructure(`Mother's Name`, 'motherName'),
    StudentParameterStructure.getStructure(`Mobile No.`, 'mobileNumber'),
    StudentParameterStructure.getStructure(`Alt. Mobile No.`, 'secondMobileNumber'),
    StudentParameterStructure.getStructure(`Scholar No.`, 'scholarNumber'),
    StudentParameterStructure.getStructure(`Address`, 'address'),
    StudentParameterStructure.getStructure(`Profile Image`, 'profileImage', CanvasImage),
    StudentParameterStructure.getStructure(`Date of Birth`, 'dateOfBirth', CanvasDate),    //uncomment after implementing Date layer
    StudentParameterStructure.getStructure(`Gender`, 'gender'),
    StudentParameterStructure.getStructure(`Caste`, 'caste'),
    StudentParameterStructure.getStructure(`Category`, 'newCategoryField'),
    StudentParameterStructure.getStructure(`Religion`, 'newReligionField'),
    StudentParameterStructure.getStructure(`Father's Occupation`, 'fatherOccupation'),
    StudentParameterStructure.getStructure(`Family SSMID`, 'familySSMID'),
    StudentParameterStructure.getStructure(`Child SSMID`, 'childSSMID'),
    StudentParameterStructure.getStructure(`Bank Name`, 'bankName'),
    StudentParameterStructure.getStructure(`Bank Ifsc Code`, 'bankIfscCode'),
    StudentParameterStructure.getStructure(`Bank Account No.`, 'bankAccountNum'),
    StudentParameterStructure.getStructure(`Aadhar No.`, 'aadharNum'),
    StudentParameterStructure.getStructure(`Blood Group`, 'bloodGroup'),
    StudentParameterStructure.getStructure(`Father's Annual Income`, 'fatherAnnualIncome'),
    StudentParameterStructure.getStructure(`RTE`, 'rte'),
    StudentParameterStructure.getStructure(`Date of Admission`, 'dateOfAdmission', CanvasDate), //uncomment after implementing Date layer

    /* Student Session Field */
    StudentSessionParameterStructure.getStructure(
        'Class',
        'class',
        (dataObject) => {
            return dataObject.data.classList.find(
                classs => {
                    return classs.id === dataObject.data.studentSectionList.find(
                        x => x.parentStudent === dataObject.studentId
                    ).parentClass
                }
            ).name
        }
    ),
    StudentSessionParameterStructure.getStructure(
        'Class Teacher Signature',
        'signatureImage',
        (dataObject) => {
            return dataObject.data.classSectionSignatureList.find(classs => 
                classs.parentClass == dataObject.data.studentSectionList.find(x => x.parentStudent === dataObject.studentId).parentClass &&
                classs.parentDivision == dataObject.data.studentSectionList.find(x => x.parentStudent === dataObject.studentId).parentDivision).signatureImage
        },
        CanvasImage
    ),
    StudentSessionParameterStructure.getStructure(
        'Section',
        'section',
        (dataObject) => {
            return dataObject.data.divisionList.find(
                classs => {
                    return classs.id === dataObject.data.studentSectionList.find(
                        x => x.parentStudent === dataObject.studentId
                    ).parentDivision
                }
            ).name
        }
    ),
    StudentSessionParameterStructure.getStructure(
        'Roll No.',
        'rollNumber',
        (dataObject) => {
            return dataObject.data.studentSectionList.find(
                x => x.parentStudent === dataObject.studentId
            ).rollNumber
        }
    ),
    StudentSessionParameterStructure.getStructure(
        'Class & Section',
        'classSection',
        (dataObject) => {
            return dataObject.data.classList.find(
                    classs => {
                        return classs.id === dataObject.data.studentSectionList.find(
                            x => x.parentStudent === dataObject.studentId
                        ).parentClass
                    }
                ).name
                + ', '
                + dataObject.data.divisionList.find(
                    division => {
                        return division.id === dataObject.data.studentSectionList.find(
                            x => x.parentStudent === dataObject.studentId
                        ).parentDivision
                    }
                ).name
        }
    ),


    /* School Field */
    /* Done */
    //// ProfileImage, Principal Signature Image
    //// Name, Print Name, Mobile Number, Address, Pin Code,
    //// Village/City, Block, District, State, Dise Code, Registration Number, Medium, Affiliation Number
    /* Remaining */
    //// Current Session, Board
    SchoolParameterStructure.getStructure(`Logo`, 'profileImage', CanvasImage),
    SchoolParameterStructure.getStructure(`Principal's Signature`, 'principalSignatureImage', CanvasImage),
    SchoolParameterStructure.getStructure(`Name`, 'name'),
    SchoolParameterStructure.getStructure(`Print Name`, 'printName'),
    SchoolParameterStructure.getStructure(`Mobile No.`, 'mobileNumber'),
    SchoolParameterStructure.getStructure(`Address`, 'address'),
    SchoolParameterStructure.getStructure(`Pin Code`, 'pincode'),
    SchoolParameterStructure.getStructure(`Village/City`, 'villageCity'),
    SchoolParameterStructure.getStructure(`Block`, 'block'),
    SchoolParameterStructure.getStructure(`District`, 'district'),
    SchoolParameterStructure.getStructure(`State`, 'state'),
    SchoolParameterStructure.getStructure(`Dise Code`, 'diseCode'),
    SchoolParameterStructure.getStructure(`Registration No.`, 'registrationNumber'),
    SchoolParameterStructure.getStructure(`Affiliation No.`, 'affiliationNumber'),
    SchoolParameterStructure.getStructure(`Medium`, 'medium'),

    
    ParameterStructure.getStructure(
        'currentSession',
        FIELDS.SCHOOL,
        CanvasText,
        () => {return 'Current Session'},
        (dataObject) => {return dataObject.data.sessionList.find(session => session.id  == dataObject.currentSession).name},
    ), 


    /* Attendance Field */
    AttendanceParameterStructure.getStructure(ATTENDANCE_TYPE_LIST[0]),
    AttendanceParameterStructure.getStructure(ATTENDANCE_TYPE_LIST[1]),
    AttendanceParameterStructure.getStructure(ATTENDANCE_TYPE_LIST[2]),
     
    /* Examination Field */
    ExaminationParameterStructure.getStructure(
        EXAMINATION_TYPE_LIST[1],
        (dataObject: any, examinationId: any, subGradeId: any) => {
            const value = dataObject.data.studentSubGradeList.find(studentSubGrade => {
                return studentSubGrade.parentStudent === dataObject.studentId
                    && studentSubGrade.parentExamination === examinationId
                    && studentSubGrade.parentSubGrade === subGradeId; 
            });
            if (value !== undefined) {
                return value.gradeObtained;
            }
            return 'N/A';
        },
        GradeLayer
    ),
    ExaminationParameterStructure.getStructure(
        EXAMINATION_TYPE_LIST[2],
        (dataObject: any, examinationId:any) => {
            const value = dataObject.data.studentExaminationRemarksList.find(studentExaminationRemarks => {
                return studentExaminationRemarks.parentStudent === dataObject.studentId
                    && studentExaminationRemarks.parentExamination === examinationId;
            });
            if (value !== undefined) {
                return value.remark;
            } else {
                return 'N/A';
            }
        },
        RemarkLayer
    ),
    ExaminationParameterStructure.getStructure(
        EXAMINATION_TYPE_LIST[0],
        (dataObject: any, parentExamination: any, parentSubject: any, testType: string, marksType: string) => {
            let marks:any = -1;
            if (marksType == MARKS_TYPE_LIST[0])
                marks =  ExaminationParameterStructure.getMarks(dataObject, parentExamination, parentSubject, testType)
            else if (marksType == MARKS_TYPE_LIST[1])
                marks = ExaminationParameterStructure.getMaximumMarks(dataObject, parentExamination, parentSubject, testType)
            return parseFloat(marks)
        },
        MarksLayer
    )
]