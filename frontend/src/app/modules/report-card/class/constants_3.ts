import { isUndefined } from "lodash";

export class A4{
    static A4Resolution = {
        pixels: {
            width: 2480,
            height: 3508
        },
        mm: {
            height: 297,
            width: 210
        }
    }

    static getHeigthRelativeToA4InPixel(width: number): number{
        return (this.A4Resolution.pixels.height * width) / this.A4Resolution.pixels.width;
    }

    static getWidthRelativeToA4InPixel(heigth: number): number{
        return (this.A4Resolution.pixels.width * heigth) / this.A4Resolution.pixels.height;
    }
};


// Canvas Layers
export class CanvasImage{
    image: HTMLImageElement;
    x: number;
    y: number;
    heigth: number = null;
    width: number = null;
    aspectRatio: any = null;
    maintainAspectRatio = true;

    constructor(base64Image: any, x: number, y: number, initialMaxHeight: number = undefined, initialMaxWidth: number = undefined) {
        this.image = new Image();
        if (initialMaxHeight || initialMaxWidth)
            this.image.onload = () => {
                this.heigth = this.image.height;
                this.width = this.image.width;
                this.aspectRatio = this.width / this.heigth;

                if (initialMaxHeight && this.heigth > initialMaxHeight) {
                    this.heigth = initialMaxHeight;
                    this.width = Math.floor(this.aspectRatio * this.heigth);    // maintaining aspect ratio
                }
                if (initialMaxWidth && this.width > initialMaxWidth) {
                    this.width = initialMaxWidth;
                    this.heigth = Math.floor(this.width / this.aspectRatio);    // maintaining aspect ratio
                }
            }
        this.image.src = base64Image;
        this.x = x;
        this.y = y;
    }

    updateHeight(newHeight: number) {
        this.heigth = newHeight;
        if (this.maintainAspectRatio)
            this.width = Math.floor(this.aspectRatio * this.heigth);
    }

    updateWidthh(newWidth: number) {
        this.width = newWidth;
        if (this.maintainAspectRatio)
            this.heigth = Math.floor(this.width / this.aspectRatio); 
    }
    
    drawImageOnCanvas(ctx: CanvasRenderingContext2D) {
        if (this.heigth && this.width)
            ctx.drawImage(this.image, this.x, this.y, this.width, this.heigth);
        else
            ctx.drawImage(this.image, this.x, this.y);
    }
}