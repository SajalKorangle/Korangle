import { SuggestFeatureComponent } from './suggest-feature.component';

export class SuggestFeatureServiceAdapter {
    vm: SuggestFeatureComponent;

    constructor() {}

    initializeAdapter(vm: SuggestFeatureComponent): void {
        this.vm = vm;
    }

    public initializeData(): void {
        let feature_data = {
            parentUser: this.vm.user.id,
        };

        this.vm.isLoading = true;
        this.vm.featureService.getObjectList(this.vm.featureService.feature, feature_data).then(
            (value) => {
                this.vm.featureList = value;
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    public createFeature(): void {
        if (!this.vm.currentFeature.title || this.vm.currentFeature.title.trim() == '') {
            alert('Title should be populated');
            return;
        }

        if (!this.vm.currentFeature.description || this.vm.currentFeature.description.trim() == '') {
            alert("'Feature Description' should be populated");
            return;
        }

        if (!this.vm.currentFeature.advantage || this.vm.currentFeature.advantage.trim() == '') {
            this.vm.currentFeature.advantage = null;
        }
        if (!this.vm.currentFeature.frequency || this.vm.currentFeature.frequency.trim() == '') {
            this.vm.currentFeature.frequency = null;
        }
        if (!this.vm.currentFeature.managedBy || this.vm.currentFeature.managedBy.trim() == '') {
            this.vm.currentFeature.managedBy = null;
        }

        this.vm.isLoading = true;

        this.vm.featureService.createObject(this.vm.featureService.feature, this.vm.currentFeature).then(
            (value) => {
                alert('Feature submitted successfully');
                this.vm.featureList.push(value);
                this.vm.initializeCurrentFeature();
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    public deleteFeature(feature: any): void {
        this.vm.featureService.deleteObject(this.vm.featureService.feature, feature).then(
            (value) => {
                this.vm.featureList = this.vm.featureList.filter((item) => {
                    return item.id != feature.id;
                });
            },
            (error) => {}
        );
    }
}
