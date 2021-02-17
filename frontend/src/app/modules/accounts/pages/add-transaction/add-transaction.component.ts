import {Component, Input, OnInit} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import { AddTransactionServiceAdapter } from './add-transaction.service.adapter'
import { AccountsService } from './../../../../services/modules/accounts/accounts.service'
import { CommonFunctions } from './../../../../classes/common-functions'
import {MatDialog} from '@angular/material';
import { ImagePreviewDialogComponent } from './../../components/image-preview-dialog/image-preview-dialog.component'
import { SchoolService } from './../../../../services/modules/school/school.service'

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

    // @Input() user;
    user: any;
    isLoading: any;
    accountsList: any;

    selectedDate: any;

    transactions: any[];


    debitAccount: any;
    debitAmount: any;
    creditAccount: any;
    creditAmount: any;
    serviceAdapter: any;
    autoAdd: any;

    approvalsList: any;
    moreTransaction: any;
    maximumPermittedAmount: any;
    
    minimumDate: any;
    maximumDate: any;

    constructor( 
      public accountsService: AccountsService,
      public dialog: MatDialog,
      public schoolService: SchoolService,
    ){ }
    // Server Handling - Initial
    ngOnInit(): void {
      this.user = DataStorage.getInstance().getUser();
      this.transactions = [];
      this.selectedDate = CommonFunctions.formatDate(new Date(), '');
      this.serviceAdapter = new AddTransactionServiceAdapter;
      this.serviceAdapter.initializeAdapter(this);
      this.serviceAdapter.initializeData();
      this.moreTransaction = 1;
      this.addNewTransaction();
      this.autoAdd = false;
    }

    func(){
      console.log(this.selectedDate);
    }
    
    addNewTransaction(): void{
      for(let i=0;i<this.moreTransaction; i++){
        let transaction = {
          debitAccounts: [],
          creditAccounts: [],
          remark: null,
          billImages: [],
          quotationImages: [],
          approvalId: null,
          approvalDbId: null,
          
        }
        this.transactions.push(transaction);
        this.addNewDebitAccount(this.transactions.length - 1);
        this.addNewCreditAccount(this.transactions.length - 1);
      }
    }

    addNewDebitAccount(index: any): void{
      this.transactions[index].debitAccounts.push({
        debitAccount: null,
        debitAmount: null,
      })
    }

    addNewCreditAccount(index: any): void{
      this.transactions[index].creditAccounts.push({
        creditAccount: null,
        creditAmount: null,
      })
    }

    removeTransaction(index: any){
      this.transactions.splice(index, 1);
    }

    removeDebitAccount(tIndex: any, aIndex: any){
      this.transactions[tIndex].debitAccounts.splice(aIndex, 1);
    }
    
    removeCreditAccount(tIndex: any, aIndex: any){
      this.transactions[tIndex].creditAccounts.splice(aIndex, 1);
    }

    handleAmountChange(transaction: any){
      let totalCreditAmount = 0;
      transaction.creditAccounts.forEach(account =>{
        totalCreditAmount += account.creditAmount;
      })
      let totalDebitAmount = 0;
      transaction.debitAccounts.forEach(account =>{
        totalDebitAmount += account.debitAmount;
      })
      if(transaction.debitAccounts.length>1 && transaction.creditAccounts.length>1){
        
      }
      else if(transaction.creditAccounts.length == 1){                                                      
        if(transaction.creditAccounts[0].creditAmount < totalDebitAmount){
          transaction.creditAccounts[0].creditAmount = totalDebitAmount;
        }
      }
      else{
        if(transaction.debitAccounts[0].debitAmount < totalCreditAmount){
          transaction.debitAccounts[0].debitAmount = totalCreditAmount;
        }
      }
    }

    isAmountUnEqual(transaction):boolean{
      let totalCreditAmount = 0;
      transaction.creditAccounts.forEach(account =>{
        totalCreditAmount += account.creditAmount;
      })
      let totalDebitAmount = 0;
      transaction.debitAccounts.forEach(account =>{
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
      if(transaction.approvalId != null){
        return false;
      }
      let totalCreditAmount = 0;
      transaction.creditAccounts.forEach(account =>{
        totalCreditAmount += account.creditAmount;
      })
      let totalDebitAmount = 0;
      transaction.debitAccounts.forEach(account =>{
        totalDebitAmount += account.debitAmount;
      })
      
      if(totalCreditAmount > this.maximumPermittedAmount || totalDebitAmount > this.maximumPermittedAmount){
        return true;
      }
      else{
        return false;
      }
    }

    isAmountMoreThanApproval(transaction): boolean{
      if(transaction.approvalId == null){
        return false;
      }
      let maxAmount = this.approvalsList.find(approval => approval.dbId == transaction.approvalDbId).totalAmount;
      let totalCreditAmount = 0;
      transaction.creditAccounts.forEach(account =>{
        totalCreditAmount += account.creditAmount;
      })
      let totalDebitAmount = 0;
      transaction.debitAccounts.forEach(account =>{
        totalDebitAmount += account.debitAmount;
      })
      if(totalCreditAmount > maxAmount || totalDebitAmount > maxAmount){
        return true;
      }
      return false;

    }

    // isReapprovalRequired(transaction): boolean{
    //   if(transaction.approvalId == null){
    //     return false;
    //   }
    //   let temp = false;
    //   for(let i=0;i<this.transactions.length; i++){
    //     if(this.isApprovalRequired(this.transactions[i]) == true){
    //       temp = true;
    //       return temp;
    //     }
    //   }
    //   return temp;
    // }

    isApprovalAttached(transaction): boolean{
      if(transaction.approvalId != null){
        return true;
      }
      return false;
    }



    isAccountNotMentioned(transaction): boolean{
      // console.log(transaction);
      let temp = false;
      transaction.debitAccounts.forEach(account =>{
        if(account.debitAccount == null){
          temp = true;
        }
      })
      
      transaction.creditAccounts.forEach(account =>{
        if(account.creditAccount == null){
          temp = true;
        }
      })
      return temp;
    }

    isAccountRepeated(transaction): boolean{
      let temp = false;
      
      for(let i=0;i<transaction.debitAccounts.length ;i++){
        if(transaction.debitAccounts[i].debitAccount != null){
          for(let j=i+1;j<transaction.debitAccounts.length; j++){
            if(transaction.debitAccounts[j].debitAccount == transaction.debitAccounts[i].debitAccount){
              temp = true;
            }
          }
          for(let j=0;j<transaction.creditAccounts.length; j++){
            if(transaction.creditAccounts[j].creditAccount == transaction.debitAccounts[i].debitAccount){
              temp = true;
            }
          }
        }
      }

      for(let i=0;i<transaction.creditAccounts.length ;i++){
        if(transaction.creditAccounts[i].creditAccount != null){
          for(let j=i+1;j<transaction.creditAccounts.length; j++){
            if(transaction.creditAccounts[j].creditAccount == transaction.creditAccounts[i].creditAccount){
              temp = true;
            }
          }
          for(let j=0;j<transaction.debitAccounts.length; j++){
            if(transaction.debitAccounts[j].debitAccount == transaction.creditAccounts[i].creditAccount){
              temp = true;
            }
          }
        }
      }

      return temp;
    }

    isAddButtonDisabled(): boolean{
      for(let i=0;i<this.transactions.length; i++){
        if(this.isApprovalRequired(this.transactions[i]) || this.isAmountUnEqual(this.transactions[i]) || 
        this.isAccountNotMentioned(this.transactions[i]) || this.isAccountRepeated(this.transactions[i]) || 
        this.isAmountMoreThanApproval(this.transactions[i]) ){
          return true;
        }
      }
      return false;
    }

    isApprovalButtonDisabled(): boolean{
      for(let i=0;i<this.transactions.length; i++){
        if(this.isAmountUnEqual(this.transactions[i]) || this.isAccountNotMentioned(this.transactions[i]) || 
        this.isAccountRepeated(this.transactions[i]) || this.isAmountMoreThanApproval(this.transactions[i]) ||
        this.isApprovalAttached(this.transactions[i])){
          return true;
        }
      }
      return false;
    }

    readURL(event, transaction, str): void {
      console.log(str);
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
    transaction.debitAccounts = approval.debitAccounts;
    transaction.creditAccounts = approval.creditAccounts;
    transaction.billImages = approval.billImages;
    transaction.quotationImages = approval.quotationImages;
    transaction.approvalDbId = approval.dbId,
    console.log(approval);
    console.log(transaction);

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