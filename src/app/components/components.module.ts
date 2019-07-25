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



import { BasicComponentsModule } from "../basic-components/basic-components.module";

import { StudentFilterComponent } from './student-filter/student-filter.component';
import { MonthDateComponent } from './month-date/month-date.component';
import { DayDateComponent } from './day-date/day-date.component';
import { EmployeeFilterComponent } from './employee-filter/employee-filter.component';
import { ParentStudentFilterComponent } from "./parent-student-filter/parent-student-filter.component";

// Pipes

import { AmountInWordsPipe } from '../pipes/amount-in-words.pipe';
import { DateInWordsPipe } from '../pipes/date-in-words.pipe';
import { IndianCurrencyPipe } from '../pipes/indian-currency.pipe';


@NgModule({
    declarations: [

        StudentFilterComponent,
        ParentStudentFilterComponent,
        MonthDateComponent,
        DayDateComponent,

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

        BasicComponentsModule,

    ],
    exports: [

        BasicComponentsModule,

        StudentFilterComponent,
        ParentStudentFilterComponent,
        EmployeeFilterComponent,
        MonthDateComponent,
        DayDateComponent,


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

    ]
})
export class ComponentsModule { }
