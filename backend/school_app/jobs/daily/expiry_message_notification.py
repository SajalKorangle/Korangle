from datetime import date, datetime
import time
import random
import http.client
import json

from django_extensions.management.jobs import DailyJob

from school_app.model.models import School, SchoolExpiryInformationJobsReport
from employee_app.models import Employee, EmployeePermission
from sms_app.models import SMSId, SMS
from sms_app.business.send_sms import send_sms_via_smsgatewayhub
from notification_app.models import Notification
from information_app.models import AdminInformation
from push_notifications.models import GCMDevice

from django.contrib.auth import get_user_model
User = get_user_model()

class Job(DailyJob):
    help = "Send expiry message to schools"

    def execute(self):

        print("Job started...")

        try:
            schoolExpiryInformationJobsReport = SchoolExpiryInformationJobsReport.objects.create()
        except:
            print('Executing Failed')
            return

        schoolList = School.objects.all()

        SUBSCRIPTION_EXPIRY_TEMPLATE_ID = 16    # could be 16 or 17

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
                
                # Extracting the details of the employees who have the permission for "Assign Task" page
                employeePermissionList = EmployeePermission.objects.filter(parentEmployee__parentSchool=school, parentTask_id=42)
                employeeList = []
                
                for employeePermission in employeePermissionList:
                    employee = employeePermission.parentEmployee
                    employee.sms = False
                    employee.notification = False         
                    employeeList.append(employee)

                smsCount = 0
                notificationCount = 0
                mobileNumberContentJson = []
                unicodeFlag = False

                for employee in employeeList:

                    # Creating a data dictionary to fetch final message content from mapped content
                    mappedDataDict = {
                        "schoolId": school.id,
                        "days": days,
                        "employeeName": employee.name,
                        "salesSupportMobileNumber": "7974151131"
                    }
                    messageContent = self.getMessageFromTemplate(defaultTemplate["mappedContent"], mappedDataDict)
                    
                    if self.checkMobileNumber(employee.mobileNumber):
                        temp = {
                            "Number": employee.mobileNumber,
                            "Text": messageContent,
                            "DLTTemplateId": defaultTemplate["templateId"]
                        }
                        unicodeFlag != self.hasUnicode(messageContent)
                        mobileNumberContentJson.append(temp)
                        employee.sms = True
                        smsCount += 1

                    try:
                        user = User.objects.get(username = employee.mobileNumber)                  
                        
                        # Creating a data dictionary which stores the necessary variables to send a notification
                        notif_data = {
                            "content": messageContent,
                            "parentUser": user,
                            "parentSchool": school
                        }

                        notification = Notification(**notif_data)
                        notification.save()
                        employee.notification = True
                        notificationCount += 1

                    except:
                        continue

                # Creating a data dictionary which stores the necessary variables to send a SMS
                sms_dict = {
                    "parentSchool_id": school.id,
                    "parentSMSId_id": 1,
                    "mobileNumberContentJson": json.dumps(mobileNumberContentJson),
                    "scheduledDateTime": None,
                    "count": -1,
                    "contentType": '8' if unicodeFlag else '0'
                }

                response = send_sms_via_smsgatewayhub(sms_dict)

                admin_info_dict = {
                    "parentSchool_id": sms_dict["parentSchool_id"],
                    "content": messageContent,
                    "smsCount": smsCount,
                    "notificationCount": notificationCount,
                    "employeeList": employeeList,
                }
                adminInformation = AdminInformation(**admin_info_dict)
                adminInformation.save()
                
        schoolExpiryInformationJobsReport.status = 'SENT'
        schoolExpiryInformationJobsReport.save()

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

    def checkMobileNumber(self, mobileNumber):
        if mobileNumber and len(str(mobileNumber)) == 10:
            return True
        else:
            False