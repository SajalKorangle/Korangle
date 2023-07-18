import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';
import { LibraryComponent } from './library.component';
import { LibraryRoutingModule } from './library.routing';
import { PrintBookListComponent } from './print/print-book-list/print-book-list.component';

@NgModule({
    declarations: [
        LibraryComponent,
        PrintBookListComponent,
    ],

    imports: [ComponentsModule, LibraryRoutingModule],
    exports: [],
    entryComponents: [],
    providers: [],
    bootstrap: [LibraryComponent],
})
export class LibraryModule { }
