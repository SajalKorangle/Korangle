import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InPagePermission, TASK_PERMISSION_LIST } from '@modules/common/in-page-permission';
import { CommonFunctions } from '@classes/common-functions';

@Component({
    selector: 'app-in-page-permission-dialog',
    templateUrl: './in-page-permission-dialog.component.html',
    styleUrls: ['./in-page-permission-dialog.component.css'],
})
export class InPagePermissionDialogComponent implements OnInit {

    inPagePermissionMappedByKey: { [key: string]: any; };   // Storing inPagePermission key value pair

    groupList: Array<string>;
    employeePermissionConfigJson: { [key: string]: any; } = {};
    // Using employeePermissionConfigJsonCopy variable to store data locally,
    // employeePermissionConfigJson will be stored in database only after clicking on apply button
    employeePermissionConfigJsonCopy: { [key: string]: any; } = {};

    isMobile = CommonFunctions.getInstance().isMobileMenu;

    constructor(public dialogRef: MatDialogRef<InPagePermissionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { [key: string]: any; }) {
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
        this.groupList.sort((a, b) => a.localeCompare(b));
        if (Object.values(this.inPagePermissionMappedByKey).find(inPagePermission => inPagePermission.options.groupName == undefined))
            this.groupList.push(undefined);
        if (data.existingPermission && data.existingPermission.configJSON) {
            this.employeePermissionConfigJson = data.existingPermission.configJSON;
            this.employeePermissionConfigJsonCopy = data.existingPermission.configJSON;
        }
    }

    ngOnInit() { }

    getGroupPermissionKeys(groupName): Array<string> {
        return Object.keys(this.inPagePermissionMappedByKey)
            .filter(permissionKey => this.inPagePermissionMappedByKey[permissionKey].options.groupName == groupName);
    }

    apply(): void {
        this.employeePermissionConfigJson = Object.assign({}, this.employeePermissionConfigJsonCopy);
        this.dialogRef.close({ employeePermissionConfigJson: this.employeePermissionConfigJson });
    }

    // Functions for inputType = 'groupOfCheckBox' only: STARTS
    intialize(permissionKey): any {
        if (!(permissionKey in this.employeePermissionConfigJson)) {
            this.employeePermissionConfigJson[permissionKey] = {};
            this.employeePermissionConfigJsonCopy[permissionKey] = {};
        }
        this.inPagePermissionMappedByKey[permissionKey].checkBoxValues.forEach(value => {
            if (!(value[0] in this.employeePermissionConfigJson[permissionKey])) {
                this.employeePermissionConfigJson[permissionKey][value[0]] = false;
                this.employeePermissionConfigJsonCopy[permissionKey][value[0]] = false;
            }
        });
        return true;
    }

    isSelectRemoveAllButtonAvailable(permissionKey, groupName): Boolean {
        let permissionKeyList = this.getGroupPermissionKeys(groupName);
        if (permissionKeyList[0] == permissionKey && this.inPagePermissionMappedByKey[permissionKey].inputType === 'groupOfCheckBox') {
            return true;
        }
        return false;
    }

    selectAllCheckBox(groupName): void {
        let permissionKeyList = this.getGroupPermissionKeys(groupName);
        permissionKeyList.forEach(permissionKey => {
            if (this.inPagePermissionMappedByKey[permissionKey].inputType === 'groupOfCheckBox') {
                this.inPagePermissionMappedByKey[permissionKey].checkBoxValues.forEach(checkBoxValue => {
                    this.employeePermissionConfigJson[permissionKey][checkBoxValue[0]] = true;
                    this.employeePermissionConfigJsonCopy[permissionKey][checkBoxValue[0]] = true;
                });
            }
        });
    }

    unSelectAllCheckBox(groupName): void {
        let permissionKeyList = this.getGroupPermissionKeys(groupName);
        permissionKeyList.forEach(permissionKey => {
            if (this.inPagePermissionMappedByKey[permissionKey].inputType === 'groupOfCheckBox') {
                this.inPagePermissionMappedByKey[permissionKey].checkBoxValues.forEach(checkBoxValue => {
                    this.employeePermissionConfigJson[permissionKey][checkBoxValue[0]] = false;
                    this.employeePermissionConfigJsonCopy[permissionKey][checkBoxValue[0]] = false;
                });
            }
        });
    }
    // Functions for inputType = 'groupOfCheckBox' only: ENDS
}
