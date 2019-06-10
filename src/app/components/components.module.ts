import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';

import { MatRadioModule } from '@angular/material';
import { MatSelectModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material';
import { MatTooltipModule } from '@angular/material';
import { MatMenuModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatProgressBarModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material';
import { MatNativeDateModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material';
import { MatSortModule } from '@angular/material';


import {CdkTableModule} from '@angular/cdk/table';


// import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
// import { StudentFilterOldComponent } from './student-filter-old/student-filter.component';
import { StudentFilterComponent } from './student-filter/student-filter.component';
import { MonthDateComponent } from './month-date/month-date.component';
import { DayDateComponent } from './day-date/day-date.component';
import { CalendarComponent } from './calendar/calendar.component';

import { FeeReceiptListComponentOld } from './fees-table/fee-receipt-list-component-old.component';
import { DiscountListOldComponent } from './discount-table/discount-list-old.component';

// Pipes

import { AmountInWordsPipe } from '../pipes/amount-in-words.pipe';
import { DateInWordsPipe } from '../pipes/date-in-words.pipe';
import { GradePipe } from '../pipes/grade.pipe';
import { MoneyFormatPipe } from '../pipes/money-format.pipe';
import {EmployeeFilterComponent} from './employee-filter/employee-filter.component';
import {ParentStudentFilterComponent} from "./parent-student-filter/parent-student-filter.component";
import {FeeReceiptListComponent} from "../modules/fees/components/fee-receipt-list/fee-receipt-list-component.component";
import {DiscountListComponent} from "../modules/fees/components/discount-list/discount-list-component.component";

@NgModule({
    declarations: [

        // FooterComponent,
        NavbarComponent,
        SidebarComponent,
        LoadingSpinnerComponent,
        // StudentFilterOldComponent,
        StudentFilterComponent,
        ParentStudentFilterComponent,
        FeeReceiptListComponentOld,
        DiscountListOldComponent,
        MonthDateComponent,
        DayDateComponent,
        CalendarComponent,

        AmountInWordsPipe,
        DateInWordsPipe,
        GradePipe,
        MoneyFormatPipe,

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
        MatFormFieldModule,
        MatInputModule,
        MatProgressBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatExpansionModule,
        MatSortModule,
        ScrollDispatchModule,

    ],
    exports: [

        // FooterComponent,
        NavbarComponent,
        SidebarComponent,
        LoadingSpinnerComponent,
        // StudentFilterOldComponent,
        StudentFilterComponent,
        ParentStudentFilterComponent,
        EmployeeFilterComponent,
        FeeReceiptListComponentOld,
        DiscountListOldComponent,
        MonthDateComponent,
        DayDateComponent,
        CalendarComponent,
        FeeReceiptListComponent,
        DiscountListComponent,


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
        MatDatepickerModule,
        MatNativeDateModule,
        MatExpansionModule,
        MatSortModule,
        ScrollDispatchModule,

    ]
})
export class ComponentsModule { }
