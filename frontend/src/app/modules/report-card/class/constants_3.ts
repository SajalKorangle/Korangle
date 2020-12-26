//Page Resolutions

export class A4{
    static aspectRatio = 210 / 297;
    static A4Resolution = {
        mm: {
            height: 297,
            width: 210
        }
    }

    static getHeightRelativeToA4(width: number): number{
        return width/this.aspectRatio;
    }

    static getWidthRelativeToA4(height: number): number{
        return this.aspectRatio*height;
    }
};

Object.seal(A4);    // Making these objects immutable
Object.seal(A4.A4Resolution);
Object.seal(A4.A4Resolution.mm);

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


//Layers--------------------------------------

// To be implemented by all Canvas Layers
export interface Layer{
    displayName: string;    // layer name displayed to user
    LAYER_TYPE: string; // Type description for JSON parsing
    x: number;
    y: number;
    dataSourceType: string;    // options: DATA_SOURCE_TYPE
    source?: {[key:string]: any};   // object containing information about the source of data
    layerSetUp(Data: object, canvasWidth: number, canvasHeight: number, ctx: CanvasRenderingContext2D): void;
    updatePosition(dx: number, dy: number): void;
    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean;
    isClicked(mouseX: number, mouseY: number): boolean
    getDataToSave(): any;

    image?: HTMLImageElement;
    height?: number;
    width?: number;
    textBoxMetrx?: {
        boundingBoxLeft: number,
        boundingBoxRight: number,
        boundingBoxTop: number,
        boundingBoxBottom: number,
    };
};

export class CanvasImage implements Layer{  // Canvas Image Layer
    displayName: string = 'Image';
    LAYER_TYPE: string = 'IMAGE';   
    image: HTMLImageElement;    // not included in content json data
    uri: string;
    x: number;
    y: number;
    height: number = null;
    width: number = null;
    aspectRatio: any = null;    
    maintainAspectRatio = true; 
    dataSourceType: string = 'N/A';
    source?: {[key:string]: any};

    constructor(attributes: object) {
        this.image = new Image();
        Object.entries(attributes).forEach(([key, value]) => this[key] = value);
        this.LAYER_TYPE = 'IMAGE';
    }

    layerSetUp(DATA: object = {}, canvasWidth: number, canvasHeight: number, ctx: CanvasRenderingContext2D): void{
        if (this.dataSourceType == DATA_SOUCE_TYPE[1]) {
            this.uri = this.source.getValueFunc(DATA);
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
        this.image.src = this.uri;
    }

    updateHeight(newHeight: number) {
        this.height = newHeight;
        if (this.maintainAspectRatio)
            this.width = this.aspectRatio * this.height;
    }

    updateWidthh(newWidth: number) {
        this.width = newWidth;
        if (this.maintainAspectRatio)
            this.height = this.width / this.aspectRatio; 
    }

    updatePosition(dx = 0, dy = 0):void {
        this.x += dx;
        this.y += dy;
    }
    
    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        console.log('draw on canvas called');
        if (this.image.complete && this.image.naturalHeight > 0) {
            setTimeout(()=>ctx.drawImage(this.image, this.x, this.y, this.width, this.height));
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

export class CanvasText implements Layer{
    displayName: string = 'Text';
    LAYER_TYPE: string = 'TEXT';   // Type description for parsing
    text: string = 'Lorem Ipsum';    
    x: number;
    y: number;
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
    dataSourceType: string = 'N/A';
    source?: {[key:string]: any};

    fontStyle: { [key: string]: string } = {
        fillStyle: DEFAULT_TEXT_COLOR
    };

    constructor(attributes: object) {
        console.log('canvas text before constructor: ', this.text);
        console.log('attributes in construtor: ', attributes);
        Object.entries(attributes).forEach(([key, value]) => this[key] = value);
        this.LAYER_TYPE = 'TEXT';
        console.log('canvas text after constructor: ', this.text);
    }

    layerSetUp(DATA: object = {}, canvasWidth: number, canvasHeight: number, ctx: CanvasRenderingContext2D): void {
        console.log('canvas text before layer setup: ', this.text);
        if (this.dataSourceType == 'DATA') {
            this.text = this.source.getValueFunc(DATA);
            console.log('if is called inside layer setup for dataSourceType== DATA');
        }
        Object.entries(this.fontStyle).forEach(([key, value])=> ctx[key] = value);  // applying font styles
        let textMetrix = ctx.measureText(this.text);
        console.log(textMetrix);
        this.textBoxMetrx = {
            boundingBoxLeft: textMetrix.actualBoundingBoxLeft,
            boundingBoxRight: textMetrix.actualBoundingBoxRight,
            boundingBoxTop: textMetrix.actualBoundingBoxAscent,
            boundingBoxBottom: textMetrix.actualBoundingBoxDescent,
        };

        if (!this.x && !this.y) {
            this.x = 50;
            this.y = 50;
        }
        console.log('canvas text after layer setup: ', this.text);
    }

    updatePosition(dx = 0, dy = 0):void {
        this.x += dx;
        this.y += dy;
    }

    // style updated to be implemented

    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        console.log('canvas text in draw on Canvas: ', this.text);
        Object.entries(this.fontStyle).forEach(([key, value])=> ctx[key] = value);  // applying font styles
        setTimeout(()=>ctx.fillText(this.text, this.x, this.y));
        return true;    // Drawn successfully on canvas
    }

    isClicked(mouseX: number, mouseY: number): boolean {    // reiterate if click is not working
        return (mouseX > this.x - this.textBoxMetrx.boundingBoxLeft - permissibleClickError
            && mouseX < this.x + this.textBoxMetrx.boundingBoxRight + permissibleClickError
            && mouseY > this.y - this.textBoxMetrx.boundingBoxTop - permissibleClickError
            && mouseY < this.y + this.textBoxMetrx.boundingBoxBottom + permissibleClickError)
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

export const LAYER_TYPES: {[key:string]: any} = {    // all nulls to be implemented
    'IMAGE': CanvasImage,
    'TEXT': CanvasText,
    'DATE': null,
    'TABLE': null,
};










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
    CONSTANT: FieldStructure.getStructure('Constant', 'constant'),
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

    static getStructure(displayName: any, variableName: any, layerType = LAYER_TYPES.TEXT): any {
        return ParameterStructure.getStructure(
            // FIELDS.STUDENT.fieldStructureKey + '-' +
            variableName,  // remove FIELDS.STUDENT.fieldStructureKey  if not needed
            FIELDS.STUDENT,
            layerType,
            () => {   // why data object, if not required remove
                return displayName;
                    // + (dataObject.userHandle ?' (top: ' + dataObject.userHandle.y + ', left: ' + dataObject.userHandle.x + ')' : '');
            },
            (dataObject) => {
                // if (dataType === DATA_TYPES.DATE) {
                //     const date = new Date(dataObject.data.studentList.find(x => x.id === dataObject.studentId)[variableName]);
                //     const dateReplacements = getDateReplacements(date);
                //     let dateValue = dataObject.userHandle.format.toString();
                //     Object.keys(dateReplacements).forEach(dataReplacementKey => {
                //         dateValue = dateValue.replace(dataReplacementKey, dateReplacements[dataReplacementKey]);
                //     });
                //     return dateValue;
                // } else {
                //     return dataObject.data.studentList.find(x => x.id === dataObject.studentId)[variableName];
                // }
                return dataObject.data.studentList.find(x => x.id === dataObject.studentId)[variableName];
            });
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
    StudentParameterStructure.getStructure(`Profile Image`, 'profileImage', LAYER_TYPES.IMAGE),
    // StudentParameterStructure.getStructure(`Date of Birth`, 'dateOfBirth', LAYER_TYPES.DATE),    //uncomment after implementing Date layer
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
    // StudentParameterStructure.getStructure(`Date of Admission`, 'dateOfAdmission', LAYER_TYPES.DATE), //uncomment after implementing Date layer
]