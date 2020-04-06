
from django.db.models import Sum


def populate_fees_app(apps, schema_editor):

    Discount = apps.get_model('fees_third_app', 'Discount')
    School = apps.get_model('school_app', 'School')

    populate_fee_type(apps)

    populate_structure(apps)

    for school_object in School.objects.all():

        discountNumber = 0
        for discount_object in \
                Discount.objects.filter(parentStudent__parentSchool=school_object)\
                        .order_by('generationDateTime'):
            discountNumber += 1
            discount_object.discountNumber = discountNumber
            discount_object.save()


def populate_fee_type(apps):

    FeeTypeOld = apps.get_model('fee_second_app', 'FeeType')
    FeeDefinition = apps.get_model('fee_second_app', 'FeeDefinition')

    FeeType = apps.get_model('fees_third_app', 'FeeType')

    for fee_type_old in FeeTypeOld.objects.all():

        for school_id in FeeDefinition.objects.filter(parentFeeType=fee_type_old, locked=True).values_list('parentSchool_id').distinct():

            fee_type_object = FeeType(name=fee_type_old.name,
                                      orderNumber=fee_type_old.orderNumber,
                                      parentSchool_id=school_id[0])

            fee_type_object.save()


def populate_structure(apps):

    # Old Model
    FeeDefinition = apps.get_model('fee_second_app', 'FeeDefinition')

    SchoolFeeComponent = apps.get_model('fee_second_app', 'SchoolFeeComponent')

    # New Model
    FeeType = apps.get_model('fees_third_app', 'FeeType')

    for fee_definition_object in FeeDefinition.objects.filter(locked=True):

        fee_type_object = FeeType.objects.get(parentSchool=fee_definition_object.parentSchool,
                                              name=fee_definition_object.parentFeeType.name)

        ruleNumber = 0

        print(fee_definition_object.parentSchool.name+' - '+fee_definition_object.parentFeeType.name)

        for school_fee_component_object in SchoolFeeComponent.objects.filter(parentFeeDefinition=fee_definition_object):

            ruleNumber += 1

            print(' ------- ' + school_fee_component_object.title)

            populate_school_fee_rule(apps, fee_definition_object, school_fee_component_object, fee_type_object, ruleNumber)

        ruleNumber += 1

        populate_school_fee_rule(apps, fee_definition_object, None, fee_type_object, ruleNumber)


def populate_school_fee_rule(apps, fee_definition_object, school_fee_component_object, fee_type_object, ruleNumber):

    Division = apps.get_model('class_app', 'Division')

    # Old Model
    ClassBasedFilter = apps.get_model('fee_second_app', 'ClassBasedFilter')
    BusStopBasedFilter = apps.get_model('fee_second_app', 'BusStopBasedFilter')
    SchoolMonthlyFeeComponent = apps.get_model('fee_second_app', 'SchoolMonthlyFeeComponent')

    StudentFeeComponent = apps.get_model('fee_second_app', 'StudentFeeComponent')
    StudentMonthlyFeeComponent = apps.get_model('fee_second_app', 'StudentMonthlyFeeComponent')

    # FeeReceiptOld = apps.get_model('fee_second_app', 'FeeReceiptOld')
    SubFeeReceiptOld = apps.get_model('fee_second_app', 'SubFeeReceipt')
    SubFeeReceiptMonthly = apps.get_model('fee_second_app', 'SubFeeReceiptMonthly')

    Concession = apps.get_model('fee_second_app', 'ConcessionSecond')
    SubConcession = apps.get_model('fee_second_app', 'SubConcession')
    SubConcessionMonthly = apps.get_model('fee_second_app', 'SubConcessionMonthly')

    # New Model
    SchoolFeeRule = apps.get_model('fees_third_app', 'SchoolFeeRule')
    ClassFilterFee = apps.get_model('fees_third_app', 'ClassFilterFee')
    BusStopFilterFee = apps.get_model('fees_third_app', 'BusStopFilterFee')

    StudentFee = apps.get_model('fees_third_app', 'StudentFee')

    SubFeeReceipt = apps.get_model('fees_third_app', 'SubFeeReceipt')

    Discount = apps.get_model('fees_third_app', 'Discount')
    SubDiscount = apps.get_model('fees_third_app', 'SubDiscount')

    school_fee_rule_object = SchoolFeeRule(parentFeeType=fee_type_object,
                                           parentSession=fee_definition_object.parentSession,
                                           ruleNumber=ruleNumber,
                                           isClassFilter=fee_definition_object.classFilter,
                                           isBusStopFilter=fee_definition_object.busStopFilter,
                                           onlyNewAdmission=fee_definition_object.onlyNewStudent,
                                           includeRTE=fee_definition_object.rte)

    if school_fee_component_object is None:
        school_fee_rule_object.name = "For Uncategorized Students"
    else:
        school_fee_rule_object.name = school_fee_component_object.title

    if fee_definition_object.frequency == 'YEARLY':

        school_fee_rule_object.isAnnually = True

        if school_fee_component_object is not None:
            school_fee_rule_object.aprilAmount = school_fee_component_object.amount

    elif fee_definition_object.frequency == 'MONTHLY':

        school_fee_rule_object.isAnnually = False

        if school_fee_component_object is not None:

            school_fee_component_monthly_object = \
                SchoolMonthlyFeeComponent.objects.get(parentMonth__name='APRIL',
                                                      parentSchoolFeeComponent=school_fee_component_object)
            school_fee_rule_object.aprilAmount = school_fee_component_monthly_object.amount

            school_fee_component_monthly_object = \
                SchoolMonthlyFeeComponent.objects.get(parentMonth__name='MAY',
                                                      parentSchoolFeeComponent=school_fee_component_object)
            school_fee_rule_object.mayAmount = school_fee_component_monthly_object.amount

            school_fee_component_monthly_object = \
                SchoolMonthlyFeeComponent.objects.get(parentMonth__name='JUNE',
                                                      parentSchoolFeeComponent=school_fee_component_object)
            school_fee_rule_object.juneAmount = school_fee_component_monthly_object.amount

            school_fee_component_monthly_object = \
                SchoolMonthlyFeeComponent.objects.get(parentMonth__name='JULY',
                                                      parentSchoolFeeComponent=school_fee_component_object)
            school_fee_rule_object.julyAmount = school_fee_component_monthly_object.amount

            school_fee_component_monthly_object = \
                SchoolMonthlyFeeComponent.objects.get(parentMonth__name='AUGUST',
                                                      parentSchoolFeeComponent=school_fee_component_object)
            school_fee_rule_object.augustAmount = school_fee_component_monthly_object.amount

            school_fee_component_monthly_object = \
                SchoolMonthlyFeeComponent.objects.get(parentMonth__name='SEPTEMBER',
                                                      parentSchoolFeeComponent=school_fee_component_object)
            school_fee_rule_object.septemberAmount = school_fee_component_monthly_object.amount

            school_fee_component_monthly_object = \
                SchoolMonthlyFeeComponent.objects.get(parentMonth__name='OCTOBER',
                                                      parentSchoolFeeComponent=school_fee_component_object)
            school_fee_rule_object.octoberAmount = school_fee_component_monthly_object.amount

            school_fee_component_monthly_object = \
                SchoolMonthlyFeeComponent.objects.get(parentMonth__name='NOVEMBER',
                                                      parentSchoolFeeComponent=school_fee_component_object)
            school_fee_rule_object.novemberAmount = school_fee_component_monthly_object.amount

            school_fee_component_monthly_object = \
                SchoolMonthlyFeeComponent.objects.get(parentMonth__name='DECEMBER',
                                                      parentSchoolFeeComponent=school_fee_component_object)
            school_fee_rule_object.decemberAmount = school_fee_component_monthly_object.amount

            school_fee_component_monthly_object = \
                SchoolMonthlyFeeComponent.objects.get(parentMonth__name='JANUARY',
                                                      parentSchoolFeeComponent=school_fee_component_object)
            school_fee_rule_object.januaryAmount = school_fee_component_monthly_object.amount

            school_fee_component_monthly_object = \
                SchoolMonthlyFeeComponent.objects.get(parentMonth__name='FEBRUARY',
                                                      parentSchoolFeeComponent=school_fee_component_object)
            school_fee_rule_object.februaryAmount = school_fee_component_monthly_object.amount

            school_fee_component_monthly_object = \
                SchoolMonthlyFeeComponent.objects.get(parentMonth__name='MARCH',
                                                      parentSchoolFeeComponent=school_fee_component_object)
            school_fee_rule_object.marchAmount = school_fee_component_monthly_object.amount

    else:
        print('Error in fee definition frequency')

    school_fee_rule_object.save()

    if school_fee_rule_object.isClassFilter and school_fee_component_object is not None:

        for class_based_filter_object in \
                ClassBasedFilter.objects.filter(parentSchoolFeeComponent=school_fee_component_object):

            for division_object in Division.objects.all():
                class_fee_filter_object = \
                    ClassFilterFee(parentSchoolFeeRule=school_fee_rule_object,
                                   parentClass=class_based_filter_object.parentClass,
                                   parentDivision=division_object)

                class_fee_filter_object.save()

    if school_fee_rule_object.isBusStopFilter and school_fee_component_object is not None:

        for bus_stop_based_filter_object in \
                BusStopBasedFilter.objects.filter(parentSchoolFeeComponent=school_fee_component_object):
            bus_stop_fee_filter_object = \
                BusStopFilterFee(parentSchoolFeeRule=school_fee_rule_object,
                                 parentBusStop=bus_stop_based_filter_object.parentBusStop)

            bus_stop_fee_filter_object.save()

    for student_fee_component_object in StudentFeeComponent.objects.filter(parentFeeDefinition=fee_definition_object):

        if get_school_fee_component_by_student_and_fee_defintion_object(apps, student_fee_component_object)\
                == school_fee_component_object:

            student_fee_object = StudentFee(parentStudent=student_fee_component_object.parentStudent,
                                            parentSchoolFeeRule=school_fee_rule_object,
                                            parentFeeType=school_fee_rule_object.parentFeeType,
                                            parentSession=school_fee_rule_object.parentSession,
                                            isAnnually=school_fee_rule_object.isAnnually)

            studentAmount = 0
            subFeeReceiptAmount = 0
            subDiscountAmount = 0

            if school_fee_rule_object.isAnnually:

                student_fee_object.aprilAmount = student_fee_component_object.amount

                studentAmount = student_fee_object.aprilAmount

            else:

                student_fee_component_monthly_object = \
                    StudentMonthlyFeeComponent.objects.filter(parentMonth__name='APRIL',
                                                           parentStudentFeeComponent=student_fee_component_object)
                if student_fee_component_monthly_object.count() == 1:
                    student_fee_object.aprilAmount = student_fee_component_monthly_object[0].amount
                else:
                    student_fee_object.aprilAmount = 0
                    print('Error: '+student_fee_component_object.parentStudent.parentSchool.name+' -- '
                          +student_fee_component_object.parentStudent.name+' -- '
                          +student_fee_component_object.parentFeeDefinition.parentFeeType.name+' -- APRIL')
                    if school_fee_component_object is not None:
                        school_fee_component_monthly_object = \
                            SchoolMonthlyFeeComponent.objects.get(parentMonth__name='APRIL',
                                                                     parentSchoolFeeComponent=school_fee_component_object)
                        print(school_fee_component_monthly_object.amount)
                        student_fee_object.aprilAmount = school_fee_component_monthly_object.amount

                student_fee_component_monthly_object = \
                    StudentMonthlyFeeComponent.objects.filter(parentMonth__name='MAY',
                                                           parentStudentFeeComponent=student_fee_component_object)
                if student_fee_component_monthly_object.count() == 1:
                    student_fee_object.mayAmount = student_fee_component_monthly_object[0].amount
                else:
                    student_fee_object.mayAmount = 0
                    print('Error: '+student_fee_component_object.parentStudent.parentSchool.name+' -- '
                          +student_fee_component_object.parentStudent.name+' -- '
                          +student_fee_component_object.parentFeeDefinition.parentFeeType.name+' -- MAY')
                    if school_fee_component_object is not None:
                        school_fee_component_monthly_object = \
                            SchoolMonthlyFeeComponent.objects.get(parentMonth__name='MAY',
                                                                     parentSchoolFeeComponent=school_fee_component_object)
                        print(school_fee_component_monthly_object.amount)
                        student_fee_object.mayAmount = school_fee_component_monthly_object.amount


                student_fee_component_monthly_object = \
                    StudentMonthlyFeeComponent.objects.filter(parentMonth__name='JUNE',
                                                           parentStudentFeeComponent=student_fee_component_object)
                if student_fee_component_monthly_object.count() == 1:
                    student_fee_object.juneAmount = student_fee_component_monthly_object[0].amount
                else:
                    student_fee_object.juneAmount = 0
                    print('Error: '+student_fee_component_object.parentStudent.parentSchool.name+' -- '
                          +student_fee_component_object.parentStudent.name+' -- '
                          +student_fee_component_object.parentFeeDefinition.parentFeeType.name+' -- JUNE')
                    if school_fee_component_object is not None:
                        school_fee_component_monthly_object = \
                            SchoolMonthlyFeeComponent.objects.get(parentMonth__name='JUNE',
                                                                     parentSchoolFeeComponent=school_fee_component_object)
                        print(school_fee_component_monthly_object.amount)
                        student_fee_object.juneAmount = school_fee_component_monthly_object.amount


                student_fee_component_monthly_object = \
                    StudentMonthlyFeeComponent.objects.filter(parentMonth__name='JULY',
                                                           parentStudentFeeComponent=student_fee_component_object)
                if student_fee_component_monthly_object.count() == 1:
                    student_fee_object.julyAmount = student_fee_component_monthly_object[0].amount
                else:
                    student_fee_object.julyAmount = 0
                    print('Error: '+student_fee_component_object.parentStudent.parentSchool.name+' -- '
                          +student_fee_component_object.parentStudent.name+' -- '
                          +student_fee_component_object.parentFeeDefinition.parentFeeType.name+' -- JULY')
                    if school_fee_component_object is not None:
                        school_fee_component_monthly_object = \
                            SchoolMonthlyFeeComponent.objects.get(parentMonth__name='JULY',
                                                                     parentSchoolFeeComponent=school_fee_component_object)
                        print(school_fee_component_monthly_object.amount)
                        student_fee_object.julyAmount = school_fee_component_monthly_object.amount


                student_fee_component_monthly_object = \
                    StudentMonthlyFeeComponent.objects.filter(parentMonth__name='AUGUST',
                                                           parentStudentFeeComponent=student_fee_component_object)
                if student_fee_component_monthly_object.count() == 1:
                    student_fee_object.augustAmount = student_fee_component_monthly_object[0].amount
                else:
                    student_fee_object.augustAmount = 0
                    print('Error: '+student_fee_component_object.parentStudent.parentSchool.name+' -- '
                          +student_fee_component_object.parentStudent.name+' -- '
                          +student_fee_component_object.parentFeeDefinition.parentFeeType.name+' -- AUGUST')
                    if school_fee_component_object is not None:
                        school_fee_component_monthly_object = \
                            SchoolMonthlyFeeComponent.objects.get(parentMonth__name='AUGUST',
                                                                     parentSchoolFeeComponent=school_fee_component_object)
                        print(school_fee_component_monthly_object.amount)
                        student_fee_object.augustAmount = school_fee_component_monthly_object.amount


                student_fee_component_monthly_object = \
                    StudentMonthlyFeeComponent.objects.filter(parentMonth__name='SEPTEMBER',
                                                           parentStudentFeeComponent=student_fee_component_object)
                if student_fee_component_monthly_object.count() == 1:
                    student_fee_object.septemberAmount = student_fee_component_monthly_object[0].amount
                else:
                    student_fee_object.septemberAmount = 0
                    print('Error: '+student_fee_component_object.parentStudent.parentSchool.name+' -- '
                          +student_fee_component_object.parentStudent.name+' -- '
                          +student_fee_component_object.parentFeeDefinition.parentFeeType.name+' -- SEPTEMBER')
                    if school_fee_component_object is not None:
                        school_fee_component_monthly_object = \
                            SchoolMonthlyFeeComponent.objects.get(parentMonth__name='SEPTEMBER',
                                                                     parentSchoolFeeComponent=school_fee_component_object)
                        print(school_fee_component_monthly_object.amount)
                        student_fee_object.septemberAmount = school_fee_component_monthly_object.amount


                student_fee_component_monthly_object = \
                    StudentMonthlyFeeComponent.objects.filter(parentMonth__name='OCTOBER',
                                                           parentStudentFeeComponent=student_fee_component_object)
                if student_fee_component_monthly_object.count() == 1:
                    student_fee_object.octoberAmount = student_fee_component_monthly_object[0].amount
                else:
                    student_fee_object.octoberAmount = 0
                    print('Error: '+student_fee_component_object.parentStudent.parentSchool.name+' -- '
                          +student_fee_component_object.parentStudent.name+' -- '
                          +student_fee_component_object.parentFeeDefinition.parentFeeType.name+' -- OCTOBER')
                    if school_fee_component_object is not None:
                        school_fee_component_monthly_object = \
                            SchoolMonthlyFeeComponent.objects.get(parentMonth__name='OCTOBER',
                                                                     parentSchoolFeeComponent=school_fee_component_object)
                        print(school_fee_component_monthly_object.amount)
                        student_fee_object.octoberAmount = school_fee_component_monthly_object.amount


                student_fee_component_monthly_object = \
                    StudentMonthlyFeeComponent.objects.filter(parentMonth__name='NOVEMBER',
                                                           parentStudentFeeComponent=student_fee_component_object)
                if student_fee_component_monthly_object.count() == 1:
                    student_fee_object.novemberAmount = student_fee_component_monthly_object[0].amount
                else:
                    student_fee_object.novemberAmount = 0
                    print('Error: '+student_fee_component_object.parentStudent.parentSchool.name+' -- '
                          +student_fee_component_object.parentStudent.name+' -- '
                          +student_fee_component_object.parentFeeDefinition.parentFeeType.name+' -- NOVEMBER')
                    if school_fee_component_object is not None:
                        school_fee_component_monthly_object = \
                            SchoolMonthlyFeeComponent.objects.get(parentMonth__name='NOVEMBER',
                                                                     parentSchoolFeeComponent=school_fee_component_object)
                        print(school_fee_component_monthly_object.amount)
                        student_fee_object.novemberAmount = school_fee_component_monthly_object.amount


                student_fee_component_monthly_object = \
                    StudentMonthlyFeeComponent.objects.filter(parentMonth__name='DECEMBER',
                                                           parentStudentFeeComponent=student_fee_component_object)
                if student_fee_component_monthly_object.count() == 1:
                    student_fee_object.decemberAmount = student_fee_component_monthly_object[0].amount
                else:
                    student_fee_object.decemberAmount = 0
                    print('Error: '+student_fee_component_object.parentStudent.parentSchool.name+' -- '
                          +student_fee_component_object.parentStudent.name+' -- '
                          +student_fee_component_object.parentFeeDefinition.parentFeeType.name+' -- DECEMBER')
                    if school_fee_component_object is not None:
                        school_fee_component_monthly_object = \
                            SchoolMonthlyFeeComponent.objects.get(parentMonth__name='DECEMBER',
                                                                     parentSchoolFeeComponent=school_fee_component_object)
                        print(school_fee_component_monthly_object.amount)
                        student_fee_object.decemberAmount = school_fee_component_monthly_object.amount


                student_fee_component_monthly_object = \
                    StudentMonthlyFeeComponent.objects.filter(parentMonth__name='JANUARY',
                                                           parentStudentFeeComponent=student_fee_component_object)
                if student_fee_component_monthly_object.count() == 1:
                    student_fee_object.januaryAmount = student_fee_component_monthly_object[0].amount
                else:
                    student_fee_object.januaryAmount = 0
                    print('Error: '+student_fee_component_object.parentStudent.parentSchool.name+' -- '
                          +student_fee_component_object.parentStudent.name+' -- '
                          +student_fee_component_object.parentFeeDefinition.parentFeeType.name+' -- JANUARY')
                    if school_fee_component_object is not None:
                        school_fee_component_monthly_object = \
                            SchoolMonthlyFeeComponent.objects.get(parentMonth__name='JANUARY',
                                                                     parentSchoolFeeComponent=school_fee_component_object)
                        print(school_fee_component_monthly_object.amount)
                        student_fee_object.januaryAmount = school_fee_component_monthly_object.amount



                student_fee_component_monthly_object = \
                    StudentMonthlyFeeComponent.objects.filter(parentMonth__name='FEBRUARY',
                                                           parentStudentFeeComponent=student_fee_component_object)
                if student_fee_component_monthly_object.count() == 1:
                    student_fee_object.februaryAmount = student_fee_component_monthly_object[0].amount
                else:
                    student_fee_object.februaryAmount = 0
                    print('Error: '+student_fee_component_object.parentStudent.parentSchool.name+' -- '
                          +student_fee_component_object.parentStudent.name+' -- '
                          +student_fee_component_object.parentFeeDefinition.parentFeeType.name+' -- FEBRUARY')
                    if school_fee_component_object is not None:
                        school_fee_component_monthly_object = \
                            SchoolMonthlyFeeComponent.objects.get(parentMonth__name='FEBRUARY',
                                                                     parentSchoolFeeComponent=school_fee_component_object)
                        print(school_fee_component_monthly_object.amount)
                        student_fee_object.februaryAmount = school_fee_component_monthly_object.amount



                student_fee_component_monthly_object = \
                    StudentMonthlyFeeComponent.objects.filter(parentMonth__name='MARCH',
                                                           parentStudentFeeComponent=student_fee_component_object)
                if student_fee_component_monthly_object.count() == 1:
                    student_fee_object.marchAmount = student_fee_component_monthly_object[0].amount
                else:
                    student_fee_object.marchAmount = 0
                    print('Error: '+student_fee_component_object.parentStudent.parentSchool.name+' -- '
                          +student_fee_component_object.parentStudent.name+' -- '
                          +student_fee_component_object.parentFeeDefinition.parentFeeType.name+' -- MARCH')
                    if school_fee_component_object is not None:
                        school_fee_component_monthly_object = \
                            SchoolMonthlyFeeComponent.objects.get(parentMonth__name='MARCH',
                                                                     parentSchoolFeeComponent=school_fee_component_object)
                        print(school_fee_component_monthly_object.amount)
                        student_fee_object.marchAmount = school_fee_component_monthly_object.amount


                studentAmount = \
                    StudentMonthlyFeeComponent.objects.filter(
                        parentStudentFeeComponent=student_fee_component_object)\
                        .aggregate(Sum('amount'))['amount__sum']

            student_fee_object.save()

            for sub_fee_receipt_old in \
                    SubFeeReceiptOld.objects.filter(parentStudentFeeComponent=student_fee_component_object)\
                            .order_by('-id'):

                fee_receipt_object = get_fee_receipt(apps, sub_fee_receipt_old)

                sub_fee_receipt = SubFeeReceipt(parentFeeReceipt=fee_receipt_object,
                                                parentStudentFee=student_fee_object,
                                                parentSession=student_fee_object.parentSession,
                                                parentFeeType=student_fee_object.parentFeeType,
                                                isAnnually=student_fee_object.isAnnually)

                if student_fee_object.isAnnually:
                    sub_fee_receipt.aprilAmount = sub_fee_receipt_old.amount
                    subFeeReceiptAmount = sub_fee_receipt.aprilAmount
                else:

                    sub_fee_receipt_monthly_query = \
                        SubFeeReceiptMonthly.objects.filter(parentMonth__name='APRIL',
                                                         parentSubFeeReceipt=sub_fee_receipt_old)
                    if sub_fee_receipt_monthly_query.count() == 1:
                        sub_fee_receipt.aprilAmount = sub_fee_receipt_monthly_query[0].amount

                    sub_fee_receipt_monthly_query = \
                        SubFeeReceiptMonthly.objects.filter(parentMonth__name='MAY',
                                                         parentSubFeeReceipt=sub_fee_receipt_old)
                    if sub_fee_receipt_monthly_query.count() == 1:
                        sub_fee_receipt.mayAmount = sub_fee_receipt_monthly_query[0].amount

                    sub_fee_receipt_monthly_query = \
                        SubFeeReceiptMonthly.objects.filter(parentMonth__name='JUNE',
                                                         parentSubFeeReceipt=sub_fee_receipt_old)
                    if sub_fee_receipt_monthly_query.count() == 1:
                        sub_fee_receipt.juneAmount = sub_fee_receipt_monthly_query[0].amount

                    sub_fee_receipt_monthly_query = \
                        SubFeeReceiptMonthly.objects.filter(parentMonth__name='JULY',
                                                         parentSubFeeReceipt=sub_fee_receipt_old)
                    if sub_fee_receipt_monthly_query.count() == 1:
                        sub_fee_receipt.julyAmount = sub_fee_receipt_monthly_query[0].amount

                    sub_fee_receipt_monthly_query = \
                        SubFeeReceiptMonthly.objects.filter(parentMonth__name='AUGUST',
                                                         parentSubFeeReceipt=sub_fee_receipt_old)
                    if sub_fee_receipt_monthly_query.count() == 1:
                        sub_fee_receipt.augustAmount = sub_fee_receipt_monthly_query[0].amount

                    sub_fee_receipt_monthly_query = \
                        SubFeeReceiptMonthly.objects.filter(parentMonth__name='SEPTEMBER',
                                                         parentSubFeeReceipt=sub_fee_receipt_old)
                    if sub_fee_receipt_monthly_query.count() == 1:
                        sub_fee_receipt.septemberAmount = sub_fee_receipt_monthly_query[0].amount

                    sub_fee_receipt_monthly_query = \
                        SubFeeReceiptMonthly.objects.filter(parentMonth__name='OCTOBER',
                                                         parentSubFeeReceipt=sub_fee_receipt_old)
                    if sub_fee_receipt_monthly_query.count() == 1:
                        sub_fee_receipt.octoberAmount = sub_fee_receipt_monthly_query[0].amount

                    sub_fee_receipt_monthly_query = \
                        SubFeeReceiptMonthly.objects.filter(parentMonth__name='NOVEMBER',
                                                         parentSubFeeReceipt=sub_fee_receipt_old)
                    if sub_fee_receipt_monthly_query.count() == 1:
                        sub_fee_receipt.novemberAmount = sub_fee_receipt_monthly_query[0].amount

                    sub_fee_receipt_monthly_query = \
                        SubFeeReceiptMonthly.objects.filter(parentMonth__name='DECEMBER',
                                                         parentSubFeeReceipt=sub_fee_receipt_old)
                    if sub_fee_receipt_monthly_query.count() == 1:
                        sub_fee_receipt.decemberAmount = sub_fee_receipt_monthly_query[0].amount

                    sub_fee_receipt_monthly_query = \
                        SubFeeReceiptMonthly.objects.filter(parentMonth__name='JANUARY',
                                                         parentSubFeeReceipt=sub_fee_receipt_old)
                    if sub_fee_receipt_monthly_query.count() == 1:
                        sub_fee_receipt.januaryAmount = sub_fee_receipt_monthly_query[0].amount

                    sub_fee_receipt_monthly_query = \
                        SubFeeReceiptMonthly.objects.filter(parentMonth__name='FEBRUARY',
                                                         parentSubFeeReceipt=sub_fee_receipt_old)
                    if sub_fee_receipt_monthly_query.count() == 1:
                        sub_fee_receipt.februaryAmount = sub_fee_receipt_monthly_query[0].amount

                    sub_fee_receipt_monthly_query = \
                        SubFeeReceiptMonthly.objects.filter(parentMonth__name='MARCH',
                                                         parentSubFeeReceipt=sub_fee_receipt_old)
                    if sub_fee_receipt_monthly_query.count() == 1:
                        sub_fee_receipt.marchAmount = sub_fee_receipt_monthly_query[0].amount

                    subFeeReceiptAmount = \
                        SubFeeReceiptMonthly.objects.filter(
                            parentSubFeeReceipt=sub_fee_receipt_old) \
                            .aggregate(Sum('amount'))['amount__sum']

                sub_fee_receipt.save()

            for sub_concession in \
                    SubConcession.objects.filter(parentStudentFeeComponent=student_fee_component_object)\
                            .order_by('-id'):

                discount_object = get_discount(apps, sub_concession)

                sub_discount = SubDiscount(parentDiscount=discount_object,
                                           parentStudentFee=student_fee_object,
                                           parentSession=student_fee_object.parentSession,
                                           parentFeeType=student_fee_object.parentFeeType,
                                           isAnnually=student_fee_object.isAnnually)

                if student_fee_object.isAnnually:
                    sub_discount.aprilAmount = sub_concession.amount
                    subDiscountAmount = sub_discount.aprilAmount
                else:

                    sub_concession_monthly_query = \
                        SubConcessionMonthly.objects.filter(parentMonth__name='APRIL',
                                                         parentSubConcession=sub_concession)
                    if sub_concession_monthly_query.count() == 1:
                        sub_discount.aprilAmount = sub_concession_monthly_query[0].amount

                    sub_concession_monthly_query = \
                        SubConcessionMonthly.objects.filter(parentMonth__name='MAY',
                                                         parentSubConcession=sub_concession)
                    if sub_concession_monthly_query.count() == 1:
                        sub_discount.mayAmount = sub_concession_monthly_query[0].amount

                    sub_concession_monthly_query = \
                        SubConcessionMonthly.objects.filter(parentMonth__name='JUNE',
                                                         parentSubConcession=sub_concession)
                    if sub_concession_monthly_query.count() == 1:
                        sub_discount.juneAmount = sub_concession_monthly_query[0].amount

                    sub_concession_monthly_query = \
                        SubConcessionMonthly.objects.filter(parentMonth__name='JULY',
                                                         parentSubConcession=sub_concession)
                    if sub_concession_monthly_query.count() == 1:
                        sub_discount.julyAmount = sub_concession_monthly_query[0].amount

                    sub_concession_monthly_query = \
                        SubConcessionMonthly.objects.filter(parentMonth__name='AUGUST',
                                                         parentSubConcession=sub_concession)
                    if sub_concession_monthly_query.count() == 1:
                        sub_discount.augustAmount = sub_concession_monthly_query[0].amount

                    sub_concession_monthly_query = \
                        SubConcessionMonthly.objects.filter(parentMonth__name='SEPTEMBER',
                                                         parentSubConcession=sub_concession)
                    if sub_concession_monthly_query.count() == 1:
                        sub_discount.septemberAmount = sub_concession_monthly_query[0].amount

                    sub_concession_monthly_query = \
                        SubConcessionMonthly.objects.filter(parentMonth__name='OCTOBER',
                                                         parentSubConcession=sub_concession)
                    if sub_concession_monthly_query.count() == 1:
                        sub_discount.octoberAmount = sub_concession_monthly_query[0].amount

                    sub_concession_monthly_query = \
                        SubConcessionMonthly.objects.filter(parentMonth__name='NOVEMBER',
                                                         parentSubConcession=sub_concession)
                    if sub_concession_monthly_query.count() == 1:
                        sub_discount.novemberAmount = sub_concession_monthly_query[0].amount

                    sub_concession_monthly_query = \
                        SubConcessionMonthly.objects.filter(parentMonth__name='DECEMBER',
                                                         parentSubConcession=sub_concession)
                    if sub_concession_monthly_query.count() == 1:
                        sub_discount.decemberAmount = sub_concession_monthly_query[0].amount

                    sub_concession_monthly_query = \
                        SubConcessionMonthly.objects.filter(parentMonth__name='JANUARY',
                                                         parentSubConcession=sub_concession)
                    if sub_concession_monthly_query.count() == 1:
                        sub_discount.januaryAmount = sub_concession_monthly_query[0].amount

                    sub_concession_monthly_query = \
                        SubConcessionMonthly.objects.filter(parentMonth__name='FEBRUARY',
                                                         parentSubConcession=sub_concession)
                    if sub_concession_monthly_query.count() == 1:
                        sub_discount.februaryAmount = sub_concession_monthly_query[0].amount

                    sub_concession_monthly_query = \
                        SubConcessionMonthly.objects.filter(parentMonth__name='MARCH',
                                                         parentSubConcession=sub_concession)
                    if sub_concession_monthly_query.count() == 1:
                        sub_discount.marchAmount = sub_concession_monthly_query[0].amount

                    subDiscountAmount = \
                        SubConcessionMonthly.objects.filter(
                            parentSubConcession=sub_concession) \
                            .aggregate(Sum('amount'))['amount__sum']

                sub_discount.save()

            if studentAmount - subFeeReceiptAmount - subDiscountAmount == 0:
                student_fee_object.cleared = True
                student_fee_object.save()
            elif studentAmount - subFeeReceiptAmount - subDiscountAmount < 0:
                print('Fees paid more than due')


def get_fee_receipt(apps, sub_fee_receipt_old):

    FeeReceipt = apps.get_model('fees_third_app', 'FeeReceipt')

    fee_receipt_object_old = sub_fee_receipt_old.parentFeeReceipt

    fee_receipt_query = FeeReceipt.objects.filter(receiptNumber=fee_receipt_object_old.receiptNumber,
                                                  parentStudent=fee_receipt_object_old.parentStudent)

    if fee_receipt_query.count() == 1:
        return fee_receipt_query[0]
    elif fee_receipt_query.count() == 0:
        fee_receipt_object = FeeReceipt(receiptNumber=fee_receipt_object_old.receiptNumber,
                                        remark=fee_receipt_object_old.remark,
                                        cancelled=fee_receipt_object_old.cancelled,
                                        parentStudent=fee_receipt_object_old.parentStudent,
                                        parentSchool=fee_receipt_object_old.parentStudent.parentSchool,
                                        parentSession=sub_fee_receipt_old.parentStudentFeeComponent.parentFeeDefinition.parentSession,
                                        parentEmployee=fee_receipt_object_old.parentEmployee)
        fee_receipt_object.save()
        fee_receipt_object.generationDateTime = fee_receipt_object_old.generationDateTime
        fee_receipt_object.save()
        return fee_receipt_object
    else:
        print('Error in fee receipt counting')
        return None


def get_discount(apps, sub_concession):

    Discount = apps.get_model('fees_third_app', 'Discount')

    concession_object = sub_concession.parentConcessionSecond

    discount_query = Discount.objects.filter(parentStudent=concession_object.parentStudent,
                                             generationDateTime=concession_object.generationDateTime)

    if discount_query.count() == 1:
        return discount_query[0]
    elif discount_query.count() == 0:
        discount_object = Discount(discountNumber=10000000+sub_concession.id,
                                   remark=concession_object.remark,
                                   cancelled=concession_object.cancelled,
                                   parentStudent=concession_object.parentStudent,
                                   parentSchool=concession_object.parentStudent.parentSchool,
                                   parentSession=sub_concession.parentStudentFeeComponent.parentFeeDefinition.parentSession,
                                   parentEmployee=concession_object.parentEmployee)
        discount_object.save()
        discount_object.generationDateTime = concession_object.generationDateTime
        discount_object.save()
        return discount_object
    else:
        print('Error in discount counting')
        return None


def get_school_fee_component_by_student_and_fee_defintion_object(apps, student_fee_component_object):

    Student = apps.get_model('student_app', 'Student')
    StudentSection = apps.get_model('student_app', 'StudentSection')
    SchoolFeeComponent = apps.get_model('fee_second_app', 'SchoolFeeComponent')


    fee_definition_object = student_fee_component_object.parentFeeDefinition
    student_object = student_fee_component_object.parentStudent

    # check rte constraint
    if (fee_definition_object.rte is False) and (student_object.rte == 'YES'):
        return None

    # check only new student constraint
    if fee_definition_object.onlyNewStudent is True:
        if (student_object.admissionSession is not None) \
                and (student_object.admissionSession.id != fee_definition_object.parentSession.id):
            return None
        if student_object.admissionSession is None:
            return None

    # find student fee component by defined filters
    school_fee_component_queryset = SchoolFeeComponent.objects.filter(parentFeeDefinition=fee_definition_object)

    session_object = fee_definition_object.parentSession
    if fee_definition_object.classFilter:
        student_section_object = \
            StudentSection.objects.get(parentStudent=student_object,
                                       parentSession=session_object)
        class_object = student_section_object.parentClass
        for school_fee_component_object in school_fee_component_queryset:
            if school_fee_component_object.classbasedfilter_set.filter(parentClass=class_object).count() == 0:
                school_fee_component_queryset = school_fee_component_queryset.exclude(id=school_fee_component_object.id)

    if fee_definition_object.busStopFilter:
        bus_stop_object = student_object.currentBusStop
        for school_fee_component_object in school_fee_component_queryset:
            if school_fee_component_object.busstopbasedfilter_set.filter(parentBusStop=bus_stop_object).count() == 0:
                school_fee_component_queryset = school_fee_component_queryset.exclude(id=school_fee_component_object.id)

    if school_fee_component_queryset.count() == 0:
        return None
    elif school_fee_component_queryset.count() == 1:
        return school_fee_component_queryset[0]
    else:
        raise ValueError('More than one school fee component for a student')
        return None

