import { Component, Input, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
@Component({
    selector: 'group-hierarchy-list',
    templateUrl: './group-hierarchy-list.component.html',
    styleUrls: ['./group-hierarchy-list.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class GroupHierarchyListComponent implements OnInit {

    @Input() element;
    @Input() vm;
    @Input() displayCheckBox;
    @Input() balanceName;
    @Output() customClick = new EventEmitter<any>();

    constructor (

    ) { }

    ngOnInit(): void {

    }

}
