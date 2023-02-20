# Add order creation functions here
# Functions will be imported in views for EaseBuzz Order Self View

from .easebuzz_payment_gateway import Easebuzz

from helloworld_project.settings import EASEBUZZ_MERCHANT_KEY, EASEBUZZ_SALT, EASEBUZZ_ENV
from django.urls import reverse
from collections import defaultdict
import json
import hashlib

KORANGLE_CHARGE = 5.9
GST = 0.18

easebuzz = Easebuzz(EASEBUZZ_MERCHANT_KEY, EASEBUZZ_SALT, EASEBUZZ_ENV)

def calculateAmount(amount):
    # Requires confirmaton if correct calculation or not
    final_amount = (float(amount) + KORANGLE_CHARGE)*(1+GST)
    return str(round(final_amount, 2))

def createOrder(orderData, orderId):
    snfurl = orderData["returnData"]["origin"] + \
        reverse("easebuzz_order_completion") + '?' + \
        orderData['returnData']['searchParams']
    
    order = defaultdict(str, {
        "txnid": orderId,
        "amount": calculateAmount(orderData["orderAmount"]),
        "productinfo": orderData["orderNote"],
        "firstname": orderData["customerName"],
        "phone": orderData["customerPhone"],
        "email": orderData["customerEmail"],
        "surl": snfurl,
        "furl": snfurl,
        "show_payment_mode": orderData["paymentMode"]["apiCode"]
    })

    # print(order)
    final_response = easebuzz.initiatePaymentAPI(order)

    result = json.loads(final_response)
    # print(result)
    if result["status"] == 1:
        return {"success": result["data"]}
    else:
        return {"failure": "Could not generate url"}

