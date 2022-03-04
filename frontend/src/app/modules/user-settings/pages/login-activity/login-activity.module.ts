import { NgModule } from '@angular/core';

import { LoginActivityRoutingModule } from './login-activity.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { LoginActivityComponent } from './login-activity.component';

@NgModule({
    declarations: [LoginActivityComponent],

    imports: [LoginActivityRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [LoginActivityComponent],
})
export class LoginActivityModule {}
