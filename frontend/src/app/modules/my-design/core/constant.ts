import { STANDARD_PAGE_RESOLUTION_MAPPED_BY_NAME, PageResolution } from "./page-resolutions";

export const DEFAULT_BACKGROUND_COLOR = '#ffffff'; // white

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