def add_old_sessions(apps, schema_editor):

    Session = apps.get_model('school_app', 'Session')

    year = 1901
    orderNumber = 1

    while True:

        session_object = {
            'name': 'Session ' + str(year) + '-' + str(year + 1)[-2:],
            'startDate': str(year) + '-04-01',
            'endDate': str(year + 1) + '-03-31',
            'orderNumber': orderNumber
        }

        session = Session(**session_object)
        session.save()

        year = year + 1
        orderNumber = orderNumber + 1
        
        if year == 2017:
            break

    while True:

        session_list = Session.objects.filter(name='Session ' + str(year) + '-' + str(year + 1)[-2:])
        if session_list.count() == 0:
            break
        session = session_list[0]
        session.orderNumber = orderNumber
        session.save()

        year = year + 1
        orderNumber = orderNumber + 1

