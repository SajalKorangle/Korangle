"""from django.test import TestCase

from school_app.models import Student

from student_app.handlers.common import populate_student_field

import datetime

class CommonTestCase(TestCase):

    def test_populate_student_field(self):



        student_object = Student.objects.all()[0]

        text = 'okay'
        number = 123
        date = '2007-04-01'

        for attr, value in student_object.__dict__.items():
            print(attr + str(value))
            if type(getattr(student_object,attr)) is int:
                populate_student_field(student_object,attr,number)
            elif type(getattr(student_object,attr)) is str:
                populate_student_field(student_object,attr,text)
            elif isinstance(getattr(student_object,attr),datetime.date):
                populate_student_field(student_object,attr,date)
            else:
                print('unrecognized type: '+str(type(getattr(student_object,attr))))

        for attr, value in student_object.__dict__.items():
            if type(getattr(student_object,attr)) is int:
                self.assertEqual(getattr(student_object,attr),number)
            elif type(getattr(student_object,attr)) is str:
                self.assertEqual(getattr(student_object,attr),text)
            elif isinstance(getattr(student_object,attr),datetime.date):
                self.assertEqual(getattr(student_object,attr).__str__(),date)
            else:
                print('unrecognized type: '+str(type(getattr(student_object,attr))))"""
