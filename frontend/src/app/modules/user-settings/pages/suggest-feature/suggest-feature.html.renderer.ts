import { SuggestFeatureComponent } from './suggest-feature.component';

export class SuggestFeatureHtmlRenderer {
    vm: SuggestFeatureComponent;

    constructor() {}

    initializeRenderer(vm: SuggestFeatureComponent): void {
        this.vm = vm;
    }

    public getStatusColor(featureStatus): any {
        switch (featureStatus) {
            case this.vm.featureStatusList.Pending:
                return 'orange';
            case this.vm.featureStatusList.Rejected:
                return 'red';
            case this.vm.featureStatusList.Resolved:
                return 'green';
        }
    }
}
