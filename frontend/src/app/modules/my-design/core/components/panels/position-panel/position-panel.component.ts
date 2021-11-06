import { Component, OnInit, Input } from '@angular/core';
import { BaseLayer } from '@modules/my-design/core/layers/base';

@Component({
    selector: 'app-position-panel',
    templateUrl: './position-panel.component.html',
    styleUrls: ['./position-panel.component.css'],
})
export class PositionPanelComponent implements OnInit {
    @Input() layer: BaseLayer;

    constructor() {}

    ngOnInit() {}

    getPixelToMmFactor(): number {
        return this.layer.ca.pixelToMmFactor;
    }

    getYCoordinate(): number {
        return Math.round(this.layer.y * this.getPixelToMmFactor() * 100) / 100;
    }

    getXCoordinate(): number {
        return Math.round(this.layer.x * this.getPixelToMmFactor() * 100) / 100;
    }

    lockToggle(event): any {
        this.layer.isPositionLocked = event.source.checked ? true : false;
    }
}
