import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DesignLayoutComponent } from '@modules/my-design/pages/design-layout/design-layout.component';

// import { LAYOUT_TYPES_MAPPED_BY_LAYERS_LIST } from '@modules/my-design/class/constant';

// for types
import { Layout, TYPE_CHOICES } from '@services/modules/my-design/models/layout';
@Component({
    selector: 'app-inventory-dialog',
    templateUrl: './inventory-dialog.component.html',
    styleUrls: ['./inventory-dialog.component.css'],
})
export class InventoryDialogComponent implements OnInit {
    vm: DesignLayoutComponent;

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
        this.selectedLayout = { // id is not set which signifies this is a new layout
            type: this.activeLayoutType
        };
    }

    getTypeFilteredMyLayoutList(): Array<Layout> {
        return this.vm.backendData.layoutList.filter(layout => layout.type == this.activeLayoutType && layout.parentSchool == this.vm.user.activeSchool.dbId);
    }

    getTypeFilteredMyPublicLayoutList(): Array<Layout> {
        return this.getTypeFilteredMyLayoutList().filter(layout => layout.publiclyShared == true);
    }

    getTypeFilteredOthersPublicLayoutList(): Array<Layout> {
        return this.vm.backendData.layoutList.filter(layout => layout.parentSchool != this.vm.user.activeSchool.dbId && layout.publiclyShared == true);
    }

    getTypeFilteredSharedWithMeLayoutList(): Array<Layout> {
        const sharedWithMeLayoutIdList = this.vm.backendData.layoutSharingSharedWithMeList.map(layoutSharing => layoutSharing.parentLayout);
        return this.vm.backendData.layoutList.filter(layout => layout.parentSchool != this.vm.user.activeSchool.dbId).filter(layout => sharedWithMeLayoutIdList.includes(layout.id));
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
