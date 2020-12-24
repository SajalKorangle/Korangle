// CANVAS DESIGN TOOL

export const permissibleClickError = 8;    // in pixels

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
    updatePosition(dx: number, dy: number): void;
    drawOnCanvas(ctx: CanvasRenderingContext2D): void;
    isClicked(mouseX: number, mouseY: number): boolean
};

export class CanvasImage implements Layer{  // Canvas Image Layer
    displayName: string = 'Image';
    LAYER_TYPE: string = 'IMAGE';   // Type description for JSON parsing
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
                console.log('from construct after image onload : x,y,width,height = ', this.x, this.y, this.width, this.heigth);
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

    updatePosition(dx = 0, dy = 0):void {
        this.x += dx;
        this.y += dy;
    }
    
    drawOnCanvas(ctx: CanvasRenderingContext2D):void {
        console.log('from draw on canvas after image onload : x,y,width,height = ', this.x, this.y, this.width, this.heigth);
        ctx.drawImage(this.image, this.x, this.y, this.width, this.heigth);
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