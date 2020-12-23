// import { DesignReportCardComponent } from './design-report-card.component';
import { A4, CanvasImage } from './../../../class/constants_3';
// Currently supports only a4 size

export class DesignReportCardCanvasAdapter {

    // vm: DesignReportCardComponent;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    canvasHeight: number;   // height and width are in pixels
    canvasWidth: number;    

    layers: Array<any>=[];  // layers in thier order from back to front
    backgroundColor: string = null;

    isSaved = false;    // if canvas is not saved then give warning; to be implemented

    constructor(){}

    initilizeAdapter(canvas: HTMLCanvasElement) {
        console.log('canvas inilitizer called')
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        console.log('mainCanvas: ', this.canvas);

        this.canvasWidth = canvas.width;
        this.canvasHeight = A4.getHeigthRelativeToA4InPixel(this.canvasWidth);
        canvas.height = this.canvasHeight;

        this.canvas.addEventListener('resize', () => {
            this.canvasWidth = canvas.width;
            this.canvasWidth = A4.getHeigthRelativeToA4InPixel(this.canvasWidth);
            canvas.width = this.canvasWidth;
        })
 
        this.applyDefaultbackground();
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
        this.isSaved = false;

        this.applyDefaultbackground();
    }

    newImageLayer(base64Image: any): void{
        let canvasImage = new CanvasImage(base64Image, 0, 0, this.canvasHeight, this.canvasWidth);
        this.layers.push(canvasImage);
        setTimeout(() => canvasImage.drawImageOnCanvas(this.context));  // Putting in ast of event loop to wait for base64Image to load
    }

}

