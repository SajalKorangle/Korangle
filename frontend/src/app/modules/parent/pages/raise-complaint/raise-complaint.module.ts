import { NgModule } from '@angular/core';

import { RaiseComplaintComponent } from "./raise-complaint.component";
import { RaiseComplaintRouting } from "./raise-complaint.routing";
import { ComponentsModule } from "@components/components.module";
import { LocalComponentsModule } from '@modules/parent/component/local-components.module';
import { DeleteModalComponent } from '@modules/parent/component/delete-modal/delete-modal.component';
import { LocalChildComponentsModule } from './component/local-child-components.module';

@NgModule({
    declarations: [
        RaiseComplaintComponent,
    ],
    imports: [
        RaiseComplaintRouting,
        ComponentsModule,
        LocalComponentsModule,
        LocalChildComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ RaiseComplaintComponent ],
    entryComponents: [DeleteModalComponent],
})
export class RaiseComplaintModule { }
