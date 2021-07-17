def exam_status_not_null(apps, schema_editor):

    Module = apps.get_model('examination_app', 'Examination')

    exams = Module.objects.all()
    for exam in exams :
        if exam.status != 'Decalred' :
            exam.status = 'Declared'
            exam.save()