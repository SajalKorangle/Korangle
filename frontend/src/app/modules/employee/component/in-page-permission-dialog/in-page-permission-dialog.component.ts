import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InPagePermission, TASK_PERMISSION_LIST } from '@classes/task-settings';


@Component({
    selector: 'app-in-page-permission-dialog',
    templateUrl: './in-page-permission-dialog.component.html',
    styleUrls: ['./in-page-permission-dialog.component.css'],
})
export class InPagePermissionDialogComponent implements OnInit {

    inPagePermissionMappedByKey: { [key: string]: InPagePermission; };

    groupList: Array<string>;
    employeePermissionConfigJson: { [key: string]: any; } = {};

    constructor(public dialogRef: MatDialogRef<InPagePermissionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { [key: string]: any; }) {
        // this.vm = data.vm;
        // this.selectedLayout = data.selectedLayout;
        this.inPagePermissionMappedByKey = TASK_PERMISSION_LIST.find(
            taskPermissionStructure => taskPermissionStructure.modulePath == this.data.module.path && taskPermissionStructure.taskPath == this.data.task.path)
            .inPagePermissionMappedByKey;
        const groupSet: Set<string> = new Set();
        Object.values(this.inPagePermissionMappedByKey).forEach(inPagePermission => {
            if (inPagePermission.options.groupName) {
                groupSet.add(inPagePermission.options.groupName);
            }
        });
        this.groupList = Array.from(groupSet);
        if (Object.values(this.inPagePermissionMappedByKey).find(inPagePermission => inPagePermission.options.groupName == undefined))
            this.groupList.push(undefined);
        console.log("dialog: ", this);
    }

    ngOnInit() { }

    getGroupPermissionKeys(groupName): Array<string> {
        return Object.keys(this.inPagePermissionMappedByKey)
            .filter(permissionKey => this.inPagePermissionMappedByKey[permissionKey].options.groupName == groupName);
    }

    apply(): void {
        this.dialogRef.close({ employeePermissionConfigJson: this.employeePermissionConfigJson });
    }

}
