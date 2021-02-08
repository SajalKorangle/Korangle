import {Component, OnInit, Inject} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
    selector: 'view-balance',
    templateUrl: './view-balance.component.html',
    styleUrls: ['./view-balance.component.css'],
   
})

export class ViewBalanceComponent implements OnInit {


    // @Input() user;
    user: any;

    
    constructor( 
    ){ }
    // Server Handling - Initial
    ngOnInit(): void {
    }


}
