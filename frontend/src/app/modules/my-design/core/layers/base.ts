// To be implemented by all Canvas Layers
export interface LAYER_INTERFACE {
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

export const DATA_SOURCE_TYPE = [    // used in all canvas layers
    'N/A',  // no data source, constant element
    'DATA'  // data source available, get data from the provided data source
];

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
    static parameterToolPanelLIST: string[] = ['position', 'settings'];  // position right toolbar pannel is present in all layers
    static toolBarList: string[] = ['position', 'settings', 'delete'];     // change strings to component later
    isPositionLocked: boolean = false;
    dataSourceType: string = 'N/A';
    source?: { [key: string]: any; };

    constructor() {
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
