import hashlib
import hmac
import base64

appId = '50334e5204e60357816fa8e6d43305'
secretKey = '6a165573c66a56432d870cfea579312a9fc776d3'

def getOrderId():
    return 1*4

def generatePaymentToken(data):
    print(data)
    data1 = "appId=" + data['appId'] + "&orderId=" + data['orderId'] + "&orderAmount=" + data['orderAmount'] + "&customerEmail=" + data['customerEmail'] + "&customerPhone=" + data['customerPhone'] + "&orderCurrency=" + data['orderCurrency']
    message = bytes(data1.encode('utf-8'))
    secret = bytes(secretKey.encode('utf-8'))
    paymentToken = base64.b64encode(hmac.new(secret, message,digestmod=hashlib.sha256).digest())
    print (paymentToken)
    return paymentToken.decode('utf-8')