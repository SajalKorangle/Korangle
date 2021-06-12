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


def generatePaymentToken(data):
    data1 = "appId=" + data['appId'] + "&orderId=" + data['orderId'] + "&orderAmount=" + data['orderAmount'] + "&customerEmail=" + data['customerEmail'] + "&customerPhone=" + data['customerPhone'] + "&orderCurrency=" + data['orderCurrency']
    message = bytes(data1.encode('utf-8'))
    secret = bytes(secretKey.encode('utf-8'))
    paymentToken = base64.b64encode(hmac.new(secret, message,digestmod=hashlib.sha256).digest())

    #get vendor id of school from the database
    vendors = [
                {
                  "vendorId":"SELF", 
                  "commission":50
                },
                {
                  "vendorId":"VEN" + str(data['parentSchool']), 
                  "commission":50
                }
            ]
    json_encoded_list = json.dumps(vendors)
    call = bytes(json_encoded_list.encode('utf-8'))
    b64_encoded_list = base64.b64encode(call)
    response = {
        'vsplit' : b64_encoded_list.decode('utf-8'),
        'paymentToken' : paymentToken.decode('utf-8')
    }
    return response


def addVendor(newVendorData, vendorId):
    newVendorData.update({
        'status': 'ACTIVE',
        'id': vendorId,
    })

    headers = {
        'x-client-id': CASHFREE_APP_ID, 
        'x-client-secret': CASHFREE_SECRET_KEY,
        'Content-Type': 'application/json'
        }

    response = requests.post(
        url=base_url+'/api/v2/easy-split/vendors', 
        data=newVendorData,
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
    assert response.json()['status'] == 'OK'
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


bank_verification_base_url = 'https://payout-gamma.cashfree.com'

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
    

    

def getToken():
    global AUTH_DATA 
    if(AUTH_DATA['expiry'] - time.time() < 5):
        authenticate()
    return AUTH_DATA["token"] 

def ifscVerification(ifsc):
    pass
