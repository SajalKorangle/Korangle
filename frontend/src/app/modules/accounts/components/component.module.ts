import { NgModule } from '@angular/core';
import { ImagePreviewDialogComponent } from './image-preview-dialog/image-preview-dialog.component';
import { ComponentsModule } from './../../../components/components.module';
import { AccountSearchComponent } from './account-search/account-search.component';
import { UpdateTransactionDialogComponent } from './update-transaction-dialog/update-transaction-dialog.component';
import { GroupHierarchyComponent } from './group-hierarchy/group-hierarchy.component';
import { GroupHierarchyListComponent } from './group-hierarchy-list/group-hierarchy-list.component';
import { ColoredBalancePipe } from './pipes/colored-balance.pipe';
@NgModule({
    declarations: [
        ImagePreviewDialogComponent,
        AccountSearchComponent,
        UpdateTransactionDialogComponent,
        GroupHierarchyComponent,
        GroupHierarchyListComponent,

        //pipes
        ColoredBalancePipe,
    ],
    imports: [ComponentsModule],
    exports: [
        ImagePreviewDialogComponent,
        AccountSearchComponent,
        UpdateTransactionDialogComponent,
        GroupHierarchyComponent,
        GroupHierarchyListComponent,

        //pipes
        ColoredBalancePipe,
    ],
})
export class AccountsComponentsModule {}
