import { Component, OnInit, Input } from '@angular/core';
import { BaseLayer } from '@modules/my-design/core/layers/base';

@Component({
    selector: 'app-settings-panel',
    templateUrl: './settings-panel.component.html',
    styleUrls: ['./settings-panel.component.css'],
})
export class SettingsPanelComponent implements OnInit {
    @Input() layer: BaseLayer;

    constructor() {}

    ngOnInit() {}
}
