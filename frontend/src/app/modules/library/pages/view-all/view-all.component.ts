import { Component, OnInit } from '@angular/core';
import { ViewAllHtmlRenderer } from './view-all.html.renderer';
import { DataStorage } from "@classes/data-storage";


class ColumnFilter {
    showSerialNumber = true;
    showName = true;
    showAuthor = true;
    showPublisher = true;
    showDateOfPurchase = true;
    showBookNumber = true;
    showEdition = false;
    showNumberOfPages = false;
    showPrintedCost = false;
    showCoverType = false;
    showLocation = false;
    showBookType = false;
    showFrontImage = false;
    showBackImage = false;
}


@Component({
    selector: 'view-all',
    templateUrl: './view-all.component.html',
    styleUrls: ['./view-all.component.css'],
    providers: [ ],
})

export class ViewAllComponent implements OnInit {

    user: any;

    isLoading = false;

    // Col Filter for books
    columnFilter: ColumnFilter;
    // Col Filter for documents
    documentFilter: ColumnFilter

    htmlRenderer: ViewAllHtmlRenderer;


    bookDocumentSelectList = ['Book', 'Documents'];
    currentBookDocumentFilter;

    constructor () { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.columnFilter = new ColumnFilter();
        this.documentFilter = new ColumnFilter();
        this.currentBookDocumentFilter = this.bookDocumentSelectList[0];

        this.htmlRenderer = new ViewAllHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);

    }

    selectAllColumns(): void {}
    unSelectAllColumns(): void {}

    printBookList(): void {
        alert("Under construction");
    }
    downloadList(): void {
        alert("Under construction");
    }

}
