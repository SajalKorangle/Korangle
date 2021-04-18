import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
@Component({
    selector: 'group-hierarchy-list',
    templateUrl: './group-hierarchy-list.component.html',
    styleUrls: ['./group-hierarchy-list.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class GroupHierarchyListComponent implements OnInit {
    @Input() group;
    @Input() vm;
    @Input() displayCheckBox;

    constructor() {}

    ngOnInit(): void {}
}
