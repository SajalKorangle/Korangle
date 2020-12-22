// import { DesignReportCardComponent } from './design-report-card.component';
import { A4 } from './../../../class/constants_3';
// Currently supports only a4 size

export class DesignReportCardCanvasAdapter {

    // vm: DesignReportCardComponent;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    canvasHeight: number;   // height and width are in pixels
    canvasWidth: number;    

    layers: [];  // layers in thier order from back to front
    background: object = {
        type: '',
        value: ''
    };

    isSaved = false;    // if canvas is not saved then give warning; to be implemented

    constructor(){}

    async initilizeAdapter(canvas: HTMLCanvasElement) {
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
 
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.background.type = 'color';
        this.background.value = 'white';
    }

    clearCanvas():void {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.layers = [];
        this.isSaved = false;
    }


}

