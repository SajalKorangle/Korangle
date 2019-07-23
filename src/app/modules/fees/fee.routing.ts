import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FeeComponent } from './fee.component';
import {  PRINT_FEE_RECIEPT_LIST, PRINT_FULL_FEE_RECIEPT_LIST } from '../../print/print-routes.constants';
import { PrintFeeReceiptListComponent } from './print/print-fee-receipt-list/print-fee-receipt-list.component';
import { PrintFullFeeReceiptListComponent } from './print/print-full-fee-receipt-list/print-full-fee-receipt-list.component';


const routes: Routes = [
    {
        path: 'collect_fee',
        loadChildren: 'app/modules/fees/pages/collect-fee/collect-fee.module#CollectFeeModule',
        data: {moduleName: 'fees'},
    },
    {
        path: 'my_collection',
        loadChildren: 'app/modules/fees/pages/my-collection/my-collection.module#MyCollectionModule',
        data: {moduleName: 'fees'},
    },
    {
        path: 'total_collection',
        loadChildren: 'app/modules/fees/pages/total-collection/total-collection.module#TotalCollectionModule',
        data: {moduleName: 'fees'},
    },

    {
        path: 'view_defaulters',
        loadChildren: 'app/modules/fees/pages/view-defaulters/view-defaulters.module#ViewDefaultersModule',
        data: {moduleName: 'fees'},
    },

    {
        path: 'generate_fees_certificate',
        loadChildren: 'app/modules/fees/pages/generate-fees-certificate/generate-fees-certificate.module#GenerateFeesCertificateModule',
        data: {moduleName: 'fees'},
    },

    {
        path: 'generate_fees_report',
        loadChildren: 'app/modules/fees/pages/generate-fees-report/generate-fees-report.module#GenerateFeesReportModule',
        data: {moduleName: 'fees'},
    },

    {
        path: 'give_discount',
        loadChildren: 'app/modules/fees/pages/give-discount/give-discount.module#GiveDiscountModule',
        data: {moduleName: 'fees'},
    },

    {
        path: 'total_discount',
        loadChildren: 'app/modules/fees/pages/total-discount/total-discount.module#TotalDiscountModule',
        data: {moduleName: 'fees'},
    },

    {
        path: 'cancel_fee_receipt',
        loadChildren: 'app/modules/fees/pages/cancel-fee-receipt/cancel-fee-receipt.module#CancelFeeReceiptModule',
        data: {moduleName: 'fees'},
    },

    {
        path: 'cancel_discount',
        loadChildren: 'app/modules/fees/pages/cancel-discount/cancel-discount.module#CancelDiscountModule',
        data: {moduleName: 'fees'},
    },

    {
        path: 'update_student_fees',
        loadChildren: 'app/modules/fees/pages/update-student-fees/update-student-fees.module#UpdateStudentFeesModule',
        data: {moduleName: 'fees'},
    },

    {
        path: 'set_school_fees',
        loadChildren: 'app/modules/fees/pages/set-school-fees/set-school-fees.module#SetSchoolFeesModule',
        data: {moduleName: 'fees'},
    },

    {
        path: 'add_fee_type',
        loadChildren: 'app/modules/fees/pages/add-fee-type/add-fee-type.module#AddFeeTypeModule',
        data: {moduleName: 'fees'},
    },

    {
        path: 'lock_fee',
        loadChildren: 'app/modules/fees/pages/lock-fee/lock-fee.module#LockFeeModule',
        data: {moduleName: 'fees'},
    },


    {
        path: '',
        component: FeeComponent,
    },
    {
        path: PRINT_FEE_RECIEPT_LIST,
        component: PrintFeeReceiptListComponent,
    },
    {
        path: PRINT_FULL_FEE_RECIEPT_LIST,
        component: PrintFullFeeReceiptListComponent,
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule,
    ],
})
export class FeeRoutingModule { }
