
from parent_test import ParentTestCase

# Business
from student_app.business.student_full_profile import get_student_full_profile, \
    get_student_full_profile_by_school_and_session_id, create_student_full_profile, \
    create_student_full_profile_list, partially_update_student_full_profile, \
    StudentModelSerializer

# Factories
from student_app.factories.student import StudentFactory
from school_app.factory.school import SchoolFactory
from vehicle_app.factory.bus_stop import BusStopFactory

# Models
from student_app.models import StudentSection, Student
from school_app.model.models import School, Session
from class_app.models import Section


class StudentFullProfileTestCase(ParentTestCase):

    def test_partially_update_student_profile(self):

        student_object = StudentFactory()

        student_serializer = StudentModelSerializer(student_object)

        data = {}
        data['id'] = student_serializer.data['id']
        data['name'] = 'Wow Wow'

        partially_update_student_full_profile(data)

        self.assertEqual(Student.objects.get(id=student_serializer.data['id']).name, data['name'])

    def test_create_student_profile_list(self):

        school_object = SchoolFactory()
        bus_stop_object = BusStopFactory(parentSchool=school_object)

        section_object = Section.objects.get(parentClassSession__parentSession__name='Session 2017-18',
                                             parentClassSession__parentClass__name='Class - 12',
                                             name='Section - A')

        data = {}
        data['name'] = 'Demo Student'
        data['fathersName'] = 'Father Name'
        data['mobileNumber'] = 9898955441
        data['dateOfBirth'] = '2007-04-01'
        data['remark'] = 'okay nice'
        data['scholarNumber'] = 'A234'
        data['rollNumber'] = '123'
        data['motherName'] = 'Mother Name'
        data['gender'] = 'Male'
        data['caste'] = 'Goyal'
        data['category'] = 'SC'
        data['religion'] = 'Jainism'
        data['fatherOccupation'] = 'Farmer'
        data['address'] = 'Hadlay, Akodiya'
        data['familySSMID'] = 12345678
        data['childSSMID'] = 1234556789
        data['bankName'] = 'State Bank Of India'
        data['bankAccountNum'] = 'SBI0000342342'
        data['aadharNum'] = 123456789012
        data['bloodGroup'] = 'O +'
        data['fatherAnnualIncome'] = '15,000'
        data['currentBusStop'] = bus_stop_object.id
        data['parentSchool'] = school_object.id
        data['parentSection'] = section_object.id

        data_list = []
        data_list.append(data)
        data_list.append(data)
        data_list.append(data)

        response = create_student_full_profile_list(data_list)

        self.assertEqual(response['message'], 'Added 3 students in school')

    def test_create_student_profile(self):

        school_object = SchoolFactory()
        bus_stop_object = BusStopFactory(parentSchool=school_object)

        section_object = Section.objects.get(parentClassSession__parentSession__name='Session 2017-18',
                                             parentClassSession__parentClass__name='Class - 12',
                                             name='Section - A')

        data = {}
        data['name'] = 'Demo Student'
        data['fathersName'] = 'Father Name'
        data['mobileNumber'] = 9898955441
        data['dateOfBirth'] = '2007-04-01'
        data['remark'] = 'okay nice'
        data['scholarNumber'] = 'A234'
        data['rollNumber'] = '123'
        data['motherName'] = 'Mother Name'
        data['gender'] = 'Male'
        data['caste'] = 'Goyal'
        data['category'] = 'SC'
        data['religion'] = 'Jainism'
        data['fatherOccupation'] = 'Farmer'
        data['address'] = 'Hadlay, Akodiya'
        data['familySSMID'] = 12345678
        data['childSSMID'] = 1234556789
        data['bankName'] = 'State Bank Of India'
        data['bankAccountNum'] = 'SBI0000342342'
        data['aadharNum'] = 123456789012
        data['bloodGroup'] = 'O +'
        data['fatherAnnualIncome'] = '15,000'
        data['currentBusStop'] = bus_stop_object.id
        data['parentSchool'] = school_object.id
        data['parentSection'] = section_object.id

        response = create_student_full_profile(data)

        Student.objects.get(parentSchool=school_object, currentBusStop=bus_stop_object, name=data['name'])


    def test_get_student_full_profile(self):

        student_object = StudentFactory(
            name='Demo Student',
            fathersName='Father Name',
            mobileNumber=9898955441,
            dateOfBirth='2007-04-01',
            remark='1000',
            scholarNumber='A234',
            motherName='Mother Name',
            gender='Male',
            caste='Goyal',
            newCategoryField='SC',
            newReligionField='Jainism',
            fatherOccupation='Farmer',
            address='Hadlay, Akodiya',
            familySSMID=12345678,
            childSSMID=123456789,
            bankName='State Bank Of India',
            bankAccountNum='SBI0000342342',
            aadharNum=123456789012,
            bloodGroup='O +',
            fatherAnnualIncome='15,000',
        )

        student_section_object = StudentSection.objects.get(parentStudent=student_object)

        response = get_student_full_profile(student_section_object)

        self.assertEqual(len(response), 31)

        self.assertEqual(response['name'], student_object.name)
        self.assertEqual(response['dbId'], student_object.id)
        self.assertEqual(response['fathersName'], student_object.fathersName)
        self.assertEqual(response['profileImage'], None)
        self.assertEqual(response['mobileNumber'], student_object.mobileNumber)
        self.assertEqual(response['dateOfBirth'].__str__(),student_object.dateOfBirth)
        self.assertEqual(response['remark'],student_object.remark)
        self.assertEqual(response['rollNumber'],student_section_object.rollNumber)
        self.assertEqual(response['scholarNumber'], student_object.scholarNumber)
        self.assertEqual(response['motherName'],student_object.motherName)
        self.assertEqual(response['gender'],student_object.gender)
        self.assertEqual(response['caste'],student_object.caste)
        self.assertEqual(response['category'],student_object.newCategoryField)
        self.assertEqual(response['religion'],student_object.newReligionField)
        self.assertEqual(response['fatherOccupation'],student_object.fatherOccupation)
        self.assertEqual(response['address'],student_object.address)
        self.assertEqual(response['familySSMID'],student_object.familySSMID)
        self.assertEqual(response['childSSMID'],student_object.childSSMID)
        self.assertEqual(response['bankName'],student_object.bankName)
        self.assertEqual(response['bankAccountNum'],student_object.bankAccountNum)
        self.assertEqual(response['aadharNum'],student_object.aadharNum)
        self.assertEqual(response['bloodGroup'],student_object.bloodGroup)
        self.assertEqual(response['fatherAnnualIncome'],student_object.fatherAnnualIncome)
        self.assertEqual(response['rte'],student_object.rte)
        self.assertEqual(response['parentTransferCertificate'],student_object.parentTransferCertificate)
        self.assertEqual(response['className'], student_section_object.parentSection.parentClassSession.parentClass.name)
        self.assertEqual(response['sectionName'], student_section_object.parentSection.name)
        self.assertEqual(response['sectionDbId'], student_section_object.parentSection.id)
        self.assertEqual(response['classDbId'], student_section_object.parentSection.parentClassSession.parentClass.id)


        if student_object.currentBusStop is not None:
            self.assertEqual(response['busStopDbId'], student_object.currentBusStop.id)
        else:
            self.assertEqual(response['busStopDbId'], None)

        if student_object.admissionSession is not None:
            self.assertEqual(response['admissionSessionDbId'], student_object.admissionSession.id)
        else:
            self.assertEqual(response['admissionSessionDbId'], None)


    def test_get_student_full_profile_by_school_and_session_id(self):

        school_object = School.objects.get(name='BRIGHT STAR')
        session_object = Session.objects.get(name='Session 2017-18')

        data = {
            'schoolDbId': school_object.id,
            'sessionDbId': session_object.id,
        }

        response = get_student_full_profile_by_school_and_session_id(data)

        student_section_queryset = \
            StudentSection.objects.filter(parentStudent__parentSchool=school_object,
                                          parentSection__parentClassSession__parentSession=session_object) \
            .order_by('parentSection__parentClassSession__parentClass__orderNumber', 'parentSection__orderNumber', 'parentStudent__name')

        self.assertEqual(len(response), student_section_queryset.count())

        index = 0
        for student_section_object in student_section_queryset:

            self.assertEqual(response[index]['dbId'], student_section_object.parentStudent.id)
            index += 1
