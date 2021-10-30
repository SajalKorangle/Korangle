import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InventoryComponent } from '@modules/my-design/components/inventory/inventory.component';

// for types
import { Layout, TYPE_CHOICES } from '@services/modules/generic-design/models/layout';

// Design Core
import { getDefaultLayoutContent } from '@modules/my-design/core/constant'

@Component({
    selector: 'app-inventory-dialog',
    templateUrl: './inventory-dialog.component.html',
    styleUrls: ['./inventory-dialog.component.css'],
})
export class InventoryDialogComponent implements OnInit {
    vm: InventoryComponent;

    layoutTypeList = TYPE_CHOICES;

    activeLayoutType: typeof TYPE_CHOICES[number] = null;

    clickedLayoutFolderType: typeof TYPE_CHOICES[number] = null;

    selectedLayout: Partial<Layout>; // type = page

    constructor(public dialogRef: MatDialogRef<InventoryDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { [key: string]: any; }) {
        this.vm = data.vm;
        // this.selectedLayout = data.selectedLayout;
    }

    ngOnInit() { }

    resetSelection(): void {
        this.selectedLayout = null;
    }

    newLayout(): void {
        const defaultLayout: Partial<Layout> = {
            parentSchool: this.vm.user.activeSchool.dbId,
            name: '',
            publiclyShared: false,
            type: this.activeLayoutType,
            content: getDefaultLayoutContent(),
        };
        this.selectedLayout = new Layout(defaultLayout); // id is not set which signifies this is a new layout
    }

    getTypeFilteredMyLayoutList(): Array<Layout> {
        return this.vm.backendData.myLayoutList.filter(layout => layout.type == this.activeLayoutType);
    }

    getTypeFilteredMyPublicLayoutList(): Array<Layout> {
        return this.vm.backendData.publicLayoutList.filter(layout => layout.type == this.activeLayoutType);
    }

    getTypeFilteredSharedWithMeLayoutList(): Array<Layout> {
        return this.vm.backendData.layoutSharingSharedWithMeList.map(ls => ls.parentLayoutInstance).filter(layout => layout.type == this.activeLayoutType) as Array<Layout>;
    }

    isMyLayout(): boolean {
        if (this.selectedLayout && this.selectedLayout.parentSchool) {
            return this.selectedLayout.parentSchool == this.vm.user.activeSchool.dbId;
        }
        else {
            false;
        }
    }

    apply(): void {
        if (this.isMyLayout() || !this.selectedLayout.id) {
            this.dialogRef.close({ layout: this.selectedLayout, copy: false });
        } else {
            this.copyAndApply();
        }
    }

    copyAndApply(): void {
        this.dialogRef.close({ layout: this.selectedLayout, copy: true });
    }
}

