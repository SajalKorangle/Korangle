import { NgModule } from '@angular/core';

import { ViewNotificationRoutingModule } from './view-notification.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { ViewNotificationComponent } from './view-notification.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [ViewNotificationComponent],

    imports: [ViewNotificationRoutingModule, ComponentsModule, MatCardModule],
    exports: [MatCardModule],
    providers: [],
    bootstrap: [ViewNotificationComponent],
})
export class ViewNotificationModule {}
