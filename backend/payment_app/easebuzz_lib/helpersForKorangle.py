# Add order creation functions here
# Functions will be imported in views for EaseBuzz Order Self View

from .easebuzz_payment_gateway import Easebuzz
from payment_app.models import ModeOfPayment, ModeOfPaymentCharges

from helloworld_project.settings import EASEBUZZ_MERCHANT_KEY, EASEBUZZ_SALT, EASEBUZZ_ENV
from django.urls import reverse
from collections import defaultdict
import json

KORANGLE_CHARGE = 5.9
KORANGLE_EASEBUZZ_BANK_LABEL = "KORANGLE"
GST = 0.18

easebuzz = Easebuzz(EASEBUZZ_MERCHANT_KEY, EASEBUZZ_SALT, EASEBUZZ_ENV)

def calculateAmount(order):
    amount = float(order["orderAmount"]) + KORANGLE_CHARGE
    final_amount = amount

    # Calculating final charges including korangle and easebuzz charges
    mode = ModeOfPayment.objects.filter(
        apiCode=order["paymentMode"]["apiCode"],
        parentPaymentGateway__name="Easebuzz"
        ).first()
    mopCharges = ModeOfPaymentCharges.objects.filter(parentModeOfPayment=mode).all()
    for charge in mopCharges:
        price = float(charge.charge)
        if charge.chargeType == "Flat":
            final_amount = amount + price*(1+GST)
        elif charge.chargeType == "Percentage":
            final_amount = (amount * 100)/(100-price*(1+GST))
        if final_amount >= charge.minimumAmount and (charge.maximumAmount == -1 or final_amount <= charge.maximumAmount):
            break

    if round(final_amount, 2) != order["orderTotalAmount"]:
        return False
    return str(round(final_amount, 2))

def createSelfOrder(orderData, orderId):
    snfurl = orderData["returnData"]["origin"] + \
        reverse("easebuzz_order_completion") + '?' + \
        orderData['returnData']['searchParams']
    
    order = defaultdict(str, {
        "txnid": orderId,
        "amount": calculateAmount(orderData),
        "productinfo": orderData["orderNote"][:45],
        "firstname": orderData["customerName"],
        "phone": orderData["customerPhone"],
        "email": orderData["customerEmail"],
        "surl": snfurl,
        "furl": snfurl,
        "show_payment_mode": orderData["paymentMode"]["apiCode"],
        "split_payments": json.dumps({
            KORANGLE_EASEBUZZ_BANK_LABEL: calculateAmount(orderData)
        })
    })

    if(order["amount"]==False):
        return {"failure": "Could not generate url"}

    final_response = easebuzz.initiatePaymentAPI(order)

    result = json.loads(final_response)
    if result["status"] == 1:
        return {"success": result["data"]}
    else:
        return {"failure": "Could not generate url"}
    

def calculatePlatformCharges(amount, modeOfPayment, schoolMerchantAccount):
    final_amount = amount
    mode = ModeOfPayment.objects.filter(
        apiCode=modeOfPayment["apiCode"],
        parentPaymentGateway__name="Easebuzz"
    ).first()
    mopCharges = ModeOfPaymentCharges.objects.filter(
        parentModeOfPayment=mode).all()
    for charge in mopCharges:
        price = float(charge.charge)
        if charge.chargeType == "Flat":
            final_amount = (amount + KORANGLE_CHARGE) + price*(1+GST)
        elif charge.chargeType == "Percentage":
            final_amount = ((amount + KORANGLE_CHARGE) * 100)/(100-price*(1+GST))
        if final_amount >= charge.minimumAmount and (charge.maximumAmount == -1 or final_amount <= charge.maximumAmount):
            break
    totalPlatformCharge = round(final_amount-amount, 2)
    schoolPlatformCharge = totalPlatformCharge
    if schoolMerchantAccount.platformFeeOnSchoolType == "Flat":
        schoolPlatformCharge = min(totalPlatformCharge, schoolMerchantAccount.maxPlatformFeeOnSchool)
    else:
        schoolPlatformCharge = round(
            totalPlatformCharge * (schoolMerchantAccount.percentageOfPlatformFeeOnSchool/100), 2)
    return {
        "school": schoolPlatformCharge,
        "parent": round(totalPlatformCharge - schoolPlatformCharge, 2),
        "total": totalPlatformCharge
    }


def createSchoolOrder(orderData, orderId, schoolMerchantAccount):
    snfurl = orderData["returnData"]["origin"] + \
        reverse("easebuzz_order_completion") + '?' + \
        orderData['returnData']['searchParams']
    platformCharges = calculatePlatformCharges(
        orderData["orderAmount"], orderData["paymentMode"], schoolMerchantAccount)
    finalAmountForParent = round(orderData["orderAmount"] + platformCharges["parent"], 2)
    if(finalAmountForParent != orderData["orderTotalAmount"]):
        return {"failure": "Could not generate url"}

    order = defaultdict(str, {
        "txnid": orderId,
        "amount": str(finalAmountForParent),
        "productinfo": orderData["orderNote"][:45],
        "firstname": orderData["customerName"],
        "phone": orderData["customerPhone"],
        "email": orderData["customerEmail"],
        "surl": snfurl,
        "furl": snfurl,
        "show_payment_mode": orderData["paymentMode"]["apiCode"],
        "split_payments": json.dumps({
            schoolMerchantAccount.easebuzzBankLabel: orderData["orderAmount"]-platformCharges["school"],
            KORANGLE_EASEBUZZ_BANK_LABEL: platformCharges["total"]
        })
    })

    final_response = easebuzz.initiatePaymentAPI(order)

    result = json.loads(final_response)
    if result["status"] == 1:
        return {"success": result["data"]}
    else:
        return {"failure": "Could not generate url"}

def verifyPayment(request):
    return easebuzz.easebuzzResponse(request.POST)
