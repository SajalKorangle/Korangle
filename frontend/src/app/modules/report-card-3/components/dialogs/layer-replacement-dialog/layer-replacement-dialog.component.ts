import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Layer } from '../../../class/constants_3';
import { DesignReportCardCanvasAdapter } from '../../../pages/design-report-card/design-report-card.canvas.adapter';

@Component({
    selector: 'app-layer-replacement-dialog',
    templateUrl: './layer-replacement-dialog.component.html',
    styleUrls: ['./layer-replacement-dialog.component.css'],
})
export class LayerReplacementDialogComponent implements OnInit {
    ca: DesignReportCardCanvasAdapter;
    layer: Layer;
    parameterList: any[];
    selectedParameter: any;

    constructor(
        public dialogRef: MatDialogRef<LayerReplacementDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }
    ) {
        this.ca = data.ca;
        this.layer = data.layer;
        this.parameterList = this.ca.vm.htmlAdapter.parameterList.filter(
            (parameterAsset) => parameterAsset.layerType == this.layer.constructor
        );
    }

    ngOnInit() {}

    getFilteredParameterList(field: any): any[] {
        return this.parameterList.filter((item) => {
            return item.field.fieldStructureKey === field.fieldStructureKey;
        });
    }

    apply(): void {
        this.dialogRef.close(this.selectedParameter);
    }
}
