import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Layer } from './../../class/constants_3';
import { DesignReportCardCanvasAdapter } from './../../pages/design-report-card/design-report-card.canvas.adapter';

@Component({
    selector: 'app-custom-menu',
    templateUrl: './custom-menu.component.html',
    styleUrls: ['./custom-menu.component.css'],
})
export class CustomMenuComponent implements OnInit, OnDestroy {
    @Input() top;
    @Input() left;

    @Input() ca: DesignReportCardCanvasAdapter;
    @Input() layer: Layer;
    @Input() layerIndexes;
    @Output() closeMenu = new EventEmitter<null>();

    constructor() {}

    ngOnInit() {
        document.addEventListener('mousedown', this.documentClickhandler);
    }

    ngOnDestroy() {
        document.removeEventListener('mousedown', this.documentClickhandler);
    }

    documentClickhandler = (event) => {
        this.closeMenu.emit();
    }

    menuClickHandler() {
        this.ca.scheduleCanvasReDraw(0);
    }

    deleteLayer(): void {
        // order of event propogation is : deleteLayer then menuClickhandler then documentClickhandler
        this.layerIndexes.forEach((i) => {
            delete this.ca.layers[i];
        });
        this.ca.layers = this.ca.layers.filter(Boolean);
        this.ca.activeLayer = null;
        this.ca.activeLayerIndexes = [];
    }

    duplicateLayer(): void {
        this.layerIndexes.forEach((i) => this.ca.duplicateLayer(this.ca.layers[i]));
    }

    replaceLayer(): void {
        this.ca.vm.htmlAdapter.openLayerReplacementDialog(this.layer);
    }
}
