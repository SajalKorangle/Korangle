import { PAGE_RESOLUTIONS } from "./page-resolutions";

export const DEFAULT_BACKGROUND_COLOR = '#ffffff'; // white

export function getDefaultLayoutContent() {
    return {
        pageList: [{
            pageResolution: PAGE_RESOLUTIONS[1].getDataToSave(),
            backgroundColor: DEFAULT_BACKGROUND_COLOR,
            layers: []
        }]
    };
}