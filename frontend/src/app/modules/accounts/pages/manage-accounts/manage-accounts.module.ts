import { NgModule } from '@angular/core';

import { ManageAccountsComponent } from './manage-accounts.component';
import { ManageAccountsRoutingModule } from './manage-accounts.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { AddAccountDialogComponent } from './add-account-dialog/add-account-dialog.component';
import { EditAccountDialogComponent } from './edit-account-dialog/edit-account-dialog.component';
import { EditGroupDialogComponent } from './edit-group-dialog/edit-group-dialog.component';
import { AddGroupDialogComponent } from './add-group-dialog/add-group-dialog.component';
import { AccountsComponentsModule } from './../../components/component.module';

@NgModule({
    declarations: [
        ManageAccountsComponent,
        AddAccountDialogComponent,
        EditAccountDialogComponent,
        AddGroupDialogComponent,
        EditGroupDialogComponent,
    ],

    imports: [ManageAccountsRoutingModule, ComponentsModule, AccountsComponentsModule],
    exports: [AddAccountDialogComponent, EditAccountDialogComponent, AddGroupDialogComponent, EditGroupDialogComponent],
    providers: [],
    bootstrap: [ManageAccountsComponent],
    entryComponents: [AddAccountDialogComponent, EditAccountDialogComponent, AddGroupDialogComponent, EditGroupDialogComponent],
})
export class ManageAccountsModule {}
