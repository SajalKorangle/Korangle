
import {SuggestFeatureComponent} from './suggest-feature.component';

export class SuggestFeatureServiceAdapter {

    vm: SuggestFeatureComponent;

    constructor() {}

    initializeAdapter(vm: SuggestFeatureComponent): void {
        this.vm = vm;
    }

    public initializeData(): void {

        let feature_data = {
            parentUser: this.vm.user.dbId,
        };

        this.vm.isLoading = true;
        this.vm.featureService.getObjectList(this.vm.featureService.feature,feature_data).then(value => {
            this.vm.featureList = value;
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

        this.vm.schoolProfile.medium = this.vm.mediumList[0];

    }

    public createFeature(): void {

        if (!this.vm.currentFeature.title || this.vm.currentFeature.title == '') {
            alert('Title should be populated');
            return;
        }

        if (!this.vm.currentFeature.why || this.vm.currentFeature.why == '') {
            alert("'Why' should be populated");
            return;
        }

        if (!this.vm.currentFeature.what || this.vm.currentFeature.what == '') {
            alert("'What' should be populated");
            return;
        }

        this.vm.isLoading = true;

        this.vm.featureService.createObject(this.vm.featureService.feature, this.vm.currentFeature).then(value => {
            alert('Feature submitted successfully');
            Object.keys(this.vm.currentFeature).forEach(key => {
                this.vm.currentFeature[key] = null;
            });
        }, error => {
            this.vm.isLoading = false;
        });

    }

    public deleteFeature(feature: any): void {

        this.vm.featureService.deleteObject(this.vm.featureService.feature, feature).then(value => {
            this.vm.featureList.filter(item => {
                return item.id != feature.id;
            });
        }, error => {
            this.vm.isLoading = false;
        });

    }

}