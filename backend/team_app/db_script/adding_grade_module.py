
def add_grade_module(apps,schema_editor):
    Module = apps.get_model('team_app', 'Module')
    grade_module = Module(path='grade',title='Grade',icon='book',orderNumber=8,parentBoard=None)
    grade_module.save()