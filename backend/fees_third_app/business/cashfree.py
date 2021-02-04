import hashlib
import hmac
import base64
import json


import urllib3

http = urllib3.PoolManager()

appId = '50334e5204e60357816fa8e6d43305'
secretKey = '6a165573c66a56432d870cfea579312a9fc776d3'

testUrl = 'https://ces-gamma.cashfree.com'
prodUrl = 'https://ces-api.cashfree.com'



def generatePaymentToken(data):
    print(data)
    data1 = "appId=" + data['appId'] + "&orderId=" + data['orderId'] + "&orderAmount=" + data['orderAmount'] + "&customerEmail=" + data['customerEmail'] + "&customerPhone=" + data['customerPhone'] + "&orderCurrency=" + data['orderCurrency']
    message = bytes(data1.encode('utf-8'))
    secret = bytes(secretKey.encode('utf-8'))
    paymentToken = base64.b64encode(hmac.new(secret, message,digestmod=hashlib.sha256).digest())
    vendors = data['vendors']
    print("vendors ids&&&&&&&&&&&&&&&&&")
    print(vendors)
    json_encoded_list = json.dumps(vendors)
    call = bytes(json_encoded_list.encode('utf-8'))
    b64_encoded_list = base64.b64encode(call)
    print("2222222222222222222222222222")

    print(b64_encoded_list)
    print (paymentToken)
    response = {
        'vsplit' : b64_encoded_list.decode('utf-8'),
        'paymentToken' : paymentToken.decode('utf-8')
    }
    return response

def generateAuthToken():
    url = testUrl + '/ces/v1/authorize'
    response = http.request('GET', url,
            headers={
                'X-Client-Id' : 'CF50334CJ1DXM3G3V76E2A',
                'X-Client-Secret' : 'b0d1e4861711b47d3cde6395fe4c1ff84d3225da'
            })
    print('response from cashfree for auth   ###########################################')
    print (response.status)

    return response

