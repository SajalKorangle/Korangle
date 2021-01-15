import { DesignReportCardComponent } from './design-report-card.component';

import {
    PageRelativeAttributes,
    DEFAULT_BACKGROUND_COLOR,
    Layer, CanvasImage, CanvasText,
    CanvasDate,
    Formula,
    PageResolution,
    PAGE_RESOLUTIONS,
    Result,
    CanvasLine,
    CanvasRectangle,
    CanvasSquare,
} from './../../../class/constants_3';

import * as jsPDF from 'jspdf'


export class DesignReportCardCanvasAdapter {

    vm: DesignReportCardComponent;

    virtualCanvas: HTMLCanvasElement;
    virtualContext: CanvasRenderingContext2D;

    actualresolution: PageResolution = PAGE_RESOLUTIONS[1] // A4 size by default
    dpi: number = 300;

    canvas: HTMLCanvasElement;  // html canvas rendered on screen
    context: CanvasRenderingContext2D;
    canvasHeight: number = null;   // current height and width are in pixels
    canvasWidth: number = null;    

    layers: Array<Layer> = [];  // layers in thier order from back to front
    activeLayer = null;
    activeLayerIndex = null;
    backgroundColor: string = null;

    lastMouseX: number;
    lastMouseY: number;
    currentMouseDown: boolean = false;

    pixelTommFactor: number;    // width(height) in mm / Canvas width(height) in pixel
    isSaved = false;    // if canvas is not saved then give warning; to be implemented

    virtualPendingReDrawId: any;
    pendingReDrawId: any;
    shape: any;

    constructor() {
    }

    func():any{
        console.log(this.shape);
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

        console.log('virtual canvas : ', this.virtualCanvas);
        console.log('virtual context: ', this.virtualContext);
 
        this.applyDefaultbackground();

        this.canvas.addEventListener('mousedown', (event) => {
            let clickedX, clickedY;
            clickedX = event.offsetX;
            clickedY = event.offsetY;
            console.log('clicked point: ', clickedX, clickedY);

            this.activeLayer = null;
            this.activeLayerIndex = null;
            this.currentMouseDown = false;

            for (let i = this.layers.length - 1; i >= 0; i--) {
                if (this.layers[i].isClicked(clickedX, clickedY)) {
                    this.activeLayer = this.layers[i];
                    this.activeLayerIndex = i;
                    this.lastMouseX = clickedX;
                    this.lastMouseY = clickedY;
                    this.currentMouseDown = true;
                    break;
                }
            }
        });

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
        this.canvas.width = this.canvas.width + 30;
        this.canvas.height = this.canvas.height + 30;
        this.canvasSizing();
    }
    decreaseCanvasSize():any{
        this.canvas.width = this.canvas.width - 30;
        this.canvas.height = this.canvas.height - 30;
        this.canvasSizing();
        console.log(this.canvas.height, this.canvas.width);
        
    }

    maximumCanvasSize():boolean{
        if(this.canvas.height> 850 || this.canvas.width > 650){
            return true;
        }
        return false;
    }

    minimumCanvasSize():boolean{
        if(this.canvas.height < 100 || this.canvas.width < 100){
            return true;
        }
        return false;
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
        console.log('canvas sizing called; previous width ', canvasPreviousWidth, 'currentHeight: ', this.canvasHeight)
    }

    loadData(Data): void{   // handle this method
        try {
            this.backgroundColor = Data.backgroundColor;
            for (let i = 0; i < Data.layers.length; i++) {
                let layerData = { ...Data.layers[i] };
            
                Object.keys(layerData).forEach(key => { // conversion from mm to pixels
                    if (key in PageRelativeAttributes)
                        layerData['key'] = layerData['key'] / this.pixelTommFactor;
                });
            
                let newLayerFromLayerData: Layer;   // update this for new architecture
                switch (layerData.LAYER_TYPE) {
                    case 'IMAGE':
                        newLayerFromLayerData = new CanvasImage(layerData, this);
                        break;
                }
                this.layers.push(newLayerFromLayerData);
            }
            this.drawAllLayers();
            console.log('canvas layers: ', this.layers);
        } catch (err) {
            console.log(err);
            alert('data corupted');
            clearTimeout(this.virtualPendingReDrawId);
        }
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

    scheduleCanvasReDraw = (duration: number = 500, successCallback: any = () => { })=>{
        clearTimeout(this.virtualPendingReDrawId);
        this.virtualPendingReDrawId = setTimeout(() => {
            this.drawAllLayers();
            successCallback();
        }, duration);
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
        this.virtualContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.layers = [];
        this.currentMouseDown = false;
        this.isSaved = false;

        this.applyDefaultbackground();
    }

    updateActiveLayer(activeLayerIndex:number): void{   // used by left layer pannel
        this.activeLayerIndex = activeLayerIndex;
        this.activeLayer = this.layers[this.activeLayerIndex];
    }

    getDataToSave() {   // updating required
        let layers = [];
        for (let i = 0; i < this.layers.length; i++){    // Copying all layer objects
            if (this.layers[i])
                layers[i] = this.layers[i].getDataToSave();
            else
                layers[i] = null;   // optimization scope: a better approach is not to store this nulls in db
        }
        layers.forEach(layer => {   // Converting pixels to mm
            if (layers) {
                Object.keys(layer).forEach(key => {
                    if (key in PageRelativeAttributes)
                        layer['key'] = this.pixelTommFactor * layer['key'];
                });
            }
        })
        return {
            backgroundColor: this.backgroundColor,
            layers: layers
        };
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

    newImageLayer(initialParameters: object): CanvasImage{
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

    newLayerInitilization(layer: Layer): void{
        this.layers.push(layer);
        let status = layer.drawOnCanvas(this.virtualContext, this.scheduleCanvasReDraw);
        if (status)
            this.context.drawImage(this.virtualCanvas, 0, 0);
        this.activeLayer = layer;
        this.activeLayerIndex = this.layers.length - 1;
    }

    

}

