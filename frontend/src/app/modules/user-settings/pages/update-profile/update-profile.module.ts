import { NgModule } from '@angular/core';

import { UpdateProfileRoutingModule } from './update-profile.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { UpdateProfileComponent } from './update-profile.component';

@NgModule({
    declarations: [UpdateProfileComponent],

    imports: [UpdateProfileRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [UpdateProfileComponent],
})
export class UpdateProfileModule {}
