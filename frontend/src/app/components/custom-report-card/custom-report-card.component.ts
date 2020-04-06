import {Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'custom-report-card',
    templateUrl: './custom-report-card.component.html',
    styleUrls: ['./custom-report-card.component.css'],
    providers: [
    ],
})
export class CustomReportCardComponent implements OnInit {

    @Input() user;
    @Input() layout = {};

    ngOnInit(): void {

    }

}
