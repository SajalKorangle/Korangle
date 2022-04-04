import json

from django.http import JsonResponse
from django.views import View

from decorators import get_success_response
from .business.contact_details import create_contact_details

# CREATING CONTACT DETAILS
class ContactDetailsView(View):

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return JsonResponse({'response': get_success_response(create_contact_details(data))})
