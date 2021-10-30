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
    resolutionName: string;
    private _orientation: ORIENTATION;
    aspectRatio: number;    // width/height(actual, not orientation dependent)
    mm: {
        height: number;
        width: number;
    } = {
            height: 0,
            width: 0,
        };

    constructor(name: string, mmHeight: number, mmWidth: number, orientation: ORIENTATION  = 'p') {
        this.resolutionName = name;
        this.mm.height = mmHeight;
        this.mm.width = mmWidth;
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
        [this.mm.height, this.mm.width] = [this.mm.width, this.mm.height];  // toggle height and width
        this.aspectRatio = 1/this.aspectRatio;
    }

    getHeightInPixel(dpi: number): number {  // returns height in pixels given dpi as argument
        return (this.mm.height * dpi) / mm_IN_ONE_INCH;
    }

    getWidthInPixel(dpi: number): number {  // returns width in pixels given dpi as argument
        return (this.mm.width * dpi) / mm_IN_ONE_INCH;
    }

    getCorrespondingHeight(width: number): number { // returns height while maintaining aspect ratio
        return (width / this.aspectRatio);
    }

    getCorrespondingWidth(height: number): number {  // returns width while maintaining aspect ratio
        return (height * this.aspectRatio);
    }

    getDataToSave(): string {
        return JSON.stringify(this);
    }
}

export const PAGE_RESOLUTIONS: PageResolution[] = [ // standard page resolutions
    new PageResolution('A3', 420, 297),
    new PageResolution('A4', 297, 210),
    new PageResolution('A5', 210, 148),
    new PageResolution('A6', 148, 105),
];