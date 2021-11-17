from datetime import date, datetime
import time
import random
import http.client
import json

from django_extensions.management.jobs import DailyJob

from school_app.model.models import School, DailyJobsReport
from employee_app.models import Employee, EmployeePermission
from sms_app.models import SMSId, SMS
from sms_app.business.send_sms import send_sms
from notification_app.models import Notification
from push_notifications.models import GCMDevice

from django.contrib.auth import get_user_model
User = get_user_model()

class Job(DailyJob):
    help = "Send expiry message to schools"

    def execute(self):

        print("Job started...")

        try:
            dailyJobsReport = DailyJobsReport.objects.create()
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
                
                # Creating a data dictionary to fetch final message content from mapped content
                mappedDataDict = {
                    "schoolId": school.id,
                    "days": days
                }
                messageContent = self.getMessageFromTemplate(defaultTemplate["mappedContent"], mappedDataDict)
                
                # Extracting the details of the employees who have the permission for "Assign Task" page
                overallEmployeeList = Employee.objects.filter(parentSchool = school)
                employeeList = []

                for employee in overallEmployeeList:
                    
                    employeePermissionList = EmployeePermission.objects.filter(parentEmployee = employee)
                    
                    for employeePermission in employeePermissionList:
                        
                        # "Assign Task" page's id = 42
                        if employeePermission.parentTask.id == 42:                  
                            employeeList.append(employeePermission.parentEmployee)

                mobileNumberContentJson = []

                for employee in employeeList:
                    temp = {
                        "Number": employee.mobileNumber,
                        "Text": messageContent,
                        "DLTTemplateId": defaultTemplate["templateId"]
                    }
                    
                    mobileNumberContentJson.append(temp)

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

                    except:
                        continue

                # Creating a data dictionary which stores the necessary variables to send a SMS
                sms_dict = {
                    "parentSchool_id": school.id,
                    "parentSMSId_id": 1,
                    "mobileNumberContentJson": json.dumps(mobileNumberContentJson),
                    "scheduledDateTime": None,
                    "count": -1,
                    "contentType": '8' if self.hasUnicode(messageContent) else '0'
                }

                response = send_sms(sms_dict)
                # print(response)

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
