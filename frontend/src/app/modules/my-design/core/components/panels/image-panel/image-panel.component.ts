import { Component, OnInit, Input } from '@angular/core';
import { CanvasImage } from '@modules/my-design/core/layers/CanvasImage';

@Component({
    selector: 'app-image-panel',
    templateUrl: './image-panel.component.html',
    styleUrls: ['./image-panel.component.css'],
})
export class ImagePanelComponent implements OnInit {
    @Input() layer: CanvasImage;

    constructor() { }

    ngOnInit() { }

    getPixelToMmFactor(): number {
        return this.layer.ca.pixelToMmFactor;
    }

    getMeasurementInMm(measurement: number) {
        return Math.round(measurement * this.getPixelToMmFactor() * 100) / 100;
    }

    getMeasurementInPx(measurement: number) {
        return measurement / this.getPixelToMmFactor();
    }

    updateStrokeColor(colorValue: any){
        this.layer.borderStyle = {...this.layer.borderStyle, strokeStyle: colorValue};
    }
}
