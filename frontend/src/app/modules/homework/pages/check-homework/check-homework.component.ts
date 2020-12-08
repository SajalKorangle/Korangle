import {Component, Input, OnInit} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'check-homework',
  templateUrl: './check-homework.component.html',
  styleUrls: ['./check-homework.component.css'],
    providers: [
    ],
})

export class CheckHomeworkComponent implements OnInit {

    // @Input() user;
    user: any;

    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }
}
