import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatProgressBarModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material';

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
        ReactiveFormsModule,

        MatProgressBarModule,
        MatFormFieldModule,

    ],
    exports: [

        NavbarComponent,
        SidebarComponent,
        LoadingSpinnerComponent,

        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        MatProgressBarModule,
        MatFormFieldModule,

    ]
})
export class BasicComponentsModule { }
