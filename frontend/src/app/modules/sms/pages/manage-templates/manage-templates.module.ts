import { NgModule } from '@angular/core';
import {ComponentsModule} from "@components/components.module";
import {ManageTemplatesComponent} from '@modules/sms/pages/manage-templates/manage-templates.component';
import {ManageTemplatesRouting} from '@modules/sms/pages/manage-templates/manage-templates.routing';

@NgModule({
    declarations: [
        ManageTemplatesComponent,
    ],
    imports: [
        ManageTemplatesRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ ManageTemplatesComponent ]
})
export class ManageTemplatesModule { }
