import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatRadioModule } from '@angular/material';
import { MatSelectModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material';
import { MatTooltipModule } from '@angular/material';
import { MatMenuModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatProgressBarModule } from '@angular/material';

import {CdkTableModule} from '@angular/cdk/table';

// import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { StudentFilterOldComponent } from './student-filter-old/student-filter.component';
import { StudentFilterComponent } from './student-filter/student-filter.component';

// Pipes

import { AmountInWordsPipe } from '../pipes/amount-in-words.pipe';
import { DateInWordsPipe } from '../pipes/date-in-words.pipe';
import { GradePipe } from '../pipes/grade.pipe';
import { MoneyFormatPipe } from '../pipes/money-format.pipe';

@NgModule({
    declarations: [
        // FooterComponent,
        NavbarComponent,
        SidebarComponent,
        LoadingSpinnerComponent,
        StudentFilterOldComponent,
        StudentFilterComponent,

        AmountInWordsPipe,
        DateInWordsPipe,
        GradePipe,
        MoneyFormatPipe,

    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        CdkTableModule,

        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatMenuModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressBarModule,
    ],
    exports: [
        // FooterComponent,
        NavbarComponent,
        SidebarComponent,
        LoadingSpinnerComponent,
        StudentFilterOldComponent,
        StudentFilterComponent,

        AmountInWordsPipe,
        DateInWordsPipe,
        GradePipe,
        MoneyFormatPipe,

        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        CdkTableModule,

        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatMenuModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressBarModule,

    ]
})
export class ComponentsModule { }
