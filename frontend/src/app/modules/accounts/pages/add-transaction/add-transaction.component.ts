import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css'],
    
})

export class AddTransactionComponent implements OnInit {

    // @Input() user;
    user: any;

    
    constructor( 
    ){ }
    // Server Handling - Initial
    ngOnInit(): void {
    }

}