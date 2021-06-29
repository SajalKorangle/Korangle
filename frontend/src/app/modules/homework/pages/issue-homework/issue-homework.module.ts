import { NgModule } from '@angular/core';

import { IssueHomeworkComponent } from './issue-homework.component';

import { ImagePreviewDialogComponent } from '../../../../components/modal/image-preview-dialog.component';
import { EditHomeworkDialogComponent } from './edit-homework/edit-homework.component';
import { IssueHomeworkRoutingModule } from './issue-homework.routing';
import { ComponentsModule } from '../../../../components/components.module';
import 'hammerjs';

@NgModule({
    declarations: [IssueHomeworkComponent, EditHomeworkDialogComponent],

    imports: [IssueHomeworkRoutingModule, ComponentsModule],
    exports: [EditHomeworkDialogComponent, ImagePreviewDialogComponent],
    providers: [],

    bootstrap: [IssueHomeworkComponent],

    entryComponents: [IssueHomeworkComponent, EditHomeworkDialogComponent, ImagePreviewDialogComponent],
})
export class IssueHomeworkModule {}
