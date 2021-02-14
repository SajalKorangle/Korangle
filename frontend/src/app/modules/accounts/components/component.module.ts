import { NgModule } from '@angular/core';
import { ImagePreviewDialogComponent } from './image-preview-dialog/image-preview-dialog.component'
import { ComponentsModule } from './../../../components/components.module'

@NgModule({
  declarations: [
    ImagePreviewDialogComponent,
  ],
  imports: [
    ComponentsModule,
  ],
  exports: [
    ImagePreviewDialogComponent,
  ]
})
export class AccountsComponentsModule { }
