import { STANDARD_PAGE_RESOLUTION_MAPPED_BY_NAME, PageResolution } from "./page-resolutions";

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

// Types

export type CLASS = { new(...args: any[]): any; };
export type KEY_VALUE_TYPE = { [key: string | number]: any; };


// Constants
export const DEFAULT_BACKGROUND_COLOR = '#ffffff'; // white
export const DEFAULT_TEXT_COLOR = '#000000'; // black
export const ACTIVE_LAYER_HIGHLIGHTER_LINE_WIDTH = 2; // in pixels
export const ACTIVE_LAYER_HIGHLIGHTER_COLOR = 'cyan';
export const PERMISSIBLE_CLICK_ERROR = 4;    // in pixels

export const DATA_SOURCE_TYPE = {    // used in all canvas layers
    constant: 'N/A',  // no data source, constant element
    data: 'DATA'  // data source available, get data from the provided data source
};