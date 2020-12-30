import razorpay
import hmac
import hashlib


razpay_key = 'rzp_test_9ItYu1Pd8xL43N'
razpay_secret = 'XfIG2E05lIuJZE2adjRPTmHL'


def hmac_sha256(val):
    h = hmac.new(razpay_secret.encode("ASCII"), val.encode("ASCII"), digestmod=hashlib.sha256).hexdigest()
    print(h)
    return h

def initialize_rzpay():
    rzpay = razorpay.Client(auth=(razpay_key, razpay_secret))
    rzpay.set_app_details({"title" : "<Korangle>", "version" : "<1>"})
    return rzpay


def create_rzpay_order(reqData):
    rzpay = initialize_rzpay()
    rzData = {}
    rzData['amount'] = reqData['price']*100
    rzData['currency'] = 'INR'
    rzData['receipt'] = str(reqData['id'])
    rzData['payment_capture'] = 0
    rzresp = rzpay.order.create(data=rzData)  # Calling razorpay api to create order
    return rzresp

def verify_txn(reqData):
    rzpay = initialize_rzpay()
    # verify the transaction and update the capture_payment attribute of record with respective order-id and send response to front-end
    generated_signature = hmac_sha256(reqData["razorpay_order_id"] + "|" + reqData["razorpay_payment_id"])

    if (generated_signature == reqData["razorpay_signature"]):
        res = rzpay.payment.capture(reqData["razorpay_payment_id"], reqData["amount"], {"currency":"INR"})
        return True
    else:
        return False
    