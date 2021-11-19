from datetime import date, datetime
import time
import random
import http.client
import json

from django_extensions.management.jobs import DailyJob

from school_app.model.models import School, DailyJobsReport
from employee_app.models import Employee, EmployeePermission
from sms_app.models import SMSId, SMS, SMSAdmin
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

            smsCount = 0
            notificationCount = 0
            smsMobileNumberList = []
            notificationMobileNumberList = []
            smsEmployeeList = []
            notificationEmployeeList = []

            if flag == 1:
                
                # Creating a data dictionary to fetch final message content from mapped content
                mappedDataDict = {
                    "schoolId": school.id,
                    "days": days
                }
                messageContent = self.getMessageFromTemplate(defaultTemplate["mappedContent"], mappedDataDict)
                
                # Extracting the details of the employees who have the permission for "Assign Task" page
                employeePermissionList = EmployeePermission.objects.filter(parentEmployee__parentSchool=school, parentTask_id=42)
                employeeList = []
                for employeePermission in employeePermissionList:         
                    employeeList.append(employeePermission.parentEmployee)

                mobileNumberContentJson = []

                for employee in employeeList:

                    if self.checkMobileNumber(employee.mobileNumber):
                        temp = {
                            "Number": employee.mobileNumber,
                            "Text": messageContent,
                            "DLTTemplateId": defaultTemplate["templateId"]
                        }
                        
                        mobileNumberContentJson.append(temp)
                        smsMobileNumberList.append(employee.mobileNumber)
                        smsEmployeeList.append(employee.name)
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

                        notificationMobileNumberList.append(employee.mobileNumber)
                        notificationEmployeeList.append(employee.name)
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
                    "contentType": '8' if self.hasUnicode(messageContent) else '0'
                }

                response = send_sms(sms_dict)

                sms_admin_dict = {
                    "parentSMSId_id": sms_dict["parentSMSId_id"],
                    "parentSchool_id": sms_dict["parentSchool_id"],
                    "content": messageContent,
                    "smsCount": smsCount,
                    "notificationCount": notificationCount,
                    "smsEmployeeList": smsEmployeeList,
                    "smsMobileNumberList": smsMobileNumberList,
                    "notificationEmployeeList": notificationEmployeeList,
                    "notificationMobileNumberList": notificationMobileNumberList
                }
                smsAdmin = SMSAdmin(**sms_admin_dict)
                smsAdmin.save()
                
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

    def checkMobileNumber(self, mobileNumber):
        if mobileNumber and len(str(mobileNumber)) == 10:
            return True
        else:
            False