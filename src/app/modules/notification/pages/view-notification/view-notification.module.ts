import { NgModule } from '@angular/core';


import {ViewNotificationRoutingModule} from './view-notification.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {ViewNotificationComponent} from "./view-notification.component";


@NgModule({
    declarations: [
        ViewNotificationComponent
    ],

    imports: [
        ViewNotificationRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ViewNotificationComponent]
})
export class ViewNotificationModule { }
