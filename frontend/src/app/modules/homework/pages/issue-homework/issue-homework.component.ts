import {Component, Input, OnInit} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'issue-homework',
  templateUrl: './issue-homework.component.html',
  styleUrls: ['./issue-homework.component.css'],
    providers: [
    ],
})

export class IssueHomeworkComponent implements OnInit {

    // @Input() user;
    user: any;

    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }
}
