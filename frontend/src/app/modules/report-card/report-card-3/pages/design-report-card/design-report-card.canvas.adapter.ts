import { A4, CanvasImage } from './../../../class/constants_3';
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

    isSaved = false;    // if canvas is not saved then give warning; to be implemented

    constructor() {
    }

    initilizeAdapter(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.canvasWidth = canvas.width;
        this.canvasHeight = A4.getHeigthRelativeToA4(this.canvasWidth);  // Adjusting Height according to aspect ratio
        canvas.height = this.canvasHeight;

        this.canvas.addEventListener('resize', () => {  // Maintain aspect ratio on resize
            this.canvasWidth = canvas.width;
            this.canvasWidth = A4.getHeigthRelativeToA4(this.canvasWidth);
            canvas.width = this.canvasWidth;
        })
        console.log('Canvas Width X Height: ', this.canvasWidth, this.canvasHeight);
 
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

    drawAllLayers(): void {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);   // Applying background color

        for (let i = 0; i < this.layers.length; i++){
            setTimeout(() => this.layers[i].drawOnCanvas(this.context));
        }
    }

    applyDefaultbackground(): void{
        this.context.fillStyle = '#ffffff';
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.backgroundColor = '#ffffff';
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

    newImageLayer(base64Image: any): void{
        let canvasImage = new CanvasImage(base64Image, 0, 0, this.canvasHeight, this.canvasWidth);
        this.layers.push(canvasImage);
        setTimeout(() => canvasImage.drawOnCanvas(this.context));  // Putting in ast of event loop to wait for base64Image to load
        this.activeLayer = canvasImage;
        this.activeLayerIndex = this.layers.length - 1;
    }

    updateActiveLayer(activeLayerIndex:number): void{   // used by left layer pannel
        this.activeLayerIndex = activeLayerIndex;
        this.activeLayer = this.layers[this.activeLayerIndex];
    }

}

