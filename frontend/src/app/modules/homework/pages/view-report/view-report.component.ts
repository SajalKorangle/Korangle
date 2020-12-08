import {Component, Input, OnInit} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.css'],
    providers: [
    ],
})

export class ViewReportComponent implements OnInit {

    // @Input() user;
    user: any;

    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }
}
