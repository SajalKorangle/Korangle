from hashlib import sha512

import requests
import json
import re
import traceback


def refund_status(merchant_key, salt, env):
    try:
        result = _refund_status(merchant_key, salt, env)
        return result
    except Exception as e:
        traceback.print_exc()
        print("#######Error on refund:refund_status#######")
        return ({"status": False, "reason": 'Exception occured'});

def _refund_status(merchant_key, salt, env):
    params = {}
    URL = None

    params['key'] = merchant_key


    # get URL based on enviroment like (env = 'test' or env = 'prod')
    URL = _getURL(env)

    # process to start refund
    refund_result = _refundStatus(params, salt, URL)

    return refund_result

def _refundStatus(params_array, salt_key, url):
    hash_key = None

    # generate hash key and push into params array.
    hash_key = _getHashKey(params_array, salt_key)
    params_array['hash'] = hash_key

    # requests call for retrive transaction
    request_result = requests.get(url + 'transaction/refund/v1/retrieve', params_array)
    print(request_result.text)
    # Korangle Comment Starts -- Replaced request_result.content with request_result.text because .content returns bytes instead of string
    return json.loads(request_result.text)
    # Korangle Comment Ends

def _getHashKey(posted, salt_key):
    hash_string = ""
    hash_sequence = "key|easebuzz_id|salt"

    hash_sequence_array = hash_sequence.split("|")

    for value in hash_sequence_array:
        if value in posted:
            hash_string += str(posted[value])
        else:
            hash_string += ""
        hash_string += "|"

    hash_string += salt_key

    return  sha512(hash_string.encode('utf-8')).hexdigest().lower()

def _getURL(env):
    url_link = None

    if env == 'test':
        url_link = "https://testdashboard.easebuzz.in/"
    elif env == 'prod':
        url_link = "https://dashboard.easebuzz.in/"
    else:
        url_link = "https://testdashboard.easebuzz.in/"

    return url_link