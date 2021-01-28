import stripe
stripe.api_key = "sk_test_51IBXMWA39a3NFkF9PBgNjGnnGdOIxUQiqlXnQ40aeX0srz65TqVPN5bPwoaiWqRwORbeaRM148gs2OeYZ3uslDB9009MyrpA0C"
import datetime

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[-1].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip



def create_stripe_account(data,ip):
    stripe.api_key = "sk_test_51IBXMWA39a3NFkF9PBgNjGnnGdOIxUQiqlXnQ40aeX0srz65TqVPN5bPwoaiWqRwORbeaRM148gs2OeYZ3uslDB9009MyrpA0C"
    school  = data['school']
    representative = data['representative']
    owner = data['owner']
    account = stripe.Account.create(
    type="custom",
    country="IN",
    email="testing@example.com",
    capabilities={
        "card_payments": {"requested": True},
        "transfers": {"requested": True},
        },
    business_type= "company",
    business_profile={
    #     "mcc" : 756,
        "name": 'Badal',
        "product_description" : 'SchoolFee',
    #     "support_address": 'address',
        "support_email": 'testing@g.com',
        "support_phone":123456,
        "support_url": 'testingsupporturl.com',
         "url" : 'testingurl.com', 
    },
    company = {
        "name": school['name'],
        "phone": school['phone'],
        "tax_id": '000000000',
        # "pan": '0000000000',
        "address" :{
          "line1": 'address_full_match​'	,
          "city": school['city'],
          "state": school['state'],
          "postal_code": school['postalCode'],
        },
        "cross_border_transaction_classifications" : ["domestic"]
    },
    external_account = {
        "object" : 'bank_account',
        "country" : 'IN',
        "currency" : 'INR',
        "account_holder_name" : 'Avinash',
        "account_holder_type" : 'individual',
        "routing_number" : 'HDFC0000261',
        "account_number" : '123456788'
    },
    tos_acceptance =  {
        "date": datetime.datetime.now(),
        "ip": ip
      }
    )
    print(account)


    id = account['id']

    response = stripe.Account.create_person(
        id,
        first_name = representative['firstName'],
        last_name = representative['lastName'],
        id_number= '000000000',
        email = 'abc@gmail.com',
        dob= {
            "day" : "01",
            "month" : "01",
            "year" : "1901"
        },
        address ={
          "line1": 'address_full_match',
          "city": representative['city'],
          "state": representative['state'],
          "postal_code": representative['postalCode'],
        },
        relationship ={
        "representative": True,
        "executive":True
        },
    )
    print("..................Person............................")
    print(response)

    account =  stripe.Account.retrieve(id)
    print(account)
    return account
    