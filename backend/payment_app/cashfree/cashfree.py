import hashlib
import hmac
import base64
import json
import requests
import time

# Do you know why they didn't just use CASHFREE_APP_ID and CASHFREE_SECRET_KEY instead of CLIENT_ID & CLIENT_SECRET
# for bearer token
# @answer : They have microservice kind of an architecture where different services are completely disjoint
from helloworld_project.settings import CASHFREE_APP_ID, CASHFREE_SECRET_KEY, CASHFREE_CLIENT_ID, CASHFREE_CLIENT_SECRET, CASHFREE_BASE_URL as base_url

bank_verification_base_url = 'https://payout-gamma.cashfree.com'

KORANGLE_PAYMENT_COMMISSION_PERCENTAGE = 0.5


def getResponseSignature(postData):  # used for validating that a response, indeed came from cashfree
    signatureData = postData["orderId"] + postData["orderAmount"] + postData["referenceId"] + \
        postData["txStatus"] + postData["paymentMode"] + postData["txMsg"] + postData["txTime"]
    message = signatureData.encode('utf-8')

    secret = CASHFREE_SECRET_KEY.encode('utf-8')
    signature = base64.b64encode(
        hmac.new(secret, message, digestmod=hashlib.sha256).digest()
    )
    return signature

# Does this code has the possibility to be used in future?
# @answer: Yes, it can be used in future when we introduce our won status check kind of thing to ensure every thing is working file. May be on our admin panel it will show the status checks
# def verifyCredentials():
#     headers = {
#         'Content-Type': 'application/x-www-form-urlencoded'
#     }

#     data = {
#         'appId': CASHFREE_APP_ID,
#         'secretKey': CASHFREE_SECRET_KEY
#     }

#     response = requests.post(
#         url=base_url+'/api/v1/credentials/verify',
#         headers = headers,
#         data=data
#     )

#     assert response.json()['status'] == "OK", "invalid cashfree credentials: {0}".format(response.json())


def getSignature(orderData):  # used to authenticate that the data is a valid data coming from korangle
    sortedKeys = sorted(orderData)
    signatureData = ""
    for key in sortedKeys:
        signatureData += key + str(orderData[key])

    message = signatureData.encode('utf-8')
    # get secret key from your config
    secret = CASHFREE_SECRET_KEY.encode('utf-8')
    signature = base64.b64encode(hmac.new(secret, message, digestmod=hashlib.sha256).digest())
    return signature.decode('utf-8')


def createAndSignCashfreeOrderForSchool(data, orderId, vendorId):

    # Is it not required to mention the vendor id and amount for Korangle here?
    # @answer : No, the leftover amount will be settled in korangle's account
    paymentSplit = [
        {
            "vendorId": str(vendorId),
            "amount": data['orderAmount']
        }
    ]

    paymentSplitEncoded = base64.b64encode(
        bytes(
            json.dumps(paymentSplit).encode('utf-8')
        )
    ).decode('utf-8')

    orderData = {}
    orderData.update(data)
    orderData.update(
        {
            'appId': CASHFREE_APP_ID,
            'orderId': str(orderId),
            'paymentSplits': paymentSplitEncoded,
            'orderAmount': round(data['orderAmount'] * (1 + KORANGLE_PAYMENT_COMMISSION_PERCENTAGE / 100), 2),  # adding korangle's commission
        }
    )

    orderData.update({
        'signature': getSignature(orderData)
    })
    print('order for school = ', orderData)
    return orderData


def createAndSignCashfreeOrderForKorangle(data, orderId):

    orderData = {}
    orderData.update(data)
    orderData.update({
        'appId': CASHFREE_APP_ID,
        'orderId': str(orderId),
    })

    orderData.update({
        'signature': getSignature(orderData)
    })
    return orderData


def getOrderDetails(orderId):
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    orderData = {
        'appId': CASHFREE_APP_ID,
        'secretKey': CASHFREE_SECRET_KEY,
        'orderId': str(orderId),
    }

    response = requests.post(
        url=base_url + '/api/v1/order/info',
        data=orderData,
        headers=headers
    )

    assert response.json()['status'] == 'OK', 'Cashfree Order Status Check Failed, response : {0}'.format(response.json())
    return response.json()


def getOrderStatus(orderId, disableAssertion=False):
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    orderData = {
        'appId': CASHFREE_APP_ID,
        'secretKey': CASHFREE_SECRET_KEY,
        'orderId': str(orderId),
    }

    response = requests.post(
        url=base_url + '/api/v1/order/info/status',
        data=orderData,
        headers=headers
    )

    if(not disableAssertion):
        assert response.json()['status'] == 'OK', 'Cashfree Order Status Check Failed, response : {0}'.format(response.json())

    return response.json()


def initiateRefund(orderId, splitData):
    orderStatusData = getOrderStatus(orderId)

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    orderData = {
        'appId': CASHFREE_APP_ID,
        'secretKey': CASHFREE_SECRET_KEY,
        'referenceId': orderStatusData['referenceId'],
        'refundAmount': float(orderStatusData['orderAmount']),
        'refundNote': 'refund towards payment made on korangle',
    }

    if(len(splitData) > 0):
        orderData.update({
            'isSplit': True,
            'splitDetails': json.dumps(splitData)
        })

    response = requests.post(
        url=base_url + '/api/v1/order/refund',
        data=orderData,
        headers=headers
    )

    assert response.json()['status'] == 'OK', 'Cashfree Refund Initiation Failed, response : {0}'.format(response.json())
    return response.json()


def getRefundStatus(refundId, disableAssertion=False):

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    refundData = {
        'appId': CASHFREE_APP_ID,
        'secretKey': CASHFREE_SECRET_KEY,
        'refundId': str(refundId),
    }

    response = requests.post(
        url=base_url + '/api/v1/refundStatus',
        data=refundData,
        headers=headers
    )

    if(not disableAssertion):
        assert response.json()['status'] == 'OK', 'Cashfree Refund Fetch Failed, response : {0}'.format(response.json())
    return response.json()


def addVendor(newVendorData, vendorId):
    newVendorData.update({
        'status': 'ACTIVE',
        'id': vendorId,
    })

    # Removing special characters and numbers from name (not allowed in cashfree)
    newVendorData['name'] = ''.join(ch for ch in newVendorData['name'] if ch.isalnum() and not ch.isnumeric())

    headers = {
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'Content-Type': 'application/json'
    }

    response = requests.post(
        url=base_url + '/api/v2/easy-split/vendors',
        json=newVendorData,
        headers=headers
    )
    assert response.json()['status'] == 'OK', 'Adding vendor on cashfree failed, response : {0}'.format(response.json())
    return response.json()['message']


def updateVendor(vendorData):
    vendorId = vendorData['id']

    applicableFields = ['email', 'bank', 'phone', 'name', 'settlementCycleId']
    toUpdateVendorData = {}
    for field in applicableFields:
        if(field in vendorData):
            toUpdateVendorData[field] = vendorData[field]

    toUpdateVendorData['name'] = ''.join(ch for ch in toUpdateVendorData['name'] if ch.isalnum() and not ch.isnumeric())

    headers = {
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'Content-Type': 'application/json'
    }

    response = requests.put(
        url=base_url + '/api/v2/easy-split/vendors/{0}'.format(vendorId),
        json=toUpdateVendorData,
        headers=headers
    )
    assert response.json()['status'] == 'OK'
    return response.json()['message']


def getVendor(vendorId):
    headers = {
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'Content-Type': 'application/json'
    }

    response = requests.get(url=base_url + '/api/v2/easy-split/vendors/{0}'.format(vendorId), headers=headers)
    assert response.json()['status'] == 'OK', 'error in get vendor, response = {0}'.format(response.json())
    return response.json()['vendorDetails']


def getSettlementsCycleList():
    headers = {
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'Content-Type': 'application/json'
    }

    response = requests.get(
        url=base_url + '/api/v2/easy-split/vendors/settlement-cycles',
        headers=headers,
    )

    assert response.json()['status'] == 'OK'

    return response.json()['settlementCycles']


AUTH_DATA = {   # Default Auth Data
    "token": "",
    "expiry": time.time() - 1
}


def authenticate():
    headers = {
        'X-Client-Secret': CASHFREE_CLIENT_SECRET,
        'X-Client-Id': CASHFREE_CLIENT_ID,
        'Content-Type': 'application/json',
    }
    response = requests.post(
        url=bank_verification_base_url + '/payout/v1/authorize',
        headers=headers,
    )
    assert response.json()["status"] == "SUCCESS", "cashfree authentication failed: {0}".format(response.json())
    global AUTH_DATA
    AUTH_DATA = response.json()['data']


def getBearerToken():
    global AUTH_DATA
    if(AUTH_DATA['expiry'] - time.time() < 5):
        authenticate()
    return 'Bearer ' + AUTH_DATA["token"]


def ifscVerification(ifsc):
    headers = {
        'Authorization': getBearerToken(),
        'Content-Type': 'Application/JSON',
    }

    response = requests.get(
        url=bank_verification_base_url + '/payout/v1/ifsc/{ifsc}'.format(ifsc=ifsc),
        headers=headers
    )

    if(response.json()["status"] == "SUCCESS"):
        return response.json()['data']
    else:
        return None


def bankAccountVerification(accountNumber, ifsc):
    headers = {
        'Authorization': getBearerToken(),
        'Content-Type': 'Application/JSON',
    }
    params = {
        'bankAccount': accountNumber,
        'ifsc': ifsc
    }

    response = requests.get(
        url=bank_verification_base_url + '/payout/v1.2/validation/bankDetails',
        headers=headers,
        params=params,
    )

    assert response.json()['status'] == "SUCCESS", "Bank Verification Error: {0}".format(response.json())

    data = response.json()['data']
    data.update({
        'accountStatus': response.json()['accountStatus'],
        'accountStatusCode': response.json()['accountStatusCode'],
        'message': response.json()['message'],
    })
    return data
