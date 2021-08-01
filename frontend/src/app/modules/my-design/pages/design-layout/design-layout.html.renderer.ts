import { DesignLayoutComponent } from './design-layout.component';

// dialogs
import { InventoryDialogComponent } from '@modules/my-design/components/dialogs/inventory-dialog/inventory-dialog.component';

export class DesignLayoutHtmlRenderer {
    vm: DesignLayoutComponent;

    isLoading: boolean = true;

    constructor(vm: DesignLayoutComponent) {
        this.vm = vm;
    }

    openInventory = (): void => {
        const data = {
            vm: this.vm,
            // selectedLayout: {}
        };
        // if (this.vm.currentLayout.id) {
        //     data.selectedLayout = {
        //         type: 'myLayout',
        //         index: this.vm.reportCardLayoutList.findIndex((l) => l.id == this.vm.currentLayout.id),
        //     };
        // } else {
        //     data.selectedLayout = { type: 'myLayout', index: -1 };
        // }

        const openedDialog = this.vm.dialog.open(InventoryDialogComponent, {
            data,
        });
        openedDialog.afterClosed().subscribe((selection: any) => {
            if (selection) {
                // if (selection.copy) {
                //     let newLayout: any = {
                //         parentSchool: this.vm.user.activeSchool.dbId,
                //         name: '',
                //         publiclyShared: false,
                //         content: this.vm.canvasAdapter.removeSchoolSpecificDataFromLayout(JSON.parse(selection.layout.content)),
                //     };
                //     this.vm.populateCurrentLayoutWithGivenValue(newLayout, true);
                //     this.openExamMappingDialog();
                // } else {
                //     this.vm.populateCurrentLayoutWithGivenValue(selection.layout);
                // }
            }
        });
    };
}