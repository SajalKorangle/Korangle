import { ViewTransactionsComponent } from './view-transactions.component'
import { PRINT_TRANSACTIONS } from '../../../../print/print-routes.constants';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';

export class ViewTransactionsServiceAdapter { 
    
    vm: ViewTransactionsComponent;

    percent_download_comlpleted ;
    download;
    totalFiles;
    downloadedFiles;
    totalFailed;
    

    initialiseAdapter(vm: ViewTransactionsComponent){
        this.vm = vm;
    }


    initialiseData(){
        this.vm.transactionsList = [];
        this.vm.isInitialLoading = true;
        this.vm.isLoading = true;
        this.vm.isLoadingTransaction = true;
        this.vm.loadMoreTransactions = true;

        let request_account_session_data = {
            parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId, 
        }

        let request_account_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        }

        
        let employee_all_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
        };
        
        let employee_data = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
        }

        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, request_account_session_data), //0
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_all_data),  //1 
            this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, request_account_data),    //2
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}),    //3
            this.vm.accountsService.getObjectList(this.vm.accountsService.employee_amount_permission, employee_data),  //4
        ]).then(value =>{
            if(value[4].length > 0){
                this.vm.maximumPermittedAmount = value[4][0].restrictedAmount;
            }
            // console.log(value);
            this.vm.minimumDate = value[3].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId).startDate;  // change for current session
            this.vm.maximumDate = value[3].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId).endDate;
            console.log(this.vm.minimumDate, this.vm.maximumDate);
            this.initialiseGroupsAndAccountList(value[0], value[2]);
            this.vm.isInitialLoading = false;
            this.vm.employeeList = value[1];
            this.popoulateAccountsList();
            this.popoulateEmployeeList();
            this.popoulateHeadList();
            this.popoulateGroupsList();
        },error =>{
            this.vm.isInitialLoading = false;
        })

    }
    
    initialiseGroupsAndAccountList(sessionList, typeList): any{
        this.vm.accountsList = [];
        this.vm.groupsList = [];
        sessionList.forEach(account =>{
            let type = typeList.find(accounts => accounts.id == account.parentAccount).accountType;
            if(type == 'ACCOUNT'){
                this.vm.accountsList.push(account);
            }
            else{
                this.vm.groupsList.push(account);
            }
        });
        console.log(this.vm.accountsList);
        console.log(this.vm.groupsList);
    }

    popoulateAccountsList(): any{
        let accounts = [];

        this.vm.accountsList.forEach(element =>{
            let tempAccount = {
                accountDbId: element.parentAccount,
                title: element.title,
                selected: true,
                currentBalance: 0,
            }
            accounts.push(tempAccount);
        })
        this.vm.filterAccountsList = accounts;
    }
  
    popoulateEmployeeList(): any{
        let employees = [];
        
        this.vm.employeeList.forEach(element =>{
            let temp = {
                employeeId: element.id,
                name: element.name,
                selected: true,
            }
            employees.push(temp);
        })
        this.vm.filterEmployeeList = employees;
    }

    popoulateHeadList(): any{
        let heads = [];
        
        this.vm.headsList.forEach(element =>{
            let temp = {
                headDbId: element.id,
                title: element.title,
                selected: true,
            }
            heads.push(temp);
        })
        this.vm.filterHeadsList = heads;
    }

    popoulateGroupsList(): any{
        let groups = [];
        let temp = {
            groupDbId: -1,
            title: 'Individual Accounts',
            selected: true,
        }
        groups.push(temp);
        this.vm.groupsList.forEach(element =>{
            let temp = {
                groupDbId: element.parentAccount,
                title: element.title,
                selected: true,
            }
            groups.push(temp);
        })
        this.vm.filterGroupsList = groups;
    }


    loadTransactions():any{
        if(this.vm.transactionsList.length == 0){
            this.vm.isLoading = true;
        }
        console.log('loading', this.vm.transactionsList.length);
        this.vm.isLoadingTransaction = true;
        let transaction_data = {
            'parentEmployee__parentSchool': this.vm.user.activeSchool.dbId,            
            'transactionDate__gte': this.vm.startDate,
            'transactionDate__lte': this.vm.endDate,
            'korangle__order': '-id',
            'korangle__count': this.vm.transactionsList.length.toString() + ',' + (this.vm.transactionsList.length + this.vm.loadingCount).toString(),
        }
        console.log(transaction_data);

        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.transaction, transaction_data),
        ]).then(value =>{
            // console.log(value);
            if(value[0].length < this.vm.loadingCount){
                this.vm.loadMoreTransactions = false;
            }
            let transaction_id_data = [];
            value[0].forEach(element =>{
                transaction_id_data.push(element.id);
            })
            let transaction_details_data = {
                'parentTransaction__in': transaction_id_data
            }
            Promise.all([
                this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_account_details, transaction_details_data),
                this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_images, transaction_details_data),
            ]).then(data =>{
                // console.log(data);
                this.initialiseTransactionData(value[0], data[0], data[1]);
                this.vm.isLoadingTransaction = false;
                this.vm.isLoading = false;
            },error =>{
                this.vm.isLoadingTransaction = false;
                this.vm.isLoading = false;
            })
            
        }, error =>{
            this.vm.isLoadingTransaction = false;
            this.vm.isLoading = false;
        })

    }

    loadAllTransactions(str):any{

        if(this.vm.loadMoreTransactions == false){
            if(str == 'print'){
                this.printTransactionsList();
            }
            else{
                this.downloadList();
            }
        }
        
        else{
            this.vm.transactionsList = [];
            let transaction_data = {
                'parentEmployee__parentSchool': this.vm.user.activeSchool.dbId,            
                'transactionDate__gte': this.vm.startDate,
                'transactionDate__lte': this.vm.endDate,
                'korangle__order': '-id',
                // 'korangle__count': this.vm.transactionsList.length.toString() + ',' + (this.vm.transactionsList.length + this.vm.loadingCount).toString(),
            }
    
            Promise.all([
                this.vm.accountsService.getObjectList(this.vm.accountsService.transaction, transaction_data),
            ]).then(value =>{
                // console.log(value);
                if(value[0].length < this.vm.loadingCount){
                    this.vm.loadMoreTransactions = false;
                }
                let transaction_id_data = [];
                value[0].forEach(element =>{
                    transaction_id_data.push(element.id);
                })
                let transaction_details_data = {
                    'parentTransaction__in': transaction_id_data
                }
                Promise.all([
                    this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_account_details, transaction_details_data),
                    this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_images, transaction_details_data),
                ]).then(data =>{
                    // console.log(data);
                    this.initialiseTransactionData(value[0], data[0], data[1]);
                    this.vm.loadMoreTransactions = false;
                    if(str == 'print'){
                        this.printTransactionsList();
                    }
                    else{
                        this.downloadList();
                    }
                    
                },error =>{
                })
            }, error =>{
            })

        }
        
    }

    initialiseTransactionData(transactionList, transactionAccounts, transactionImages){
        transactionList.forEach(transaction =>{
            let tempData = {
                dbId: transaction.id,
                debitAccounts: [],
                creditAccounts: [],
                remark: transaction.remark,
                billImages: [],
                quotationImages: [],
                approvalId: transaction.approvalId,
                voucherNumber: transaction.voucherNumber,
                transactionDate: transaction.transactionDate,
                parentEmployeeName: null,
                parentEmployee: transaction.parentEmployee,
            }

            tempData.parentEmployeeName = this.vm.employeeList.find(employee => employee.id == transaction.parentEmployee).name;

            transactionAccounts.forEach(account =>{
                if(account.parentTransaction == transaction.id){
                    let tempAccount = this.vm.accountsList.find(acccount => acccount.parentAccount == account.parentAccount);
                    let temp = {
                        dbId: tempAccount.id,
                        accountDbId: tempAccount.parentAccount,
                        account: tempAccount.title,
                        amount: account.amount,
                        transactionAccountDbId: account.id,
                        parentHead: tempAccount.parentHead,
                        parentGroup: tempAccount.parentGroup,
                    }
                    if(account.transactionType == 'DEBIT'){
                        tempData.debitAccounts.push(temp);
                    }
                    else{
                        tempData.creditAccounts.push(temp);
                    }
                }
            })
            transactionImages.forEach(image =>{
                if(image.parentTransaction == transaction.id){
                    if(image.imageType == 'BILL'){
                        tempData.billImages.push(image);
                    }
                    else{
                        tempData.quotationImages.push(image);
                    }
                }
            })
            tempData.billImages.sort((a,b) => { return (a.orderNumber - b.orderNumber)});
            tempData.quotationImages.sort((a,b) => { return (a.orderNumber - b.orderNumber)});
            this.vm.transactionsList.push(tempData);

        })
        this.vm.transactionsList.sort((a,b) => { return (b.voucherNumber - a.voucherNumber)});
        console.log(this.vm.transactionsList);
    }

    getHeaderValue():any{
        let headerValues = [];
        for(let filter in this.vm.columnFilter){
            if(this.vm.columnFilter[filter].value == true){
            headerValues.push(this.vm.columnFilter[filter].displayName);
            }
        }
        return headerValues;                
    }
    
    getTransactionsData(transaction):any{
        let transactionData = [];
        if(this.vm.columnFilter.voucherNumber.value){
            transactionData.push(transaction.voucherNumber)
        }
        if(this.vm.columnFilter.date.value){
            transactionData.push(transaction.transactionDate)
        }
        if(this.vm.columnFilter.debitAccount.value){
            let tempData = ''
            transaction.debitAccounts.forEach(account =>{
                tempData += account.account + ' - ' + account.amount;
                tempData += '\n';
            })
            transactionData.push(tempData);    
        }
        if(this.vm.columnFilter.creditAccount.value){
            let tempData = ''
            transaction.creditAccounts.forEach(account =>{
                tempData += account.account + ' - ' + account.amount;
                tempData += '\n';
            })
            transactionData.push(tempData);   
        }
        if(this.vm.columnFilter.remark.value){
            transactionData.push(transaction.remark)
        }
        if(this.vm.columnFilter.approvalId.value){
            transactionData.push(transaction.approvalId)    
        }
        if(this.vm.columnFilter.addedBy.value){
            transactionData.push(transaction.parentEmployeeName);   
        }
        return transactionData
    }

    downloadList(): any{
        console.log(this.getHeaderValue());
        let excelData = [];
        excelData.push(this.getHeaderValue());
        this.vm.getFilteredTransactionList().forEach(transaction =>{
            excelData.push(this.getTransactionsData(transaction));
        })
        console.log(excelData);
        this.vm.excelService.downloadFile(excelData, 'korangle_transactions.csv');
        if(this.vm.columnFilter.bill.value || this.vm.columnFilter.quotation.value){
            this.downloadDocuments();
        }
    }

    getBillsTotalFile(){
        let totalFiles = 0;
        this.vm.getFilteredTransactionList().forEach(transaction => {
            totalFiles += transaction.billImages.length;
        })
        return totalFiles;
    }

    getQuotationTotalFile(){
        let totalFiles = 0
        this.vm.getFilteredTransactionList().forEach(transaction => {
            totalFiles += transaction.quotationImages.length;
        })
        return totalFiles;
    }

    async download_each_file(document_url){
        const response = await fetch(document_url)
        if (response.status ==403){
            ++this.totalFailed;
        }
        else{
		    const reader = response.body.getReader();
		    const contentLength = response.headers.get('Content-Length');
		    let receivedLength = 0;
		    let chunks = [];
		    while(true) {
		        const {done, value} = await reader.read();
		         if (done) {
		             break;
		        }
		        chunks.push(value);
		        receivedLength += value.length;
		        console.log(`Received ${receivedLength} of ${contentLength}`)
		        console.log(`now total received is ${this.percent_download_comlpleted} %`)
		    }
		    let blob = new Blob(chunks);
		    return blob;
    	}
	}

    downloadDocuments() {
        this.totalFailed=0;
        this.download="START";
        this.totalFiles = 0;
        if(this.vm.columnFilter.bill.value){
            this.totalFiles += this.getBillsTotalFile();
        }
        if(this.vm.columnFilter.quotation.value){
            this.totalFiles += this.getQuotationTotalFile();
        }
        if (this.totalFiles){
		    alert("You are about to download "+ (this.totalFiles) + 'files');
		    let zip = new JSZip();
		    let check1 = 0;
		    this.downloadedFiles = 0;
		    let flag = 1;
		    // this.studentParameterDocumentList.forEach(parameter => {
		        if (this.vm.columnFilter.bill.value){
		            var Folder = zip.folder('Bills');
		            this.vm.getFilteredTransactionList().forEach(transaction => {
                        transaction.billImages.forEach(image =>{
                            let document_url = image.imageURL;
                            if (document_url){
		                        check1=check1+1;
		                        this.download_each_file(document_url).then(blob => {
		                            if (blob){
                                        let type = document_url.split(".");
                                        type = type[type.length-1];
				                        let file = new Blob([blob], { type: type});
                                        Folder.file('transaction_'+transaction.voucherNumber+"_bill_" + image.orderNumber, file);
                                        this.downloadedFiles=this.downloadedFiles+1;
                                        console.log(check1,this.downloadedFiles)
                                    }
                                    if (check1===this.downloadedFiles+this.totalFailed){
                                        zip.generateAsync({ type: "blob"})
                                        .then(content => {
                                            FileSaver.saveAs(content, "Documents.zip");
                                            this.download='NOT'
                                        });
                                        this.vm.isLoading=false
                                        this.download='END'
                                        this.downloadedFiles=0
                                        this.totalFiles=0
                                        this.percent_download_comlpleted=0
                                    }
		                        },error=>{
		                            this.download="FAIL"
		                            this.vm.isLoading = false;
		                            this.downloadedFiles=0
		                            this.totalFiles=0
		                            this.percent_download_comlpleted=0
		                        });
		                    };
                        })
		                
		            });
		        };
                if (this.vm.columnFilter.quotation.value){
		            var Folder = zip.folder('Quotations');
		            this.vm.getFilteredTransactionList().forEach(transaction => {
                        transaction.quotationImages.forEach(image =>{
                            let document_url = image.imageURL;
                            if (document_url){
		                        check1=check1+1;
		                        this.download_each_file(document_url).then(blob => {
		                            if (blob){
                                        let type = document_url.split(".");
                                        type = type[type.length-1];
				                        let file = new Blob([blob], { type: type});
                                        Folder.file('transaction_'+transaction.voucherNumber+"_quotation_" + image.orderNumber, file);
                                        this.downloadedFiles=this.downloadedFiles+1;
                                        console.log(check1,this.downloadedFiles)
                                    }
                                    if (check1===this.downloadedFiles+this.totalFailed){
                                        zip.generateAsync({ type: "blob"})
                                        .then(content => {
                                            FileSaver.saveAs(content, "Documents.zip");
                                            this.download='NOT'
                                        });
                                        this.vm.isLoading=false
                                        this.download='END'
                                        this.downloadedFiles=0
                                        this.totalFiles=0
                                        this.percent_download_comlpleted=0
                                    }
		                        },error=>{
		                            this.download="FAIL"
		                            this.vm.isLoading = false;
		                            this.downloadedFiles=0
		                            this.totalFiles=0
		                            this.percent_download_comlpleted=0
		                        });
		                    };
                        })
		                
		            });
		        };
		    // });
	    } else{
	    alert("No documents are available for download.");
		this.download="NOT";
		}
	}

    printTransactionsList(){
        let value = {
          transactionsList: this.vm.getFilteredTransactionList(),
            startDate: this.vm.startDate,
            endDate: this.vm.endDate,
            columnFilter: this.vm.columnFilter,
          };
          this.vm.printService.navigateToPrintRoute(PRINT_TRANSACTIONS, {user: this.vm.user, value});
    }

    

}