
import { PurchaseSmsComponent } from "./purchase-sms.component";

export class PurchaseSmsServiceAdapter {

    vm: PurchaseSmsComponent;

    constructor() {}

    initializeAdapter(vm: PurchaseSmsComponent): void {
        this.vm = vm;
    }
    purchasedSMS: number=0;
    initializeData(): void {

        this.vm.isInitialLoading = true;

        const sms_count_request_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.smsOldService.getSMSCount(sms_count_request_data, this.vm.user.jwt),
        ]).then(value =>{
            this.vm.SMSCount = value[0].count;
            this.vm.isInitialLoading = false;

        },error =>{
            this.vm.isInitialLoading = false;
        })
    }



    createRzpayOrder() {
        this.vm.isLoading = true;
        let sms_purchase_data = {
            parentSchool :this.vm.user.activeSchool.dbId,
            purchseDateTime: Date.now(),
            orderId : -1,
            payment_capture : 0,
            price :0,
            numberOfSMS:0
        }
        if(this.vm.value1 >0)
        {   
            for(let i=0;i<this.vm.smsPlan.length;i++)
            {
                if(this.vm.smsPlan[i].selected)
                {
                    sms_purchase_data.price= this.vm.value1;
                    sms_purchase_data.numberOfSMS = this.vm.smsPlan[i].noOfSms;
                    break;
                }
            }
        }
        else
        {   
            sms_purchase_data.price = this.vm.price;
            sms_purchase_data.numberOfSMS = this.vm.value;
        }

        this.purchasedSMS = +sms_purchase_data.numberOfSMS;

        //call api to create order_id
        Promise.all([
            this.vm.smsService.createObject(this.vm.smsService.sms_purchase,sms_purchase_data)
        ]).then(value => {      
            this.payWithRazor(value[0]);
            this.vm.isLoading =  false; 
        })
        
    }

    payWithRazor(val) {
        const options: any = {
          key: 'rzp_test_9ItYu1Pd8xL43N',
          amount: val.price, // amount should be in paise format to display Rs 1255 without decimal point
          currency: 'INR',
          name: 'Korangle', // company name or product name
          description: 'sms-purchase',  // product description
          order_id: val.orderId, // order_id created by you in backend
          receipt_id :val.id,
          modal: {
            // We should prevent closing of the form when esc key is pressed.
            escape: false,
          },
          prefill: {
              email:this.vm.user.email,
              contact: this.vm.user.username
          },
          notes: {
            // include notes if any
          },
          theme: {
            color: '#0c238a'
          },
        };
        options.handler = ((response, error) => {
          options.error = error;
          // call your backend api to verify payment signature, capture transaction & update the record
            let update_data = {
                id : options.receipt_id,
                response : response,
                amount : options.amount
            }
            Promise.all([
                this.vm.smsService.updateObject(this.vm.smsService.sms_purchase,update_data)
                ]).then(value => {
                    if(value[0] === undefined)
                    alert('Transaction Failed Contact your Admin!!!' + 'Payment Details :-  ' + 'Payment Id = ' +response.razorpay_payment_id +
                    '  Order Id = '+ response.razorpay_order_id);
                    else 
                    {   
                        alert('Transaction Completed!!!');
                        this.vm.SMSCount += this.purchasedSMS;
                        this.vm.ref.detectChanges();
                    }
                    
                })
            });
        options.modal.ondismiss = (() => {
          // handle the case when user closes the form while transaction is in progress
          alert('Transaction cancelled.');
        });
        const rzp = new this.vm.winRef.nativeWindow.Razorpay(options);
        rzp.open();
    }

}