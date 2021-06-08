import { NgModule } from '@angular/core';

import { ViewAllRoutingModule } from './view-all.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { ViewAllComponent } from './view-all.component';
import { ViewImageModalComponent } from '@components/view-image-modal/view-image-modal.component';

@NgModule({
    declarations: [ViewAllComponent],

    imports: [ViewAllRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [ViewAllComponent],
    entryComponents: [ViewImageModalComponent],
})
export class ViewAllModule {}
