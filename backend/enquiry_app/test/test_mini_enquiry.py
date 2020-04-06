
from parent_test import ParentTestCase

# Model
from class_app.models import Class

# Factory
from school_app.factory.school import SchoolFactory
from enquiry_app.factory.enquiry import EnquiryFactory

# Business
from enquiry_app.business.mini_enquiry import get_mini_enquriry_list


class MiniEnquiryTestCase(ParentTestCase):

    def test_get_mini_enquiry_list(self):

        school_object = SchoolFactory()

        class_object = Class.objects.get(name='Class - 12')

        enquiry_list = []

        enquiry_list.extend(EnquiryFactory.create_batch(3, parentSchool=school_object, parentClass=class_object))

        data = {
            'parentSchool': school_object.id,
        }

        response = get_mini_enquriry_list(data)

        self.assertEqual(len(response), 3)

        index = 0
        for enquiry in enquiry_list:
            enquiry_response = response[index]
            self.assertEqual(enquiry.parentSchool.id, school_object.id)
            self.assertEqual(enquiry_response['id'], enquiry.id)
            self.assertEqual(enquiry_response['enquirerName'], enquiry.enquirerName)
            self.assertEqual(enquiry_response['dateOfEnquiry'], enquiry.dateOfEnquiry)
            index += 1
