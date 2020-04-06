from django.test import TestCase

class ParentTestCase(TestCase):

    def setUp(self):

        print(self.__str__())