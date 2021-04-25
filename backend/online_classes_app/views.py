from common.common_views_3 import CommonView, CommonListView, APIView
from decorators import user_permission_3
import jwt
import hashlib
import hmac
import base64
import time

API_KEY = 'feab_2y9TZyvvWEDgrWmUQ'
SECRET_KEY = 'vjzfd38K6jKbHimYf9nUOwyjCR6CJqsmYRqK'
EMAIL_ID = 'kumar.93@iitj.ac.in'


def generateSignature(data):
    ts = int(round(time.time() * 1000)) - 30000;
    msg = data['apiKey'] + str(data['meetingNumber']) + str(ts) + str(data['role']);    
    message = base64.b64encode(bytes(msg, 'utf-8'));
    # message = message.decode("utf-8");    
    secret = bytes(data['apiSecret'], 'utf-8')
    hash = hmac.new(secret, message, hashlib.sha256)
    hash =  base64.b64encode(hash.digest())
    hash = hash.decode("utf-8")
    tmpString = "%s.%s.%s.%s.%s" % (data['apiKey'], str(data['meetingNumber']), str(ts), str(data['role']), hash)
    signature = base64.b64encode(bytes(tmpString, "utf-8"))
    signature = signature.decode("utf-8")
    return signature.rstrip("=")

# if __name__ == '__main__':
#     data = {'apiKey': "" ,
#                 'apiSecret': "",
#                 'meetingNumber': 888,
#                 'role': 0}
# 	print (generateSignature(data))

class ZoomAuthData(CommonView, APIView):
    permittedMethods = ['get']

    @user_permission_3
    def get(self, request, *args, **kwargs):
        response = {'email': EMAIL_ID}
        jwt_payload = {
            'iss': API_KEY,
            'exp': int(time.time())+900 # jwt valid for 15 minutes
        }
        response['jwt'] = jwt.encode(jwt_payload, SECRET_KEY, algorithm="HS256").decode('utf-8')
        return response

class ZoomMettingSignature(CommonView, APIView):
    permittedMethods = ['get']

    @user_permission_3
    def get(self, request, *args, **kwargs):
        mettingSignatureData = {'apiKey': API_KEY , 'apiSecret': SECRET_KEY, 'meetingNumber': request.GET['mettingNumber'], 'role': int(request.GET['role'])}
        response = {'signature': generateSignature(mettingSignatureData)}
        return response



from .models import OnlineClass

class OnlineClassView(CommonView, APIView):
    Model = OnlineClass
    RelationsToSchool = ['parentSchool__id']


class OnlineClassListView(CommonListView, APIView):
    Model = OnlineClass
    RelationsToSchool = ['parentSchool__id']

