import { Component, OnInit } from '@angular/core';
import { DataStorage } from "@classes/data-storage";
import { GenericService } from '@services/generic/generic-service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ViewBookFlowServiceAdapter } from './view-book-flow.service-adapter';
import { map } from 'rxjs/operators';
import moment = require('moment');
import {
  FormControl,
} from '@angular/forms';

const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-view-book-flow',
  templateUrl: './view-book-flow.component.html',
  styleUrls: ['./view-book-flow.component.css'],
  providers: [
    GenericService,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ViewBookFlowComponent implements OnInit {
  moment = moment;
  user: any;
  serviceAdapter: ViewBookFlowServiceAdapter;
  isLoading: boolean = false;
  minDate = new Date(1990, 0, 1);
  maxDate = new Date();
  issueStartDate = new FormControl(null);
  issueEndDate = new FormControl(this.maxDate);
  depositStartDate = new FormControl(null);
  depositEndDate = new FormControl(this.maxDate);
  showFilters: Boolean = false;
  issueVisibility: 'all' | 'issued' | 'deposited' = 'all';
  booksList: any = [];
  filteredBookList: any = [];
  selectedBook: any = null;
  selectedBookFormControl: FormControl = new FormControl();

  issueToFormControl: FormControl = new FormControl('all');

  selectedStudent: any = null;
  selectedStudentSection: any;

  selectedEmployee: any = null;
  employeeList: any = null;

  isRecordListLoading: boolean = false;
  bookIssueRecordList: any = null;

  constructor(public genericService: GenericService) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new ViewBookFlowServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);

    this.filteredBookList = this.selectedBookFormControl.valueChanges.pipe(
      map((value) => (typeof value === 'string' ? value : (value as any).bookNumber)),
      map((bookNumber) => this.filterBooksList(bookNumber))
    );
  }
  filterBooksList(value: string) {
    if (value === null || value === '' || typeof value !== 'string') {
      return [];
    }

    value = value.trim();
    return this.booksList.filter((book) => {
      return (
        book.name.toLowerCase().indexOf(value.toLowerCase()) != -1 ||
        (book.bookNumber && book.bookNumber.toString().toLowerCase().indexOf(value.toLowerCase()) != -1)
      );
    })
      .sort((a, b) => {
        if (getBookIndex(a) == getBookIndex(b)) {
          return 0;
        } else if (getBookIndex(a) > getBookIndex(b)) {
          return 1;
        } else {
          return -1;
        }
      })
      .slice(0, 20);
    function getBookIndex(book: any): number {
      let index = 100000;
      let nameIndex = book.name.toLowerCase().indexOf(value.toLowerCase());
      let bookNumberIndex = book.bookNumber ? book.bookNumber.toString().toLowerCase().indexOf(value.toLowerCase()) : -1;
      index = (nameIndex != -1 && nameIndex < index) ? nameIndex : index;
      index = (bookNumberIndex != -1 && bookNumberIndex < index) ? bookNumberIndex : index;
      return index;
    }
  }
  displayBook(book) {
    return book ? (typeof book == 'string' ? book : book.name + ' (' + book.bookNumber + ')') : '';
  }
  leftText(name: any): any {
    let text = (<HTMLInputElement>document.getElementById("bookInput")).value;
    let ind = name.toLowerCase().indexOf(text.toLowerCase());
    if (ind == -1)
      return name;
    if (ind > 0)
      return name.substring(0, ind);
    return '';
  }
  rightText(name: any): any {
    let text = (<HTMLInputElement>document.getElementById("bookInput")).value;
    let ind = name.toLowerCase().indexOf(text.toLowerCase());
    if (ind == -1)
      return '';
    let right = ind + text.length;
    if (right < name.length)
      return name.substring(right, name.length);
    return '';
  }
  highlightText(name: any): any {
    let text = (<HTMLInputElement>document.getElementById("bookInput")).value;
    let ind = name.toLowerCase().indexOf(text.toLowerCase());
    if (ind != -1)
      return name.substring(ind, ind + text.length);
    return '';
  }
  handleStudentListSelection(value): void {
    this.selectedStudent = value[0][0];
    this.selectedStudentSection = value[1][0];
  }
  handleEmployeeListSelection(value): void {
    this.selectedEmployee = value;
  }
  clearBookField() {
    this.selectedBookFormControl.setValue('');
    this.selectedBook = null;
  }
  clearStudentEmployeeField() {
    this.issueToFormControl.setValue('all');
    this.selectedStudent = null;
    this.selectedStudentSection = null;
    this.selectedEmployee = null;
    this.employeeList = null;
  }
  handleIssueToFieldSelect(e: any) {
    this.selectedStudent = null;
    this.selectedEmployee = null;
    this.employeeList = null;
  }
  searchBookRecords() {
    let query = {
      filter: {
        issueTime__date__gte: this.issueStartDate.value ? moment(this.issueStartDate.value).format('YYYY-MM-DD') : undefined,
        issueTime__date__lte: this.issueEndDate.value ? moment(this.issueEndDate.value).format('YYYY-MM-DD') : undefined,
      },
      order_by: ['-issueTime'],
      fields_list: ["__all__", "parentBook__name", "parentBook__bookNumber", "parentStudent__name", "parentStudent__scholarNumber", "parentEmployee__name"]
    };
    if (this.issueVisibility === 'issued') {
      query.filter['depositTime'] = null;
    } else if (this.issueVisibility === 'deposited') {
      query.filter['depositTime__date__isnull'] = false;
      query.filter['depositTime__date__gte'] = this.depositStartDate.value ? moment(this.depositStartDate.value).format('YYYY-MM-DD') : undefined;
      query.filter['depositTime__date__lte'] = this.depositEndDate.value ? moment(this.depositEndDate.value).format('YYYY-MM-DD') : undefined;
    }

    if (this.selectedBook) query.filter['parentBook_id'] = this.selectedBook.id;
    if (this.issueToFormControl.value === 'student') {
      query.filter['parentEmployee'] = null;
      if (this.selectedStudent) query.filter['parentStudent_id'] = this.selectedStudent.id;
    } else if (this.issueToFormControl.value === 'employee') {
      query.filter['parentStudent'] = null;
      if (this.selectedEmployee) query.filter['parentEmployee_id'] = this.selectedEmployee.id;
    }
    this.isRecordListLoading = true;
    this.genericService.getObjectList({ library_app: "BookIssueRecord" }, query).then((bookIssueRecordList) => {
      this.bookIssueRecordList = bookIssueRecordList;
      this.isRecordListLoading = false;
    });
  }

  displayStudentName(record) {
    if (!record.parentStudent) return 'N/A';
    let out = record.parentStudent__name;
    if (record.parentStudent__scholarNumber)
      out += ' (' + record.parentStudent__scholarNumber + ')';
    return out;
  }
}
