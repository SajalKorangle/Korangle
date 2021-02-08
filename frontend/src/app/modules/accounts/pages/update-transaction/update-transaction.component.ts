import {Component, Input, OnInit} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";


@Component({
  selector: 'update-transaction',
  templateUrl: './update-transaction.component.html',
  styleUrls: ['./update-transaction.component.css'],
})

export class UpdateTransactionComponent implements OnInit {

    // @Input() user;
     // @Input() user;
     user: any;

    
     constructor( 
     ){ }
     // Server Handling - Initial
     ngOnInit(): void {
     }
}
