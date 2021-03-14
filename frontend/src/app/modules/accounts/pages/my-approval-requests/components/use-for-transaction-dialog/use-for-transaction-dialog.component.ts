import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonFunctions } from '../../../../../../classes/common-functions'

@Component({
  selector: 'app-use-for-transaction-dialog',
  templateUrl: './use-for-transaction-dialog.component.html',
  styleUrls: ['./use-for-transaction-dialog.component.css']
})
export class UseFortransactionDialogComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<UseFortransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: {
      [key: string]: any,
     })
  { }

  ngOnInit() {
    console.log(this.data);
  }

  readURL(event, str): void {
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
              this.data.approval.billImages.push(tempImageData);
            }
            else{
              this.data.approval.quotationImages.push(tempImageData);
            }
        };
        reader.readAsDataURL(image);
    }
    console.log(this.data.approval.billImages);
    console.log(this.data.approval.quotationImages);
  }

  isAmountMoreThanApproved(): boolean{
    let maxAmount = 0;
    this.data.originalApproval.creditAccounts.forEach(account =>{
      maxAmount += account.amount;
    })
    let totalCreditAmount = 0;
    this.data.approval.creditAccounts.forEach(account =>{
      totalCreditAmount += account.amount;
    })
    let totalDebitAmount = 0;
    this.data.approval.debitAccounts.forEach(account =>{
      totalDebitAmount += account.amount;
    })
    if(totalCreditAmount > maxAmount || totalDebitAmount > maxAmount){
      return true;
    }
    return false;
  }

  isAmountUnequal(): boolean{
    let totalCreditAmount = 0;
    this.data.approval.creditAccounts.forEach(account =>{
      totalCreditAmount += account.amount;
    })
    let totalDebitAmount = 0;
    this.data.approval.debitAccounts.forEach(account =>{
      totalDebitAmount += account.amount;
    })
    if(totalCreditAmount != totalDebitAmount){
      return true;
    }
    return false;
  }

  getMaximumApprovedAmount(){
    let maxAmount = 0;
    this.data.originalApproval.creditAccounts.forEach(account =>{
      maxAmount += account.amount;
    })
    return maxAmount;
  }

  addTransaction(): any{
    let data = {
      'parentEmployee__parentSchool': this.data.vm.user.activeSchool.dbId,
      'transactionDate__gte': this.data.vm.minimumDate,
      'transactionDate__lte': this.data.vm.maximumDate,
      'korangle__order': '-voucherNumber',
      'korangle__count': '0,1',
    }
    let lastVoucherNumber = 1;
    Promise.all([
        this.data.vm.accountsService.getObjectList(this.data.vm.accountsService.transaction, data),
    ]).then(val =>{
      console.log(val[0]);
        if(val[0].length > 0){
            lastVoucherNumber = val[0][0].voucherNumber + 1;
        }
        let transaction_data = {
            parentEmployee: this.data.approval.requestedBy,
            voucherNumber: lastVoucherNumber,
            remark: this.data.approval.remark,
            transactionDate: this.data.approval.transactionDate,
            approvalId: this.data.approval.approvalId,

        }
        console.log(transaction_data);
        Promise.all([
            this.data.vm.accountsService.createObject(this.data.vm.accountsService.transaction, transaction_data),
        ]).then(value1 =>{
            console.log(value1);
            let toCreateAccountList = [];
            let toUpdateAccountBalanceList = [];
            const service = [];

            // value[0].forEach((element,index) =>{
            this.data.approval.debitAccounts.forEach(account =>{
                let tempData = {
                    parentTransaction: value1[0].id,
                    parentAccount: account.accountDbId,
                    amount: account.amount,
                    transactionType: 'DEBIT',
                }
                toCreateAccountList.push(tempData);
                let tempData1 = {
                    id: account.dbId,
                    balance: account.balance + account.amount,
                }
                toUpdateAccountBalanceList.push(tempData1);
            });
            this.data.approval.creditAccounts.forEach(account =>{
                let tempData = {
                    parentTransaction: value1[0].id,
                    parentAccount: account.accountDbId,
                    amount: account.amount,
                    transactionType: 'CREDIT',
                }
                toCreateAccountList.push(tempData);
                
                let tempData1 = {
                    id: account.dbId,
                    balance: account.balance - account.amount,
                }
                toUpdateAccountBalanceList.push(tempData1);
            });
                
                
            let i=1;
            this.data.approval.billImages.forEach(image =>{
            let tempData = {
                parentTransaction: value1[0].id,
                imageURL: image.imageURL,
                orderNumber: i,
                imageType: 'BILL',
            }
            let temp_form_data = new FormData();
            const layout_data = { ...tempData,};
            Object.keys(layout_data).forEach(key => {
                if (key === 'imageURL' ) {
                    temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'imageURL' + i +'.jpeg'));
                } else {
                    temp_form_data.append(key, layout_data[key]);
                }
            });
            i = i + 1;
            service.push(this.data.vm.accountsService.createObject(this.data.vm.accountsService.transaction_images, temp_form_data))

            })
                
            i=1;
            this.data.approval.quotationImages.forEach(image =>{
                let tempData = {
                    parentTransaction: value1[0].id,
                    imageURL: image.imageURL,
                    orderNumber: i,
                    imageType: 'QUOTATION',
                }
                let temp_form_data = new FormData();
                const layout_data = { ...tempData,};
                Object.keys(layout_data).forEach(key => {
                    if (key === 'imageURL' ) {
                        temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'imageURL' + i +'.jpeg'));
                    } else {
                        temp_form_data.append(key, layout_data[key]);
                    }
                });
                i = i + 1;
                service.push(this.data.vm.accountsService.createObject(this.data.vm.accountsService.transaction_images, temp_form_data))
            })
            service.push(this.data.vm.accountsService.createObjectList(this.data.vm.accountsService.transaction_account_details, toCreateAccountList));
            service.push(this.data.vm.accountsService.partiallyUpdateObjectList(this.data.vm.accountsService.account_session, toUpdateAccountBalanceList));
            
            let tempData = {
                id: this.data.approval.dbId,
                parentTransaction: value1[0].id,
            }
            this.data.approval.parentTransaction = value1[0].id;
            this.data.approval.approvedGenerationDateTime = CommonFunctions.formatDate(new Date(), ''),
            service.push(this.data.vm.accountsService.partiallyUpdateObject(this.data.vm.accountsService.approval, tempData))


            // });
            Promise.all(service).then(data =>{
                console.log(data);
                this.data.originalApproval.parentTransaction = value1[0].id;
                this.populateOriginalApproval();
                alert('Transaction Recorded Successfully');
                this.dialogRef.close();
            })

        })
    })

  }

  populateOriginalApproval(){
    this.data.originalApproval.transactionDate = CommonFunctions.formatDate(new Date(), '');
    this.data.originalApproval.remark = this.data.approval.remark;
    this.data.originalApproval.billImages = [];
    this.data.originalApproval.quotationImages = [];
    this.data.originalApproval.debitAccounts = [];
    this.data.originalApproval.creditAccounts = [];
    this.data.approval.billImages.forEach(element =>{
      this.data.originalApproval.billImages.push(element);
    })
    this.data.approval.quotationImages.forEach(element =>{
      this.data.originalApproval.quotationImages.push(element);
    })
    this.data.approval.debitAccounts.forEach(element =>{
      this.data.originalApproval.debitAccounts.push(element);
    })
    this.data.approval.creditAccounts.forEach(element =>{
      this.data.originalApproval.creditAccounts.push(element);
    })
  }
  
}
