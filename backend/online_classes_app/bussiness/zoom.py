import hashlib
import hmac
import base64
import time
import jwt
from helloworld_project import settings

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


def newJWT():
    jwt_payload = {
        'iss': settings.ZOOM_API_KEY,
        'exp': int(time.time())+120 # jwt valid for 2 minutes
    }
    return jwt.encode(jwt_payload, settings.ZOOM_SECRET_KEY, algorithm="HS256").decode('utf-8')