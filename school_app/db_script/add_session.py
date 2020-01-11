
def add_session(apps,schema_editor):
    Session = apps.get_model('school_app','Session')
    session_20_21 = Session(startDate='2020-04-01',endDate='2021-03-31',name='Session 2020-21',orderNumber=4)
    session_21_22 = Session(startDate='2021-04-01',endDate='2022-03-31',name='Session 2021-22',orderNumber=5)
    session_20_21.save()
    session_21_22.save()