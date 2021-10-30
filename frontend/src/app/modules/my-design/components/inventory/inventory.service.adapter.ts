import { InventoryComponent } from './inventory.component';

// Type
import {QUERY_INTERFACE} from '@services/generic/generic-service';

export class InventoryServiceAdapter {
    vm: InventoryComponent;

    constructor(vm: InventoryComponent) {
        this.vm = vm;
    }

    async initializeDate() {

        const layoutFields = ['id', 'type', 'parentSchool', 'name', 'thumbnail', 'publiclyShared'];

        const myLayoutQuery: QUERY_INTERFACE = {
            fields_list: layoutFields,
            filter: {parentSchool: this.vm.user.activeSchool.dbId},
        };
        
        const publicLayoutQuery: QUERY_INTERFACE = {
            fields_list: layoutFields,
            filter: {publiclyShared: true},
        };

        const layoutSharedWithMeQuery: QUERY_INTERFACE = {
            parent_query: {
                parentLayout: {fields_list: layoutFields,}
            },
            filter: {parentSchoolSharedWith: this.vm.user.activeSchool.dbId}
        };

        [
            this.vm.backendData.myLayoutList,   // 1
            this.vm.backendData.publicLayoutList,   // 2
            this.vm.backendData.layoutSharingSharedWithMeList   // 3
        ] = await Promise.all([
            this.vm.genericService.getObjectList({generic_design_app: 'Layout'}, myLayoutQuery),    // 0
            this.vm.genericService.getObjectList({generic_design_app: 'Layout'}, publicLayoutQuery),    // 1
            this.vm.genericService.getObjectList({generic_design_app: 'LayoutShare'}, layoutSharedWithMeQuery), // 2
        ]);

        this.vm.isLoading = false;
    }
}