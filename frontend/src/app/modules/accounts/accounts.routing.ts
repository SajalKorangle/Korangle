import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AccountsComponent } from './accounts.component';
import { PRINT_TRANSACTIONS } from './../../print/print-routes.constants';
import { PRINT_LEDGER } from './../../print/print-routes.constants';
import { PrintTransactionsListComponent } from './print/print-transactions/print-transactions.component' 
import { PrintLedgerComponent } from './print/print-ledger/print-ledger.component' 

const routes: Routes = [
    {
        path: 'add_transaction',
        loadChildren: 'app/modules/accounts/pages/add-transaction/add-transaction.module#AddTransactionModule',
        data: {moduleName: 'accounts'},
    },
    {
        path: 'update_transaction',
        loadChildren: 'app/modules/accounts/pages/update-transaction/update-transaction.module#UpdateTransactionModule',
        data: {moduleName: 'accounts'},
    },
    {
        path: 'view_transactions',
        loadChildren: 'app/modules/accounts/pages/view-transactions/view-transactions.module#ViewTransactionsModule',
        data: {moduleName: 'accounts'},
    },
    {
        path: 'view_balance',
        loadChildren: 'app/modules/accounts/pages/view-balance/view-balance.module#ViewBalanceModule',
        data: {moduleName: 'accounts'},
    },
    {
        path: 'request_approval',
        loadChildren: 'app/modules/accounts/pages/my-approval-requests/my-approval-requests.module#MyApprovalRequestsModule',
        data: {moduleName: 'accounts'},
    },
    {
        path: 'grant_approval',
        loadChildren: 'app/modules/accounts/pages/grant-approval/grant-approval.module#GrantApprovalModule',
        data: {moduleName: 'accounts'},
    },
    {
        path: 'manage_accounts',
        loadChildren: 'app/modules/accounts/pages/manage-accounts/manage-accounts.module#ManageAccountsModule',
        data: {moduleName: 'accounts'},
    },
    {
        path: 'transfer_balance',
        loadChildren: 'app/modules/accounts/pages/transfer-balance/transfer-balance.module#TransferBalanceModule',
        data: {moduleName: 'accounts'},
    },
    {
        path: 'transfer_balance',
        loadChildren: 'app/modules/accounts/pages/transfer-balance/transfer-balance.module#TransferBalanceModule',
        data: {moduleName: 'accounts'},
    },
    {
        path: 'settings',
        loadChildren: 'app/modules/accounts/pages/settings/settings.module#SettingsModule',
        data: {moduleName: 'accounts'},
    },
    
    {
        path: PRINT_TRANSACTIONS,
        component: PrintTransactionsListComponent,
    },
    {
        path: PRINT_LEDGER,
        component: PrintLedgerComponent,
    },
    
    {
        path: '',   
        component: AccountsComponent,
    },


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
export class AccountsRoutingModule { }
