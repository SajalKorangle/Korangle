import { NgModule } from '@angular/core';

import { RemoveDuplicateMarksRouting } from './remove-duplicate-marks.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { RemoveDuplicateMarksComponent } from './remove-duplicate-marks.component';

@NgModule({
    declarations: [RemoveDuplicateMarksComponent],

    imports: [RemoveDuplicateMarksRouting, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [RemoveDuplicateMarksComponent],
})
export class RemoveDuplicateMarksModule {}
