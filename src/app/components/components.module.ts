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

import { FeeReceiptListComponent } from './fees-table/fee-receipt-list.component';
import { DiscountListComponent } from './discount-table/discount-list.component';

// Pipes

import { AmountInWordsPipe } from '../pipes/amount-in-words.pipe';
import { DateInWordsPipe } from '../pipes/date-in-words.pipe';
import { GradePipe } from '../pipes/grade.pipe';
import { MoneyFormatPipe } from '../pipes/money-format.pipe';
import {EmployeeFilterComponent} from './employee-filter/employee-filter.component';

@NgModule({
    declarations: [

        // FooterComponent,
        NavbarComponent,
        SidebarComponent,
        LoadingSpinnerComponent,
        // StudentFilterOldComponent,
        StudentFilterComponent,
        FeeReceiptListComponent,
        DiscountListComponent,
        MonthDateComponent,
        DayDateComponent,
        CalendarComponent,

        AmountInWordsPipe,
        DateInWordsPipe,
        GradePipe,
        MoneyFormatPipe,

        EmployeeFilterComponent,

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
        EmployeeFilterComponent,
        FeeReceiptListComponent,
        DiscountListComponent,
        MonthDateComponent,
        DayDateComponent,
        CalendarComponent,

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
