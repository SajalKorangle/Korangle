import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../../../components/components.module';
import { PlaceHolderComponent } from './placeholder.component';

@NgModule({
    declarations: [PlaceHolderComponent],

    imports: [ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [PlaceHolderComponent],
})
export class GeneratePayslipModule {}
