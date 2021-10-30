import { DesignLayoutComponent } from './design-layout.component';

export class DesignLayoutServiceAdapter {
    vm: DesignLayoutComponent;

    constructor(vm: DesignLayoutComponent) {
        this.vm = vm;
    }

    async initializeDate() {
        const layout_request = {
            fields__korangle: ['id', 'type', 'parentSchool', 'name', 'thumbnail', 'publiclyShared']
        };

        const layout_sharing_shared_with_me_request = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        [
            this.vm.backendData.layoutList,
            this.vm.backendData.layoutSharingSharedWithMeList
        ] = await Promise.all([
            this.vm.myDesignService.getObjectList(this.vm.myDesignService.layout, layout_request),  // 0
            this.vm.myDesignService.getObjectList(this.vm.myDesignService.layout_sharing, layout_sharing_shared_with_me_request), // 1
        ]);

        this.vm.htmlRenderer.isLoading = false;
    }
}