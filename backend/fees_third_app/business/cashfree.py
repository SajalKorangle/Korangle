import hashlib
import hmac
import base64
import json
import requests

import urllib3

http = urllib3.PoolManager()

appId = '50334e5204e60357816fa8e6d43305'
secretKey = '6a165573c66a56432d870cfea579312a9fc776d3'

testUrl = 'https://ces-gamma.cashfree.com'
prodUrl = 'https://ces-api.cashfree.com'



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

def generateAuthToken():
    cashfreeResponse = requests.post(url = testUrl + '/ces/v1/authorize',
            headers={
                'X-Client-Id' : 'CF50334CJ1DXM3G3V76E2A',
                'X-Client-Secret' : 'b0d1e4861711b47d3cde6395fe4c1ff84d3225da'
            })
    response = cashfreeResponse.content.decode('utf-8').splitlines()
    response = json.loads(response[6])
    print(response['message'])
    data = response['data']
    return data['token']

def addVendor(reqData):
    data = reqData['schoolData']
    data['aadharNo']= ''
      
    data['vendorId'] = 'VEN_'+ str(reqData['parentSchool']) + '___' + str(reqData['parentEmployee'])
    print(data)
    token = generateAuthToken() #generate a token for authenticity of call on cashfree
    print("########and the token is")
    print(token)
    headers = {
        'Authorization' : 'Bearer '+token,
        'Content-Type' : 'application/json'
    }
    # newVendor = {
    #     'vendorId' : 'VEN' + str(reqData['parentSchool']), ##create your own personal unique ids to identify each and every vendor
    #     'name'  : data['name'],
    #     'phone' : data['phone'],
    #     'email' : data['email'],
    #     'bankAccount' : data['bankAccount'],
    #     'accountHolder' : data['accountHolder'],
    #     'ifsc'  : data['ifsc'],
    #     'panNo' : data['panNo'],
    #     'aadharNo' : data['aadharNo'],
    #     'gstin' : data['gstin'],
    #     'address1'  : data['address1'],
    #     'address2'  : data['address2'],
    #     'city'  : data['city'],
    #     'state' : data['state'],
    #     'pincode' : data['pincode']  

    # }
    response = requests.post(url = testUrl + '/ces/v1/addVendor', data=json.dumps(data), headers=headers)
    print("adding vendorrrrrrrrrrrrr")
    print(response.content)
    response = response.content.decode('utf-8').splitlines()
    response = json.loads(response[6])
    return response

def getVendor(vendorId):
    token = generateAuthToken() #generate a token for authenticity of call on cashfree
    headers = {
        'Authorization' : 'Bearer '+token,
        'Content-Type' : 'application/json'
    }
    response = requests.get(url = testUrl + '/ces/v1/getVendor/'+vendorId, headers=headers)
    response = response.content.decode('utf-8').splitlines()
    response = json.loads(response[6])
    print(response)
    return response


