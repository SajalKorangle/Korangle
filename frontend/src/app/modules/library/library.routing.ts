import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LibraryComponent } from './library.component';
import { PRINT_BOOK_LIST } from '../../print/print-routes.constants';
import { PrintBookListComponent } from './print/print-book-list/print-book-list.component';

const routes: Routes = [
    {
        path: 'update_book',
        loadChildren: 'app/modules/library/pages/update-book/update-book.module#UpdateBookModule',
        data: { moduleName: 'library' },
    },
    {
        path: 'view_all',
        loadChildren: 'app/modules/library/pages/view-all/view-all.module#ViewAllModule',
        data: { moduleName: 'library' },
    },
    {
        path: 'add_via_excel',
        loadChildren: 'app/modules/library/pages/add-via-excel/add-via-excel.module#AddViaExcelModule',
        data: { moduleName: 'library' },
    },
    {
        path: 'add_book',
        loadChildren: 'app/modules/library/pages/add-book/add-book.module#AddBookModule',
        data: { moduleName: 'library' },
    },
    {
        path: 'delete_book',
        loadChildren: 'app/modules/library/pages/delete-book/delete-book.module#DeleteBookModule',
        data: { moduleName: 'library' },
    },
    {
        path: '',
        component: LibraryComponent,
    },
    {
        path: PRINT_BOOK_LIST,
        component: PrintBookListComponent
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LibraryRoutingModule {}
