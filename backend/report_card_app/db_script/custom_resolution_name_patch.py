import json

def customNameFix(apps, schema_editor):
    ReportCardLayoutNew = apps.get_model('report_card_app', 'ReportCardLayoutNew')
    layouts = ReportCardLayoutNew.objects.all()

    for layout in layouts:
        content = json.loads(layout.content)
        for page in content:
            if page['actualresolution']['resolutionName'] == 'Cusotm':
                page['actualresolution']['resolutionName'] = 'Custom'
                page['actualresolution']['mmHeight'] = 300
                page['actualresolution']['mmWidth'] = 300
        layout.content = json.dumps(content)
        layout.save()