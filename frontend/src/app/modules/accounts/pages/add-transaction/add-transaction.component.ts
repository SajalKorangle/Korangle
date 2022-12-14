import { Component, OnInit } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";
import { AccountsService } from './../../../../services/modules/accounts/accounts.service';
import { CommonFunctions } from './../../../../classes/common-functions';
import { MatDialog } from '@angular/material';
import { ImagePreviewDialogComponent } from './../../components/image-preview-dialog/image-preview-dialog.component';
import { GenericService } from '@services/generic/generic-service';

import { AddTransactionServiceAdapter } from './add-transaction.service.adapter';
import { AddTransactionHtmlRenderer } from './add-transaction.html.renderer';
import { AddTransactionBackendData } from './add-transaction.backend.data';

@Component({
  selector: 'add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css'],
  providers: [
    AccountsService,
    GenericService,
  ]
})

export class AddTransactionComponent implements OnInit {

  user: any;

  selectedDate: any;

  transactionList: any[];

  maximumPermittedAmount: any;

  lockAccounts: any;

  serviceAdapter: AddTransactionServiceAdapter;
  htmlRenderer: AddTransactionHtmlRenderer;
  backendData: AddTransactionBackendData;

  isLoading: any;

  constructor(
    public accountsService: AccountsService,
    public dialog: MatDialog,
    public genericService: GenericService,
  ) { }

  // Server Handling - Initial
  ngOnInit(): void {
    this.user = DataStorage.getInstance().getUser();
    this.transactionList = [];

    this.htmlRenderer = new AddTransactionHtmlRenderer();
    this.htmlRenderer.initializeRenderer(this);

    this.backendData = new AddTransactionBackendData();
    this.backendData.initializeData(this);

    this.serviceAdapter = new AddTransactionServiceAdapter;
    this.serviceAdapter.initializeAdapter(this);

    this.serviceAdapter.initializeData();
    // console.log("this", this);
  }

  initilizeDate(): void {
    const today = new Date();
    const sessionStartDate = new Date(this.htmlRenderer.minimumDate);
    const sessionEndDate = new Date(this.htmlRenderer.maximumDate);
    if (today >= sessionStartDate && today <= sessionEndDate)
      this.selectedDate = CommonFunctions.formatDate(new Date(), '');
    else
      this.selectedDate = CommonFunctions.formatDate(sessionEndDate, '');
  }

  removeTransaction(index: any) {
    this.transactionList.splice(index, 1);
  }

  removeDebitAccount(tIndex: any, aIndex: any) {
    this.transactionList[tIndex].debitAccountList.splice(aIndex, 1);
  }

  removeCreditAccount(tIndex: any, aIndex: any) {
    this.transactionList[tIndex].creditAccountList.splice(aIndex, 1);
  }

  handleAmountChange(transaction: any, newAmount: number) {
    if (transaction.creditAccountList.length == 1 && transaction.debitAccountList.length == 1) {
      transaction.creditAccountList[0].amount = newAmount;
      transaction.debitAccountList[0].amount = newAmount;
    }
    else if (transaction.creditAccountList.length == 1) {
      transaction.creditAccountList[0].amount = transaction.debitAccountList.reduce((accumulator, nextAccount) => accumulator + nextAccount.amount, 0);
    }
    else if (transaction.debitAccountList.length == 1) {
      transaction.debitAccountList[0].amount = transaction.creditAccountList.reduce((accumulator, nextAccount) => accumulator + nextAccount.amount, 0);
    }
  }

  isAmountUnEqual(transaction): boolean {
    let totalCreditAmount = 0;
    transaction.creditAccountList.forEach(account => {
      totalCreditAmount += account.amount;
    });
    let totalDebitAmount = 0;
    transaction.debitAccountList.forEach(account => {
      totalDebitAmount += account.amount;
    });
    if (totalCreditAmount == totalDebitAmount) {
      return false;
    }
    else {
      return true;
    }
  }

  isApprovalRequired(transaction): boolean {
    if (transaction.approval != null || this.maximumPermittedAmount == null) {
      return false;
    }
    let totalCreditAmount = 0;
    transaction.creditAccountList.forEach(account => {
      totalCreditAmount += account.amount;
    });
    let totalDebitAmount = 0;
    transaction.debitAccountList.forEach(account => {
      totalDebitAmount += account.amount;
    });

    if (totalCreditAmount > this.maximumPermittedAmount || totalDebitAmount > this.maximumPermittedAmount) {
      return true;
    } else {
      return false;
    }
  }

  isAmountLessThanMinimum(transaction): boolean {
    for (let i = 0; i < transaction.debitAccountList.length; i++) {
      if (transaction.debitAccountList[i].amount < 0.01 && transaction.debitAccountList[i].parentAccount != null) {
        return true;
      }
    }
    for (let i = 0; i < transaction.creditAccountList.length; i++) {
      if (transaction.creditAccountList[i].amount < 0.01 && transaction.creditAccountList[i].parentAccount != null) {
        return true;
      }
    }
    return false;
  }
  isAmountMoreThanMaximum(transaction): boolean {
    for (let i = 0; i < transaction.debitAccountList.length; i++) {
      if (transaction.debitAccountList[i].amount > 99999999.99 && transaction.debitAccountList[i].parentAccount != null) {
        return true;
      }
    }
    for (let i = 0; i < transaction.creditAccountList.length; i++) {
      if (transaction.creditAccountList[i].amount > 99999999.99 && transaction.creditAccountList[i].parentAccount != null) {
        return true;
      }
    }
    return false;
  }

  isAmountMoreThanApproval(transaction): boolean {
    if (transaction.approval == null) {
      return false;
    }

    const parentApproval = transaction.approval;
    let flag = false;
    transaction.creditAccountList.forEach(account => {
      if (!account.parentAccount) {
        return; // return of this callback function not isAmpuntMoreThanApproval function
      }
      const approvalAccountDeatils = this.backendData.approvalAccountDetailsList.find(el => el.parentApproval == parentApproval.id
        && el.parentAccount == account.parentAccount
        && el.transactionType == 'CREDIT');
      if (approvalAccountDeatils) {
        if (account.amount > approvalAccountDeatils.amount) {
          flag = true;
        }
      }
      else {
        flag = true;
      }
    });

    transaction.debitAccountList.forEach(account => {
      if (!account.parentAccount) {
        return; // return of this callback function not isAmpuntMoreThanApproval function
      }
      const approvalAccountDeatils = this.backendData.approvalAccountDetailsList.find(el => el.parentApproval == parentApproval.id
        && el.parentAccount == account.parentAccount
        && el.transactionType == 'DEBIT');
      if (approvalAccountDeatils) {
        if (account.amount > approvalAccountDeatils.amount) {
          flag = true;
        }
      }
      else {
        flag = true;
      }
    });
    return flag;
  }

  isAccountNotMentioned(transaction): boolean {
    let temp = false;
    transaction.debitAccountList.forEach(account => {
      if (account.parentAccount == null) {
        temp = true;
      }
    });

    transaction.creditAccountList.forEach(account => {
      if (account.parentAccount == null) {
        temp = true;
      }
    });
    return temp;
  }

  isAccountRepeated(transaction): boolean {
    let temp = false;

    for (let i = 0; i < transaction.debitAccountList.length; i++) {
      if (transaction.debitAccountList[i].parentAccount != null) {
        for (let j = i + 1; j < transaction.debitAccountList.length; j++) {
          if (transaction.debitAccountList[j].parentAccount == transaction.debitAccountList[i].parentAccount) {
            temp = true;
          }
        }
        for (let j = 0; j < transaction.creditAccountList.length; j++) {
          if (transaction.creditAccountList[j].parentAccount == transaction.debitAccountList[i].parentAccount) {
            temp = true;
          }
        }
      }
    }

    for (let i = 0; i < transaction.creditAccountList.length; i++) {
      if (transaction.creditAccountList[i].parentAccount != null) {
        for (let j = i + 1; j < transaction.creditAccountList.length; j++) {
          if (transaction.creditAccountList[j].parentAccount == transaction.creditAccountList[i].parentAccount) {
            temp = true;
          }
        }
        for (let j = 0; j < transaction.debitAccountList.length; j++) {
          if (transaction.debitAccountList[j].parentAccount == transaction.creditAccountList[i].parentAccount) {
            temp = true;
          }
        }
      }
    }

    return temp;
  }

  readURL(event, transaction, str): void {
    if (event.target.files && event.target.files[0]) {
      let image = event.target.files[0];
      if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
        alert('File type should be either jpg, jpeg, or png');
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        let tempImageData = {
          orderNumber: null,
          imageURL: reader.result,
        };
        if (str == 'bill') {
          transaction.billImages.push(tempImageData);
        }
        else {
          transaction.quotationImages.push(tempImageData);
        }
      };
      reader.readAsDataURL(image);
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

}
