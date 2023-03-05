import { Component, Input, OnInit } from '@angular/core';
import { User } from '@classes/user';
import { GenericService } from '@services/generic/generic-service';

@Component({
    selector: 'manage-type',
    templateUrl: './manage_type.component.html',
    styleUrls: ['./manage_type.component.css'],
    providers: [GenericService],
})



export class ManageTypeComponent implements OnInit {

    @Input() user: User;
    
    leave_types: any;
    is_leaves_types_empty: boolean = false;
    ngOnInit() {
        this.genericService.getObjectList({leaves_app: 'LeaveTypes'}, {}).then((value) => {
            this.leave_types = value;
            if(!value.length) {
                this.is_leaves_types_empty = true;
            }
        });
    }
    constructor (private genericService: GenericService) { }
    addNewType($event): void {
        alert('Under Construction!');
    }
}
