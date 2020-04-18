import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
    declarations: [
        NavbarComponent,
        SidebarComponent,
        LoadingSpinnerComponent,
    ],
    imports: [

        CommonModule,
        FormsModule,

        MatProgressBarModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    exports: [

        NavbarComponent,
        SidebarComponent,
        LoadingSpinnerComponent,

        CommonModule,
        FormsModule,

        MatProgressBarModule,
        MatFormFieldModule,
        MatInputModule,
    ]
})
export class BasicComponentsModule { }
