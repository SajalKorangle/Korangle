import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskPermissionStructure, TASK_PERMISSION_LIST } from '@classes/task-settings';


@Component({
    selector: 'app-in-page-permission-dialog',
    templateUrl: './in-page-permission-dialog.component.html',
    styleUrls: ['./in-page-permission-dialog.component.css'],
})
export class InPagePermissionDialogComponent implements OnInit {

    taskPermissionStructure: TaskPermissionStructure;

    constructor(public dialogRef: MatDialogRef<InPagePermissionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { [key: string]: any; }) {
        // this.vm = data.vm;
        // this.selectedLayout = data.selectedLayout;
        this.taskPermissionStructure = TASK_PERMISSION_LIST.find(taskPermissionStructure => taskPermissionStructure.modulePath == this.data.module.path && taskPermissionStructure.taskPath == this.data.task.path);
        console.log('this.taskPermissionS', this.taskPermissionStructure);
        console.log("All task Perm: ", TASK_PERMISSION_LIST);
    }

    ngOnInit() { }

    getPermissionKeys(): Array<string> {
        return Object.keys(this.taskPermissionStructure.permissionStructureMappedByKey);
    }

    apply(): void {
        // if (this.isMyLayout() || this.selectedLayout == this.vm.ADD_LAYOUT_STRING) {
        //     this.dialogRef.close({ layout: this.selectedLayout, copy: false });
        // } else {
        //     this.copyAndApply();
        // }
    }

    // copyAndApply(): void {
    //     this.dialogRef.close({ layout: this.selectedLayout, copy: true });
    // }
}
