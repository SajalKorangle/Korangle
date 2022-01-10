import { Component, OnInit } from '@angular/core';
import { DataStorage } from "@classes/data-storage";

@Component({
    selector: 'app-send-new-message',
    templateUrl: './send-new-message.component.html',
    styleUrls: ['./send-new-message.component.css']
})
export class SendNewMessageComponent implements OnInit {
    user;
    
    constructor() { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);
    }

}
