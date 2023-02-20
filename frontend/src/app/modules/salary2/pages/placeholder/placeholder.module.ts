import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../../../components/components.module';
import { PlaceHolderComponent } from './placeholder.component';
import { PlaceHolderRoutingModule } from './placeholder.routing';

@NgModule({
    declarations: [PlaceHolderComponent],

    imports: [ComponentsModule, PlaceHolderRoutingModule],
    exports: [PlaceHolderComponent],
    providers: [],
    bootstrap: [PlaceHolderComponent],
})
export class PlaceHolderModule {}
