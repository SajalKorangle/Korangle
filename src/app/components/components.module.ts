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


import {CdkTableModule} from '@angular/cdk/table';

import { BasicComponentsModule } from "../basic-components/basic-components.module";

import { StudentFilterComponent } from './student-filter/student-filter.component';
import { MonthDateComponent } from './month-date/month-date.component';
import { DayDateComponent } from './day-date/day-date.component';
import { EmployeeFilterComponent } from './employee-filter/employee-filter.component';
import { ParentStudentFilterComponent } from "./parent-student-filter/parent-student-filter.component";
import { FeeReceiptListComponent } from "../modules/fees/components/fee-receipt-list/fee-receipt-list-component.component";
import { DiscountListComponent } from "../modules/fees/components/discount-list/discount-list-component.component";

// Pipes

import { AmountInWordsPipe } from '../pipes/amount-in-words.pipe';
import { DateInWordsPipe } from '../pipes/date-in-words.pipe';
import { GradePipe } from '../pipes/grade.pipe';
import { MoneyFormatPipe } from '../pipes/money-format.pipe';
import { IndianCurrencyPipe } from '../pipes/indian-currency.pipe';


@NgModule({
    declarations: [

        StudentFilterComponent,
        ParentStudentFilterComponent,
        MonthDateComponent,
        DayDateComponent,

        AmountInWordsPipe,
        DateInWordsPipe,
        GradePipe,
        MoneyFormatPipe,
        IndianCurrencyPipe,

        EmployeeFilterComponent,

        FeeReceiptListComponent,
        DiscountListComponent,

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
        MatProgressBarModule,
        MatDatepickerModule,
        MatExpansionModule,
        MatSortModule,
        ScrollDispatchModule,

        BasicComponentsModule,

    ],
    exports: [

        BasicComponentsModule,

        StudentFilterComponent,
        ParentStudentFilterComponent,
        EmployeeFilterComponent,
        MonthDateComponent,
        DayDateComponent,
        FeeReceiptListComponent,
        DiscountListComponent,


        AmountInWordsPipe,
        DateInWordsPipe,
        GradePipe,
        MoneyFormatPipe,
        IndianCurrencyPipe,

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
        MatProgressBarModule,
        MatDatepickerModule,
        MatExpansionModule,
        MatSortModule,
        ScrollDispatchModule,

    ]
})
export class ComponentsModule { }
