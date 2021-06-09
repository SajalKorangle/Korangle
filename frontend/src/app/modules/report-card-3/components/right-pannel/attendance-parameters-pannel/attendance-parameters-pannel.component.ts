import { Component, OnInit, Input } from '@angular/core';
import { Layer } from '../../../class/constants_3';

@Component({
    selector: 'app-attendance-parameters-pannel',
    templateUrl: './attendance-parameters-pannel.component.html',
    styleUrls: ['./attendance-parameters-pannel.component.css'],
})
export class AttendanceParametersPannelComponent implements OnInit {
    @Input() layer: Layer;
    @Input() canvasRefresh: any;

    constructor() {}

    ngOnInit() {}

    toDate(dateString: string): Date {
        return new Date(dateString);
    }
}
