import {Component, OnInit, Inject} from '@angular/core';

@Component({
    selector: 'grant-approval',
    templateUrl: './grant-approval.component.html',
    styleUrls: ['./grant-approval.component.css'],
    
})

export class GrantApprovalComponent implements OnInit {


    // @Input() user;
    user: any;

    
    constructor( 
    ){ }
    // Server Handling - Initial
    ngOnInit(): void {
    }


}
