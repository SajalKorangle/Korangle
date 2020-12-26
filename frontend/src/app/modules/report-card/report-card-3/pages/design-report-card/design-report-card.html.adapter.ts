import { DesignReportCardComponent } from './design-report-card.component';
import { FIELDS, PARAMETER_LIST } from './../../../class/constants_3';
import { CommonFunctions } from '@classes/common-functions.ts';

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

    fullScreenToggle(): void{
        this.isFullScreen = CommonFunctions.elementFullScreenToggle(document.getElementById('drc-mainCard'))
    }

}

