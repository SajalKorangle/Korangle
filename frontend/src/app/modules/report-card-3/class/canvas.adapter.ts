import {
    CanvasAdapterInterface,
    DEFAULT_BACKGROUND_COLOR,
    Layer, CanvasImage, CanvasText,
    CanvasDate,
    Formula,
    PageResolution,
    PAGE_RESOLUTIONS,
    Result,
    GradeRule,
    CanvasTable,
    BaseLayer,
    AttendanceLayer,
    GradeLayer,
    RemarkLayer,
    MarksLayer,
    CanvasLine,
    CanvasRectangle,
    CanvasSquare,
    CanvasCircle,
    CanvasRoundedRectangle,
    GradeRuleSet,
    CanvasGroup,
    CurrentSession
} from './constants_3';

export class CanvasAdapterBase implements CanvasAdapterInterface { 

    vm: any;

    currentLayout: { name: string, thumbnail?:any, publiclyShared:boolean, content: any };

    DATA: any;

    virtualCanvas: HTMLCanvasElement;
    virtualContext: CanvasRenderingContext2D;

    canvasHeight: number = null;   // current height and width are in pixels
    canvasWidth: number = null;

    actualresolution: PageResolution = PAGE_RESOLUTIONS[1] // A4 size by default
    dpi: number = 72;

    pixelTommFactor: number;    // width(height) in mm / Canvas width(height) in pixel

    layers: Array<Layer> = [];  // layers in thier order from back to front
    activeLayer:Layer = null;
    activeLayerIndexes: Array<number> = [];

    activePageIndex: number = 0;

    gradeRuleSetList: Array<GradeRuleSet> = [];

    backgroundColor: string = null;

    virtualPendingReDrawId: any;
    layersFullyDrawnPendingPromiseList:any[] = [];
    
    currentZoom = 100;
    originalHeight: number;
    originalWidth: number;

    metaDrawings: boolean = false;   // meta drawings includes things like hilighter, assistance etc.

    constructor() {
        this.virtualCanvas = document.createElement('canvas');
        this.virtualContext = this.virtualCanvas.getContext('2d');

        Object.defineProperty(this, 'canvasHeight', {   // alias for this.canvas.height and this.virtualCanvas.height
            get: () => this.virtualCanvas.height,
            set: (newHeight) => this.virtualCanvas.height = newHeight,
            configurable: true
        });

        Object.defineProperty(this, 'canvasWidth', {    // alias for this.canvas.width and this.virtualCanvas.width
            get: () => this.virtualCanvas.width,
            set: (newWidth) => this.virtualCanvas.width = newWidth,
            configurable: true
        });
    }
    
    getEmptyLayoutPage(): { [key: string]: any }{
        return {
            actualresolution: {
                resolutionName: PAGE_RESOLUTIONS[1].resolutionName, // a4 page
                orientation: 'p',
            },
            backgroundColor: DEFAULT_BACKGROUND_COLOR,
            gradeRuleSetList:[],
            layers: []
        };
    }
    
    getEmptyLayout(): any[] {
        return [this.getEmptyLayoutPage()];
    }

    storeThumbnail(): void{
        let canavs:any = document.createElement('canvas');
        canavs.height = this.actualresolution.getmmHeight();
        canavs.width = this.actualresolution.getmmWidth();
        let ctx = canavs.getContext('2d');
        ctx.drawImage(this.virtualCanvas, 0, 0, canavs.width, canavs.height);
        this.currentLayout.thumbnail = canavs.toDataURL();
    }

    canvasSizing(maxHeight:number, maxWidth:number=Infinity, doScale:boolean = false): void{
        let canvasPreviousWidth = this.canvasWidth;
        if (maxWidth / maxHeight > this.actualresolution.getAspectRatio()) {
            this.canvasWidth = this.actualresolution.getCorrospondingWidth(maxHeight);
            this.canvasHeight = maxHeight;
        }
        else {
            this.canvasHeight = this.actualresolution.getCorrospondingHeight(maxWidth);
            this.canvasWidth = maxWidth;
        }

        this.pixelTommFactor = this.actualresolution.getmmWidth() / this.canvasWidth;

        if (doScale) {
            let scaleFactor = this.canvasWidth / canvasPreviousWidth;
            this.layers.forEach((layer: Layer) => layer.scale(scaleFactor));
            this.scheduleCanvasReDraw(0);
        }
    }

    protected drawAllLayers(): boolean {
        this.virtualContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.virtualContext.fillStyle = this.backgroundColor;
        this.virtualContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);   // Applying background color

        for (let i = 0; i < this.layers.length; i++){
            if (!this.layers[i])
                continue;
            let status = this.layers[i].drawOnCanvas(this.virtualContext, this.scheduleCanvasReDraw);    // check for redundant iterations
            if (!status)
                return false;
        }
        if (this.activeLayer && this.metaDrawings) {
            this.activeLayer.highlightLayer(this.virtualContext);
        }
        this.layersFullyDrawnPendingPromiseList.forEach(resolve => resolve());
        this.layersFullyDrawnPendingPromiseList = [];
        return true;
    }

    scheduleCanvasReDraw = (duration: number = 500, preCallback: any = () => { }, postCallback: any = () => { }):Promise<any>=>{
        clearTimeout(this.virtualPendingReDrawId);
        return new Promise(resolve => {
            this.layersFullyDrawnPendingPromiseList.push(resolve);
            this.virtualPendingReDrawId = setTimeout(() => {
                preCallback();
                this.drawAllLayers();
                postCallback();
            }, duration);
        });
    }

    updateResolution(newResolution: PageResolution): void{
        this.actualresolution = new PageResolution(newResolution.resolutionName,
            newResolution.mm.height, newResolution.mm.width, newResolution.orientation);    // copy of standard resolution
        this.canvasSizing(this.actualresolution.getHeightInPixel(this.dpi), this.actualresolution.getWidthInPixel(this.dpi));
        this.scheduleCanvasReDraw(0);
    }
    
}

export class CanvasAdapterHTML extends CanvasAdapterBase {
    canvas: HTMLCanvasElement;  // html canvas rendered on screen
    context: CanvasRenderingContext2D;

    maxVisibleHeight: number;
    maxVisibleWidth: number;

    lastMouseX: number;
    lastMouseY: number;
    currentMouseDown: boolean = false;
    selectDragedOverLayers: boolean = false;
    selectionAssistanceRef: HTMLDivElement;

    isSaved = true;    // if canvas is not saved then give warning; to be implemented

    pendingReDrawId: any;

    documentEventListners: { keydown: any, mouseup: any } = {
        keydown: (event) => {
            if (!this.activeLayer || !(event.target instanceof HTMLBodyElement))
                return;
            if (event.key == 'ArrowUp') {
                this.activeLayer.updatePosition(0, -1)
                event.preventDefault();
                this.scheduleCanvasReDraw(0); 
            }
            if (event.key == 'ArrowDown') {
                this.activeLayer.updatePosition(0, 1);
                event.preventDefault();
                this.scheduleCanvasReDraw(0); 
            }
            if (event.key == 'ArrowLeft') {
                this.activeLayer.updatePosition(-1, 0);
                event.preventDefault();
                this.scheduleCanvasReDraw(0); 
            }
            if (event.key == 'ArrowRight') {
                this.activeLayer.updatePosition(1, 0);
                event.preventDefault();
                this.scheduleCanvasReDraw(0); 
            } 
        },
        mouseup: (event) => {
            if (this.selectionAssistanceRef) {
                document.body.removeChild(this.selectionAssistanceRef);
                this.selectionAssistanceRef = null;
            }
        }
    };
    layerClickEvents: any[] = [];

    metaDrawings: boolean = true;

    constructor() {
        super();
        Object.defineProperty(this, 'canvasHeight', {   // alias for this.canvas.height and this.virtualCanvas.height
            get: () => this.virtualCanvas.height,
            set: (newHeight) => {
                this.virtualCanvas.height = newHeight;
                this.canvas.height = newHeight;
            },
            configurable: true
        });

        Object.defineProperty(this, 'canvasWidth', {    // alias for this.canvas.width and this.virtualCanvas.width
            get: () => this.virtualCanvas.width,
            set: (newWidth) => {
                this.virtualCanvas.width = newWidth;
                this.canvas.width = newWidth;
            },
            configurable: true
        });
    }

    destructor() {
        document.removeEventListener('keydown', this.documentEventListners.keydown);
        document.removeEventListener('mouseup', this.documentEventListners.mouseup);
    }

    protected drawAllLayers(): boolean{
        if (super.drawAllLayers()) {
            clearTimeout(this.pendingReDrawId);
            this.pendingReDrawId = setTimeout(() => this.context.drawImage(this.virtualCanvas, 0, 0));
        }
        return true;
    }

}