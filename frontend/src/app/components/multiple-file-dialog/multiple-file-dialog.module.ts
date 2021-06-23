import { NgModule } from '@angular/core';
import { CommonModule  } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCommonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatOptionModule,
} from '@angular/material';

import { ComponentsModule } from '../components.module';

import { MultipleFileDialogComponent } from './multiple-file-dialog.component';

@NgModule({
  declarations: [MultipleFileDialogComponent],
  entryComponents: [MultipleFileDialogComponent],
  imports: [
    FormsModule,
    MatButtonModule,
    MatCommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    ComponentsModule,
  ],
})
export class MultipleFileDialogModule {}