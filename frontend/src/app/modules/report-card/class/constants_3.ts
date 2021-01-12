import { DesignReportCardCanvasAdapter } from './../report-card-3/pages/design-report-card/design-report-card.canvas.adapter'; // this is causing cyclic dependency, solve later by moving common things at upper level
import {ATTENDANCE_STATUS_LIST} from '@modules/attendance/classes/constants';


const FormulaParser = require('hot-formula-parser').Parser;

// Utility Functions ---------------------------------------------------------------------------

function getNumberInWords(numerical: number): string {
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

function getYear(year: any): string {
    if (year < 2000) {
        return getNumberInWords(Math.floor(year / 100))
            + ' ' + getNumberInWords(year % 100);
    } else {
        return 'Two Thousand ' + getNumberInWords(year % 100);
    }
}

function getDateReplacements(date: any): {[key:string]: string} {

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

//Page Resolutions ---------------------------------------------
export const mm_IN_ONE_INCH: number = 24.5;
export const DPI_LIST: number[] = [
    600,
    300,
    200,
    100,
    50
]
export interface PageResolution{
    resolutionName: string;
    orientation: string  // p: potrait, l:landscape
    aspectRatio: number;
    mm: {
        height: number;
        width: number;
    }
    getHeightInPixel(dpi: number): number;
    getWidthInPixel(dpi: number): number;
    getCorrospondingWidth(height: number): number;
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

export const PAGE_RESOLUTIONS: PageResolution[] = [
    getStructeredPageResolution('A3', 420, 297),
    getStructeredPageResolution('A4', 297, 210),
    getStructeredPageResolution('A5', 210, 148),
    getStructeredPageResolution('A6', 148, 105),
    getStructeredPageResolution('Custom', 100, 100)
]

export const CUSTOM_PAGE_RESOLUTION_INDEX: number = 4;

// CANVAS DESIGN TOOL------------------------------------------------------------------------

//Constants--------------------------------------

export const permissibleClickError = 4;    // in pixels

export const PageRelativeAttributes = [
    'x',
    'y',
    'width',
    'height'
];

export const DATA_SOUCE_TYPE = [
    'N/A',
    'DATA'
]

export const DEFAULT_BACKGROUND_COLOR = '#ffffff';
export const DEFAULT_TEXT_COLOR = '#000000'


export const ATTENDANCE_TYPE_LIST = [
    'Present',
    'Absent',
    'Total Record',
];

export const EXAMINATION_TYPE_LIST = [
    'Marks', // 0
    'Grades', // 1
    'Remarks', // 2
    'Marks-To-Grade', // 3
];

export const MARKS_TYPE_LIST = [
    'Marks Obtained',
    'Maximum Marks',
];

export const ALPHABET_LIST = 'abcdefghijklmnopqrstuvwxyz';

export const TEST_TYPE_LIST = [
    null,
    'Oral',
    'Written',
    'Theory',
    'Practical',
];

export const MARKS_NOT_AVAILABLE_CORROSPONDING_INT = -1;
export var DEFAULT_MAXIMUM_MARKS = 100;

//Layers--------------------------------------

// To be implemented by all Canvas Layers
export interface Layer{
    id: number;
    displayName: string;    // layer name displayed to user
    LAYER_TYPE: string; // Type description for JSON parsing
    x: number;
    y: number;
    parameterToolPannels: string[];
    dataSourceType: string;    // options: DATA_SOURCE_TYPE
    source?: { [key: string]: any };   // object containing information about the source of data
    ca: DesignReportCardCanvasAdapter;  // canvas adapter
    layerDataUpdate(): void;
    updatePosition(dx: number, dy: number): void;
    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean;
    isClicked(mouseX: number, mouseY: number): boolean;
    scale(scaleFactor: number): void;
    getDataToSave(): any;

    updateTextBoxMetrics?(): void;
    dateFormatting?(): void;

    image?: HTMLImageElement;
    text?: string;
    height?: number;
    width?: number;
    textBoxMetrx?: {
        boundingBoxLeft: number,
        boundingBoxRight: number,
        boundingBoxTop: number,
        boundingBoxBottom: number,
    };
    fontStyle?: { [key: string]: any };
    underline?: boolean;
    dateFormat?: string;
    date?: Date;
    startDate?: Date;
    endDate?: Date;
    parentExamination?: any;
    parentSubject?: any;
    testType?: string;
    marksType?: string;
    formula?: string;
    decimalPlaces?: number;
    marks?: number;
    formulaVariable?: FormulaVariable;
};

export class BaseLayer {
    id: number = null;
    static maxID: number = 0;

    x: number = 0;
    y: number = 0;

    displayName: string; 
    LAYER_TYPE: string;
    parameterToolPannels: string[] = ['position'];

    dataSourceType: string = 'N/A';
    source?: {[key:string]: any};

    ca: DesignReportCardCanvasAdapter;  // canvas adapter

    constructor(ca: DesignReportCardCanvasAdapter) { 
        this.ca = ca;
        BaseLayer.maxID += 1;
        this.id = BaseLayer.maxID;
    }

    initilizeSelf(attributes:object): void{
        Object.entries(attributes).forEach(([key, value]) => this[key] = value);
        BaseLayer.maxID = Math.max(BaseLayer.maxID, this.id);   // always keeping static maxID maximum of all layers
    }

    updatePosition(dx = 0, dy = 0):void {
        this.x += dx;
        this.y += dy;
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

    constructor(attributes: object, ca: DesignReportCardCanvasAdapter, initilize:boolean=true) {
        super(ca);
        this.parameterToolPannels.push('image');

        this.image = new Image();
        
        if (initilize) {
            this.initilizeSelf(attributes);
            this.LAYER_TYPE = 'IMAGE';
            this.layerDataUpdate();
        }
    }

    layerDataUpdate(): void{
        const DATA = this.ca.vm.DATA;
        const canvasWidth = this.ca.canvasWidth, canvasHeight = this.ca.canvasHeight;
        
        if (this.dataSourceType == DATA_SOUCE_TYPE[1]) {
            this.uri = this.source.getValueFunc(DATA)+'?javascript=';
        }
        if (!this.height && !this.width) {
            let getHeightAndWidth = () => {
                this.height = this.image.height;
                this.width = this.image.width;
                this.aspectRatio = this.width / this.height;

                if (canvasHeight && this.height > canvasHeight) {
                    this.height = canvasHeight;
                    this.width = this.aspectRatio * this.height;    // maintaining aspect ratio
                }
                if (canvasWidth && this.width > canvasWidth) {
                    this.width = canvasWidth;
                    this.height = this.width / this.aspectRatio;    // maintaining aspect ratio
                }
            }
            if (this.image.complete && this.image.naturalHeight > 0) {
                getHeightAndWidth();
            } else {
                this.image.onload = () => {
                    getHeightAndWidth();
                }
            }
        }
        this.image.setAttribute('crossOrigin', 'anonymous');
        this.image.src = this.uri;
    }

    updateHeight(newHeight: number) {
        this.height = newHeight;
        if (this.maintainAspectRatio)
            this.width = this.aspectRatio * this.height;
    }

    updateWidth(newWidth: number) {
        this.width = newWidth;
        if (this.maintainAspectRatio)
            this.height = this.width / this.aspectRatio; 
    }

    updatePosition(dx = 0, dy = 0):void {
        this.x += dx;
        this.y += dy;
    }
    
    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        if (this.image.complete && this.image.naturalHeight > 0) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            return true;    // Drawn successfully on canvas
        }
        scheduleReDraw();
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

    getDataToSave() {
        let savingData: any = {
            'displayName': this.displayName,
            'LAYER_TYPE': this.LAYER_TYPE,
            'x': this.x,
            'y': this.y,
            'height': this.height,
            'width': this.width,
            'dataSourceType': this.dataSourceType,
        }
        if (this.dataSourceType == DATA_SOUCE_TYPE[0]) {
            savingData.uri = this.uri;
        } else {
            savingData.source = this.source;
            delete savingData.source.layerType;
        }
        return { ...savingData };
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


    fontStyle: { [key: string]: string } = {
        fillStyle: DEFAULT_TEXT_COLOR,
        font: ' normal 12px Arial',
    };
    underline?: boolean;
    parameterToolPannels: string[] = ['text'];
    ca: DesignReportCardCanvasAdapter;

    constructor(attributes: object, ca: DesignReportCardCanvasAdapter, initilize:boolean=true) {
        super(ca);
        this.parameterToolPannels.push('text');
        
        this.x = 50 / ca.pixelTommFactor;
        this.y = 50 / ca.pixelTommFactor;
        this.fontStyle.font = ` normal ${6/ca.pixelTommFactor}px Arial`;
        Object.entries(attributes).forEach(([key, value]) => this[key] = value);
        this.LAYER_TYPE = 'TEXT';
        this.underline = false;
        this.fontStyle.font = ` normal ${6 / ca.pixelTommFactor}px Arial`;

        if (initilize) {
            this.initilizeSelf(attributes);
            this.LAYER_TYPE = 'TEXT';
            this.layerDataUpdate();
        }
    }

    layerDataUpdate(): void {
        const DATA = this.ca.vm.DATA;
        if (this.dataSourceType == 'DATA') {
            this.text = this.source.getValueFunc(DATA);
        }
        this.updateTextBoxMetrics();
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
        // if(this.underline){
        //     ctx.beginPath()
        //     ctx.moveTo(this.x + this.textBoxMetrx.boundingBoxLeft, this.y + this.textBoxMetrx.boundingBoxBottom );
        //     ctx.lineTo(this.x + this.textBoxMetrx.boundingBoxLeft+ this.textBoxMetrx.boundingBoxRight, this.y + this.textBoxMetrx.boundingBoxBottom);
        //     ctx.stroke();
        // }
    }

    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        Object.entries(this.fontStyle).forEach(([key, value])=> ctx[key] = value);  // applying font styles
        ctx.fillText(this.text, this.x, this.y);
        if(this.underline){
            ctx.beginPath()
            ctx.moveTo(this.x + this.textBoxMetrx.boundingBoxLeft, this.y + this.textBoxMetrx.boundingBoxBottom );
            ctx.lineTo(this.x + this.textBoxMetrx.boundingBoxLeft+ this.textBoxMetrx.boundingBoxRight, this.y + this.textBoxMetrx.boundingBoxBottom);
            ctx.stroke();
        }
        return true;    // Drawn successfully on canvas
    }

    isClicked(mouseX: number, mouseY: number): boolean {    // reiterate if click is not working
        return (mouseX > this.x - this.textBoxMetrx.boundingBoxLeft - permissibleClickError
            && mouseX < this.x + this.textBoxMetrx.boundingBoxRight + permissibleClickError
            && mouseY > this.y - this.textBoxMetrx.boundingBoxTop - permissibleClickError
            && mouseY < this.y + this.textBoxMetrx.boundingBoxBottom + permissibleClickError)
    }

    scale(scaleFactor: number): void {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
        Object.keys(this.textBoxMetrx).forEach(key => this.textBoxMetrx[key] *= scaleFactor);
        const [italics, fontWeight, fontSize, font] = this.fontStyle.font.split(' ');
        let newFontSize = parseFloat(fontSize.substr(0, fontSize.length - 2));
        newFontSize *= scaleFactor;
        this.fontStyle.font = [italics, fontWeight, newFontSize + 'px', font].join(' ');
    }

    getDataToSave() {
        let savingData: any = {
            'displayName': this.displayName,
            'LAYER_TYPE': this.LAYER_TYPE,
            'x': this.x,
            'y': this.y,
            'dataSourceType': this.dataSourceType,
            'fontStyle': this.fontStyle
        }
        if (this.dataSourceType == DATA_SOUCE_TYPE[0]) {
            savingData.text = this.text;
        } else {
            savingData.source = this.source;
            delete savingData.source.layerType;
        }
        return { ...savingData };
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

        this.updateTextBoxMetrics();
    }

    dateFormatting(): void{
        console.log(this.date);
        const dateReplacements:{[key:string]: string}  = getDateReplacements(this.date);
        let dateValue = this.dateFormat;
        Object.entries(dateReplacements).forEach(([dataReplacementKey, dateReplacementvalue]) => {
            dateValue = dateValue.replace(dataReplacementKey, dateReplacementvalue);
        });
        this.text = dateValue;
    }

    getDataToSave() {
        let savingData: any = {
            'displayName': this.displayName,
            'LAYER_TYPE': this.LAYER_TYPE,
            'x': this.x,
            'y': this.y,
            'dataSourceType': this.dataSourceType,
            'fontStyle': this.fontStyle,
            'dateFormat': this.dateFormat
        }
        if (this.dataSourceType == DATA_SOUCE_TYPE[0]) {
            savingData.date = this.date;
        } else {
            savingData.source = this.source;
        }
        return { ...savingData };
    }

}

class AttendanceLayer extends CanvasText implements Layer{
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
        this.text = this.source.getValueFunc(DATA, this.startDate, this.endDate);
        this.updateTextBoxMetrics();
    }

    // Dato to save need to be implemented
}

export class GradeLayer extends CanvasText implements Layer{
    displayName: string = 'Grade';
    examinationId: any = null;
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
        this.text = this.source.getValueFunc(this.ca.vm.DATA, this.examinationId, this.subGradeId);
        this.updateTextBoxMetrics();
    }

    // data to save need to be implemented

}

export class RemarksLayer extends CanvasText implements Layer{
    displayName: string = 'Reamrks';
    examinationId: any = null;

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
        this.text = this.source.getValueFunc(this.ca.vm.DATA, this.examinationId);
        this.updateTextBoxMetrics();
    }

    // data to save need to be implemented

}

export class MarksLayer extends CanvasText implements Layer{
    displayName: string = 'Marks';

    dataSourceType: string = 'DATA';
    source: { [key: string]: any };    // required attribute

    marks: number = null;
    decimalPlaces: number=1;
    parentExamination: any = null;
    parentSubject: any = null;
    testType: string = null;
    marksType:string = MARKS_TYPE_LIST[0];

    constructor(attributes: object, ca: DesignReportCardCanvasAdapter) {
        super(attributes, ca, false);
        this.parameterToolPannels.push('marks');

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'MARKS';
        this.layerDataUpdate();          
    }

    layerDataUpdate(): void {
        if (this.parentExamination && this.parentSubject) {
            this.marks = this.source.getValueFunc(
                this.ca.vm.DATA,
                this.parentExamination,
                this.parentSubject,
                this.testType,
                this.marksType);
            this.text = this.marks!=-1?this.marks.toFixed(this.decimalPlaces):'N/A';
        } else {
            this.text = 'Make apprpiate selection from right pannel';
        }
        this.updateTextBoxMetrics();
    }

    // Data To Save need to be implemented

}





// Variables----------------------------------------

export interface CustomVariable{
    id: number;
    ca: DesignReportCardCanvasAdapter;
    type: string;   // can be of three types, layer, marks and formula
    name: string;   // name of variable
    layerID?: number; 
    formula?: string;
    parentExamination?: any,
    parentSubject?: any,
    testType?: any
    marksType?: string;
    value?: number;

    evaluate(parser?:any, depth?:number): any;
}

function setCustomFunctionsInParser(parser: any): void {
    parser.setFunction('SUPP', function(params) {

        // There should be at least 2 numbers and
        // the final number will decide how many numbers will we choose out of these.
        if (params.length < 5) {
            console.log('Insufficient length');
            return 'Insufficient length';
        }

        // All parameter arguments should be numbers
        let flag = true;
        params.every(argument => {
           if (isNaN(Number(argument.toString())) || argument<0) {
               console.log('All parameters are not positive numbers');
               flag = false;
               return false;
           }
        });
        if (!flag) {
            return 'All parameters are not positive numbers';
        }

        const passingMarks = params[params.length - 3]
        const allowedSuplementry = params[params.length - 2];
        const subjectsConsidered = params[params.length - 1];

        if (subjectsConsidered + 3 > params.length)
            return 'Subjects Considered cannot be more than given subject'

        const marksList = params.slice(0, -3);  // removing last 3 arguments
        const passSubjectCount: any[] = marksList.filter(marks => marks >= passingMarks).length;
        const failedSubjectCount = marksList.filter(marks => marks < passingMarks).length;
        const subjectCount = marksList.length;
        const subjectsNotConsidered = subjectCount - subjectsConsidered;

        if (passSubjectCount >= subjectsConsidered)
            return 'PASS';
        else if (failedSubjectCount - subjectsNotConsidered <= allowedSuplementry)
            return `SUPPLEMENTRY(${failedSubjectCount - subjectsNotConsidered})`
        return 'FAIL'

    });
}

export function getParser(customVariablesList: CustomVariable[]) {
    const PARSER = new FormulaParser();
    setCustomFunctionsInParser(PARSER);
    customVariablesList.forEach((variable: CustomVariable) => {
        if (variable.type != 'FORMULA') {
            PARSER.setVariable(variable.name, variable.evaluate());
        }
    })
    return PARSER;
}

export class BaseVariable{
    static maxID = 0;
    id: number;
    ca: DesignReportCardCanvasAdapter;
    type: string;
    name: string = 'variable';
    constructor(ca: DesignReportCardCanvasAdapter) {
        this.ca = ca;
        BaseLayer.maxID += 1;
        this.id = BaseLayer.maxID;
        this.name += `_${this.id}`;
    }
}

export class ConstantVariable extends BaseVariable implements CustomVariable{
    type: string = 'CONSTANT';
    value: number = 0;
    constructor(ca: DesignReportCardCanvasAdapter) {
        super(ca);
    }
    evaluate(parser:any): number{
        return this.value;
    }
}

export class LayerVariable extends BaseVariable implements CustomVariable{
    type: string = 'LAYER'  // supports only marks layer and marksformula layer
    layerID: number;
    constructor(ca :DesignReportCardCanvasAdapter) {
        super(ca);
    }

    evaluate(parser:any): number {
        const layer = this.ca.layers.find(layer => layer.id == this.layerID);
        if (!layer || !layer.marks)
            return 0;
        return layer.marks;
    }
}

export class MarksVariabe extends BaseVariable implements CustomVariable{
    type: string = 'MARKS';
    parentExamination: any = null;
    parentSubject: any = null;
    testType: any = null;
    marksType: string = null; 
    
    constructor(ca :DesignReportCardCanvasAdapter) {
        super(ca);
    }

    evaluate(parser:any): number {
        let result;
        console.log('marks var = ', this);
        if (this.marksType == MARKS_TYPE_LIST[0])
            result = ExaminationParameterStructure.getMarks(this.ca.vm.DATA, this.parentExamination, this.parentSubject, this.testType);
        else if (this.marksType == MARKS_TYPE_LIST[1])
            result = ExaminationParameterStructure.getMarks(this.ca.vm.DATA, this.parentExamination, this.parentSubject, this.testType);
        console.log('result = ', result);
        return result
    }
}

export class FormulaVariable extends BaseVariable implements CustomVariable{
    type: string = 'FORMULA';
    formula: string = '';
    constructor(ca: DesignReportCardCanvasAdapter) {
        super(ca);
    }

    evaluate(parser: any = null): any{
        let parsedData;
        if (parser) {
            parsedData = parser.parse(this.formula);
        }
        else {
            parser = getParser(this.ca.customVariablesList);
            this.ca.customVariablesList.every((variable: CustomVariable) => {
                if (variable == this)
                    return false;
                if (variable.type == 'FORMULA')
                    parser.setVariable(variable.name, variable.evaluate(parser));
                return true;
            })
            parsedData = parser.parse(this.formula);
        }
        if (parsedData.error)
            return parsedData.error;
        return parsedData.result;
    }
}

export const CUSTOM_VARIABLE_TYPES = {
    'CONSTANT': ConstantVariable,
    'LAYER': LayerVariable,
    'MARKS': MarksVariabe,
    'FORMULA': FormulaVariable
}

export class Formula extends CanvasText implements Layer{
    displayName: string = 'Formula';

    formulaVariable: FormulaVariable;
    decimalPlaces: number = 1;
    marks: number = null;


    dataSourceType: string = 'DATA';
    source: { [key: string]: any };    // required attribute

    constructor(attributes: object, ca: DesignReportCardCanvasAdapter) {
        super(attributes, ca, false);
        this.parameterToolPannels.push('formula');

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'FORMULA';
        if (!this.formulaVariable) {
            this.formulaVariable = new FormulaVariable(ca);
            this.formulaVariable.name = `formula_${this.id}`;
            ca.customVariablesList.push(this.formulaVariable);
        }
        this.layerDataUpdate();          
    }

    layerDataUpdate(): void {
        let result = this.formulaVariable.evaluate();
        console.log('evaluated marks = ', this.marks);
        console.log('Result from layerDataUpdate  =', result);
        if (isNaN(Number(result)))
            this.text = result
        else {
            this.marks = Number(result)
            this.text = this.marks.toFixed(this.decimalPlaces);
        }
        this.updateTextBoxMetrics();
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
                return dataObject.data.attendanceList.filter(attendance => {
                    if (attendance.parentStudent === dataObject.studentId) {
                        const dateOfAttendance = new Date(attendance.dateOfAttendance);
                        return dateOfAttendance >= startDate
                            && dateOfAttendance <= endDate;
                    }
                    return false;
                }).reduce((total, attendance) => {
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
                    return 'Parameter Not available';
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


    /* Attendance Field */
    AttendanceParameterStructure.getStructure(ATTENDANCE_TYPE_LIST[0]),
    AttendanceParameterStructure.getStructure(ATTENDANCE_TYPE_LIST[1]),
    AttendanceParameterStructure.getStructure(ATTENDANCE_TYPE_LIST[2]),
     
    /* Examination Field */
    ExaminationParameterStructure.getStructure(
        EXAMINATION_TYPE_LIST[1],
        (dataObject: any, examinationId:any, subGradeId: any) => {
            const value = dataObject.data.studentSubGradeList.find(studentSubGrade => {
                return studentSubGrade.parentStudent === dataObject.studentId
                    && studentSubGrade.parentExamination === examinationId
                    && studentSubGrade.parentSubGrade === dataObject.userHandle.value.subGradeId;   // yet to understand
            });
            if (value !== undefined) {
                return value.gradeObtained;
            } else {
                return 'N/A';
            }
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
        GradeLayer
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