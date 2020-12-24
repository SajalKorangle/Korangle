// CANVAS DESIGN TOOL

export const permissibleClickError = 8;    // in pixels

export const PageRelativeAttributes = [
    'x',
    'y',
    'width',
    'height'
];

export class A4{
    static aspectRatio = 210 / 297;
    static A4Resolution = {
        mm: {
            height: 297,
            width: 210
        }
    }

    static getHeigthRelativeToA4(width: number): number{
        return width/this.aspectRatio;
    }

    static getWidthRelativeToA4(heigth: number): number{
        return this.aspectRatio*heigth;
    }
};

Object.seal(A4);    // Making these objects immutable
Object.seal(A4.A4Resolution);
Object.seal(A4.A4Resolution.mm);

// To be implemented by all Canvas Layers
interface Layer{
    displayName: string;
    LAYER_TYPE: string;
    x: number;
    y: number;
    layerSetUp(canvasWidth:number, canvasHeight: number): void;
    updatePosition(dx: number, dy: number): void;
    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean;
    isClicked(mouseX: number, mouseY: number): boolean
};

export class CanvasImage implements Layer{  // Canvas Image Layer
    displayName: string = 'Image';
    LAYER_TYPE: string = 'IMAGE';   // Type description for JSON parsing
    image: HTMLImageElement;    // not included in content json data
    uri: string;
    x: number;
    y: number;
    heigth: number = null;
    width: number = null;
    aspectRatio: any = null;    // not included in content json data
    maintainAspectRatio = true; // not included in content json data

    constructor(uri: any, x: number, y: number) {
        this.image = new Image();
        console.log(uri);
        this.uri = uri;
        this.x = x;
        this.y = y;
    }

    layerSetUp(canvasWidth: number, canvasHeight: number): void{
        if (!this.heigth && !this.width) {
            this.image.onload = () => {
                this.heigth = this.image.height;
                this.width = this.image.width;
                this.aspectRatio = this.width / this.heigth;

                if (canvasHeight && this.heigth > canvasHeight) {
                    this.heigth = canvasHeight;
                    this.width = this.aspectRatio * this.heigth;    // maintaining aspect ratio
                }
                if (canvasWidth && this.width > canvasWidth) {
                    this.width = canvasWidth;
                    this.heigth = this.width / this.aspectRatio;    // maintaining aspect ratio
                }
            }
        }
        this.image.src = this.uri;
    }

    updateHeight(newHeight: number) {
        this.heigth = newHeight;
        if (this.maintainAspectRatio)
            this.width = this.aspectRatio * this.heigth;
    }

    updateWidthh(newWidth: number) {
        this.width = newWidth;
        if (this.maintainAspectRatio)
            this.heigth = this.width / this.aspectRatio; 
    }

    updatePosition(dx = 0, dy = 0):void {
        this.x += dx;
        this.y += dy;
    }
    
    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        if (this.image.complete && this.image.naturalHeight > 0) {
            setTimeout(()=>ctx.drawImage(this.image, this.x, this.y, this.width, this.heigth));
            return true;    // Drawn successfully on canvas
        }
        scheduleReDraw();
        return false;   // Canvas Drawing failed, scheduled redraw for later
    }

    isClicked(mouseX: number, mouseY: number): boolean {
        return (mouseX > this.x - permissibleClickError
            && mouseX < this.x + this.width + permissibleClickError
            && mouseY > this.y - permissibleClickError
            && mouseY < this.y+this.heigth+permissibleClickError)
    }
}

export const LAYER_TYPES = {
    'IMAGE': CanvasImage
};










// BUSINESS

// Note: The fieldStructureKey values will be saved in database
// so you can not change fieldStructureKey values at a later stage.

class FieldStructure {

    static getStructure(displayFieldName: any, fieldStructureKey: any): any {
        return {
            displayFieldName: displayFieldName,
            fieldStructureKey: fieldStructureKey,
        }
    }

}

// Different field types have different way of getting their values
export const FIELDS = {
    STUDENT: FieldStructure.getStructure('Student', 'student'),
    STUDENT_SESSION: FieldStructure.getStructure('Student Session', 'student_session'),
    STUDENT_CUSTOM: FieldStructure.getStructure('Student Custom', 'student_custom'),
    SCHOOL: FieldStructure.getStructure('School', 'school'),
    CONSTANT: FieldStructure.getStructure('Constant', 'constant'),
    EXAMINATION: FieldStructure.getStructure('Examination', 'examination'),
    ATTENDANCE: FieldStructure.getStructure('Attendance', 'attendance'),
};