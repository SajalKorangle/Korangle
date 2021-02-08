import {Component, OnInit, Inject} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
    selector: 'my-approval-requests',
    templateUrl: './my-approval-requests.component.html',
    styleUrls: ['./my-approval-requests.component.css'],
    
})




export class MyApprovalRequestsComponent implements OnInit {


    // @Input() user;
    // @Input() user;
    user: any;

    
    constructor( 
    ){ }
    // Server Handling - Initial
    ngOnInit(): void {
    }


}
