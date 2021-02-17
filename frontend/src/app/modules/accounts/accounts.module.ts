import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { AccountsComponent } from './accounts.component';

import { AccountsRoutingModule } from './accounts.routing';
import { AccountsComponentsModule } from './components/component.module'
import { ImagePreviewDialogComponent } from './components/image-preview-dialog/image-preview-dialog.component'
import { UpdateTransactionDialogComponent } from './components/update-transaction-dialog/update-transaction-dialog.component'
import { PrintTransactionsListComponent } from './print/print-transactions/print-transactions.component'
import {ExcelService} from "../../excel/excel-service";
import { UseFortransactionDialogComponent } from './pages/my-approval-requests/use-for-transaction-dialog/use-for-transaction-dialog.component';


@NgModule({
    declarations: [
        AccountsComponent,
        PrintTransactionsListComponent,
    ],

    imports: [
        ComponentsModule,
        AccountsRoutingModule,
        AccountsComponentsModule,
    ],
    exports: [],
    providers: [ExcelService],
    bootstrap: [AccountsComponent],
    entryComponents: [
        ImagePreviewDialogComponent,
        UpdateTransactionDialogComponent,
    ]
})
export class AccountsModule { }
