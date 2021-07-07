def get_error_response(message):
    error_response = {}
    error_response['status'] = 'fail'
    error_response['message'] = message
    return error_response


def get_success_response(data):
    message_response = {}
    message_response['status'] = 'success'
    message_response['data'] = data
    return message_response


def get_success_message(message):
    message_response = {}
    message_response['status'] = 'success'
    message_response['message'] = message
    return message_response


def filter_json_func(db_content, request_json):
    for key in request_json:
        try:
            if key.endswith('__in'):
                array = request_json[key].split(",")
                print(db_content[key[:-4]])
                if str(db_content[key[:-4]]) not in array:
                    print("fal")
                    return False
            elif db_content[key] != request_json[key]:
                return False
        except KeyError:
            return False
    return True
