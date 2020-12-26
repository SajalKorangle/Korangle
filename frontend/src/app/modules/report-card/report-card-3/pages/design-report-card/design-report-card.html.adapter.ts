import { DesignReportCardComponent } from './design-report-card.component';
import { FIELDS, PARAMETER_LIST, DATA_SOUCE_TYPE, ParameterAsset } from './../../../class/constants_3';

export class DesignReportCardHtmlAdapter {

    fields: any = FIELDS;
    parameterList: any[] = [...PARAMETER_LIST];

    vm: DesignReportCardComponent;
    canvasMargin = 24;

    isSaving = false;
    isLoading = false;
    isFullScreen = false;

    activeLeftColumn: string = 'layers';

    constructor() {}

    // Data

    initializeAdapter(vm: DesignReportCardComponent): void {
        this.vm = vm;
    }

    canvasSetUp():void {
        let canvasWrapper = document.getElementById('canvasWrapper');
        let computedCavasWidth = canvasWrapper.getBoundingClientRect().width - 2*this.canvasMargin;
        this.vm.canvas.width = computedCavasWidth;
    }

    getFieldKeys(): any{
        return Object.keys(this.fields);
    }

    getFilteredParameterList(field: any): any[] {
        return this.parameterList.filter(item => {
            return item.field.fieldStructureKey === field.fieldStructureKey;
        });
    }

    addNewLayerForAsset(asset: ParameterAsset): void {
        this.vm.canvasAdapter.newLayerInitilization(new asset.layerType({ 'dataSourceType': 'DATA', 'source': asset }));   
    }

    fullScreenToggle(): void{
        let element = document.getElementById('drc-mainCard');
        if (this.isFullScreen) {
            element.classList.remove('fullScreen');
            document.getElementById('drc-wrapper').appendChild(element);
            if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen();
            }
            this.isFullScreen = false;
        } else{
            element.classList.add('fullScreen');
            document.body.appendChild(element);
            if(document.body.requestFullscreen)
                document.body.requestFullscreen();
            this.isFullScreen = true;
        }     
    }

}

