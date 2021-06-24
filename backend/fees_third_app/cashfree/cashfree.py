import hashlib
import hmac
import base64
import json
import requests
import time


from helloworld_project.settings import CASHFREE_APP_ID, CASHFREE_SECRET_KEY, CASHFREE_CLIENT_ID, CASHFREE_CLIENT_SECRET

# testUrl = 'https://ces-gamma.cashfree.com'
# prodUrl = 'https://ces-api.cashfree.com'

base_url = 'https://test.cashfree.com'
checkout_url = 'https://test.cashfree.com/billpay/checkout/post/submit'
bank_verification_base_url = 'https://payout-gamma.cashfree.com'

def getResponseSignature(postData):
    signatureData = postData["orderId"] + postData["orderAmount"] + postData["referenceId"] + postData["txStatus"] + postData["paymentMode"] + postData["txMsg"] + postData["txTime"]
    message = signatureData.encode('utf-8')

    secret = CASHFREE_SECRET_KEY.encode('utf-8')
    signature = base64.b64encode(
        hmac.new(secret, message,digestmod=hashlib.sha256).digest()
        )
    return signature

def verifyCredentials():
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    data = {
        'appId': CASHFREE_APP_ID,
        'secretKey': CASHFREE_SECRET_KEY
    }

    response = requests.post(
        url=base_url+'/api/v1/credentials/verify',
        headers = headers,
        data=data
    )
    print(response.json())
    assert response.json()['status'] == "OK", "invalid cashfree credentials: {0}".format(response.json())


# def createCashfreeOrder(data, orderId, vendorId):

#     headers = {
#         'Content-Type': 'application/x-www-form-urlencoded'
#         }

#     paymentSplit = [
#             {
#                 "vendorId" : vendorId,
#                 "amount" : data['orderAmount']
#             }
#         ]
#     print('payment Splits: ', paymentSplit)
#     paymentSplitEncoded = base64.b64encode(
#         bytes( 
#             json.dumps(paymentSplit).encode('utf-8')
#         )
#         ).decode('utf-8')

#     orderData = {
#         'appId': CASHFREE_APP_ID,
#         'secretKey': CASHFREE_SECRET_KEY,
#         'orderId': str(orderId),
#         'paymentSplits': paymentSplitEncoded,
#         # 'notifyUrl': ''  Update Notify Url later
#     }
#     orderData.update(data)
#     print('order data = ', orderData)

#     response = requests.post(
#         url=base_url+'/api/v1/order/create', 
#         data=orderData,
#         headers=headers
#         )
        
#     assert response.json()['status'] == 'OK' and 'paymentLink' in response.json(), 'Cashfree Order Creation Failed, response : {0}'.format(response.json())
#     return response.json()

def createAndSignCashfreeOrder(data, orderId, vendorId):

    paymentSplit = [
            {
                "vendorId" : str(vendorId),
                "amount" : data['orderAmount']
            }
        ]
    print('payment Splits: ', paymentSplit)
    paymentSplitEncoded = base64.b64encode(
        bytes( 
            json.dumps(paymentSplit).encode('utf-8')
        )
        ).decode('utf-8')

    orderData = {
        'appId': CASHFREE_APP_ID,
        'orderId': str(orderId),
        'paymentSplits': paymentSplitEncoded,
        # 'notifyUrl': ''  Update Notify Url later
    }
    orderData.update(data)

    sortedKeys = sorted(orderData)
    signatureData = ""
    for key in sortedKeys:
      signatureData += key+str(orderData[key])

    message = signatureData.encode('utf-8')
    #get secret key from your config
    secret = CASHFREE_SECRET_KEY.encode('utf-8')
    signature = base64.b64encode(hmac.new(secret, message,digestmod=hashlib.sha256).digest())
    orderData.update({
        'signature': signature.decode('utf-8')
    })
    return orderData


def getOrderStatus(orderId):
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
        }

    orderData = {
        'appId': CASHFREE_APP_ID,
        'secretKey': CASHFREE_SECRET_KEY,
        'orderId': str(orderId),
    }

    response = requests.post(
        url=base_url+'/api/v1/order/info/status', 
        data=orderData,
        headers=headers
        )

    assert response.json()['status'] == 'OK', 'Cashfree Order Status Check Failed, response : {0}'.format(response.json())
    return response.json()


def isOrderCompleted(orderId):
    orderStatusData = getOrderStatus(orderId)
    return orderStatusData['txStatus'] == 'SUCCESS'

# def initiateRefund(orderId, amount):
#     orderStatusData = getOrderStatus(orderId)

#     headers = {
#         'Content-Type': 'application/x-www-form-urlencoded'
#         }

#     orderData = {
#         'appId': CASHFREE_APP_ID,
#         'secretKey': CASHFREE_SECRET_KEY,
#         'referenceId': orderStatusData['referenceId'],
#         'refundAmount': str(amount) ,
#         'refundNote': 'refund towards school fee payment'
#     }

#     response = requests.post(
#         url=base_url+'/api/v1/order/refund', 
#         data=orderData,
#         headers=headers
#         )


def addVendor(newVendorData, vendorId):
    newVendorData.update({
        'status': 'ACTIVE',
        'id': vendorId,
    })

    #Remove special characters from name
    newVendorData['name'] = ''.join(ch for ch in newVendorData['name'] if ch.isalnum() and not ch.isnumeric())
    print(newVendorData)
    headers = {
        'x-client-id': CASHFREE_APP_ID, 
        'x-client-secret': CASHFREE_SECRET_KEY,
        'Content-Type': 'application/json'
        }

    response = requests.post(
        url=base_url+'/api/v2/easy-split/vendors', 
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

    headers = {
        'x-client-id': CASHFREE_APP_ID, 
        'x-client-secret': CASHFREE_SECRET_KEY,
        'Content-Type': 'application/json'
        }

    response = requests.put(
        url=base_url+'/api/v2/easy-split/vendors/{0}'.format(vendorId), 
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

    response = requests.get(url = base_url + '/api/v2/easy-split/vendors/{0}'.format(vendorId), headers=headers)
    assert response.json()['status'] == 'OK', 'error in get vendor, response = {0}'.format(response.json())
    return response.json()['vendorDetails']





def getSettelmentsCycleList():
    headers = {
        'x-client-id': CASHFREE_APP_ID, 
        'x-client-secret': CASHFREE_SECRET_KEY,
        'Content-Type': 'application/json'
        }

    response = requests.get(
        url=base_url+ '/api/v2/easy-split/vendors/settlement-cycles',
        headers=headers,
        )
    assert response.json()['status'] == 'OK'

    return response.json()['settlementCycles']




AUTH_DATA = {   # Default Auth Data
        "token": "", 
	    "expiry": time.time()-1
    }

def authenticate():
    headers = { 
        'X-Client-Secret': CASHFREE_CLIENT_SECRET, 
        'X-Client-Id': CASHFREE_CLIENT_ID,
        'Content-Type': 'application/json',
        }
    response = requests.post(
        url=bank_verification_base_url+'/payout/v1/authorize',
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
    print('printing ifsc: ', ifsc)
    headers = {
        'Authorization': getBearerToken(),
        'Content-Type': 'Application/JSON',
    }

    response = requests.get(
        url=bank_verification_base_url+'/payout/v1/ifsc/{ifsc}'.format(ifsc=ifsc),
        headers=headers
    )

    if(response.json()["status"] == "SUCCESS"):
        return response.json()['data']
    else:
        print(response.json())
        return None

def bankVerification(accountNumber, ifsc):
    headers = {
        'Authorization': getBearerToken(),
        'Content-Type': 'Application/JSON',
    }
    params ={
        'bankAccount': accountNumber,
        'ifsc': ifsc
    }

    print('params: ', params)

    response = requests.get(
        url= bank_verification_base_url+'/payout/v1.2/validation/bankDetails',
        headers= headers,
        params = params,
    )

    assert response.json()['status'] == "SUCCESS", "Bank Verification Error: {0}".format(response.json())
    
    data = response.json()['data']
    data.update({
        'accountStatus': response.json()['accountStatus'],
        'accountStatusCode': response.json()['accountStatusCode'],
        'message': response.json()['message'],
    })
    return data