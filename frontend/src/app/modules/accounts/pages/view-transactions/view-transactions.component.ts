import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'view-transactions',
  templateUrl: './view-transactions.component.html',
  styleUrls: ['./view-transactions.component.css'],
    
})

export class ViewTransactionsComponent implements OnInit {

    // @Input() user;
    user: any;

    
    constructor( 
    ){ }
    // Server Handling - Initial
    ngOnInit(): void {
    }

}