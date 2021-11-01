export const mm_IN_ONE_INCH: number = 24.5;
export const DPI_LIST: number[] = [ // standard DPIs
    50,
    72,
    100,
    150,
    200,
    250,
    300,
    400,
    500,
    600,
];

type ORIENTATION = 'p' | 'l';   // p: portrait, l:landscape

// Definition: Aspect Ratio = Width / Height

export class PageResolution {
    private _orientation: ORIENTATION;
    aspectRatio: number;    // width/height(actual, not orientation dependent)
    mmHeight: number;
    mmWidth: number;

    constructor(mmHeight: number, mmWidth: number, orientation: ORIENTATION  = 'p') {
        this.mmHeight = mmHeight;
        this.mmWidth = mmWidth;
        this._orientation = orientation;
        this.aspectRatio = mmWidth / mmHeight;
    }

    get orientation() {
        return this._orientation;
    }

    set orientation(orientation: ORIENTATION) {
        if(this._orientation == orientation) 
            return;
        this._orientation = orientation;
        [this.mmHeight, this.mmWidth] = [this.mmWidth, this.mmHeight];  // toggle height and width
        this.aspectRatio = 1/this.aspectRatio;
    }

    getHeightInPixel(dpi: number): number {  // returns height in pixels given dpi as argument
        return (this.mmHeight * dpi) / mm_IN_ONE_INCH;
    }

    getWidthInPixel(dpi: number): number {  // returns width in pixels given dpi as argument
        return (this.mmWidth * dpi) / mm_IN_ONE_INCH;
    }

    getCorrespondingHeight(width: number): number { // returns height while maintaining aspect ratio
        return (width / this.aspectRatio);
    }

    getCorrespondingWidth(height: number): number {  // returns width while maintaining aspect ratio
        return (height * this.aspectRatio);
    }

    getDataToSave() {
        const data = {
            mmHeight: this.mmHeight,
            mmWidth: this.mmWidth,
            orientation: this._orientation,
        };
        return data;
    }
}

export const STANDARD_PAGE_RESOLUTION_MAPPED_BY_NAME: {[key:string]: PageResolution} = {
    A3:  new PageResolution(420, 297),
    A4: new PageResolution(297, 210),
    A5: new PageResolution(210, 148),
    A6: new PageResolution(148, 105),
};