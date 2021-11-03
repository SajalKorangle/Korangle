import { NgModule } from '@angular/core';

import { CollectFeeRoutingModule } from './collect-fee.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { CollectFeeComponent } from './collect-fee.component';
import { FeesComponentsModule } from '../../components/fees-components.module';
import { SmsService } from '@services/modules/sms/sms.service';
import { SmsOldService } from '@services/modules/sms/sms-old.service';
import { UserService } from '@services/modules/user/user.service';
import { TCService } from '@services/modules/tc/tc.service';

@NgModule({
    declarations: [CollectFeeComponent],

    imports: [CollectFeeRoutingModule, ComponentsModule, FeesComponentsModule],
    exports: [],
    providers: [
        SmsService,
        SmsOldService,
        UserService,
        TCService
    ],
    bootstrap: [CollectFeeComponent],
})
export class CollectFeeModule {}
