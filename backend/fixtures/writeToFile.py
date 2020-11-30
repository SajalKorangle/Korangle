from django.core.serializers import serialize
import json

def writeUnformattedData(data, file_path):
    with open(file_path, 'w') as f:
        prevCh = None
        chunk = ''
        for ch in data:
            chunk += ch
            if (prevCh == '}' and ch == ','):
                chunk += '\n'
                f.write(chunk)
            prevCh = ch
        f.write(chunk)


def writeQuerySet(query_set, file_path):  #   write in json format
    json_data = serialize('json', query_set)
    writeUnformattedData(json_data, file_path)    

def readJsonData(file_path):
    with open(file_path, 'r') as f:
        json_data = f.read()
        parsed_data = json.loads(json_data)
        return parsed_data


    