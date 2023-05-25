import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { PrintService } from '../../../../print/print-service';

@Component({
  selector: 'app-print-book-list',
  templateUrl: './print-book-list.component.html',
  styleUrls: ['./print-book-list.component.css']
})
export class PrintBookListComponent implements OnInit, AfterViewChecked {
  bookList: any;
  columnFilter: any;

  viewChecked = true;

  constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) {}

  ngOnInit(): void {
    const { value } = this.printService.getData();
    this.bookList = value['bookList'];
    this.columnFilter = value['columnFilter'];
    this.viewChecked = false;
}

  ngAfterViewChecked(): void {
      if (this.viewChecked === false) {
          this.viewChecked = true;
          this.printService.print();
          this.bookList = null;
          this.columnFilter = null;
          this.cdRef.detectChanges();
      }
  }

}
