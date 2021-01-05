import { NgModule } from '@angular/core'; 
import { CommonModule  } from '@angular/common';
import {
  MatButtonModule, 
  MatCommonModule, 
  MatDialogModule,
  MatIconModule,
} from '@angular/material'; 

import { ImagePdfPreviewDialogComponent} from './image-pdf-preview-dialog.component';
  
@NgModule({ 
  declarations: [ImagePdfPreviewDialogComponent], 
  entryComponents: [ImagePdfPreviewDialogComponent], 
  imports: [  
    MatButtonModule, 
    MatCommonModule, 
    MatDialogModule,
    MatIconModule,
    CommonModule,
  ],
}) 
export class ImagePdfPreviewDialogModule {} 