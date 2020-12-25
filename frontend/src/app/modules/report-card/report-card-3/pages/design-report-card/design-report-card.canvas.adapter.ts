import { A4, CanvasImage, PageRelativeAttributes, DEFAULT_BACKGROUND_COLOR } from './../../../class/constants_3';
// Currently supports only a4 size

export class DesignReportCardCanvasAdapter {

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    canvasHeight: number;   // height and width are in pixels
    canvasWidth: number;    

    layers: Array<any> = [];  // layers in thier order from back to front
    activeLayer = null;
    activeLayerIndex = null;
    backgroundColor: string = null;

    lastMouseX: number;
    lastMouseY: number;
    currentMouseDown: boolean = false;

    pixelTommFactor: number;
    isSaved = false;    // if canvas is not saved then give warning; to be implemented

    pendingReDrawId: any;

    constructor() {
    }

    initilizeAdapter(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.canvasWidth = canvas.width;
        this.canvasHeight = A4.getHeightRelativeToA4(this.canvasWidth);  // Adjusting Height according to aspect ratio
        canvas.height = this.canvasHeight;
        this.pixelTommFactor = A4.A4Resolution.mm.width / this.canvasWidth; 

        this.canvas.addEventListener('resize', () => {  // Maintain aspect ratio on resize
            this.canvasWidth = canvas.width;
            this.canvasHeight = A4.getHeightRelativeToA4(this.canvasWidth);
            canvas.height = this.canvasHeight;
            this.pixelTommFactor = A4.A4Resolution.mm.width / this.canvasWidth; 
            // Check if we need to do some more work wrt layers here
        })
 
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
                console.log('Layer position: ', this.layers[i].x, this.layers[i].y);
                console.log('Layer width and height: ', this.layers[i].width, this.layers[i].height);
                console.log(this.layers[i].isClicked(clickedX, clickedY))
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
                
                    let newLayerFromLayerData;
                    switch (layerData.LAYER_TYPE) {
                        case 'IMAGE':
                            newLayerFromLayerData = Object.assign(new CanvasImage, layerData);
                            break;
                    }
                    this.layers.push(newLayerFromLayerData);
                    newLayerFromLayerData.layerSetUp(this.canvasWidth, this.canvasHeight);
                } else {
                    this.layers.push(null);
                }
            }
            this.drawAllLayers();
            console.log('canvas layers: ', this.layers);
        } catch (err) {
            console.log(err);
            alert('data corupted');
            clearTimeout(this.pendingReDrawId);
        }
    }

    drawAllLayers(): void {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);   // Applying background color

        for (let i = 0; i < this.layers.length; i++){
            if (!this.layers[i])
                continue;
            let status = this.layers[i].drawOnCanvas(this.context, this.scheduleCanvasReDraw);    // check for redundant iterations
            if (!status)
                break;
        }
    }

    scheduleCanvasReDraw = (duration:number =500)=>{
        clearTimeout(this.pendingReDrawId);
        this.pendingReDrawId = setTimeout(() => this.drawAllLayers(), duration);
    }

    applyDefaultbackground(): void{
        this.context.fillStyle = DEFAULT_BACKGROUND_COLOR;
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.backgroundColor = DEFAULT_BACKGROUND_COLOR;
    }

    applyBackground(bgColor: string): void{
        this.context.fillStyle = bgColor;
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.backgroundColor = bgColor;
    }

    clearCanvas():void {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.layers = [];
        this.currentMouseDown = false;
        this.isSaved = false;

        this.applyDefaultbackground();
    }

    newImageLayer(uri: string): void{
        let canvasImage = new CanvasImage(uri, 0, 0);
        canvasImage.layerSetUp(this.canvasHeight, this.canvasWidth);
        this.layers.push(canvasImage);
        canvasImage.drawOnCanvas(this.context, this.scheduleCanvasReDraw);  // Putting in ast of event loop to wait for base64Image to load
        this.activeLayer = canvasImage;
        this.activeLayerIndex = this.layers.length - 1;
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
                layers[i] = null;
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

}

