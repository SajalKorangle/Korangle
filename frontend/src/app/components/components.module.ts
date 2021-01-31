import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material';

import { MatInputModule } from '@angular/material/input'
import { MatTableModule } from '@angular/material';  
import { MatDialogModule } from '@angular/material';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';

import 'hammerjs';
 
import { BasicComponentsModule } from "../basic-components/basic-components.module";

import { MonthDateComponent } from './month-date/month-date.component';
import { DayDateOldComponent } from './day-date-old/day-date-old.component';
import { DayDateComponent } from "./day-date/day-date.component";
import { EmployeeFilterComponent } from './employee-filter/employee-filter.component';
import { ParentStudentFilterComponent } from "./parent-student-filter/parent-student-filter.component";
import { CustomizedNumberInputComponent } from './customized-number-input/customized-number-input.component';
import { ImagePreviewDialogComponent } from './modal/image-preview-dialog.component'

// Pipes

import { AmountInWordsPipe } from '../pipes/amount-in-words.pipe';
import { DateInWordsPipe } from '../pipes/date-in-words.pipe';
import { IndianCurrencyPipe } from '../pipes/indian-currency.pipe';


@NgModule({
    declarations: [

        ParentStudentFilterComponent,
        MonthDateComponent,
        DayDateOldComponent,
        DayDateComponent,
        CustomizedNumberInputComponent,
        ImagePreviewDialogComponent,

        AmountInWordsPipe,
        DateInWordsPipe,
        IndianCurrencyPipe,

        EmployeeFilterComponent,

    ],
    imports: [

        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        ScrollDispatchModule,

        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatMenuModule,
        MatAutocompleteModule,
        MatProgressBarModule,
        MatDatepickerModule,
        MatExpansionModule,
        MatSortModule,
        MatCardModule,
        MatTabsModule,
        MatSliderModule,

        MatInputModule,
        MatTableModule,
        MatDialogModule,
        MatListModule,
        MatSlideToggleModule,
        
        BasicComponentsModule,

    ],
    exports: [

        BasicComponentsModule,

        ParentStudentFilterComponent,
        EmployeeFilterComponent,
        MonthDateComponent,
        DayDateOldComponent,
        DayDateComponent,
        CustomizedNumberInputComponent,
        ImagePreviewDialogComponent,

        AmountInWordsPipe,
        DateInWordsPipe,
        IndianCurrencyPipe,

        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        ScrollDispatchModule,

        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatMenuModule,
        MatAutocompleteModule,
        MatProgressBarModule,
        MatDatepickerModule,
        MatExpansionModule,
        MatSortModule,
        MatCardModule,
        MatTabsModule,
        MatSliderModule,
        MatInputModule,
        MatDialogModule,
        MatListModule,
        MatSlideToggleModule,
        
    ],
})
export class ComponentsModule { }
