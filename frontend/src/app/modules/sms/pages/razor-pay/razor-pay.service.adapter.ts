import { resolve } from "dns";
import { reject } from "lodash";

export class RazorpayServiceAdapter {

    createRzpayOrder(data,smsService,winRef) : any {
        
        return new Promise((resolve, reject) => {
            let sms_purchase_data = {
                parentSchool :data.user.activeSchool.dbId,
                purchseDateTime: Date.now(),
                numberOfSMS : data.noOfSMS,
                price : data.price,
                orderId : -1,
                payment_capture : 0
            }
            data.purchasedSMS = sms_purchase_data.numberOfSMS;
            //call api to create order_id
            Promise.all([
                smsService.createObject(smsService.sms_purchase,sms_purchase_data)
            ]).then(value => {   
                this.payWithRazor(value[0],data,smsService,winRef).then(value=> {
                    resolve(value);
                },error =>{
                    reject();
                });
            })
        });
        
    }

    payWithRazor(val,data,smsService,winRef) : any {

        return new Promise((resolve, reject) => {

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
                email:data.user.email,
                contact: data.user.username
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
                    smsService.updateObject(smsService.sms_purchase,update_data)
                    ]).then(value => {
                        if(value[0] === undefined)
                        alert('Transaction Failed Contact your Admin!!!' + 'Payment Details :-  ' + 'Payment Id = ' +response.razorpay_payment_id +
                        '  Order Id = '+ response.razorpay_order_id);                    
                        else
                        {
                            alert('Transaction Completed!!!')
                        }
                        resolve(value[0]);
                    }, error => {
                        reject();
                    })
                });
            options.modal.ondismiss = (() => {
            // handle the case when user closes the form while transaction is in progress
            alert('Transaction cancelled.');
                reject();
            });
            const rzp = new winRef.nativeWindow.Razorpay(options);
            rzp.open();
        });
    }

}