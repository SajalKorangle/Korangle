import { NgModule } from '@angular/core';

import { GiveDiscountRoutingModule } from './give-discount.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { GiveDiscountComponent } from './give-discount.component';
import { FeesComponentsModule } from '../../components/fees-components.module';
import { SmsService } from '@services/modules/sms/sms.service';
import { SmsOldService } from '@services/modules/sms/sms-old.service';
import { UserService } from '@services/modules/user/user.service';
import { TCService } from '@services/modules/tc/tc.service';

@NgModule({
    declarations: [GiveDiscountComponent],

    imports: [GiveDiscountRoutingModule, ComponentsModule, FeesComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [GiveDiscountComponent],
})
export class GiveDiscountModule {}
