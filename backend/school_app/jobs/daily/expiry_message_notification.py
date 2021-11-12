from datetime import date, datetime
import time
import random
import http.client
import json

from django_extensions.management.jobs import DailyJob

from school_app.model.models import School, DailyJobsReport
from sms_app.models import SMSId, SMS
from sms_app.business.send_sms import send_sms
from notification_app.models import Notification
from push_notifications.models import GCMDevice

from django.contrib.auth import get_user_model
User = get_user_model()

class Job(DailyJob):
    help = "Send expiry message to schools"

    def execute(self):

        waitTime = random.randint(1, 5)
        time.sleep(waitTime)

        print("Job started...")

        try:
            dailyJobsReport = DailyJobsReport()
        except:
            print('Executing Failed')
            return

        schoolList = School.objects.all()

        SUBSCRIPTION_EXPIRY_TEMPLATE_ID = 16

        with open('sms_app/constant_database/default_sms_templates.json', encoding='utf-8') as f:
            templates = json.loads(f.read())

        for template in templates:
            if template["id"] == SUBSCRIPTION_EXPIRY_TEMPLATE_ID:
                defaultTemplate = template


        for school in schoolList:

            if school.expired or school.dateOfExpiry is None:
                continue

            today = date.today()
            expiryDate = school.dateOfExpiry
            diff = (expiryDate - today).days

            flag = 1
            
            if diff == 7 or diff == 3:
                days = "in " + str(diff) + " days"
            elif diff == 0:
                days = "today"
            else:
                flag = 0

            if flag == 1:
                
                try:
                    user = User.objects.get(username = school.mobileNumber)
                except:
                    continue


                # Creating a data dictionary to fetch final message content from mapped content
                mappedDataDict = {}
                mappedDataDict['schoolId'] = school.id
                mappedDataDict['days'] = days

                messageContent = self.getMessageFromTemplate(defaultTemplate["mappedContent"], mappedDataDict)

                # Creating a data dictionary which stores the necessary variables to send a notification
                notif_data = {}
                notif_data['content'] = messageContent
                notif_data['parentUser'] = user
                notif_data['parentSchool'] = school
                
                fcm_devices = GCMDevice.objects.filter(user=notif_data['parentUser'].id)
                result = fcm_devices.send_message(notif_data['content'], title="Korangle")

                notification = Notification(**notif_data)
                notification.save()
                # print(result)

                # Creating a data dictionary which stores the necessary variables to send a SMS
                sms_dict = {}
                sms_dict['parentSchool_id'] = school.id
                sms_dict['parentSMSId_id'] = 1
                sms_dict['mobileNumberContentJson'] = [{
                    "Number": 7043167316,
                    "Text": messageContent,
                    "DLTTemplateId": defaultTemplate["templateId"]
                }]
                sms_dict['mobileNumberContentJson'] = json.dumps(sms_dict['mobileNumberContentJson'])
                sms_dict['scheduledDateTime'] = None

                if self.hasUnicode(messageContent):
                    sms_dict['contentType'] = '8'
                else:
                    sms_dict['contentType'] = '0'

                sms_dict['count'] = -1

                response = send_sms(sms_dict)
                # print(response)

                sms_dict['sentStatus'] = 'FAILED' if response['requestId'] == -1 else 'SUCCESS'
                sms_dict['requestId'] = response['requestId']
                sms_dict['remark'] = response['remark']
                sms_dict['mobileNumberContentJson'] = response['mobileNumberContentJson']
                sms_dict['smsGateWayHubVendor'] = True

                sms = SMS(**sms_dict)
                sms.save()

        dailyJobsReport.status = 'SENT'
        dailyJobsReport.save()

        print("Job finished")

    def hasUnicode(self, message):
        for char in message:
            if ord(char) > 127:
                return True
        return False
    
    def getMessageFromTemplate(self, message, mappedDataDict):
        ret = message
        for key in mappedDataDict.keys():
            ret = ret.replace('{#' + key + '#}', str(mappedDataDict[key]))
        return ret