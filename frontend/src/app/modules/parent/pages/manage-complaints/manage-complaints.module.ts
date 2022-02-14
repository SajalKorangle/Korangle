import { NgModule } from '@angular/core';

import { ManageComplaintsComponent } from "./manage-complaints.component";
import { ManageComplaintsRouting } from "./manage-complaints.routing";
import { ComponentsModule } from "@components/components.module";
import { LocalComponentsModule } from '@modules/parent/component/local-components.module';
import { DeleteModalComponent } from '@modules/parent/component/delete-modal/delete-modal.component';

@NgModule({
    declarations: [
        ManageComplaintsComponent,
    ],
    imports: [
        ManageComplaintsRouting,
        ComponentsModule,
        LocalComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ ManageComplaintsComponent ],
    entryComponents: [DeleteModalComponent],
})
export class ManageComplaintsModule { }
