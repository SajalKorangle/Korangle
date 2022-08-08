def change_complaint_module_orderNumber(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    module_object = Module.objects.get(path = 'complaints')

    module_object.orderNumber = 16
    module_object.save()
