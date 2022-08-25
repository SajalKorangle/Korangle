import { Component, Input, OnInit, HostListener } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";
import { UpdateTransactionServiceAdapter } from './update-transaction.service.adapter';
import { AccountsService } from './../../../../services/modules/accounts/accounts.service';
import { SchoolService } from './../../../../services/modules/school/school.service';
import { ImagePreviewDialogComponent } from './../../components/image-preview-dialog/image-preview-dialog.component';
import { UpdateTransactionDialogComponent } from './../../components/update-transaction-dialog/update-transaction-dialog.component';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'update-transaction',
  templateUrl: './update-transaction.component.html',
  styleUrls: ['./update-transaction.component.css'],
  providers: [
    AccountsService,
    SchoolService,
  ]
})

export class UpdateTransactionComponent implements OnInit {

  user: any;
  serviceAdapter: UpdateTransactionServiceAdapter;
  isLoading: any;

  searchTypeList = [
    'Voucher No.',
    'Account',
  ];

  isLoadingTransaction: any;
  loadMoreTransaction: boolean;
  loadingCount = 15;
  maximumPermittedAmount: any;
  shouldTransactionsBeEmpty: boolean;

  isVNumberEmpty = true;

  transactionsList: any;
  accountsList: any;
  searchType = this.searchTypeList[0];
  minimumDate: any;
  maximumDate: any;

  lockAccounts: any;

  constructor(
    public accountsService: AccountsService,
    public schoolService: SchoolService,
    public dialog: MatDialog,
  ) { }
  // Server Handling - Initial
  ngOnInit(): void {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new UpdateTransactionServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
  }

  handleSelection(selectedSearchType:any) {
    console.log(selectedSearchType);
    
    this.searchType = selectedSearchType;
    this.shouldTransactionsBeEmpty = false;
  }

  getDisplayDateFormat(str: any) {
    // return str;
    let d = new Date(str);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('/');
  }

  @HostListener('window:scroll', ['$event']) onScrollEvent(event) {
    if ((document.documentElement.clientHeight + document.documentElement.scrollTop) > (0.7 * document.documentElement.scrollHeight)
      && this.loadMoreTransaction == true && this.isLoadingTransaction == false) {
      this.serviceAdapter.loadMoreTransaction();
    }
  }




  openImagePreviewDialog(images: any, index: any, editable): void {
    const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: { 'images': images, 'index': index, 'editable': editable, 'isMobile': false }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openUpdateTransactionDialog(transaction): void {
    const dialogRef = this.dialog.open(UpdateTransactionDialogComponent, {

      data: {
        transaction: JSON.parse(JSON.stringify(transaction)),
        vm: this,
        originalTransaction: transaction
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onVnumberChange(vNumber:any): void {
    if(vNumber == "" || vNumber == null) {
      this.isVNumberEmpty = true;
    } else {
      this.isVNumberEmpty = false;
    }
  }

}
