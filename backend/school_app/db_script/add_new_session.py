def add_new_session(apps,schema_editor):
    Session = apps.get_model('school_app','Session')
    session_22_23 = Session(startDate='2022-04-01',endDate='2023-03-31',name='Session 2022-23',orderNumber=6)
    session_23_24 = Session(startDate='2023-04-01',endDate='2024-03-31',name='Session 2023-24',orderNumber=7)
    session_24_25 = Session(startDate='2024-04-01',endDate='2025-03-31',name='Session 2024-25',orderNumber=8)

    session_22_23.save()
    session_23_24.save()
    session_24_25.save()
