import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { NotificationComponent } from './notification.component';

import { NotificationRoutingModule } from './notification.routing';
import { NotificationService } from '../../services/modules/notification/notification.service';

@NgModule({
    declarations: [NotificationComponent],

    imports: [ComponentsModule, NotificationRoutingModule],
    exports: [],
    providers: [NotificationService],
    bootstrap: [NotificationComponent],
})
export class NotificationModule {}
