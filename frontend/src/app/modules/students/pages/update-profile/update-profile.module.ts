import { NgModule } from '@angular/core';

import { UpdateProfileRoutingModule } from './update-profile.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { UpdateProfileComponent } from './update-profile.component';

import { MultipleFileDialogModule } from '../../multiple-file-dialog/multiple-file-dialog.module';
import { ViewImageModalComponent } from '@components/view-image-modal/view-image-modal.component';

@NgModule({
    declarations: [UpdateProfileComponent],

    imports: [UpdateProfileRoutingModule, ComponentsModule, MultipleFileDialogModule],
    exports: [],
    providers: [],
    bootstrap: [UpdateProfileComponent],
    entryComponents: [ViewImageModalComponent],
})
export class UpdateProfileModule {}
