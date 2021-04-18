import { NgModule } from '@angular/core';

import { DeleteEnquiryComponent } from './delete-enquiry.component';

import { DeleteEnquiryRoutingModule } from './delete-enquiry.routing';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
    declarations: [DeleteEnquiryComponent],

    imports: [DeleteEnquiryRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [DeleteEnquiryComponent],
})
export class DeleteEnquiryModule {}
