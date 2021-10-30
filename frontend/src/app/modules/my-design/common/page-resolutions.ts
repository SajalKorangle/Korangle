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

export class PageResolution {
    resolutionName: string;
    orientation: 'p' | 'l'; // p: potrait, l:landscape
    aspectRatio: number;    // width/height(actual, not orientation dependent)
    mm: {
        height: number;
        width: number;
    } = {
            height: 0,
            width: 0,
        };

    constructor(name: string, mmHeight: number, mmWidth: number, orientation: 'p' | 'l' = 'p') {
        this.resolutionName = name;
        this.mm.height = mmHeight;
        this.mm.width = mmWidth;
        this.orientation = orientation;
        this.aspectRatio = mmWidth / mmHeight;
    }

    getmmHeight(): number {
        if (this.orientation == 'p') {
            return this.mm.height;
        } else if (this.orientation = 'l') {
            return this.mm.width;
        }
        return -1;
    }

    getmmWidth(): number {
        if (this.orientation == 'p') {
            return this.mm.width;
        } else if (this.orientation = 'l') {
            return this.mm.height;
        }
        return -1;
    }

    getAspectRatio(): number {
        if (this.orientation == 'p') {
            return this.aspectRatio;
        } else if (this.orientation = 'l') {
            return 1 / this.aspectRatio;
        }
        return -1;
    }

    getHeightInPixel(dpi: number): number {  // returns height in pixels given dpi as argument
        if (this.orientation == 'p') {
            return (this.mm.height * dpi) / mm_IN_ONE_INCH;
        } else if (this.orientation = 'l') {
            return (this.mm.width * dpi) / mm_IN_ONE_INCH;
        }
        return -1;
    }

    getWidthInPixel(dpi: number): number {  // returns width in pixels given dpi as argument
        if (this.orientation == 'p') {
            return (this.mm.width * dpi) / mm_IN_ONE_INCH;
        } else if (this.orientation = 'l') {
            return (this.mm.height * dpi) / mm_IN_ONE_INCH;
        }
        return -1;
    }

    getCorrospondingHeight(width: number): number { // returns height while maintaining aspect ratio
        if (this.orientation == 'p') {
            return (width / this.aspectRatio);
        } else if (this.orientation = 'l') {
            return (width * this.aspectRatio);
        }
        return -1;
    }

    getCorrospondingWidth(height: number): number {  // returns width while maintaining aspect ratio
        if (this.orientation == 'p') {
            return (height * this.aspectRatio);
        } else if (this.orientation = 'l') {
            return (height / this.aspectRatio);
        }
        return -1;
    }
}

export const PAGE_RESOLUTIONS: PageResolution[] = [ // standard page resolutions
    new PageResolution('A3', 420, 297),
    new PageResolution('A4', 297, 210),
    new PageResolution('A5', 210, 148),
    new PageResolution('A6', 148, 105),
];