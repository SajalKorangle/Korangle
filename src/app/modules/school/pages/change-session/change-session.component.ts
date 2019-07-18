import {Component, OnInit } from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'change-session',
  templateUrl: './change-session.component.html',
  styleUrls: ['./change-session.component.css'],
})

export class ChangeSessionComponent implements OnInit {

    user: any;

    isLoading = false;

    constructor () { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
    }
}
