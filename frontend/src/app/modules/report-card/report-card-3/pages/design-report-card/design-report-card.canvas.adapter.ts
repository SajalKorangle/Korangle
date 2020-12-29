// Currently supports only a4 size
import { DesignReportCardComponent } from './design-report-card.component';
import { A4, PageRelativeAttributes, DEFAULT_BACKGROUND_COLOR, CanvasImage, CanvasText, Layer } from './../../../class/constants_3';
import * as jsPDF from 'jspdf'
export class DesignReportCardCanvasAdapter {

    vm: DesignReportCardComponent;

    virtualCanvas: HTMLCanvasElement;
    virtualContext: CanvasRenderingContext2D;

    canvas: HTMLCanvasElement;  // html canvas rendered on screen
    context: CanvasRenderingContext2D;
    canvasHeight: number = null;   // height and width are in pixels
    canvasWidth: number = null;    

    layers: Array<Layer> = [];  // layers in thier order from back to front
    activeLayer = null;
    activeLayerIndex = null;
    backgroundColor: string = null;

    lastMouseX: number;
    lastMouseY: number;
    currentMouseDown: boolean = false;

    pixelTommFactor: number;
    isSaved = false;    // if canvas is not saved then give warning; to be implemented

    virtualPendingReDrawId: any;
    pendingReDrawId: any;

    constructor() {
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

    canvasSizing(): void{
        let canvasPreviousWidth = this.canvasWidth;
        if (this.canvas.width / this.canvas.height > A4.aspectRatio) {
            this.canvasHeight = this.canvas.height;
            this.canvasWidth = A4.getWidthRelativeToA4(this.canvasHeight);
            this.canvas.width = this.canvasWidth;
        }
        else {
            this.canvasWidth = this.canvas.width;
            this.canvasHeight = A4.getHeightRelativeToA4(this.canvasWidth);
            this.canvas.height = this.canvasHeight;
        }

        this.pixelTommFactor = A4.A4Resolution.mm.width / this.canvasWidth;
        
        this.virtualCanvas.height = this.canvasHeight;
        this.virtualCanvas.width = this.canvasWidth;

        if (canvasPreviousWidth) {
            let scaleFactor = this.canvasWidth / canvasPreviousWidth;
            this.layers.forEach((layer: Layer) => layer.scale(scaleFactor));
            this.scheduleCanvasReDraw(0);
        }
    }

    loadData(Data): void{
        try {
            this.backgroundColor = Data.backgroundColor;
            for (let i = 0; i < Data.layers.length; i++) {
                if (Data.layers[i]) {
                    let layerData = { ...Data.layers[i] };
                
                    Object.keys(layerData).forEach(key => { // conversion from mm to pixels
                        if (key in PageRelativeAttributes)
                            layerData['key'] = layerData['key'] / this.pixelTommFactor;
                    });
                
                    let newLayerFromLayerData: Layer;   // update this for new architecture
                    switch (layerData.LAYER_TYPE) {
                        case 'IMAGE':
                            newLayerFromLayerData = new CanvasImage(layerData);
                            break;
                    }
                    this.layers.push(newLayerFromLayerData);
                    newLayerFromLayerData.layerSetUp(this.vm.DATA, this.canvasWidth, this.canvasHeight, this.virtualContext);  // change empty object first arg to DATA object
                } else {
                    this.layers.push(null);
                }
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
        this.pendingReDrawId = setTimeout(()=>this.context.drawImage(this.virtualCanvas, 0, 0));
    }

    scheduleCanvasReDraw = (duration:number =500)=>{
        clearTimeout(this.virtualPendingReDrawId);
        this.virtualPendingReDrawId = setTimeout(() => this.drawAllLayers(), duration);
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

    getDataToSave() {
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

    downloadPDF() {
        let doc = new jsPDF();
        doc.addImage(this.virtualCanvas.toDataURL(), 'PNG', 0, 0);
        doc.save(this.vm.currentLayout.name + '.pdf');
    }

    newImageLayer(initialParameters: object): void{
        let canvasImage = new CanvasImage(initialParameters);
        canvasImage.layerSetUp({}, this.canvasHeight, this.canvasWidth, this.virtualContext);    // Update {} to DATA
        this.layers.push(canvasImage);
        let status = canvasImage.drawOnCanvas(this.virtualContext, this.scheduleCanvasReDraw);  // Putting in ast of event loop to wait for base64Image to load
        if (status)
            setTimeout(() => this.context.drawImage(this.virtualCanvas, 0, 0));
        this.activeLayer = canvasImage;
        this.activeLayerIndex = this.layers.length - 1;
    }

    newTextLayer(initialParameters: object = {}): void{
        let canvasText = new CanvasText(initialParameters);
        canvasText.layerSetUp(this.vm.DATA, this.canvasHeight, this.canvasWidth, this.virtualContext);
        this.layers.push(canvasText);
        let status = canvasText.drawOnCanvas(this.virtualContext, this.scheduleCanvasReDraw);
        if (status)
            setTimeout(() => this.context.drawImage(this.virtualCanvas, 0, 0));
        this.activeLayer = canvasText;
        this.activeLayerIndex = this.layers.length - 1;
    }

    newLayerInitilization(layer: Layer): void{
        layer.layerSetUp(this.vm.DATA, this.canvasHeight, this.canvasWidth, this.virtualContext)
        this.layers.push(layer);
        let status = layer.drawOnCanvas(this.virtualContext, this.scheduleCanvasReDraw);
        if (status)
            setTimeout(() => this.context.drawImage(this.virtualCanvas, 0, 0));
        this.activeLayer = layer;
        this.activeLayerIndex = this.layers.length - 1;
    }

}

