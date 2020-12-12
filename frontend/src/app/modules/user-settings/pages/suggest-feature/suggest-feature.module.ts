import { NgModule } from '@angular/core';


import {SuggestFeatureRouting} from "./suggest-feature.routing";
import {ComponentsModule} from "../../../../components/components.module";
import {SuggestFeatureComponent} from "./suggest-feature.component";


@NgModule({
    declarations: [
        SuggestFeatureComponent
    ],

    imports: [
        SuggestFeatureRouting ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [SuggestFeatureComponent]
})
export class SuggestFeatureModule { }
