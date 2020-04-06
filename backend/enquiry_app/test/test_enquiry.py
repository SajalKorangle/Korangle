
from parent_test import ParentTestCase

import datetime

# Factory
from school_app.factory.school import SchoolFactory
from enquiry_app.factory.enquiry import EnquiryFactory

# Business
from enquiry_app.business.enquiry \
    import create_enquiry, get_enquiry, delete_enquiry, update_enquiry, EnquiryModelSerializer, get_enquiry_list

# Model
from enquiry_app.models import Enquiry
from class_app.models import Class


class EnquiryTestCase(ParentTestCase):

    def test_get_enquiry_list(self):

        school_object = SchoolFactory()

        class_object = Class.objects.get(name='Class - 12')

        enquiry_list = []

        enquiry_list.extend(EnquiryFactory.create_batch(3, parentSchool=school_object, parentClass=class_object))

        data = {
            'parentSchool': school_object.id,
            'startDate': datetime.date.today(),
            'endDate': datetime.date.today(),
        }

        response = get_enquiry_list(data)

        self.assertEqual(len(response), 3)

        index = 0
        for enquiry in enquiry_list:
            enquiry_response = response[index]
            self.assertEqual(enquiry.parentSchool.id, school_object.id)
            self.assertEqual(enquiry_response['id'], enquiry.id)
            index += 1

    def test_create_enquiry(self):

        school_object = SchoolFactory()

        data = {
            'studentName': 'Dummy',
            'enquirerName': 'Dummy Enquirer',
            'parentClass': Class.objects.get(name='Class - 12').id,
            'parentSchool': school_object.id,
        }

        create_enquiry(data)

        Enquiry.objects.get(studentName=data['studentName'],
                            enquirerName=data['enquirerName'],
                            parentClass_id=data['parentClass'],
                            parentSchool_id=data['parentSchool'])

    def test_update_enquiry(self):

        enquiry_object = EnquiryFactory()

        enquiry_serializer = EnquiryModelSerializer(enquiry_object)

        data = enquiry_serializer.data

        data['studentName'] = 'okay now'

        update_enquiry(data)

        self.assertEqual(Enquiry.objects.get(id=enquiry_serializer.data['id']).studentName, 'okay now')

    def test_get_enquiry(self):

        enquiry_object = EnquiryFactory()

        data = {
            'id': enquiry_object.id,
        }

        response = get_enquiry(data)

        self.assertEqual(response['studentName'], enquiry_object.studentName)
        self.assertEqual(response['id'], data['id'])

    def test_delete_enquiry(self):

        enquiry_object = EnquiryFactory()

        data = {
            'id': enquiry_object.id
        }

        delete_enquiry(data)

        self.assertEqual(Enquiry.objects.filter(id=data['id']).count(),0)
