import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonFunctions } from './../../../../classes/common-functions';

@Component({
  selector: 'app-update-transaction-dialog',
  templateUrl: './update-transaction-dialog.html',
  styleUrls: ['./update-transaction-dialog.css']
})
export class UpdateTransactionDialogComponent implements OnInit {


  transaction: any;
  originalTransaction: any;
  vm: any;
  accountsList: any;
  maximumPermittedAmount: any;
  approval: any;
  approvalAccountDetailList: Array<any>;

  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UpdateTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      [key: string]: any,
    }) { }

  ngOnInit() {
    this.transaction = this.data.transaction;
    this.vm = this.data.vm;
    this.accountsList = this.data.vm.accountsList;
    this.maximumPermittedAmount = this.data.vm.maximumPermittedAmount;
    this.originalTransaction = this.data.originalTransaction;
    this.loadApproval();
    // console.log('this: ', this);
  }

  async loadApproval() {
    this.isLoading = true;
    const approval_request = {
      parentTransaction: this.originalTransaction.dbId,
    };
    const approvalList = await this.vm.accountsService.getObjectList(this.vm.accountsService.approval, approval_request);
    if (approvalList.length == 1) {
      this.approval = approvalList[0];
      const approval_account_details_request = {
        parentApproval: this.approval.id,
      };
      this.approvalAccountDetailList = await this.vm.accountsService.getObjectList(
        this.vm.accountsService.approval_account_details,
        approval_account_details_request
      );
    }
    this.isLoading = false;
  }

  addNewDebitAccount(): void {
    this.transaction.debitAccounts.push({});
  }

  addNewCreditAccount(): void {
    this.transaction.creditAccounts.push({});
  }

  removeDebitAccount(aIndex: any) {
    this.transaction.debitAccounts.splice(aIndex, 1);
  }

  removeCreditAccount(aIndex: any) {
    this.transaction.creditAccounts.splice(aIndex, 1);
  }

  handleAmountChange(newAmount) {
    if (this.transaction.creditAccounts.length == 1 && this.transaction.debitAccounts.length == 1) {
      this.transaction.creditAccounts[0].amount = newAmount;
      this.transaction.debitAccounts[0].amount = newAmount;
    }
    else if (this.transaction.creditAccounts.length == 1) {
      this.transaction.creditAccounts[0].amount = this.transaction.debitAccounts.reduce((accumulator, nextAccount) => accumulator + nextAccount.amount, 0);
    }
    else if (this.transaction.debitAccounts.length == 1) {
      this.transaction.debitAccounts[0].amount = this.transaction.creditAccounts.reduce((accumulator, nextAccount) => accumulator + nextAccount.amount, 0);
    }
  }

  isAmountUnEqual(): boolean {
    let totalCreditAmount = 0;
    this.transaction.creditAccounts.forEach(account => {
      if (account.amount != null)
        totalCreditAmount += account.amount;
    });
    let totalDebitAmount = 0;
    this.transaction.debitAccounts.forEach(account => {
      if (account.amount != null)
        totalDebitAmount += account.amount;
    });
    if (totalCreditAmount == totalDebitAmount) {
      return false;
    }
    else {
      return true;
    }
  }

  isApprovalRequired(): boolean {
    if (this.maximumPermittedAmount == null) {
      return false;
    }
    let totalCreditAmount = 0;
    this.transaction.creditAccounts.forEach(account => {
      if (account.amount != null)
        totalCreditAmount += account.amount;
    });
    let totalDebitAmount = 0;
    this.transaction.debitAccounts.forEach(account => {
      if (account.amount != null)
        totalDebitAmount += account.amount;
    });

    if (totalCreditAmount > this.maximumPermittedAmount || totalDebitAmount > this.maximumPermittedAmount) {
      return true;
    }
    else {
      return false;
    }
  }

  isAmountMoreThanApproval(): boolean {
    if (!this.approval) {
      return false;
    }

    let flag = false;
    this.transaction.creditAccounts.forEach(account => {
      if (!account.accountDbId) {
        return; // return of this callback function not isAmpuntMoreThanApproval function
      }
      const approvalAccountDeatils = this.approvalAccountDetailList.find(el => el.parentAccount == account.accountDbId && el.transactionType == 'CREDIT');
      if (approvalAccountDeatils) {
        if (account.amount > approvalAccountDeatils.amount) {
          flag = true;
        }
      }
      else {
        flag = true;
      }
    });

    this.transaction.debitAccounts.forEach(account => {
      if (!account.accountDbId) {
        return; // return of this callback function not isAmpuntMoreThanApproval function
      }
      const approvalAccountDeatils = this.approvalAccountDetailList.find(el => el.parentAccount == account.accountDbId && el.transactionType == 'DEBIT');
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

  isAccountNotMentioned(): boolean {
    let temp = false;
    this.transaction.debitAccounts.forEach(account => {
      if (account.dbId == null) {
        temp = true;
      }
    });

    this.transaction.creditAccounts.forEach(account => {
      if (account.dbId == null) {
        temp = true;
      }
    });
    return temp;
  }

  isAccountRepeated(): boolean {
    let temp = false;

    for (let i = 0; i < this.transaction.debitAccounts.length; i++) {
      if (this.transaction.debitAccounts[i].dbId != null) {
        for (let j = i + 1; j < this.transaction.debitAccounts.length; j++) {
          if (this.transaction.debitAccounts[j].dbId == this.transaction.debitAccounts[i].dbId) {
            temp = true;
          }
        }
        for (let j = 0; j < this.transaction.creditAccounts.length; j++) {
          if (this.transaction.creditAccounts[j].dbId == this.transaction.debitAccounts[i].dbId) {
            temp = true;
          }
        }
      }
    }

    for (let i = 0; i < this.transaction.creditAccounts.length; i++) {
      if (this.transaction.creditAccounts[i].dbId != null) {
        for (let j = i + 1; j < this.transaction.creditAccounts.length; j++) {
          if (this.transaction.creditAccounts[j].dbId == this.transaction.creditAccounts[i].dbId) {
            temp = true;
          }
        }
        for (let j = 0; j < this.transaction.debitAccounts.length; j++) {
          if (this.transaction.debitAccounts[j].dbId == this.transaction.creditAccounts[i].dbId) {
            temp = true;
          }
        }
      }
    }

    return temp;
  }

  isAmountLessThanMinimum(): boolean {
    for (let i = 0; i < this.transaction.debitAccounts.length; i++) {
      if (this.transaction.debitAccounts[i].amount < 0.01 && this.transaction.debitAccounts[i].dbId != null) {
        return true;
      }
    }
    for (let i = 0; i < this.transaction.creditAccounts.length; i++) {
      if (this.transaction.creditAccounts[i].amount < 0.01 && this.transaction.creditAccounts[i].dbId != null) {
        return true;
      }
    }
    return false;
  }

  isAddButtonDisabled(): boolean {

    if (this.isApprovalRequired() || this.isAmountUnEqual() ||
      this.isAccountNotMentioned() || this.isAccountRepeated() || this.isAmountLessThanMinimum() || this.isAmountMoreThanApproval()) {
      return true;
    }
    return false;
  }


  readURL(event, str): void {
    if (event.target.files && event.target.files[0]) {
      let image = event.target.files[0];
      if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
        alert('File type should be either jpg, jpeg, or png');
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        let tempImageData = {
          id: null,
          orderNumber: null,
          imageURL: reader.result,
        };
        if (str == 'bill') {
          this.transaction.billImages.push(tempImageData);
        }
        else {
          this.transaction.quotationImages.push(tempImageData);
        }
      };
      reader.readAsDataURL(image);
    }
  }

  getAccount(account) {
    return this.accountsList.find(accc => accc.id == account.dbId);
  }

  assignAccount(account, index, str) {
    if (str == 'debit') {
      this.transaction.debitAccounts[index] = {
        account: account.title,
        accountDbId: account.parentAccount,
        amount: this.transaction.debitAccounts[index].amount,
        dbId: account.id,
        balance: account.balance,
        parentHead: account.parentHead,
      };
    }
    else {
      this.transaction.creditAccounts[index] = {
        account: account.title,
        accountDbId: account.parentAccount,
        amount: this.transaction.creditAccounts[index].amount,
        dbId: account.id,
        balance: account.balance,
        parentHead: account.parentHead,
      };
    }

  }




  addTransaction() {
    this.vm.isLoading = true;
    let transaction_data = {
      id: this.transaction.dbId,
      remark: this.transaction.remark,
    };
    this.dialogRef.close();
    Promise.all([
      this.vm.accountsService.partiallyUpdateObject(this.vm.accountsService.transaction, transaction_data),
    ]).then(value1 => {
      let toCreateAccountList = [];
      let toUpdateAccountList = [];
      let toDeleteAccountList = [];
      let toDeleteImageList = [];
      let toUpdateImageList = [];
      const service = [];

      this.transaction.debitAccounts.forEach(account => {
        let index = this.originalTransaction.debitAccounts.map(function (e) { return e.dbId; }).indexOf(account.dbId);
        if (index == -1) {
          let tempData = {
            parentTransaction: this.transaction.dbId,
            parentAccount: account.accountDbId,
            amount: account.amount,
            transactionType: 'DEBIT',
          };
          toCreateAccountList.push(tempData);
        }
        else {
          let amountDiff = account.amount - this.originalTransaction.debitAccounts[index].amount;
          if (amountDiff != 0) {
            let tempData = {
              id: account.transactionAccountDbId,
              amount: account.amount,
            };
            toUpdateAccountList.push(tempData);
          }
          this.originalTransaction.debitAccounts.splice(index, 1);  // remoevd from original transaction
        }
      });
      this.transaction.creditAccounts.forEach(account => {
        let index = this.originalTransaction.creditAccounts.map(function (e) { return e.dbId; }).indexOf(account.dbId);
        if (index == -1) {
          let tempData = {
            parentTransaction: this.transaction.dbId,
            parentAccount: account.accountDbId,
            amount: account.amount,
            transactionType: 'CREDIT',
          };
          toCreateAccountList.push(tempData);
        }
        else {
          let amountDiff = account.amount - this.originalTransaction.creditAccounts[index].amount;
          if (amountDiff != 0) {
            let tempData = {
              id: account.transactionAccountDbId,
              amount: account.amount,
            };
            toUpdateAccountList.push(tempData);
          }
          this.originalTransaction.creditAccounts.splice(index, 1); // remoevd from original transaction
        }
      });
      this.originalTransaction.debitAccounts.forEach(account => {
        toDeleteAccountList.push(account.transactionAccountDbId);
      });
      this.originalTransaction.creditAccounts.forEach(account => {
        toDeleteAccountList.push(account.transactionAccountDbId);
      });
      let delete_data = {
        'id__in': toDeleteAccountList,
      };
      let i = 1;
      this.transaction.billImages.forEach(image => {
        let index = -1;
        image.orderNumber = i;
        image.imageType = 'BILL';
        if (image.id != null) {
          index = this.originalTransaction.billImages.map(function (e) { return e.id; }).indexOf(image.id);
        }
        if (index == -1) {
          image.parentTransaction = this.transaction.dbId;
          let tempData = JSON.parse(JSON.stringify(image));
          let temp_form_data = new FormData();
          const layout_data = { ...tempData, };
          Object.keys(layout_data).forEach(key => {
            if (key === 'imageURL') {
              temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'imageURL' + i + '.jpeg'));
            } else {
              temp_form_data.append(key, layout_data[key]);
            }
          });
          i = i + 1;
          service.push(this.data.vm.accountsService.createObject(this.data.vm.accountsService.transaction_images, temp_form_data));
        }
        else {
          if (this.originalTransaction.billImages[index].orderNumber != i) {
            let tempData = {
              id: this.originalTransaction.billImages[index].id,
              orderNumber: i,
            };
            toUpdateImageList.push(tempData);
          }
          i = i + 1;
          this.originalTransaction.billImages.splice(index, 1);
        }
      });
      i = 1;
      this.transaction.quotationImages.forEach(image => {
        let index = -1;
        image.orderNumber = i;
        image.imageType = 'QUOTATION';
        if (image.id != null) {
          index = this.originalTransaction.quotationImages.map(function (e) { return e.id; }).indexOf(image.id);
        }
        if (index == -1) {
          image.parentTransaction = this.transaction.dbId;
          let tempData = JSON.parse(JSON.stringify(image));
          let temp_form_data = new FormData();
          const layout_data = { ...tempData, };
          Object.keys(layout_data).forEach(key => {
            if (key === 'imageURL') {
              temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'imageURL' + i + '.jpeg'));
            } else {
              temp_form_data.append(key, layout_data[key]);
            }
          });
          i = i + 1;
          service.push(this.data.vm.accountsService.createObject(this.vm.accountsService.transaction_images, temp_form_data));
        }
        else {
          if (this.originalTransaction.quotationImages[index].orderNumber != i) {
            let tempData = {
              id: this.originalTransaction.quotationImages[index].id,
              orderNumber: i,
            };
            toUpdateImageList.push(tempData);
          }
          i = i + 1;
          this.originalTransaction.quotationImages.splice(index, 1);
        }
      });
      this.originalTransaction.billImages.forEach(image => {
        toDeleteImageList.push(image.id);
      });
      this.originalTransaction.quotationImages.forEach(image => {
        toDeleteImageList.push(image.id);
      });

      service.push(this.vm.accountsService.createObjectList(this.vm.accountsService.transaction_account_details, toCreateAccountList));
      service.push(this.vm.accountsService.partiallyUpdateObjectList(this.vm.accountsService.transaction_account_details, toUpdateAccountList));
      if (toDeleteAccountList.length > 0) {
        service.push(this.vm.accountsService.deleteObjectList(this.vm.accountsService.transaction_account_details, delete_data));
      }
      service.push(this.vm.accountsService.partiallyUpdateObjectList(this.vm.accountsService.transaction_images, toUpdateImageList));
      if (toDeleteImageList.length > 0) {
        let image_delete_data = {
          id__in: toDeleteImageList,
        };
        service.push(this.vm.accountsService.deleteObjectList(this.vm.accountsService.transaction_images, image_delete_data));
      }

      Promise.all(service).then(data => {
        this.populateOriginalTransaction();
        alert('Transaction Updated Successfully');
        this.vm.isLoading = false;
      });
    });
  }

  populateOriginalTransaction() {
    this.originalTransaction.transactionDate = CommonFunctions.formatDate(new Date(), '');
    this.originalTransaction.remark = this.transaction.remark;
    this.originalTransaction.billImages = [];
    this.originalTransaction.quotationImages = [];
    this.originalTransaction.debitAccounts = [];
    this.originalTransaction.creditAccounts = [];
    this.transaction.billImages.forEach(element => {
      this.originalTransaction.billImages.push(element);
    });
    this.transaction.quotationImages.forEach(element => {
      this.originalTransaction.quotationImages.push(element);
    });
    this.transaction.debitAccounts.forEach(element => {
      this.originalTransaction.debitAccounts.push(element);
    });
    this.transaction.creditAccounts.forEach(element => {
      this.originalTransaction.creditAccounts.push(element);
    });
  }

  deleteTransaction() {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    this.vm.isLoading = true;
    let transaction_data = {
      id: this.transaction.dbId,
    };
    this.dialogRef.close();
    Promise.all([
      this.vm.accountsService.deleteObject(this.vm.accountsService.transaction, transaction_data),
    ]).then(val => {
      const transactionIndex = this.data.vm.transactionsList.findIndex(t => t.dbId == transaction_data.id);
      this.data.vm.transactionsList.splice(transactionIndex, 1);
      alert('Transaction Deleted Successfully');
      this.vm.isLoading = false;
    });
  }


}
