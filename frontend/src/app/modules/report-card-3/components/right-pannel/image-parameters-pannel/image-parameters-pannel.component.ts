import { Component, OnInit, Input } from '@angular/core';
import { CanvasImage } from '../../../class/constants_3';

@Component({
    selector: 'app-image-parameters-pannel',
    templateUrl: './image-parameters-pannel.component.html',
    styleUrls: ['./image-parameters-pannel.component.css'],
})
export class ImageParametersPannelComponent implements OnInit {
    @Input() layer: CanvasImage;
    @Input() canvasRefresh: any;

    constructor() {}

    ngOnInit() {}

    getPixelTommFactor(): number {
        return this.layer.ca.pixelTommFactor;
    }

    getMeasurementInMM(measurement: any) {
        return Math.round(measurement * this.getPixelTommFactor() * 100) / 100;
    }
}
