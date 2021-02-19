import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';
import { AccountsService } from './../../../../services/modules/accounts/accounts.service'

@Component({
    selector: 'group-hierarchy',
    templateUrl: './group-hierarchy.component.html',
    styleUrls: ['./group-hierarchy.component.css'],
    providers: [ 
        AccountsService,
    ],
})

export class GroupHierarchyComponent implements OnInit {

    @Input() group;
    @Input() vm;
    @Input() sourcePage;

    constructor (
        public accountsService: AccountsService,
    ) { }

    ngOnInit(): void {
        console.log(this.group);

    }

    handleClick(element){
        if(this.sourcePage == 'Manage'){
            this.vm.openEditDialog(element);
        }
        else{
            this.vm.displayLedgerAccount(element);
        }
    }

    

}
