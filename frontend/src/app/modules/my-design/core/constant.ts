import { STANDARD_PAGE_RESOLUTION_MAPPED_BY_NAME, PageResolution } from "./page-resolutions";

export const DEFAULT_BACKGROUND_COLOR = '#ffffff'; // white
export const DEFAULT_TEXT_COLOR = '#000000'; // black
export const ACTIVE_LAYER_HIGHLIGHTER_LINE_WIDTH = 2; // in pixels
export const ACTIVE_LAYER_HIGHLIGHTER_COLOR = 'cyan';
export const PERMISSIBLE_CLICK_ERROR = 4;    // in pixels
export const DEFAULT_IMAGE_URL = 'https://korangleplus.s3.amazonaws.com/assets/img/ef3f502028770e76bbeeeea68744c2c3.jpg';

export interface LAYOUT_INTERFACE{
    [key: string]: any;
    pageList: Array<{
        pageResolution: PageResolution,
        backgroundColor: string,
        layers: Array<{[key: string]: any}> // change this to LAYER TYPE Later
    }>;
}

export function getDefaultLayoutContent() {
    return {
        pageList: [{
            pageResolution: STANDARD_PAGE_RESOLUTION_MAPPED_BY_NAME.A4.getDataToSave(),
            backgroundColor: DEFAULT_BACKGROUND_COLOR,
            layers: []
        }]
    };
}