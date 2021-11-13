import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ModalVideoComponent } from '@basic-components/modal-video/modal-video.component';
import { MatDialogModule } from '@angular/material';
import { SafePipe } from '../pipes/safe.pipe';
import {YouTubePlayerModule} from '@angular/youtube-player';

@NgModule({
    declarations: [NavbarComponent, SidebarComponent, LoadingSpinnerComponent, ModalVideoComponent, SafePipe],
    entryComponents: [ModalVideoComponent],
    imports: [
        CommonModule,
        FormsModule,

        MatProgressBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        YouTubePlayerModule
    ],
    exports: [
        NavbarComponent,
        SidebarComponent,
        LoadingSpinnerComponent,
        ModalVideoComponent,

        CommonModule,
        FormsModule,

        MatProgressBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        SafePipe,
        MatButtonModule,
        MatIconModule,
    ],
})
export class BasicComponentsModule {}
