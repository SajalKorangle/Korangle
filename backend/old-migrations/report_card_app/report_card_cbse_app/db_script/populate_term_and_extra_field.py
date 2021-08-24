
def populate_term_and_extra_field(apps, schema_editor):

    Term = apps.get_model('report_card_cbse_app', 'Term')
    ExtraField = apps.get_model('report_card_cbse_app', 'ExtraField')

    term_object = Term(name='Term - I')
    term_object.save()

    term_object = Term(name='Term - II')
    term_object.save()

    term_object = Term(name='Term - III')
    term_object.save()

    extra_field_object = ExtraField(name='Work Education (or Pre-vocational Education)')
    extra_field_object.save()

    extra_field_object = ExtraField(name='Art Education')
    extra_field_object.save()

    extra_field_object = ExtraField(name='Health & Physical Education')
    extra_field_object.save()

    extra_field_object = ExtraField(name='Discipline')
    extra_field_object.save()

