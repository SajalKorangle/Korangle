import datetime
from django.utils.duration import duration_iso_string
from django.utils.functional import Promise
from django.utils.timezone import is_aware
import decimal
import uuid

# This function is copied from django.core.serializers.json.DjangoJSONEncoder,


def custom_type_json_encoder(o):
    # See "Date Time String Format" in the ECMA-262 specification.
    if isinstance(o, datetime.datetime):
        r = o.isoformat()
        if o.microsecond:
            r = r[:23] + r[26:]
        if r.endswith('+00:00'):
            r = r[:-6] + 'Z'
        return r
    elif isinstance(o, datetime.date):
        return o.isoformat()
    elif isinstance(o, datetime.time):
        if is_aware(o):
            raise ValueError("JSON can't represent timezone-aware times.")
        r = o.isoformat()
        if o.microsecond:
            r = r[:12]
        return r
    elif isinstance(o, datetime.timedelta):
        return duration_iso_string(o)
    elif isinstance(o, (decimal.Decimal, uuid.UUID, Promise)):
        return str(o)
    else:
        return o


def make_dict_serializable(data):
    for key in data:
        data[key] = custom_type_json_encoder(data[key])
    return data


def make_dict_list_serializable(data):
    for i in range(len(data)):
        data[i] = make_dict_serializable(data[i])
    return data
