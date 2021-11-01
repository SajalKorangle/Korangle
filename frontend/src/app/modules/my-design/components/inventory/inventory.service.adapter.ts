import { InventoryComponent } from './inventory.component';

// Type
import { QUERY_INTERFACE } from '@services/generic/generic-service';
import { Query } from '@services/generic/query-service';

export class InventoryServiceAdapter {
    vm: InventoryComponent;

    constructor(vm: InventoryComponent) {
        this.vm = vm;
    }

    async initializeDate() {

        const layoutFields = ['id', 'type', 'parentSchool', 'name', 'thumbnail', 'publiclyShared'];

        const myLayoutQuery = new Query({ generic_design_app: 'Layout' })
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .setFields(...layoutFields).getObjectList();

        const publicLayoutQuery = new Query({ generic_design_app: 'Layout' })
            .filter({ publiclyShared: true })
            .setFields(...layoutFields).getObjectList();

        const layoutSharedWithMe_parentLayoutQuery = new Query({ generic_design_app: 'Layout' }).setFields(...layoutFields);

        const layoutSharedWithMeQuery = new Query({ generic_design_app: 'LayoutShare' })
            .addParentQuery('parentLayout', layoutSharedWithMe_parentLayoutQuery)
            .filter({ parentSchoolSharedWith: this.vm.user.activeSchool.dbId })
            .getObjectList();


        [
            this.vm.backendData.myLayoutList,   // 1
            this.vm.backendData.publicLayoutList,   // 2
            this.vm.backendData.layoutSharingSharedWithMeList   // 3
        ] = await Promise.all([
            myLayoutQuery,  // 0
            publicLayoutQuery,   // 1
            layoutSharedWithMeQuery, // 2
        ]);

        this.vm.isLoading = false;
    }
}