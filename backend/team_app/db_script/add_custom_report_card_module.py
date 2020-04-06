
def add_custom_report_card_module(apps,schema_editor):
    Module = apps.get_model('team_app', 'Module')

    # To show custom report card along with report card module
    # So the should have same orderNumber
    report_card = Module.objects.filter(title='Report Card')[0]
    
    custom_reportcard = Module()
    custom_reportcard.path='custom_reportcard'
    custom_reportcard.title='Custom Report Card'
    custom_reportcard.icon = report_card.icon
    custom_reportcard.orderNumber = report_card.orderNumber
    custom_reportcard.parentBoard = None
    custom_reportcard.save()
