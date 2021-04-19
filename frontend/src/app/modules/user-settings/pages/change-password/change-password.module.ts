import { NgModule } from '@angular/core';

import { ChangePasswordRoutingModule } from './change-password.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { ChangePasswordComponent } from './change-password.component';

@NgModule({
    declarations: [ChangePasswordComponent],

    imports: [ChangePasswordRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [ChangePasswordComponent],
})
export class ChangePasswordModule {}
