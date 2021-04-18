import { Component, OnInit, Input } from '@angular/core';
import { RemarkLayer } from '../../../class/constants_3';

@Component({
    selector: 'app-remark-parameters-pannel',
    templateUrl: './remark-parameters-pannel.component.html',
    styleUrls: ['./remark-parameters-pannel.component.css'],
})
export class RemarkParametersPannelComponent implements OnInit {
    @Input() layer: RemarkLayer;
    @Input() canvasRefresh: any;

    constructor() {}

    ngOnInit() {}
}
