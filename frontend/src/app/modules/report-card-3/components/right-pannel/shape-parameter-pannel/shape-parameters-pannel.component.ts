import { Component, OnInit, Input } from '@angular/core';
import { Layer } from '../../../class/constants_3';

@Component({
    selector: 'app-shape-parameters-pannel',
    templateUrl: './shape-parameters-pannel.component.html',
    styleUrls: ['./shape-parameters-pannel.component.css'],
})
export class ShapeParametersPannelComponent implements OnInit {
    @Input() layer: any;
    @Input() canvasRefresh: any;

    constructor() {}

    ngOnInit() {}

    getMeasurementInMM(measurement: any) {
        return Math.round(measurement * this.getPixelTommFactor() * 100) / 100;
    }

    getPixelTommFactor(): number {
        return this.layer.ca.pixelTommFactor;
    }

    formalLabelForSlider(value: number): string {
        return value * 100 + '%';
    }
}
