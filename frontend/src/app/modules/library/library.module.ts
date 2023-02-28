import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';
import { LibraryComponent } from './library.component';
import { LibraryRoutingModule } from './library.routing';

@NgModule({
    declarations: [
        LibraryComponent,
    ],

    imports: [ComponentsModule, LibraryRoutingModule],
    exports: [],
    entryComponents: [],
    providers: [],
    bootstrap: [LibraryComponent],
})
export class LibraryModule { }
