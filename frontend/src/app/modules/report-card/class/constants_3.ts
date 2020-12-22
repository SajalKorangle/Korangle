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