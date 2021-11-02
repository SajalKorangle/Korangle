import { InventoryComponent } from './inventory.component';

// Type
import { Query } from '@services/generic/query';

export class InventoryServiceAdapter {
    vm: InventoryComponent;

    constructor(vm: InventoryComponent) {
        this.vm = vm;
    }

    async initializeDate() {

        const layoutFields = ['id', 'type', 'parentSchool', 'name', 'thumbnail', 'publiclyShared'];

        const myLayoutQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .setFields(...layoutFields).getObjectList({ generic_design_app: 'Layout' });

        const publicLayoutQuery = new Query()
            .filter({ publiclyShared: true })
            .setFields(...layoutFields).getObjectList({ generic_design_app: 'Layout' });

        const layoutSharedWithMe_parentLayoutQuery = new Query().setFields(...layoutFields);

        const layoutSharedWithMeQuery = new Query()
            .addParentQuery('parentLayout', layoutSharedWithMe_parentLayoutQuery)
            .filter({ parentSchoolSharedWith: this.vm.user.activeSchool.dbId })
            .getObjectList({ generic_design_app: 'LayoutShare' });


        [
            this.vm.backendData.myLayoutList,   // 0
            this.vm.backendData.publicLayoutList,   // 1
            this.vm.backendData.layoutSharingSharedWithMeList   // 2
        ] = await Promise.all([
            myLayoutQuery,  // 0
            publicLayoutQuery,   // 1
            layoutSharedWithMeQuery, // 2
        ]);

        this.vm.isLoading = false;
    }
}


