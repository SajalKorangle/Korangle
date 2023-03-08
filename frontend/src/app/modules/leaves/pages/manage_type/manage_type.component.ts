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
    // page variables
    colorCodes: string[] = [
        '#f9ebea', '#f2d7d5', '#e6b0aa', '#d98880', '#cd6155', '#c0392b', '#a93226', '#922b21', '#943126', '#78281f',
        '#f5eef8', '#ebdef0', '#d7bde2', '#c39bd3', '#af7ac5', '#9b59b6', '#884ea0', '#76448a', '#633974', '#512e5f',
        '#eaf2f8', '#d4e6f1', '#a9cce3', '#7fb3d5', '#5499c7', '#2980b9', '#2471a3', '#1f618d', '#1a5276', '#154360',
        '#e8f8f5', '#d1f2eb', '#a3e4d7', '#76d7c4', '#48c9b0', '#1abc9c', '#17a589', '#148f77', '#117864', '#0e6251',
        '#e9f7ef', '#d4efdf', '#a9dfbf', '#7dcea0', '#52be80', '#27ae60', '#229954', '#1e8449', '#196f3d', '#145a32',
        '#fef9e7', '#fcf3cf', '#f9e79f', '#f7dc6f', '#f4d03f', '#f1c40f', '#d4ac0d', '#b7950b', '#9a7d0a', '#7d6608',
        '#fdf2e9', '#fae5d3', '#f5cba7', '#f0b27a', '#eb984e', '#e67e22', '#ca6f1e', '#af601a', '#935116', '#784212',
        '#fdfefe', '#fbfcfc', '#f7f9f9', '#f4f6f7', '#f0f3f4', '#ecf0f1', '#d0d3d4', '#b3b6b7', '#979a9a', '#7b7d7d',
        '#f4f6f6', '#eaeded', '#d5dbdb', '#bfc9ca', '#aab7b8', '#95a5a6', '#839192', '#717d7e', '#5f6a6a', '#4d5656',
        '#ebedef', '#d6dbdf', '#aeb6bf', '#85929e', '#5d6d7e', '#34495e', '#2e4053', '#283747', '#212f3c', '#1b2631',
        '#eaecee', '#d5d8dc', '#abb2b9', '#808b96', '#566573', '#2c3e50', '#273746', '#212f3d', '#1c2833', '#17202a'
    ];
    leave_types: any;
    is_leaves_types_empty: boolean = false;
    is_form_visible : boolean = false;
    is_colorList_visible: boolean = false;
    // form items
    name: string = "";
    leaveType: number = -1;
    color: string = "";


    ngOnInit() {
        this.genericService.getObjectList({leaves_app: 'LeaveTypes'}, {}).then((value) => {
            this.leave_types = value;
            if (!value.length) {
                this.is_leaves_types_empty = true;
            }
        });
    }

    constructor (private genericService: GenericService) { }
    // handle Modal
    addNewType(event): void {
        this.is_form_visible = true;
        this.is_colorList_visible = false;
        this.name = "";
        this.leaveType = -1;
        this.color = "";
    }
    closeAddNewType(event) : void {
        this.is_form_visible = false;
        this.is_colorList_visible = false;
        this.name = "";
        this.leaveType = -1;
        this.color = "";
    }
    saveLeaveType(event) : void {
        alert('Under Construction!');
    }
    closeColorList(event): void {
        const classNames = event.target.className.split(' ');
        if (
            this.is_colorList_visible &&
            classNames[0] !== "colorSelector"
        ) {
            this.is_colorList_visible = false;
        }
    }
    updateColor(event, colorCode) : void {
        console.log(colorCode);
        this.color = colorCode;
        console.log(this.color);
        this.is_colorList_visible = !this.is_colorList_visible
    }

}
