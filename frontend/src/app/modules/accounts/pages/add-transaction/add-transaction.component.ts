import {Component, Input, OnInit} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import { AccountsService } from './../../../../services/modules/accounts/accounts.service'
import { CommonFunctions } from './../../../../classes/common-functions'
import {MatDialog} from '@angular/material';
import { ImagePreviewDialogComponent } from './../../components/image-preview-dialog/image-preview-dialog.component';
import { SchoolService } from './../../../../services/modules/school/school.service';

import { AddTransactionServiceAdapter } from './add-transaction.service.adapter'
import { AddTransactionHtmlRenderer } from './add-transaction.html.renderer';
import { AddTransactionBackendData } from './add-transaction.backend.data';

@Component({
  selector: 'add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css'],
  providers: [
    AccountsService,
    SchoolService,
  ]
    
})

export class AddTransactionComponent implements OnInit {

    user: any;
    isLoading: any;

    selectedDate: any;

    transactionList: any[];

    debitAccount: any;
    debitAmount: any;
    creditAccount: any;
    creditAmount: any;

    approvalsList: any;
    maximumPermittedAmount: any;
    
    lockAccounts: any;

    serviceAdapter: any;
    htmlRenderer: any;
    backendData: any;
    
    constructor( 
      public accountsService: AccountsService,
      public dialog: MatDialog,
      public schoolService: SchoolService,
    ) { }

    // Server Handling - Initial
    ngOnInit(): void {

        this.user = DataStorage.getInstance().getUser();
        this.transactionList = [];
        this.selectedDate = CommonFunctions.formatDate(new Date(), '');

        this.htmlRenderer = new AddTransactionHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);

        this.backendData = new AddTransactionBackendData();
        this.backendData.initializeData(this);

        this.serviceAdapter = new AddTransactionServiceAdapter;
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

    }

    removeTransaction(index: any){
      this.transactionList.splice(index, 1);
    }

    removeDebitAccount(tIndex: any, aIndex: any){
      this.transactionList[tIndex].debitAccountList.splice(aIndex, 1);
    }
    
    removeCreditAccount(tIndex: any, aIndex: any){
      this.transactionList[tIndex].creditAccountList.splice(aIndex, 1);
    }

    handleAmountChange(transaction: any){
      let totalCreditAmount = 0;
      transaction.creditAccountList.forEach(account =>{
        totalCreditAmount += account.creditAmount;
      })
      let totalDebitAmount = 0;
      transaction.debitAccountList.forEach(account =>{
        totalDebitAmount += account.debitAmount;
      })
      if(transaction.debitAccountList.length>1 && transaction.creditAccountList.length>1){
        
      }
      else if(transaction.creditAccountList.length == 1){                                                      
        if(transaction.creditAccountList[0].creditAmount < totalDebitAmount){
          transaction.creditAccountList[0].creditAmount = totalDebitAmount;
        }
      }
      else{
        if(transaction.debitAccountList[0].debitAmount < totalCreditAmount){
          transaction.debitAccountList[0].debitAmount = totalCreditAmount;
        }
      }
    }

    isAmountUnEqual(transaction):boolean{
      let totalCreditAmount = 0;
      transaction.creditAccountList.forEach(account =>{
        totalCreditAmount += account.creditAmount;
      })
      let totalDebitAmount = 0;
      transaction.debitAccountList.forEach(account =>{
        totalDebitAmount += account.debitAmount;
      })
      if(totalCreditAmount == totalDebitAmount){
        return false;
      }
      else{
        return true;
      }
    }

    isApprovalRequired(transaction): boolean{
      if(transaction.approvalId != null || this.maximumPermittedAmount == null){
        return false;
      }
      let totalCreditAmount = 0;
      transaction.creditAccountList.forEach(account =>{
        totalCreditAmount += account.creditAmount;
      })
      let totalDebitAmount = 0;
      transaction.debitAccountList.forEach(account =>{
        totalDebitAmount += account.debitAmount;
      })
      
      if(totalCreditAmount > this.maximumPermittedAmount || totalDebitAmount > this.maximumPermittedAmount){
        return true;
      }
      else{
        return false;
      }
    }

    isAmountLessThanMinimum(transaction): boolean{
      for(let i=0;i<transaction.debitAccountList.length; i++){
        if(transaction.debitAccountList[i].debitAmount < 0.01 && transaction.debitAccountList[i].debitAccount != null){
          return true;
        }
      }
      for(let i=0;i<transaction.creditAccountList.length; i++){
        if(transaction.creditAccountList[i].creditAmount < 0.01 && transaction.creditAccountList[i].creditAccount != null){
          return true;
        }
      }
      return false;
    }

    isAmountMoreThanApproval(transaction): boolean{
      if(transaction.approvalId == null){
        return false;
      }
      let maxAmount = this.approvalsList.find(approval => approval.dbId == transaction.approvalDbId).totalAmount;
      let totalCreditAmount = 0;
      transaction.creditAccountList.forEach(account =>{
        totalCreditAmount += account.creditAmount;
      })
      let totalDebitAmount = 0;
      transaction.debitAccountList.forEach(account =>{
        totalDebitAmount += account.debitAmount;
      })
      if(totalCreditAmount > maxAmount || totalDebitAmount > maxAmount){
        return true;
      }
      return false;

    }

    isApprovalAttached(transaction): boolean {
      if(transaction.approvalId != null){
        return true;
      }
      return false;
    }

    isAccountNotMentioned(transaction): boolean {
      let temp = false;
      transaction.debitAccountList.forEach(account =>{
        if(account.debitAccount == null){
          temp = true;
        }
      })
      
      transaction.creditAccountList.forEach(account =>{
        if(account.creditAccount == null){
          temp = true;
        }
      })
      return temp;
    }

    isAccountRepeated(transaction): boolean{
      let temp = false;
      
      for(let i=0;i<transaction.debitAccountList.length ;i++){
        if(transaction.debitAccountList[i].debitAccount != null){
          for(let j=i+1;j<transaction.debitAccountList.length; j++){
            if(transaction.debitAccountList[j].debitAccount == transaction.debitAccountList[i].debitAccount){
              temp = true;
            }
          }
          for(let j=0;j<transaction.creditAccountList.length; j++){
            if(transaction.creditAccountList[j].creditAccount == transaction.debitAccountList[i].debitAccount){
              temp = true;
            }
          }
        }
      }

      for(let i=0;i<transaction.creditAccountList.length ;i++){
        if(transaction.creditAccountList[i].creditAccount != null){
          for(let j=i+1;j<transaction.creditAccountList.length; j++){
            if(transaction.creditAccountList[j].creditAccount == transaction.creditAccountList[i].creditAccount){
              temp = true;
            }
          }
          for(let j=0;j<transaction.debitAccountList.length; j++){
            if(transaction.debitAccountList[j].debitAccount == transaction.creditAccountList[i].creditAccount){
              temp = true;
            }
          }
        }
      }

      return temp;
    }

    readURL(event, transaction, str): void {
      console.log(str);
      if (event.target.files && event.target.files[0]) {
          let image = event.target.files[0];
          console.log(image);
          if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
              alert('File type should be either jpg, jpeg, or png');
              return;
          }
          
          const reader = new FileReader();
          reader.onload = e => {
              let tempImageData = {
                  orderNumber: null,
                  imageURL: reader.result,
              }
              if(str == 'bill'){
                transaction.billImages.push(tempImageData);
              }
              else{
                transaction.quotationImages.push(tempImageData);
              }
          };
          reader.readAsDataURL(image);
      }
      console.log(transaction.billImages);
      console.log(transaction.quotationImages);
    }

    assignApproval(approval, transaction){
        transaction.approvalId = approval.approvalId;
        transaction.remark = approval.remark;
        transaction.debitAccountList = approval.debitAccountList;
        transaction.creditAccountList = approval.creditAccountList;
        transaction.billImages = approval.billImages;
        transaction.quotationImages = approval.quotationImages;
        transaction.approvalDbId = approval.dbId;
    }

    openImagePreviewDialog(images: any, index: any, editable): void {
      console.log(images);
      const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100%',
          width: '100%',
          data: {'images': images, 'index': index, 'editable': editable, 'isMobile': false}
      });

      dialogRef.afterClosed().subscribe(result => {
      });
    }

}
