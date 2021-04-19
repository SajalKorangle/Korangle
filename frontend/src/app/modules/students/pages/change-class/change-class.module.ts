import { NgModule } from '@angular/core';

import { ChangeClassRoutingModule } from './change-class.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { ChangeClassComponent } from './change-class.component';

@NgModule({
    declarations: [ChangeClassComponent],

    imports: [ChangeClassRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [ChangeClassComponent],
})
export class ChangeClassModule {}
