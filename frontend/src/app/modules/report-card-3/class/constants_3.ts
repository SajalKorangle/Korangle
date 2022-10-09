import { ATTENDANCE_STATUS_LIST } from '@modules/attendance/classes/constants';
import canvasTxt from 'canvas-txt';
import { globalAgent } from 'http';

const FormulaParser = require('hot-formula-parser').Parser;

// Utility Functions ---------------------------------------------------------------------------

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function numberToVariable(n: number): string {  // used to convert layer id to a unique variabla name
    // converts decimal number to base 26; 0-25 is encoded as A-Z
    let variable = '';
    let temp;

    do {
        temp = n % 26;
        variable = String.fromCharCode(65 + temp) + variable;
        n = Math.floor(n / 26);
    } while (n > 0);

    return variable;
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

function getMarksInWords(num: number, decimalPlaces: number = 0): string {  // converts numbers from 0 to 99999 in words
    // used in conversion of marks to words
    let floorNum = Math.floor(num);
    if (floorNum == 0) {
        return 'Zero';
    }
    let unitTens = getNumberInWords(floorNum % 100);
    floorNum = Math.floor(floorNum / 100);
    let hundreds = getNumberInWords(floorNum % 10);
    floorNum = Math.floor(floorNum / 10);
    let thousands = getNumberInWords(floorNum % 100);
    let result = `${thousands ? thousands + ' Thousand ' : ''}${hundreds ? hundreds + ' Hundred ' : ''}${unitTens}`;
    let decimalValue = num - floorNum;
    if (decimalPlaces > 0) {
        result = result.trim() + ' Point';
        while (decimalPlaces--) {
            decimalValue *= 10;
            result += ` ${getMarksInWords(Math.floor(decimalValue % 10))}`;
        }
    }
    return result.trim();
}

function getYear(year: number): string {   // converts year number in words
    if (year < 2000) {
        return getNumberInWords(Math.floor(year / 100))
            + ' ' + getNumberInWords(year % 100);
    } else {
        return 'Two Thousand ' + getNumberInWords(year % 100);
    }
}

function getDateReplacements(date: any): { [key: string]: string; } {
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
    50,
    72,
    100,
    150,
    200,
    250,
    300,
    400,
    500,
    600,
];

export class PageResolution {
    resolutionName: string;
    orientation: string; // p: potrait, l:landscape
    aspectRatio: number;    // width/height(actual, not orientation dependent)
    mm: {
        height: number;
        width: number;
    } = {
            height: 0,
            width: 0,
        };

    constructor(name: string, mmHeight: number, mmWidth: number, orientation: string = 'p') {
        this.resolutionName = name;
        this.mm.height = mmHeight;
        this.mm.width = mmWidth;
        this.orientation = orientation;
        this.aspectRatio = mmWidth / mmHeight;
    }

    getmmHeight(): number {
        if (this.orientation == 'p') {
            return this.mm.height;
        } else if (this.orientation = 'l') {
            return this.mm.width;
        }
        return -1;
    }

    getmmWidth(): number {
        if (this.orientation == 'p') {
            return this.mm.width;
        } else if (this.orientation = 'l') {
            return this.mm.height;
        }
        return -1;
    }

    getAspectRatio(): number {
        if (this.orientation == 'p') {
            return this.aspectRatio;
        } else if (this.orientation = 'l') {
            return 1 / this.aspectRatio;
        }
        return -1;
    }

    getHeightInPixel(dpi: number): number {  // returns height in pixels given dpi as argument
        if (this.orientation == 'p') {
            return (this.mm.height * dpi) / mm_IN_ONE_INCH;
        } else if (this.orientation = 'l') {
            return (this.mm.width * dpi) / mm_IN_ONE_INCH;
        }
        return -1;
    }

    getWidthInPixel(dpi: number): number {  // returns width in pixels given dpi as argument
        if (this.orientation == 'p') {
            return (this.mm.width * dpi) / mm_IN_ONE_INCH;
        } else if (this.orientation = 'l') {
            return (this.mm.height * dpi) / mm_IN_ONE_INCH;
        }
        return -1;
    }

    getCorrospondingHeight(width: number): number { // returns height while maintaining aspect ratio
        if (this.orientation == 'p') {
            return (width / this.aspectRatio);
        } else if (this.orientation = 'l') {
            return (width * this.aspectRatio);
        }
        return -1;
    }

    getCorrospondingWidth(height: number): number {  // returns width while maintaining aspect ratio
        if (this.orientation == 'p') {
            return (height * this.aspectRatio);
        } else if (this.orientation = 'l') {
            return (height / this.aspectRatio);
        }
        return -1;
    }
}

export const PAGE_RESOLUTIONS: PageResolution[] = [ // standard page resolutions
    new PageResolution('A3', 420, 297),
    new PageResolution('A4', 297, 210),
    new PageResolution('A5', 210, 148),
    new PageResolution('A6', 148, 105),
];

export const permissibleClickError = 4;    // in pixels
export const ACTIVE_LAYER_HIGHLIGHTER_LINE_WIDTH = 2; // in pixels
export const ACTIVE_LAYER_HIGHLIGHTER_COLOR = 'cyan';


export const DATA_SOUCE_TYPE = [    // used in all canvas layers
    'N/A',  // no data source, constant eement
    'DATA'  // data source availabel, get data from the provided data source
];

export const DEFAULT_BACKGROUND_COLOR = '#ffffff'; // white
export const DEFAULT_TEXT_COLOR = '#000000'; // black

export const DEFAULT_IMAGE_URL = 'https://korangleplus.s3.amazonaws.com/assets/img/ef3f502028770e76bbeeeea68744c2c3.jpg';

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

export const VERTICAL_ALIGNMENT_LIST_MAP = {
    'top': 'Top',
    'middle': 'Middle',
    'bottom': 'Bottom',
};

export const HORIZONTAL_ALIGNMENT_LIST = [
    'left',
    'right',
    'center',
];

export const MARKS_NOT_AVAILABLE_CORROSPONDING_INT = -1;
export const MARKS_AVAILABLE_BUT_ABSENT_CORROSPONDING_INT = -2;
export var DEFAULT_MAXIMUM_MARKS = 100;
export const DEFAULT_PASSING_MARKS = 40;

// Canvas Adapter Interface
export interface CanvasAdapterInterface {
    vm: any;

    currentLayout: { name: string, thumbnail?: any, publiclyShared: boolean, content: any; };
    DATA: any;

    virtualCanvas: HTMLCanvasElement;
    virtualContext: CanvasRenderingContext2D;

    canvasHeight: number;   // current height and width are in pixels
    canvasWidth: number;

    actualresolution: PageResolution;
    dpi: number;

    pixelTommFactor: number;    // width(height) in mm / Canvas width(height) in pixel

    layers: Array<Layer>;  // layers in thier order from back to front
    activeLayer: Layer;
    activeLayerIndexes: Array<number>;

    activePageIndex: number;

    gradeRuleSetList: Array<GradeRuleSet>;

    backgroundColor: string;

    virtualPendingReDrawId: any;

    metaDrawings: boolean;

    isLoading: boolean;

    clearCanvas(): void;
    storeThumbnail(): void;
    updatePage(pageIndex: number): Promise<any>;
    canvasSizing(maxHeight: number, maxWidth: number, doScale: boolean): void;
    applyDefaultbackground(): void;
    scheduleCanvasReDraw(duration: number, preCallback: any, postCallback: any): Promise<any>;
    fullCanavsRefresh(): void;
    updateResolution(newResolution: PageResolution): Promise<any>;
    getLayerFromLayerData(layerData: any, constructor: any): Layer;
    loadData(Data): Promise<any>;
    getDataToSave(): { [object: string]: any; };
    resetActiveLayer(): Promise<any>;
    updateActiveLayer(activeLayerIndex: number, shiftKey: boolean): Promise<any>;
    newLayerInitilization(layer: Layer): Promise<any>;
    deleteGradeRuleSet(index: number): Promise<any>;
}


//Layers--------------------------------------

// To be implemented by all Canvas Layers
export interface Layer {
    // contains definition all class variables to be implemented by any canvas layer
    constructor: any;   // constructor of class
    id: number;
    displayName: string;    // layer name displayed to user
    LAYER_TYPE: string; // Type description for JSON parsing
    error: boolean;
    x: number;  // distance in pixels from left edge of canvas
    y: number;  // distance in pixels from top edge of canvas
    height: number; // box model height
    width: number;  // box model width
    isLocked: boolean; // if element is locked on the canvas
    parameterToolPannels: string[]; // list of right pannel parameter toolbar
    dataSourceType: string;    // options: DATA_SOURCE_TYPE, if 'N/A', all data of layer is constant; if 'DATA' use source class variable to get data
    source?: { [key: string]: any; };   // object containing information about the source of data, stores reference of element from PARAMETER_LIST
    alternateText: string;
    ca: CanvasAdapterInterface;  // canvas adapter,
    highlightLayer(ctx: CanvasRenderingContext2D): void;
    layerDataUpdate(): void;    // gets data of layer if dataSourceType is 'DATA',
    updatePosition(dx: number, dy: number): void;
    // draws layer to canavs or schedules redraw after some time if layer is not ready yet
    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean;
    isClicked(mouseX: number, mouseY: number, shiftKey: boolean): boolean; // given clicked x and y if this layer is clicked or not
    scale(scaleFactor: number): void;   // scales all parameters of layer by given scale factor, used while zooming, fullscreen etc.
    getDataToSave(): { [object: string]: any; };   // retunn data to be saved to database

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
    prefix?: string;
    suffix?: string;
    font?: string;
    fontSize?: number;
    fontWeight?: string;
    italics?: string;
    fillStyle?: string;
    textBaseline?: string;
    textAlign?: string;
    maxWidth?: number;
    minHeight?: number;
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
    outOf?: number;
    marks?: number;
    formula?: string;
    examinationName?: string;
    gradeRuleSet?: GradeRuleSet;
}

export class BaseLayer {    // this layer is inherited by all canvas layers
    id: number = null;
    static maxID: number = 0;   // for auto incrementing id

    error: boolean = false;
    x: number = 0;
    y: number = 0;

    height: number = null;
    width: number = null;

    alternateText: string = 'N/A';
    displayName: string;
    LAYER_TYPE: string;
    parameterToolPannels: string[] = ['position', 'settings'];  // position right toolbar pannel is present in all layers
    isLocked: boolean = false;
    dataSourceType: string = 'N/A';
    source?: { [key: string]: any; };

    ca: CanvasAdapterInterface;  // canvas adapter

    constructor(ca: CanvasAdapterInterface) {
        this.ca = ca;
        BaseLayer.maxID += 1;
        this.id = BaseLayer.maxID;
    }

    initilizeSelf(attributes: object): void { // initilizes all class variables according to provided initial parameters data as object
        Object.entries(attributes).forEach(([key, value]) => this[key] = value);
        BaseLayer.maxID = Math.max(BaseLayer.maxID, this.id);   // always keeping static maxID maximum of all layers
        if (this.dataSourceType == DATA_SOUCE_TYPE[1] && this.source && !this.source.getValueFunc) {
            // The dependence on htmlAdapter should be removed, once custom parameter handling is updated use paramter list insted of htmlAdapter
            this.source = this.ca.vm.htmlAdapter.parameterList.find(el => el.key == this.source.key
                && el.field.fieldStructureKey == this.source.field.fieldStructureKey);
            if (!this.source)
                this.error = true;
        }
    }

    updatePosition(dx = 0, dy = 0): void {
        if (this.isLocked) {
            return;
        }
        else {
            this.x += dx;
            this.y += dy;
        }
    }

    highlightLayer(ctx: CanvasRenderingContext2D): void {
        if (this.height && this.width) {
            ctx.strokeStyle = ACTIVE_LAYER_HIGHLIGHTER_COLOR;
            ctx.lineWidth = ACTIVE_LAYER_HIGHLIGHTER_LINE_WIDTH;
            ctx.strokeRect(this.x - permissibleClickError / 4, this.y - permissibleClickError / 4,
                this.width + permissibleClickError / 2, this.height + permissibleClickError / 2);
        }
    }

    isClicked(mouseX: number, mouseY: number, shiftKey: boolean = false): boolean {
        return (mouseX > this.x - permissibleClickError
            && mouseX < this.x + this.width + permissibleClickError
            && mouseY > this.y - permissibleClickError
            && mouseY < this.y + this.height + permissibleClickError);
    }

    getDataToSave(): { [object: string]: any; } {   // common data to be saved in database
        let savingData: any = {
            id: this.id,
            displayName: this.displayName,
            LAYER_TYPE: this.LAYER_TYPE,
            x: this.x * this.ca.pixelTommFactor,  // converting pixels to mm
            y: this.y * this.ca.pixelTommFactor,
            dataSourceType: this.dataSourceType,
            isLocked: this.isLocked
        };
        return savingData;
    }
}

export class CanvasImage extends BaseLayer implements Layer {  // Canvas Image Layer
    displayName: string = 'Image';

    image: HTMLImageElement = null;
    radius: number = 0;

    // uses height and width of the base layer for image height and width
    borderStyle = {
        lineWidth: 0,
        strokeStyle: '#000000',
    };

    uri: string;
    aspectRatio: any = null;
    maintainAspectRatio = true;

    constructor(attributes: object, ca: CanvasAdapterInterface) {
        super(ca);  // parent constructor
        this.parameterToolPannels.push('image');

        this.image = new Image();

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'IMAGE';
        this.layerDataUpdate();
    }

    initilizeSelf(attributes: object): void {
        super.initilizeSelf(attributes);
        if (this.height && this.width && (!this.aspectRatio)) { // calculate aspect ratio if height and width is available
            this.aspectRatio = this.width / this.height;
        }
    }

    layerDataUpdate(): void {
        this.error = false;
        if (this.dataSourceType == DATA_SOUCE_TYPE[1]) {
            const DATA = this.ca.DATA;
            const value = this.source.getValueFunc(DATA);
            if (value) {
                this.uri = value + '?javascript=';
            }
            else {
                this.uri = DEFAULT_IMAGE_URL + '?javascript=';
            }
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
            else if (!this.height || !this.width) {
                this.aspectRatio = this.image.width / this.image.height;
                if (this.height)
                    this.width = this.height * this.aspectRatio;
                else
                    this.height = this.width / this.aspectRatio;
            }
        };

        this.image.onload = () => {
            getHeightAndWidth();
        };
        this.image.onerror = () => {
            this.error = true;
        };
        this.image.setAttribute('crossOrigin', 'anonymous');
        this.image.src = this.uri;
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

        if (this.image.complete && this.image.naturalHeight != 0) {

            const lineWidth = 2 * this.borderStyle.lineWidth;   // correcting for clipping
            const x = this.x + this.borderStyle.lineWidth;   // adjisted for line Width
            const y = this.y + this.borderStyle.lineWidth;   // adjusted for line Width
            const width = this.width - lineWidth;
            const height = this.height - lineWidth;
            let maxRadius = Math.min(this.width, this.height) / 2;
            let computedRadius = Math.ceil(Math.min(this.radius, maxRadius));

            ctx.save();

            // Cliping path
            ctx.beginPath();
            ctx.moveTo(this.x + computedRadius, this.y);
            ctx.lineTo(this.x + this.width - computedRadius, this.y);
            ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + computedRadius, computedRadius);
            ctx.lineTo(this.x + this.width, this.y + this.height - computedRadius);
            ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width - computedRadius, this.y + this.height, computedRadius);
            ctx.lineTo(this.x + computedRadius, this.y + this.height);
            ctx.arcTo(this.x, this.y + this.height, this.x, this.y + this.height - computedRadius, computedRadius);
            ctx.lineTo(this.x, this.y + computedRadius);
            ctx.arcTo(this.x, this.y, this.x + computedRadius, this.y, computedRadius);
            ctx.closePath();
            ctx.clip();

            if (lineWidth > 0) {
                Object.entries(this.borderStyle).forEach(([key, value]) => ctx[key] = value);
                ctx.lineWidth = lineWidth;
                const correction = 1;
                ctx.drawImage(this.image, x - correction, y - correction, width + (2 * correction), height + (2 * correction));    // with correction
                ctx.stroke();
            }
            else {
                ctx.drawImage(this.image, x, y, width, height);
            }

            ctx.restore();
            return true;    // Drawn successfully on canvas
        }
        scheduleReDraw(1000);   // draw again after some time
        return false;   // Canvas Drawing failed, scheduled redraw for later
    }

    scale(scaleFactor: number): void {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
        this.height *= scaleFactor;
        this.width *= scaleFactor;
        this.radius *= scaleFactor;
        this.borderStyle.lineWidth *= scaleFactor;
    }

    getDataToSave(): { [object: string]: any; } {
        let savingData = super.getDataToSave();
        savingData = {
            ...savingData,
            height: this.height * this.ca.pixelTommFactor,
            width: this.width * this.ca.pixelTommFactor,
            maintainAspectRatio: this.maintainAspectRatio,
            radius: this.radius * this.ca.pixelTommFactor,
            borderStyle: { ...this.borderStyle, lineWidth: this.borderStyle.lineWidth * this.ca.pixelTommFactor, }
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

export class TableRow {
    height: number = 10;    // in mm
}

export class TableColumn {
    width: number = 30;     // in mm
}

export class CanvasTable extends BaseLayer implements Layer {
    displayName: string = 'Table';

    rowsList: Array<TableRow> = [];
    columnsList: Array<TableColumn> = [];
    rowCount: number = 0;
    columnCount: number = 0;
    selectedCells: any[];

    height: number = 0; // computed from rowsList and columnsList
    width: number = 0;

    cells: Array<any> = null;

    constructor(attributes: object, ca: CanvasAdapterInterface) {
        super(ca);
        this.parameterToolPannels.push('table');

        this.x = 50 / ca.pixelTommFactor;
        this.y = 50 / ca.pixelTommFactor;
        this.selectedCells = [];
        this.selectedCells.push({
            row: 0,
            column: 0,
        });

        this.initilizeSelf(attributes);
        this.layerDataUpdate();
        this.updateTableMetrix();

        this.LAYER_TYPE = 'TABLE';
    }

    initilizeSelf(attributes: object): void {
        super.initilizeSelf(attributes);
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

        if (!this.cells) {
            this.cells = new Array(this.rowCount);
            for (let i = 0; i < this.rowCount; i++) {
                this.cells[i] = new Array(this.columnCount);
                for (let j = 0; j < this.columnCount; j++) {
                    this.cells[i][j] = {
                        'topBorder': {
                            'visible': true,
                            'lineWidth': 2,
                            'strokeStyle': 'black',
                        },
                        'bottomBorder': {
                            'visible': true,
                            'lineWidth': 2,
                            'strokeStyle': 'black',
                        },
                        'leftBorder': {
                            'visible': true,
                            'lineWidth': 2,
                            'strokeStyle': 'black',
                        },
                        'rightBorder': {
                            'visible': true,
                            'lineWidth': 2,
                            'strokeStyle': 'black',
                        },
                        'cellBackground': '#ffffff',
                    };
                }
            }
        }

    }

    layerDataUpdate(): void {
    }


    updateTableMetrix(): void {  // computing height and width of table from its rows and columns
        this.height = 0;
        this.width = 0;

        this.rowsList.forEach(tableRow => {
            this.height += tableRow.height;
        });

        this.columnsList.forEach(tableColumn => {
            this.width += tableColumn.width;
        });
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

        for (let i = 0; i < this.rowCount; i++) {
            for (let j = 0; j < this.columnCount; j++) {
                if (this.cells[i][j].cellBackground != null) {
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
        for (let j = 0; j < this.rowsList.length; j++) {
            for (let i = 0; i < this.columnsList.length; i++) {

                let temp1 = this.cells[j][i].topBorder.lineWidth;
                let temp2 = this.cells[j][i].bottomBorder.lineWidth;
                if (i > 0) {
                    temp1 = Math.min(temp1, this.cells[j][i - 1].topBorder.lineWidth);
                    temp2 = Math.min(temp2, this.cells[j][i - 1].bottomBorder.lineWidth);
                }
                temp1 = temp1 / 2;
                temp2 = temp2 / 2;
                if (this.cells[j][i].leftBorder.visible == true) {
                    ctx.beginPath();
                    ctx.moveTo(pointerX, pointerY - temp1);
                    ctx.lineTo(pointerX, pointerY + this.rowsList[j].height - temp2);          // vertical lines
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
        for (let i = 0; i < this.rowsList.length; i++) {

            let temp1 = this.cells[i][this.columnCount - 1].topBorder.lineWidth;
            let temp2 = this.cells[i][this.columnCount - 1].bottomBorder.lineWidth;
            temp1 = temp1 / 2;
            temp2 = temp2 / 2;
            if (this.cells[i][this.columnCount - 1].rightBorder.visible == true) {
                ctx.beginPath();
                ctx.lineWidth = this.cells[i][this.columnCount - 1].rightBorder.lineWidth;
                ctx.strokeStyle = this.cells[i][this.columnCount - 1].rightBorder.strokeStyle;       // last vertical line
                ctx.moveTo(pointerX, pointerY - temp1);
                ctx.lineTo(pointerX, pointerY + this.rowsList[i].height + temp2);
                ctx.stroke();

            }
            pointerY += this.rowsList[i].height;
        }

        pointerX = this.x;
        pointerY = this.y;
        for (let j = 0; j < this.columnsList.length; j++) {
            for (let i = 0; i < this.rowsList.length; i++) {
                let temp1 = this.cells[i][j].leftBorder.lineWidth;
                let temp2 = this.cells[i][j].leftBorder.lineWidth;
                if (i > 0) {
                    temp1 = Math.min(temp1, this.cells[i - 1][j].leftBorder.lineWidth);
                    temp2 = Math.min(temp2, this.cells[i - 1][j].rightBorder.lineWidth);
                }
                temp1 = temp1 / 2;
                temp2 = temp2 / 2;
                if (this.cells[i][j].topBorder.visible == true) {
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
        for (let i = 0; i < this.columnsList.length; i++) {
            let temp1 = this.cells[this.rowCount - 1][i].leftBorder.lineWidth;
            let temp2 = this.cells[this.rowCount - 1][i].rightBorder.lineWidth;
            temp1 = temp1 / 2;
            temp2 = temp2 / 2;
            if (this.cells[this.rowCount - 1][i].bottomBorder.visible == true) {
                ctx.beginPath();
                ctx.lineWidth = this.cells[this.rowCount - 1][i].bottomBorder.lineWidth;
                ctx.strokeStyle = this.cells[this.rowCount - 1][i].bottomBorder.strokeStyle;           // last horizontal line
                ctx.moveTo(pointerX - temp1, pointerY);
                ctx.lineTo(pointerX + this.columnsList[i].width + temp2, pointerY);
                ctx.stroke();
            }
            pointerX += this.columnsList[i].width;
        }

        ctx.closePath();

        return true;    // Drawn successfully on canvas
    }

    isClicked(mouseX: number, mouseY: number, shiftKey: boolean = false): boolean {
        let result = super.isClicked(mouseX, mouseY, shiftKey);
        if (result) {
            let clickedRow, clickedColumn, sumColumnsWidth, sumRowsHeights;
            let x = mouseX - this.x;
            let y = mouseY - this.y;
            sumColumnsWidth = 0;
            sumRowsHeights = 0;
            this.rowsList.every((row, index) => {
                sumRowsHeights += row.height;
                if (y < sumRowsHeights) {
                    clickedRow = index;
                    return false;
                }
                return true;
            });
            this.columnsList.every((col, index) => {
                sumColumnsWidth += col.width;
                if (x < sumColumnsWidth) {
                    clickedColumn = index;
                    return false;
                }
                return true;
            });
            let index = this.selectedCells.findIndex(cell => cell.row == clickedRow && cell.column == clickedColumn);
            if (index == -1)
                this.selectedCells.push({ row: clickedRow, column: clickedColumn });
            else
                this.selectedCells.splice(index, 1);
        }
        return result;
    }

    scale(scaleFactor: number): void {
        this.x *= scaleFactor;
        this.y *= scaleFactor;

        this.rowsList.forEach(row => {
            row.height *= scaleFactor;
        });

        this.columnsList.forEach(column => {
            column.width *= scaleFactor;
        });

        for (let i = 0; i < this.rowCount; i++) {
            for (let j = 0; j < this.columnCount; j++) {
                this.cells[i][j].topBorder.lineWidth *= scaleFactor;
                this.cells[i][j].bottomBorder.lineWidth *= scaleFactor;
                this.cells[i][j].leftBorder.lineWidth *= scaleFactor;
                this.cells[i][j].rightBorder.lineWidth *= scaleFactor;
            }
        }

        this.updateTableMetrix();
    }

    getDataToSave(): { [object: string]: any; } {
        let savingData = super.getDataToSave();
        savingData = {
            ...savingData,
            rowsList: [],
            columnsList: [],
            cells: JSON.parse(JSON.stringify(this.cells)),
        };
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

        savingData.cells.forEach(row => {
            row.forEach(cell => {
                cell.topBorder.lineWidth *= this.ca.pixelTommFactor;
                cell.bottomBorder.lineWidth *= this.ca.pixelTommFactor;
                cell.leftBorder.lineWidth *= this.ca.pixelTommFactor;
                cell.rightBorder.lineWidth *= this.ca.pixelTommFactor;
            });
        });
        return savingData;
    }
}

class ShapeBaseLayer extends BaseLayer {
    shapeStyle: {
        lineWidth: number,
        strokeStyle: string,
        fillStyle: string,
        // globalAlpha: number,
    } = {
            lineWidth: 2,
            strokeStyle: '#000000',
            fillStyle: 'transparent',
            // globalAlpha: 1,
        };

    constructor(ca: CanvasAdapterInterface) {
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
            shapeStyle: { ...this.shapeStyle }
        };
        savingData.shapeStyle.lineWidth *= this.ca.pixelTommFactor;
        return savingData;
    }

}

export class CanvasLine extends ShapeBaseLayer implements Layer {
    displayName: string = 'Line';

    length: number = 40;
    orientation: number = 0;

    constructor(attributes: object, ca: CanvasAdapterInterface) {
        super(ca);
        this.parameterToolPannels.push('shape');

        this.x = 20 / ca.pixelTommFactor;
        this.y = 20 / ca.pixelTommFactor;
        this.length = 40 / ca.pixelTommFactor;

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'LINE';
        this.layerDataUpdate();

        // functinal height and width; used for drawing highlighter
        Object.defineProperty(this, 'height', {
            get: function () {
                return (this.length * Math.sin((this.orientation * Math.PI) / 180)) + this.shapeStyle.lineWidth;
            }
        });

        Object.defineProperty(this, 'width', {
            get: function () {
                return (this.length * Math.cos((this.orientation * Math.PI) / 180)) + this.shapeStyle.lineWidth;
            }
        });

    }

    layerDataUpdate(): void {
        return;
    }

    updateLength(newlength: any) {
        this.length = newlength;
    }

    updateOrientation(newOrientation: any) {
        this.orientation = newOrientation;
    }

    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        if (this.shapeStyle.lineWidth == 0)
            return true;
        ctx.save();
        super.drawOnCanvas(ctx, scheduleReDraw);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + (this.length * Math.cos((this.orientation * Math.PI) / 180)), this.y
            + (this.length * Math.sin((this.orientation * Math.PI) / 180)));
        ctx.stroke();
        ctx.restore();
        return true;    // Drawn successfully on canvas
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
            length: this.length * this.ca.pixelTommFactor,
            orientation: this.orientation,
        };

        return { ...savingData };
    }

}


export class CanvasRectangle extends ShapeBaseLayer implements Layer {
    displayName: string = 'Rectangle';

    ca: CanvasAdapterInterface;
    length: any = 20;
    width: any = 30;

    constructor(attributes: object, ca: CanvasAdapterInterface, initilize: boolean = true) {
        super(ca);
        this.parameterToolPannels.push('shape');

        this.x = 20 / ca.pixelTommFactor;
        this.y = 20 / ca.pixelTommFactor;
        this.length = 20 / ca.pixelTommFactor;
        this.width = 30 / ca.pixelTommFactor;

        if (initilize) {
            this.initilizeSelf(attributes);
            this.layerDataUpdate();
        }

        this.LAYER_TYPE = 'RECTANGLE';

        Object.defineProperty(this, 'height', {
            get: function () {
                return this.length;
            }
        });

    }

    layerDataUpdate(): void {
        return;
    }


    updateLength(newlength: any) {
        this.length = newlength;
    }

    updateWidth(newWidth: any) {
        this.width = newWidth;
    }

    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        ctx.save();
        super.drawOnCanvas(ctx, scheduleReDraw);
        const x = this.x + this.shapeStyle.lineWidth / 2;   // adjisted for line Width
        const y = this.y + this.shapeStyle.lineWidth / 2;   // adjusted for line Width
        const width = this.width - this.shapeStyle.lineWidth;
        const height = this.height - this.shapeStyle.lineWidth;
        ctx.beginPath();
        ctx.rect(x + this.shapeStyle.lineWidth / 2, y + this.shapeStyle.lineWidth / 2, width - this.shapeStyle.lineWidth, height - this.shapeStyle.lineWidth);
        ctx.fill();
        if (this.shapeStyle.lineWidth > 0) {
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.stroke();
        }
        ctx.restore();
        return true;    // Drawn successfully on canvas
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
            length: this.length * this.ca.pixelTommFactor,
            width: this.width * this.ca.pixelTommFactor,
        };

        return { ...savingData };
    }

}

export class CanvasCircle extends ShapeBaseLayer implements Layer {
    displayName: string = 'Circle';

    radius: number = 20;

    constructor(attributes: object, ca: CanvasAdapterInterface, initilize: boolean = true) {
        super(ca);
        this.parameterToolPannels.push('shape');

        this.x = 50 / ca.pixelTommFactor;
        this.y = 50 / ca.pixelTommFactor;
        this.radius = 20 / ca.pixelTommFactor;

        if (initilize) {
            this.initilizeSelf(attributes);
            this.LAYER_TYPE = 'CIRCLE';
            this.layerDataUpdate();
        }

        // functinal height and width; used for drawing highlighter
        Object.defineProperty(this, 'height', {
            get: function () {
                return 2 * this.radius;
            }
        });

        Object.defineProperty(this, 'width', {
            get: function () {
                return 2 * this.radius;
            }
        });
    }

    layerDataUpdate(): void {
        return;
    }

    updateRadius(newRadius: any) {
        this.radius = newRadius;
    }

    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        ctx.save();
        super.drawOnCanvas(ctx, scheduleReDraw);
        const radius = this.radius - this.shapeStyle.lineWidth / 2;
        ctx.beginPath();
        ctx.arc(this.x + this.radius, this.y + this.radius, radius - this.shapeStyle.lineWidth / 2, 0, 2 * Math.PI);
        ctx.fill();
        if (this.shapeStyle.lineWidth > 0) {
            ctx.beginPath();
            ctx.arc(this.x + this.radius, this.y + this.radius, radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
        ctx.restore();
        return true;    // Drawn successfully on canvas
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
            radius: this.radius * this.ca.pixelTommFactor,
        };

        return { ...savingData };
    }

}

export class CanvasRoundedRectangle extends ShapeBaseLayer implements Layer {
    displayName: string = 'Rounded Rectangle';

    length: number;
    width: number;
    radius: number;

    constructor(attributes: object, ca: CanvasAdapterInterface) {
        super(ca);
        this.parameterToolPannels.push('shape');

        this.x = 20 / ca.pixelTommFactor;
        this.y = 20 / ca.pixelTommFactor;
        this.length = 30 / ca.pixelTommFactor;
        this.width = 20 / ca.pixelTommFactor;
        this.radius = 5 / ca.pixelTommFactor;

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'ROUNDED-RECTANGLE';
        this.layerDataUpdate();

        // functinal height and width; used for drawing highlighter
        Object.defineProperty(this, 'height', {
            get: function () {
                return this.length;
            }
        });

    }

    layerDataUpdate(): void {
        return;
    }

    updateLength(newlength: any) {
        this.length = newlength;
    }

    updateWidth(newWidth: any) {
        this.width = newWidth;
    }

    updateRadius(newRadius: any) {
        this.radius = newRadius;
    }

    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        super.drawOnCanvas(ctx, scheduleReDraw);
        ctx.save();
        const x = this.x + this.shapeStyle.lineWidth / 2;   // adjisted for line Width
        const y = this.y + this.shapeStyle.lineWidth / 2;   // adjusted for line Width
        const width = this.width - this.shapeStyle.lineWidth;
        const height = this.height - this.shapeStyle.lineWidth;
        const offSet = this.shapeStyle.lineWidth / 2;
        const maxRadius = Math.round(Math.min(this.width, this.height) / 2);
        const radius = Math.max(Math.min(this.radius, maxRadius) - this.shapeStyle.lineWidth / 2, 0);
        ctx.beginPath();
        ctx.moveTo(x + radius, y + offSet);
        ctx.lineTo(x + width - radius, y + offSet);
        ctx.quadraticCurveTo(x + width - offSet, y + offSet, x + width - offSet, y + radius);
        ctx.lineTo(x + width - offSet, y + height - radius);
        ctx.quadraticCurveTo(x + width - offSet, y + height - offSet, x + width - radius, y + height - offSet);
        ctx.lineTo(x + radius, y + height - offSet);
        ctx.quadraticCurveTo(x + offSet, y + height - offSet, x + offSet, y + height - radius);
        ctx.lineTo(x + offSet, y + radius);
        ctx.quadraticCurveTo(x + offSet, y + offSet, x + radius, y + offSet);
        ctx.fill();

        if (this.shapeStyle.lineWidth > 0) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.stroke();
        }
        ctx.restore();
        return true;    // Drawn successfully on canvas
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
            length: this.length * this.ca.pixelTommFactor,
            width: this.width * this.ca.pixelTommFactor,
            radius: this.radius * this.ca.pixelTommFactor,
        };

        return { ...savingData };
    }

}


export class CanvasSquare extends CanvasRectangle implements Layer {
    displayName: string = 'Square';

    constructor(attributes: object, ca: CanvasAdapterInterface) {
        super(attributes, ca, false);


        this.x = 20 / ca.pixelTommFactor;
        this.y = 20 / ca.pixelTommFactor;
        this.length = 20 / ca.pixelTommFactor;
        this.width = this.length;

        this.initilizeSelf(attributes);
        this.layerDataUpdate();

        this.LAYER_TYPE = 'SQUARE';
    }

    updateLength(newlength: any) {
        this.length = newlength;
        this.width = this.length;
    }

}

export class CanvasText extends BaseLayer implements Layer {
    text: string = 'Lorem Ipsum';
    prefix: string = '';
    suffix: string = '';

    font: string = 'Arial';
    fontSize: number = 12;
    fontWeight: string = 'normal';
    italics: string = '';
    fillStyle: string = DEFAULT_TEXT_COLOR;
    textBaseline: string = 'top';
    textAlign: string = 'center';

    maxWidth: number = 100;
    minHeight: number = 0;
    lastHeight: number = 0;
    underline: boolean = false;


    constructor(attributes: object, ca: CanvasAdapterInterface, initilize: boolean = true) {
        super(ca);
        this.parameterToolPannels.push('text');

        this.x = 50 / ca.pixelTommFactor;
        this.y = 50 / ca.pixelTommFactor;
        this.maxWidth = Math.round(7500 / ca.pixelTommFactor) / 100;
        // this.minHeight = Math.round(1000 / ca.pixelTommFactor) / 100;
        this.underline = false;
        this.fontSize = 6 / ca.pixelTommFactor;

        if (initilize) {    // initilize is sent as false is this class is super class of some other layer, in that case child class handles this block
            this.initilizeSelf(attributes);
            this.layerDataUpdate();
        }
        this.LAYER_TYPE = 'TEXT';

        // functinal height and width; used for drawing highlighter
        Object.defineProperty(this, 'height', {
            get: function () {
                return Math.max(this.lastHeight, this.minHeight);
            }
        });

        Object.defineProperty(this, 'width', {
            get: function () {
                return this.maxWidth;
            }
        });

        Object.defineProperty(this, 'displayName', {
            get: function () {
                let displayName = this.text.toString().substr(0, 15);
                if (this.text.length > 15) {
                    displayName = displayName.substr(0, 12) + '...';
                }
                return displayName;
            },
            set: function (v) { }   // dummy set function
        });

    }

    layerDataUpdate(): void {
        const DATA = this.ca.DATA;
        if (this.dataSourceType == 'DATA') {
            if (this.error) {
                this.text = this.alternateText;
            } else {
                let value = this.source.getValueFunc(DATA);
                this.text = value ? value : this.alternateText;
            }
        }
    }


    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        ctx.fillStyle = this.fillStyle;
        canvasTxt.font = this.font;
        canvasTxt.fontSize = Math.max(1, this.fontSize);
        canvasTxt.align = this.textAlign;
        canvasTxt.vAlign = this.textBaseline;
        canvasTxt.fontStyle = this.italics;
        canvasTxt.fontWeight = this.fontWeight;
        canvasTxt.yLimit = 'top';
        canvasTxt.underline = this.underline;
        ctx.strokeStyle = this.fillStyle;
        // canvasTxt.debug = true;
        this.lastHeight = canvasTxt.drawText(ctx, this.prefix + this.text + this.suffix, this.x, this.y,
            Math.max(1, this.maxWidth), Math.max(1, this.minHeight)).height;
        return true;    // Drawn successfully on canvas
    }

    scale(scaleFactor: number): void {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
        this.fontSize *= scaleFactor;
        this.minHeight *= scaleFactor;
        this.maxWidth *= scaleFactor;
    }

    getDataToSave(): { [object: string]: any; } {
        let savingData = super.getDataToSave();

        savingData = {
            ...savingData,
            prefix: this.prefix,
            suffix: this.suffix,
            fontSize: this.fontSize * this.ca.pixelTommFactor,
            italics: this.italics,
            fontWeight: this.fontWeight,
            font: this.font,
            underline: this.underline,
            fillStyle: this.fillStyle,
            textBaseline: this.textBaseline,
            textAlign: this.textAlign,
            maxWidth: this.maxWidth * this.ca.pixelTommFactor,
            minHeight: this.minHeight * this.ca.pixelTommFactor
        };
        if (this.dataSourceType == DATA_SOUCE_TYPE[0]) {
            savingData.text = this.text;
        } else {
            savingData.source = { ...this.source };
            delete savingData.source.layerType;
        }
        delete savingData.displayName;
        return savingData;
    }

}




export class CanvasDate extends CanvasText implements Layer {
    date: Date = new Date();
    dateFormat: string = '<dd>/<mm>/<yyy>';

    constructor(attributes: object, ca: CanvasAdapterInterface) {
        super(attributes, ca, false);
        this.parameterToolPannels.push('date');

        this.maxWidth = Math.round(5000 / ca.pixelTommFactor) / 100;

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'DATE';
        this.layerDataUpdate();
    }

    layerDataUpdate(): void {
        if (this.dataSourceType == 'DATA') {
            const DATA = this.ca.DATA;
            const value = this.source.getValueFunc(DATA);
            if (value) {
                this.date = new Date(this.source.getValueFunc(DATA));
            }
            else {
                this.text = this.alternateText;
                return;
            }
        }

        this.dateFormatting();
    }

    dateFormatting(): void {
        const dateReplacements: { [key: string]: string; } = getDateReplacements(this.date);
        let dateValue = this.dateFormat;
        Object.entries(dateReplacements).forEach(([dataReplacementKey, dateReplacementvalue]) => {
            dateValue = dateValue.replace(dataReplacementKey, dateReplacementvalue);
        });
        this.text = dateValue;
    }

    getDataToSave(): { [object: string]: any; } {
        let savingData = super.getDataToSave();
        delete savingData.text;
        savingData = {
            ...savingData,
            'dateFormat': this.dateFormat
        };
        if (this.dataSourceType == DATA_SOUCE_TYPE[0]) {
            savingData.date = this.date;
        } // else part is alreday handled in super.getDataToSave call
        return savingData;
    }

}

export class CanvasGroup extends BaseLayer implements Layer {
    layers: Array<Layer> = [];

    parameterToolPannels = ['position'];

    constructor(attributes: object, ca: CanvasAdapterInterface, initilize: boolean = true) {
        super(ca);
        this.parameterToolPannels.push('group');

        if (initilize) {
            this.initilizeSelf(attributes);
            this.layerDataUpdate();
        }
        this.LAYER_TYPE = 'GROUP';

        Object.defineProperty(this, 'x', {
            get: function () {
                return Math.min(...this.layers.map(l => l.x), 999999);
            },
            set: function (newX: number) {
                let dx = newX - this.x;
                this.updatePosition(dx, 0);
            }
        });

        Object.defineProperty(this, 'y', {
            get: function () {
                return Math.min(...this.layers.map(l => l.y), 999999);
            },
            set: function (newY: number) {
                let dy = newY - this.y;
                this.updatePosition(0, dy);
            }
        });

        Object.defineProperty(this, 'isLocked', {
            get: function () {
                return !this.layers.every(layer => layer.isLocked == false);
            },
            set: function (newIsLocked) {
                this.layers.forEach(l => l.isLocked = newIsLocked);
            }
        });

        Object.defineProperty(this, 'height', {
            get: function () {
                return Math.max(...this.layers.map(l => l.height + l.y), 0) - this.y;
            }
        });

        Object.defineProperty(this, 'width', {
            get: function () {
                return Math.max(...this.layers.map(l => l.width + l.x), 0) - this.x;
            }
        });
    }

    layerDataUpdate(): void {
    }

    updatePosition(dx = 0, dy = 0): void {
        if (this.isLocked) {
            return;
        }
        else {
            this.layers.forEach(layer => layer.updatePosition(dx, dy));
        }
    }

    highlightLayer(ctx: CanvasRenderingContext2D): void {
        this.layers.forEach(l => l.highlightLayer(ctx));
    }

    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        let result = true;
        this.layers.forEach(layer => result = result && layer.drawOnCanvas(ctx, scheduleReDraw));
        return result;
    }

    scale(scaleFactor: number): void {
        this.layers.forEach(layer => layer.scale(scaleFactor));
    }

    isClicked(mouseX: number, mouseY: number, shiftKey: boolean = false): boolean {
        let res: boolean = false;
        this.layers.forEach(layer => {
            res = res || layer.isClicked(mouseX, mouseY, shiftKey);
        });
        return res;
    }

    getDataToSave(): object {
        // To be implemented
        return {};
    }
}

export class AttendanceLayer extends CanvasText implements Layer {
    startDate: Date = new Date();
    endDate: Date = new Date();

    dataSourceType: string = 'DATA';
    source: { [key: string]: any; };    // required attribute

    constructor(attributes: object, ca: CanvasAdapterInterface) {
        super(attributes, ca, false);
        this.parameterToolPannels.push('attendance');

        this.maxWidth = Math.round(2000 / ca.pixelTommFactor) / 100;

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'ATTENDANCE';
        this.layerDataUpdate();
    }

    layerDataUpdate(): void {
        const DATA = this.ca.DATA;
        this.text = this.source.getValueFunc(DATA, this.startDate, this.endDate);   // check PARAMETER_LIST with field = attendance
    }

    getDataToSave(): { [object: string]: any; } {
        let savingData = super.getDataToSave();
        delete savingData.text;
        savingData = {
            ...savingData,
            startDate: this.startDate,
            endDate: this.endDate,
        };
        return savingData;
    }
}

export class GradeLayer extends CanvasText implements Layer {
    parentExamination: any = null;
    subGradeId: any = null;

    examinationName: string;    // explicitly added for sharing, not a good archtecture

    dataSourceType: string = 'DATA';
    source: { [key: string]: any; };    // required attribute

    constructor(attributes: object, ca: CanvasAdapterInterface) {
        super(attributes, ca, false);
        this.parameterToolPannels.push('grade');

        this.maxWidth = Math.round(3000 / ca.pixelTommFactor) / 100;

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'GRADE';
        this.layerDataUpdate();
    }

    layerDataUpdate(): void {
        const DATA = this.ca.DATA;
        if (this.parentExamination) {
            if (this.subGradeId) {
                this.text = this.source.getValueFunc(this.ca.DATA, this.parentExamination, this.subGradeId);
                this.error = false;
            }
            this.examinationName = this.source.getExaminationName(this.ca.DATA, this.parentExamination);
        } else {
            this.text = this.alternateText;
            this.error = true;
        }
    }

    getDataToSave(): { [object: string]: any; } {
        let savingData = super.getDataToSave();
        delete savingData.text;
        savingData = {
            ...savingData,
            parentExamination: this.parentExamination,
            subGradeId: this.subGradeId,
            examinationName: this.source.getExaminationName(this.ca.DATA, this.parentExamination),
        };
        return savingData;
    }

}

export class RemarkLayer extends CanvasText implements Layer {
    parentExamination: any = null;

    examinationName: string;    // explicitly added for sharing, not a good archtecture

    dataSourceType: string = 'DATA';
    source: { [key: string]: any; };    // required attribute

    constructor(attributes: object, ca: CanvasAdapterInterface) {
        super(attributes, ca, false);
        this.parameterToolPannels.push('remark');

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'REMARK';
        this.layerDataUpdate();
    }

    layerDataUpdate(): void {
        const DATA = this.ca.DATA;
        if (this.parentExamination) {
            this.text = this.source.getValueFunc(this.ca.DATA, this.parentExamination);
            this.error = false;
            this.examinationName = this.source.getExaminationName(this.ca.DATA, this.parentExamination);
        } else {
            this.text = this.alternateText;
            this.error = true;
        }
    }

    getDataToSave(): { [object: string]: any; } {
        let savingData = super.getDataToSave();
        delete savingData.text;
        savingData = {
            ...savingData,
            parentExamination: this.parentExamination,
            examinationName: this.source.getExaminationName(this.ca.DATA, this.parentExamination),
        };
        return savingData;
    }

}

export class GradeRule {
    lowerMarks: number = 0;
    upperMarks: number = 100;
    lowerInclusion: boolean = true;
    upperInclusion: boolean = true;
    gradeValue: string = 'A';


    constructor(attributes: object = {}) {
        this.initilizeSelf(attributes);
    }
    initilizeSelf(attributes: object): void {
        Object.entries(attributes).forEach(([key, value]) => this[key] = value);
    }

    belongsToGrade(marks: number): boolean {
        if (((this.lowerInclusion && this.lowerMarks <= marks)
            || (!this.lowerInclusion && this.lowerMarks < marks))
            && ((this.upperInclusion && this.upperMarks >= marks)
                || (!this.upperInclusion && this.upperMarks > marks))) {
            return true;
        }
        return false;
    }
}

export class GradeRuleSet {
    id: number;
    name: string;

    gradeRules: Array<GradeRule> = [new GradeRule()];

    static maxID = 0;

    constructor(attributes: object = {}) {
        GradeRuleSet.maxID++;
        this.id = GradeRuleSet.maxID;
        this.initilizeSelf(attributes);
    }

    initilizeSelf(attributes: object): void {
        Object.entries(attributes).forEach(([key, value]) => this[key] = value);
        GradeRuleSet.maxID = Math.max(GradeRuleSet.maxID, this.id);   // always keeping static maxID maximum of all layers
        if (!this.name) {
            this.name = 'Grade Rule Set - ' + this.id;
        }
    }

    getDataToSave(): { [object: string]: any; } {
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

export class MarksLayer extends CanvasText implements Layer {

    dataSourceType: string = 'DATA';
    source: { [key: string]: any; };    // required attribute

    marks: number = null;
    decimalPlaces: number = 1;
    outOf: number = 100;
    parentExamination: any = null;
    parentSubject: any = null;
    testType: string = null;
    marksType: string = MARKS_TYPE_LIST[0];
    inWords: boolean = false;

    examinationName: string;    // explicitly added for sharing, not a good archtecture

    gradeRuleSet: GradeRuleSet;

    constructor(attributes: object, ca: CanvasAdapterInterface) {
        super(attributes, ca, false);
        this.parameterToolPannels.push('marks');

        this.maxWidth = Math.round(2500 / ca.pixelTommFactor) / 100;

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'MARKS';
        this.layerDataUpdate();
    }

    layerDataUpdate(): void {
        if (this.parentExamination) {
            this.examinationName = this.source.getExaminationName(this.ca.DATA, this.parentExamination);
        }
        if (this.parentExamination && this.parentSubject) {
            let gradeValue: string = null;
            const marksTemp = this.source.getValueFunc(
                this.ca.DATA,
                this.parentExamination,
                this.parentSubject,
                this.testType,
                this.marksType
            );
            this.marks =
                marksTemp *
                (this.outOf /
                    this.source.getValueFunc(
                        this.ca.DATA,
                        this.parentExamination,
                        this.parentSubject,
                        this.testType,
                        MARKS_TYPE_LIST[1]));
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
                    this.text =
                        this.marks >= 0
                            ? getMarksInWords(
                                Math.round(this.marks * Math.pow(10, this.decimalPlaces)) /
                                Math.pow(10, this.decimalPlaces),
                                this.decimalPlaces
                            )
                            : marksTemp == -2
                                ? "Absent"
                                : this.alternateText;
                } else {
                    this.text =
                        this.marks >= 0
                            ? this.marks.toFixed(this.decimalPlaces)
                            : marksTemp == -2
                                ? "A"
                                : this.alternateText;
                }
            }
            this.error = false;
        } else {
            this.text = this.alternateText;
            this.error = true;
        }
    }

    getDataToSave(): { [object: string]: any; } {
        let savingData = super.getDataToSave();
        delete savingData.text;
        savingData = {
            ...savingData,
            decimalPlaces: this.decimalPlaces,
            outOf: this.outOf,
            parentExamination: this.parentExamination,
            parentSubject: this.parentSubject,
            testType: this.testType,
            marksType: this.marksType,
            inWords: this.inWords,
            examinationName: this.source.getExaminationName(this.ca.DATA, this.parentExamination),
        };
        if (this.gradeRuleSet) {
            savingData.gradeRuleSet = this.gradeRuleSet.id;
        }
        return savingData;
    }

}

function setCustomFunctionsInParser(parser: any): void {
    parser.setFunction('Max', function (params) {

        // There should be at least 2 numbers and
        // the final number will decide how many numbers will we choose out of these.
        if (params.length < 3) {
            console.log('Insufficient length');
            return 0;
        }

        // All parameter arguments should be numbers
        let jhanda = true;
        params.every(argument => {
            if (Number(argument.toString()) != argument) {
                console.log('All parameters are not numbers');
                jhanda = false;
                return false;
            }
        });
        if (!jhanda) {
            return 0;
        }

        // Final number should be less than the total number of numbers
        // and should be an integer
        if (params.length - 1 <= params[params.length - 1] ||
            parseInt(params[params.length - 1].toString()) != params[params.length - 1]) {
            console.log('Last parameter has a fault');
            return 0;
        }

        // Calculate the result
        let minList = params.slice(0, params.length - 1 - params[params.length - 1]);
        minList.sort(function (a, b) { return b - a; });
        let result = 0;
        params.slice(minList.length, params.length - 1).forEach(number => {
            result += Number(number);
            // console.log(result);
            minList.every((minNumber, index, list) => {
                if (minNumber > number) {
                    result += Number(minNumber - number);
                    // console.log(result);
                    list[index] = number;
                    return false;
                }
                return true;
            });
            // console.log(minList);
        });
        return result;

    });
}

export function getParser(layers: Layer[]) {
    const PARSER = new FormulaParser();
    // setCustomFunctionsInParser(PARSER);
    layers.forEach((layer: Layer) => {
        if (layer) {
            if ((layer.LAYER_TYPE == 'MARKS' || layer.LAYER_TYPE == 'FORMULA')) {
                PARSER.setVariable(numberToVariable(layer.id),
                    layer.marks >= 0 ? Math.round(layer.marks * Math.pow(10, layer.decimalPlaces)) / Math.pow(10, layer.decimalPlaces) : 0);
            }
            else if (layer instanceof CanvasText) {
                const parsedValue = parseFloat(layer.text);
                PARSER.setVariable(numberToVariable(layer.id), parsedValue);
            }
        }
    });
    setCustomFunctionsInParser(PARSER);
    return PARSER;
}

export class Formula extends CanvasText implements Layer {

    formula: string = '';
    decimalPlaces: number = 1;
    marks: number = null;
    inWords: boolean = false;
    gradeRuleSet: GradeRuleSet;

    constructor(attributes: object, ca: CanvasAdapterInterface) {
        super(attributes, ca, false);
        this.parameterToolPannels.push('formula');

        this.maxWidth = Math.round(4000 / ca.pixelTommFactor) / 100;

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'FORMULA';
        this.layerDataUpdate();
    }

    layerDataUpdate(dependents: number[] = [], parser?: any): void {
        dependents.push(this.id);
        if (this.formula.length > 0) {
            let formulaCopy: string = this.formula;
            let indexOfLayerIdNextDigit: number = formulaCopy.search(/#[0-9]+/);
            let formulaDependencies = [];
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
                if (dependents.includes(layerId)) {
                    alert('Cyclic Formula Found: #' + layerId + ' and #' + this.id);
                    this.text = '!ERROR';
                    return;
                }
                let layer = this.ca.layers.find(l => l && l.id == layerId);
                // Harshal (7th Oct 2022): I hope adding " || layer.LAYER_TYPE == 'MARKS'" doesn't slow
                // the canvas rendering.
                if (layer && (layer.LAYER_TYPE == 'FORMULA' || layer.LAYER_TYPE == 'MARKS')) {
                    formulaDependencies.push(layer);
                }
                formulaCopy = formulaCopy.replace('#' + layerId, numberToVariable(layerId));
                indexOfLayerIdNextDigit = formulaCopy.search(/#[0-9]+/);
            }

            // const parser = getParser(this.ca.layers);
            formulaDependencies.forEach(formulaOrMarksLayer => {
                // The calculation might be repetitive but if the formula is getting calculated
                // before dependent formula or mark then it will show gibberish value.
                 formulaOrMarksLayer.layerDataUpdate([...dependents]);
                // parser.setVariable(numberToVariable(formulaLayer.id), formulaLayer.marks);
            });
            if (!parser)
                parser = getParser(this.ca.layers);

            let result = parser.parse(formulaCopy);
            if (result.error) {
                this.text = result.error;
            } else {
                this.marks = Number(result.result);
                let gradeValue: string = null;

                if (this.gradeRuleSet) {
                    this.gradeRuleSet.gradeRules.forEach((gradeRule: GradeRule) => {
                        if (gradeRule.belongsToGrade(this.marks))
                            gradeValue = gradeRule.gradeValue;
                    });
                }
                if (gradeValue) {
                    this.text = gradeValue;
                }
                else if (this.inWords) {
                    this.text = this.marks >= 0 ?
                        getMarksInWords(Math.round(this.marks * Math.pow(10, this.decimalPlaces)) / Math.pow(10, this.decimalPlaces), this.decimalPlaces)
                        : this.alternateText;
                }
                else {
                    this.text = this.marks >= 0 ? this.marks.toFixed(this.decimalPlaces) : this.alternateText;
                }
            }
        } else {
            this.text = 'Write Formula';
        }
    }

    getDataToSave(): { [object: string]: any; } {
        let savingData = super.getDataToSave();
        delete savingData.text;
        savingData = {
            ...savingData,
            formula: this.formula,
            inWords: this.inWords,
            decimalPlaces: this.decimalPlaces,
        };
        if (this.gradeRuleSet) {
            savingData.gradeRuleSet = this.gradeRuleSet.id;
        }
        return savingData;
    }

}

export class Result extends CanvasText implements Layer {

    marksLayers: (MarksLayer | Formula)[] = [];
    rules: { passingMarks: number[], remarks: string[], colorRule: any[]; } = { passingMarks: [], remarks: ['PASS'], colorRule: ['#008000'] };

    constructor(attributes: object, ca: CanvasAdapterInterface) {
        super(attributes, ca, false);
        this.parameterToolPannels.push('result');

        this.maxWidth = Math.round(5000 / ca.pixelTommFactor) / 100;

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'RESULT';
        this.layerDataUpdate();
    }

    layerDataUpdate(): void {
        let numberOfFailedSubjects = 0;
        this.marksLayers = this.marksLayers.filter(m => m && this.ca.layers.find(l => l && l.id == m.id));
        this.marksLayers.forEach((layer: MarksLayer | Formula, index: number) => {
            if (!layer.marks || layer.marks < this.rules.passingMarks[index]) {
                numberOfFailedSubjects++;
            }
        });
        this.text = this.rules.remarks[numberOfFailedSubjects];
        this.fillStyle = this.rules.colorRule[numberOfFailedSubjects];
    }

    getDataToSave(): { [object: string]: any; } {
        let savingData = super.getDataToSave();
        delete savingData.text;
        savingData = {
            ...savingData,
            marksLayers: this.marksLayers.map(layer => layer.id),
            rules: { ...this.rules },
        };
        return savingData;
    }

}

export class CurrentSession extends CanvasText implements Layer {

    dataSourceType: string = 'DATA';
    source: { [key: string]: any; };    // required attribute

    startDate: Date = new Date();
    endDate: Date = new Date();

    format: {
        date1: string,
        seperator: string,
        date2: string;
    } = {
            date1: '<yyy>',
            seperator: '-',
            date2: '<yy>'
        };


    constructor(attributes: object, ca: CanvasAdapterInterface) {
        super(attributes, ca, false);
        this.parameterToolPannels.push('currentSession');

        this.maxWidth = Math.round(5000 / ca.pixelTommFactor) / 100;

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'CURRENT_SESSION';
        this.layerDataUpdate();
    }

    layerDataUpdate = (): void => {
        let sessionData = this.source.getValueFunc(this.ca.DATA);
        this.startDate = new Date(sessionData.startDate);
        this.endDate = new Date(sessionData.endDate);
        let dateReplacementsForStartDate = getDateReplacements(this.startDate);
        let dateReplacementsForEndDate = getDateReplacements(this.endDate);
        let dateValue1 = this.format.date1;
        let dateValue2 = this.format.date2;
        Object.entries(dateReplacementsForStartDate).forEach(([dataReplacementKey, dateReplacementvalue]) => {
            dateValue1 = dateValue1.replace(dataReplacementKey, dateReplacementvalue);
        });
        Object.entries(dateReplacementsForEndDate).forEach(([dataReplacementKey, dateReplacementvalue]) => {
            dateValue2 = dateValue2.replace(dataReplacementKey, dateReplacementvalue);
        });
        this.text = dateValue1 + this.format.seperator + dateValue2;
    }

    getDataToSave(): { [object: string]: any; } {
        let savingData = super.getDataToSave();
        savingData = {
            ...savingData,
            format: this.format
        };
        return savingData;
    }

}


export const LayersMappedByType: { [key: string]: any; } = {
    'IMAGE': CanvasImage,
    'TABLE': CanvasTable,
    'LINE': CanvasLine,
    'RECTANGLE': CanvasRectangle,
    'CIRCLE': CanvasCircle,
    'ROUNDED-RECTANGLE': CanvasRoundedRectangle,
    'SQUARE': CanvasSquare,
    'TEXT': CanvasText,
    'DATE': CanvasDate,
    'ATTENDANCE': AttendanceLayer,
    'GRADE': GradeLayer,
    'REMARK': RemarkLayer,
    'MARKS': MarksLayer,
    'CURRENT_SESSION': CurrentSession,
    'FORMULA': Formula,
    'RESULT': Result,
};



// BUSINESS------------------------------------------------------------------------------------

// Note: The fieldStructureKey values will be saved in database
// so you can not change fieldStructureKey values at a later stage.

class FieldStructure {

    static getStructure(displayFieldName: any, fieldStructureKey: any): any {
        return {
            displayFieldName: displayFieldName,
            fieldStructureKey: fieldStructureKey,
        };
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

export interface ParameterAsset {
    key: string;
    field: string;
    layerType: any;
    displayParameterNameFunc: any;
    getValueFunc: any;
}

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

    static getStructure(displayName: any, variableName: any, layerType: any = CanvasText): any {
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

    static getStructure(displayName: any, variableName: any, getValueFunc: any, layerType: any = CanvasText): any {
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


    static getStructure(displayName: any, variableName: any, layerType: any = CanvasText): any {
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

    static getStructure(studentParameterName: any, studentParameterId: any, layerType = CanvasText): any {
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

    static getStructure(variableType: any, getValueFunc: any, layerType: any = CanvasText): any {

        return {
            ...ParameterStructure.getStructure(
                variableType,
                FIELDS.EXAMINATION,
                layerType,
                (dataObject) => {
                    return variableType;
                },
                getValueFunc,
            ),
            getExaminationName: ExaminationParameterStructure.getExaminationName
        };
    }

    static getExaminationName(dataObject: any, parentExamination: number) {
        let exam = dataObject.data.examinationList.find(e => e.id == parentExamination);
        if (exam) {
            return exam.name;
        }
        return 'N/A';
    }

    static getMarks(
        dataObject: any,
        parentExamination: any,
        parentSubject: any,
        testType: string
    ): number {
        const student_test_object = dataObject.data.studentTestList.find(
            (studentTest) => {
                return (
                    studentTest.parentExamination === parentExamination &&
                    studentTest.parentSubject === parentSubject &&
                    studentTest.testType === testType &&
                    studentTest.parentStudent === dataObject.studentId
                );
            }
        );
        if (
            student_test_object !== undefined &&
            !isNaN(student_test_object.marksObtained)
        ) {
            if (student_test_object.absent) {
                return MARKS_AVAILABLE_BUT_ABSENT_CORROSPONDING_INT;
            } else {
                return student_test_object.marksObtained;
            }
        } else {
            return MARKS_NOT_AVAILABLE_CORROSPONDING_INT;
        }
    }

    static getMaximumMarks(dataObject: any, parentExamination: any, parentSubject: any, testType: string): number {
        const test_object = dataObject.data.testList.find(test => {
            return test.parentExamination === parentExamination
                && test.parentSubject === parentSubject
                && test.testType === testType
                && test.parentClass === dataObject.data.studentSectionList.find(item =>
                    item.parentStudent === dataObject.studentId).parentClass
                && test.parentDivision === dataObject.data.studentSectionList.find(item =>
                    item.parentStudent === dataObject.studentId).parentDivision;
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
                    ).parentClass;
                }
            ).name;
        }
    ),
    StudentSessionParameterStructure.getStructure(
        'Class Teacher Signature',
        'signatureImage',
        (dataObject) => {
            const classTeacherSignature = dataObject.data.classSectionSignatureList.find(classs =>
                classs.parentClass == dataObject.data.studentSectionList.find(x => x.parentStudent === dataObject.studentId).parentClass &&
                classs.parentDivision == dataObject.data.studentSectionList.find(x => x.parentStudent === dataObject.studentId).parentDivision);
            if (classTeacherSignature)
                return classTeacherSignature.signatureImage;
            else
                return null;
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
                    ).parentDivision;
                }
            ).name;
        }
    ),
    StudentSessionParameterStructure.getStructure(
        'Roll No.',
        'rollNumber',
        (dataObject) => {
            return dataObject.data.studentSectionList.find(
                x => x.parentStudent === dataObject.studentId
            ).rollNumber;
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
                    ).parentClass;
                }
            ).name
                + ', '
                + dataObject.data.divisionList.find(
                    division => {
                        return division.id === dataObject.data.studentSectionList.find(
                            x => x.parentStudent === dataObject.studentId
                        ).parentDivision;
                    }
                ).name;
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
        CurrentSession,
        () => { return 'Current Session'; },
        (dataObject) => {
            const { startDate, endDate } = dataObject.data.sessionList.find(session => session.id == dataObject.currentSession);
            return { startDate, endDate };
        },
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
        (dataObject: any, examinationId: any) => {
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
            let marks: any = -1;
            if (marksType == MARKS_TYPE_LIST[0])
                marks = ExaminationParameterStructure.getMarks(dataObject, parentExamination, parentSubject, testType);
            else if (marksType == MARKS_TYPE_LIST[1])
                marks = ExaminationParameterStructure.getMaximumMarks(dataObject, parentExamination, parentSubject, testType);
            return parseFloat(marks);
        },
        MarksLayer
    )
];