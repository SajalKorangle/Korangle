import { DesignReportCardComponent } from './design-report-card.component';
import {reportError, ERROR_SOURCES } from './../../../../services/modules/errors/error-reporting.service'

import {
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
    getStructeredPageResolution,
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
} from './../../class/constants_3';

import * as jsPDF from 'jspdf'


export class DesignReportCardCanvasAdapter {

    vm: DesignReportCardComponent;

    virtualCanvas: HTMLCanvasElement;
    virtualContext: CanvasRenderingContext2D;

    actualresolution: PageResolution = PAGE_RESOLUTIONS[1] // A4 size by default
    dpi: number = 72;

    canvas: HTMLCanvasElement;  // html canvas rendered on screen
    context: CanvasRenderingContext2D;
    canvasHeight: number = null;   // current height and width are in pixels
    canvasWidth: number = null;    

    layers: Array<Layer> = [];  // layers in thier order from back to front
    activeLayer:Layer = null;
    activeLayerIndex:number = null;
    // selectedLayers: Array<Layer> = [];
    // selectedLayersIndices: Array<number> = [];

    activePageIndex: number = 0;

    gradeRuleSetList: Array<GradeRuleSet> = [];

    backgroundColor: string = null;

    lastMouseX: number;
    lastMouseY: number;
    currentMouseDown: boolean = false;

    pixelTommFactor: number;    // width(height) in mm / Canvas width(height) in pixel
    isSaved = true;    // if canvas is not saved then give warning; to be implemented

    virtualPendingReDrawId: any;
    pendingReDrawId: any;
    shape: any;
    currentZoom = 100;
    originalHeight: any;
    originalWidth: any;
    
    constructor() {
    }

    getEmptyLayoutPage(): { [key: string]: any }{
        return {
            actualresolution: {
                resolutionName: PAGE_RESOLUTIONS[1].resolutionName,
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
    
    addEmptyPage(): void{
        this.vm.currentLayout.content.push(this.getEmptyLayoutPage());
        this.updatePage(this.vm.currentLayout.content.length-1);
    }

    updatePage(pageIndex: number): void{
        if (this.activePageIndex == pageIndex)
            return;
        if (this.activePageIndex == 0) {
            this.storeThumbnail()
        }
        this.vm.currentLayout.content[this.activePageIndex] = this.getDataToSave();
        this.loadData(this.vm.currentLayout.content[pageIndex]);
        this.activePageIndex = pageIndex;
    }

    storeThumbnail(): void{
        let canavs:any = document.createElement('canvas');
        canavs.height = this.actualresolution.mm.height;
        canavs.width = this.actualresolution.mm.width;
        let ctx = canavs.getContext('2d');
        ctx.drawImage(this.virtualCanvas, 0, 0, canavs.width, canavs.height);
        this.vm.currentLayout.thumbnail = canavs.toDataURL();
        this.vm.thumbnailUpdated = true;
    }

    initilizeAdapter(vm: DesignReportCardComponent) {
        this.vm = vm;
        this.virtualCanvas = document.createElement('canvas');
        this.virtualContext = this.virtualCanvas.getContext('2d');
    }

    initilizeCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.canvasSizing();
        
        this.originalWidth = this.canvas.width;
        this.originalHeight = this.canvas.height;
        this.currentZoom = 100;
 
        this.applyDefaultbackground();

        this.canvas.addEventListener('mousedown', (event) => {
            let clickedX, clickedY;
            clickedX = event.offsetX;
            clickedY = event.offsetY;

            this.activeLayer = null;
            this.activeLayerIndex = null;
            this.currentMouseDown = false;

            for (let i = this.layers.length - 1; i >= 0; i--) {
                if (this.layers[i].isClicked(clickedX, clickedY)) {
                    this.updateActiveLayer(i, event);
                    this.lastMouseX = clickedX;
                    this.lastMouseY = clickedY;
                    this.currentMouseDown = true;
                    break;
                }
            }

            // if (!this.activeLayer) {
            //     this.selectedLayers = [];
            //     this.selectedLayersIndices = [];
            // }
        });

        this.canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            if (this.activeLayer) {
                this.vm.htmlAdapter.openContextMenu(event);
                this.currentMouseDown = false;
            }
        })

        this.canvas.addEventListener('mousemove', (event) => {  // Handling movement via mouse
            if (!this.currentMouseDown)
                return;
            let mouseX = event.offsetX, mouseY = event.offsetY, dx, dy;
            dx = mouseX - this.lastMouseX;  // Change in x
            dy = mouseY - this.lastMouseY;  // Change in y
            this.activeLayer.updatePosition(dx, dy);  // Update x and y of layer
            this.lastMouseX = mouseX;
            this.lastMouseY = mouseY;
            this.drawAllLayers();
        });

        this.canvas.addEventListener('mouseup', (event) => {
            this.currentMouseDown = false;
        });
    }

    updateResolution(newResolution: PageResolution): void{
        this.actualresolution = newResolution;
        this.canvasWidth = null;
        this.canvasWidth = null;
        this.canvasSizing();
        this.scheduleCanvasReDraw(0);
    }

    increaseCanvasSize():any{
        this.currentZoom += 25;
        this.canvas.height = this.currentZoom*this.originalHeight/100;
        this.canvas.width = this.currentZoom*this.originalWidth/100;
        this.canvasSizing();
        
    }
    decreaseCanvasSize():any{
        this.currentZoom -= 25;
        this.canvas.height = this.currentZoom*this.originalHeight/100;
        this.canvas.width = this.currentZoom*this.originalWidth/100;
        this.canvasSizing();
        
    }

    maximumCanvasSize():any{
        return this.actualresolution.getHeightInPixel(this.dpi)*2;
    }

    minimumCanvasSize():any{
        return this.actualresolution.getHeightInPixel(this.dpi)*(0.1);
    }

    changeZoomLevel(event: any): any{
        this.currentZoom = event.value;
        this.canvas.height = event.value;
        this.canvas.width = event.value;
        this.canvasSizing();
        // this.canvas.height = this.currentZoom*this.originalHeight/100;
        // this.canvas.width = this.currentZoom*this.originalWidth/100;

    }
    
    canvasSizing(): void{
        let canvasPreviousWidth = this.canvasWidth;
        if (this.canvas.width / this.canvas.height > this.actualresolution.aspectRatio) {
            this.canvasHeight = this.canvas.height;
            this.canvasWidth = this.actualresolution.getCorrospondingWidth(this.canvasHeight);
            this.canvas.width = this.canvasWidth;
        }
        else {
            this.canvasWidth = this.canvas.width;
            this.canvasHeight = this.actualresolution.getCorrospondingHeight(this.canvasWidth);
            this.canvas.height = this.canvasHeight;
        }

        this.pixelTommFactor = this.actualresolution.mm.width / this.canvasWidth;
        
        this.virtualCanvas.height = this.canvasHeight;
        this.virtualCanvas.width = this.canvasWidth;

        if (canvasPreviousWidth) {
            let scaleFactor = this.canvasWidth / canvasPreviousWidth;
            this.layers.forEach((layer: Layer) => layer.scale(scaleFactor));
            this.scheduleCanvasReDraw(0);
        }
    }

    getDataToSave() {   // updating required

        let layers = [];
        for (let i = 0; i < this.layers.length; i++){    // Copying all layer objects
            layers[i] = this.layers[i].getDataToSave();
        };

        let dataToSave:{[key:string]:any} = {
            actualresolution: {
                resolutionName: this.actualresolution.resolutionName,
                orientation: this.actualresolution.orientation
            },
            backgroundColor: this.backgroundColor,

            gradeRuleSetList: this.gradeRuleSetList.map(gradeRuleSet=>gradeRuleSet.getDataToSave()),
            layers: layers
        };

        if (this.actualresolution.resolutionName == PAGE_RESOLUTIONS[4].resolutionName) {   //custom resolution
            dataToSave.actualresolution.mmHeight = this.actualresolution.mm.height;
            dataToSave.actualresolution.mmWidth = this.actualresolution.mm.width;
        }

        return dataToSave
    }

    loadData(Data): void{   // handle this method
        this.clearCanvas()
        Data = JSON.parse(JSON.stringify(Data)); // deep copy of layoutPageData

        BaseLayer.maxID = 0;
        try {
            
            // loading resolution
            let resolution = PAGE_RESOLUTIONS.find(pr => pr.resolutionName == Data.actualresolution.resolutionName);
            if (!resolution) {
                PAGE_RESOLUTIONS[4] = getStructeredPageResolution('Custom', Data.actualresolution.mmHeight, Data.actualresolution.mmWidth, Data.actualresolution.orientation)
                resolution = PAGE_RESOLUTIONS[4];
            }

            // apply resolution
            this.vm.htmlAdapter.canvasSetUp();
            this.updateResolution(resolution);

            // loding Grade Rules
            Data.gradeRuleSetList.forEach(gradeRuleSet => {
                gradeRuleSet.gradeRules = gradeRuleSet.gradeRules.map(gradeRule => new GradeRule(gradeRule));   // creating GradeRules from GradeRules data if GradeRuleSet
            });

            this.gradeRuleSetList = Data.gradeRuleSetList.map(gradeRuleSet => new GradeRuleSet(gradeRuleSet));  // creating GradeRuleSet 


            let mmToPixelScaleFactor = this.canvasHeight / this.actualresolution.mm.height;

            this.backgroundColor = Data.backgroundColor;

            for (let i = 0; i < Data.layers.length; i++) {
                let layerData = Data.layers[i];
            
                let newLayerFromLayerData: Layer;   // update this for new architecture
                switch (layerData.LAYER_TYPE) {
                    case 'IMAGE':
                        newLayerFromLayerData = new CanvasImage(layerData, this);
                        break;
                    
                    case 'TABLE':
                        newLayerFromLayerData = new CanvasTable(layerData, this);
                        break;
                    
                    case 'LINE':
                        newLayerFromLayerData = new CanvasLine(layerData, this);
                        break;
                    
                    case 'RECTANGLE':
                        newLayerFromLayerData = new CanvasRectangle(layerData, this);
                        break;
                    
                    case 'CIRCLE':
                        newLayerFromLayerData = new CanvasCircle(layerData, this);
                        break;
                
                    case 'ROUNDED-RECTANGLE':
                        newLayerFromLayerData = new CanvasRoundedRectangle(layerData, this);
                        break;
                    
                    case 'SQUARE':
                        newLayerFromLayerData = new CanvasSquare(layerData, this);
                        break;
                    
                    case 'TEXT':
                    case 'DATE':
                    case 'ATTENDANCE':
                    case 'GRADE':
                    case 'REMARK':
                    case 'MARKS':
                    case 'FORMULA':
                    case 'RESULT':
                        layerData.fontStyle = { // structuring according to canvas
                            fillStyle: layerData.fillStyle,
                            font: [layerData.italics, layerData.fontWeight, layerData.fontSize+'px', layerData.font].join(' ')
                        };
                        delete layerData.fillStyle;
                        delete layerData.italics;
                        delete layerData.fontWeight;
                        delete layerData.fontSize;
                        delete layerData.font;
                        switch (layerData.LAYER_TYPE) {
                            case 'TEXT':
                                newLayerFromLayerData = new CanvasText(layerData, this);
                                break;
                            case 'DATE':
                                if (layerData.date) {
                                    layerData.date = new Date(layerData.date);
                                }
                                newLayerFromLayerData = new CanvasDate(layerData, this);
                                break;
                            case 'ATTENDANCE':
                                layerData.startDate = new Date(layerData.startDate);
                                layerData.endDate = new Date(layerData.endDate);
                                newLayerFromLayerData = new AttendanceLayer(layerData, this);
                                break;
                            case 'GRADE':
                                newLayerFromLayerData = new GradeLayer(layerData, this);
                                break;
                            case 'REMARK':
                                newLayerFromLayerData = new RemarkLayer(layerData, this);
                                break;
                            case 'MARKS':
                                if (layerData.gradeRuleSet) {
                                    layerData.gradeRuleSet = this.gradeRuleSetList.find(gradeRuleSet => gradeRuleSet.id == layerData.gradeRuleSet);
                                }
                                newLayerFromLayerData = new MarksLayer(layerData, this);
                                break;
                            case 'FORMULA': // Formula can depend in some layers that is not initilized yet
                                this.layers.push(null); // This null will be replaces during formula layer initilization
                                continue;
                            case 'RESULT':
                                this.layers.push(null); // This null will be replaces during result layer initilization
                                continue;
                        }
                        break;        
                }
                newLayerFromLayerData.scale(mmToPixelScaleFactor);
                this.layers.push(newLayerFromLayerData);
            }

            Data.layers.forEach((layerData, index) => { // For Formula layers
                if (layerData.LAYER_TYPE == 'FORMULA') {
                    let newLayerFromLayerData = new Formula(layerData, this);
                    newLayerFromLayerData.scale(mmToPixelScaleFactor);
                    this.layers[index] = newLayerFromLayerData;
                }
            });

            Data.layers.forEach((layerData, index) => { // For Result layers
                if (layerData.LAYER_TYPE == 'RESULT') {
                    layerData.marksLayers = layerData.marksLayers.map(layerId => this.layers.find(layer => layer && layer.id == layerId));
                    let newLayerFromLayerData = new Result(layerData, this);
                    newLayerFromLayerData.scale(mmToPixelScaleFactor);
                    this.layers[index] = newLayerFromLayerData;
                }
            });

            if (this.layers.length > 0) {
                this.activeLayer = this.layers[this.layers.length - 1];
                this.activeLayerIndex = this.layers.length - 1;
            }
            this.drawAllLayers();
            // console.log('canvas layers: ', this.layers);
            this.isSaved = false;
        } catch (err) {
            console.error(err);
            reportError(ERROR_SOURCES[1], location.pathname + location.search, err, 'error in loading saved layout page; data croupted');
            alert('data corupted');
            this.clearCanvas();
        }
    }

    getLayerFromLayerData(layerData: any, constructor:any): Layer{
        switch (layerData.LAYER_TYPE) {
            case 'TEXT':
            case 'DATE':
            case 'ATTENDANCE':
            case 'GRADE':
            case 'REMARK':
            case 'MARKS':
            case 'FORMULA':
            case 'RESULT':
                layerData.fontStyle = { // structuring according to canvas
                    fillStyle: layerData.fillStyle,
                    font: [layerData.italics, layerData.fontWeight, layerData.fontSize+'px', layerData.font].join(' ')
                };
                delete layerData.fillStyle;
                delete layerData.italics;
                delete layerData.fontWeight;
                delete layerData.fontSize;
                delete layerData.font;
                switch (layerData.LAYER_TYPE) {
                    case 'DATE':
                        if (layerData.date) {
                            layerData.date = new Date(layerData.date);
                        }
                        break;
                    case 'ATTENDANCE':
                        layerData.startDate = new Date(layerData.startDate);
                        layerData.endDate = new Date(layerData.endDate);
                        break;
                    case 'MARKS':
                        if (layerData.gradeRuleSet) {
                            layerData.gradeRuleSet = this.gradeRuleSetList.find(gradeRuleSet => gradeRuleSet.id == layerData.gradeRuleSet);
                        }
                        break;
                }
                break;      
        }
        return new constructor(layerData, this);
    }

    replaceLayerWithNewLayerType(layer:Layer, initialParameters: {[key:string]:any} = {}): void{
        let layerIndex = this.layers.findIndex(l => l.id == layer.id);
        let layerData = JSON.parse(JSON.stringify(layer.getDataToSave()));
        initialParameters = { ...layerData, ...initialParameters };

        let newLayer: Layer = this.getLayerFromLayerData(initialParameters, layer.constructor);
        newLayer.scale(1 / this.pixelTommFactor);

        this.layers[layerIndex] = newLayer;
        this.activeLayer = newLayer;
        this.activeLayerIndex = layerIndex;
        this.scheduleCanvasReDraw();
    }

    private drawAllLayers(): void {
        this.virtualContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.virtualContext.fillStyle = this.backgroundColor;
        this.virtualContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);   // Applying background color

        for (let i = 0; i < this.layers.length; i++){
            if (!this.layers[i])
                continue;
            let status = this.layers[i].drawOnCanvas(this.virtualContext, this.scheduleCanvasReDraw);    // check for redundant iterations
            if (!status)
                return;
        }
        clearTimeout(this.pendingReDrawId);
        this.pendingReDrawId = setTimeout(() => this.context.drawImage(this.virtualCanvas, 0, 0));
    }

    scheduleCanvasReDraw = (duration: number = 500, preCallback: any = () => { }, postCallback: any = () => { })=>{
        clearTimeout(this.virtualPendingReDrawId);
        this.virtualPendingReDrawId = setTimeout(() => {
            preCallback();
            this.drawAllLayers();
            postCallback();
        }, duration);
    }

    fullCanavsRefresh():void {
        this.layers.forEach((layer: Layer) => {
            layer.layerDataUpdate();
        })
        this.scheduleCanvasReDraw(0);
    }

    layerMove(id1: number, id2:number): void{   // move layer of id2 above layer of id1
        let layer1Index: number = this.layers.findIndex(l => l.id == id1);
        let layer2Index: number = this.layers.findIndex(l => l.id == id2);
        let layerToMove = this.layers[layer2Index];
        delete this.layers[layer2Index];
        this.layers.splice(layer1Index, 0, layerToMove);
        this.layers = this.layers.filter(Boolean);
        this.scheduleCanvasReDraw(0);
        this.activeLayer = layerToMove;
        this.activeLayerIndex = this.layers.findIndex(l => l.id ==layerToMove.id);
    }

    duplicateLayer(layer: Layer): void{
        let layerParticularData = layer.getDataToSave();
        let deepCopyLayerData = JSON.parse(JSON.stringify(layerParticularData));
        delete deepCopyLayerData.id;
        deepCopyLayerData.displayName += ' copy';
        let newLayer = this.getLayerFromLayerData(deepCopyLayerData, layer.constructor);
        let mmToPixelScaleFactor = this.canvasHeight / this.actualresolution.mm.height;
        newLayer.scale(mmToPixelScaleFactor);
        newLayer.x += 15;   // slightly shifting layer 
        newLayer.y += 15;
        this.newLayerInitilization(newLayer);
    }

    applyDefaultbackground(): void{
        this.backgroundColor = DEFAULT_BACKGROUND_COLOR;
        this.scheduleCanvasReDraw(0);
    }

    applyBackground(bgColor: string): void{
        this.backgroundColor = bgColor;
        this.scheduleCanvasReDraw(0);
    }

    clearCanvas(): void {
        clearTimeout(this.virtualPendingReDrawId);

        this.virtualContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.layers = [];
        this.currentMouseDown = false;
        this.isSaved = false;
        this.activePageIndex = 0;

        this.applyDefaultbackground();
    }

    removeSchoolSpecificDataFromLayout(layoutContent: any[]): any[] {
        layoutContent = JSON.parse(JSON.stringify(layoutContent));
        for (let i=0; i < layoutContent.length; i++) {
            layoutContent[i].layers = layoutContent[i].layers.map(layer => {
                switch (layer.LAYER_TYPE) {
                    case 'GRADE':
                        layer.parentExamination = null;
                        layer.subsubGradeId = null;
                        layer.error = true;
                        break;
                    case 'REMARK':
                        layer.parentExamination = null;
                        layer.error = true;
                        break;
                    case 'MARKS':
                        layer.parentExamination = null;
                        layer.error = true;
                        break;
                }
                return layer;
            })
        }
        return layoutContent;
    }

    updateActiveLayer(activeLayerIndex:number, event: MouseEvent=null): void{   // used by left layer pannel
        
        this.activeLayerIndex = activeLayerIndex;
        this.activeLayer = this.layers[this.activeLayerIndex];
        // if (event) {    // if event is a mouse event then check for control key pressed and select multiple layers
        //     if (event.shiftKey) {
        //         this.selectedLayers.push(this.activeLayer);
        //         this.selectedLayersIndices.push(this.activeLayerIndex);
        //     } else {
        //         this.selectedLayers = [];
        //         this.selectedLayersIndices = [];
        //     }
        // }
    }

    downloadPDF() { // apply a loading spinner and block the canvas user interaction while saving(to be done)
        let actualCanavsWidth = this.canvasWidth, actualCanavsHeight = this.canvasHeight;
        this.canvas.width = this.actualresolution.getWidthInPixel(this.dpi);
        this.canvas.height = this.actualresolution.getHeightInPixel(this.dpi);

        this.vm.htmlAdapter.isSaving = true;
        this.canvasSizing();
        setTimeout(() => {
            let doc = new jsPDF({ orientation: 'p', unit: 'pt', format: [this.canvasHeight, this.canvasWidth] });
            let dataurl = this.canvas.toDataURL()
            doc.addImage(dataurl, 'PNG', 0, 0, this.canvasWidth, this.canvasHeight);
            doc.save(this.vm.currentLayout.name + '.pdf');
            this.canvas.width = actualCanavsWidth;
            this.canvas.height = actualCanavsHeight;
            this.canvasSizing();
            this.vm.htmlAdapter.isSaving = false;
        },1000);    // bad design of waiting for canvas loading
    }

    newImageLayer(initialParameters: object = {}): CanvasImage{
        let canvasImage = new CanvasImage(initialParameters, this);
        this.newLayerInitilization(canvasImage);
        return canvasImage
    }

    newTextLayer(initialParameters: object = {}): CanvasText{
        let canvasText = new CanvasText(initialParameters, this);
        this.newLayerInitilization(canvasText);
        return canvasText;
    }

    newDateLayer(initialParameters: object = {}): CanvasDate {
        let canvasDate = new CanvasDate(initialParameters, this);
        this.newLayerInitilization(canvasDate);
        return canvasDate;
    }

    
    newLineLayer(initialParameters: object = {}): CanvasLine {
        let canvasShape = new CanvasLine(initialParameters, this);
        this.newLayerInitilization(canvasShape);
        return canvasShape;
    }

    newRectangleLayer(initialParameters: object = {}): CanvasRectangle {
        let canvasShape = new CanvasRectangle(initialParameters, this);
        this.newLayerInitilization(canvasShape);
        return canvasShape;
    }

    newSquareLayer(initialParameters: object = {}): CanvasSquare {
        let canvasShape = new CanvasSquare(initialParameters, this);
        this.newLayerInitilization(canvasShape);
        return canvasShape;
    }

    newCircleLayer(initialParameters: object = {}): CanvasCircle {
        let canvasShape = new CanvasCircle(initialParameters, this);
        this.newLayerInitilization(canvasShape);
        return canvasShape;
    }

    newRoundedRectangleLayer(initialParameters: object = {}): CanvasRoundedRectangle {
        let canvasShape = new CanvasRoundedRectangle(initialParameters, this);
        this.newLayerInitilization(canvasShape);
        return canvasShape;
    }

    newFormulaLayer(initialParameters: object = {}):Formula{
        let canavsFormula = new Formula(initialParameters, this);
        this.newLayerInitilization(canavsFormula);
        return canavsFormula;
    }

    newReultLayer(initialParameters: object = {}): Result{
        let result = new Result(initialParameters, this);
        this.newLayerInitilization(result);
        return result;
    }

    newTableLayer(initialParameters: object = {}): CanvasTable{
        let canavsTable = new CanvasTable(initialParameters, this);
        this.newLayerInitilization(canavsTable);
        return canavsTable;
    }

    newLayerInitilization(layer: Layer): void{
        this.layers.push(layer);
        let status = layer.drawOnCanvas(this.virtualContext, this.scheduleCanvasReDraw);
        if (status)
            this.context.drawImage(this.virtualCanvas, 0, 0);
        this.activeLayer = layer;
        this.activeLayerIndex = this.layers.length - 1;
    }

    

}

