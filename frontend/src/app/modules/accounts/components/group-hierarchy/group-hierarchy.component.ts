import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
    selector: 'group-hierarchy',
    templateUrl: './group-hierarchy.component.html',
    styleUrls: ['./group-hierarchy.component.css'],
    
})

export class GroupHierarchyComponent implements OnInit {

    @Input() group;
    @Input() vm;
    @Input() sourcePage;

    constructor (
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
