
def rc_versin_upgrade(apps, schema_editor):

     Module = apps.get_model('team_app', 'Module')
     report_card_module = Module.objects.get(path='report_card_3.0', title='R.C. 3.0')
     report_card_module.title = 'R.C. 3.1'
     report_card_module.save()