import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { AccountsComponent } from './accounts.component';

import { AccountsRoutingModule } from './accounts.routing';
import { AccountsComponentsModule } from './components/component.module'
import { ImagePreviewDialogComponent } from './components/image-preview-dialog/image-preview-dialog.component'


@NgModule({
    declarations: [
        AccountsComponent,
    ],

    imports: [
        ComponentsModule,
        AccountsRoutingModule,
        AccountsComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [AccountsComponent],
    entryComponents: [
        ImagePreviewDialogComponent,
    ]
})
export class AccountsModule { }
