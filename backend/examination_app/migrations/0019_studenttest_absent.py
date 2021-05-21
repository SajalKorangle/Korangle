# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-05-08 12:21
from __future__ import unicode_literals

from django.db import migrations, models


def delete_duplicates(apps,schema_editor):
    student_test_model = apps.get_model('examination_app','StudentTest')
    for row in student_test_model.objects.filter(parentExamination=379, parentSubject=34, parentStudent=27291):
        if student_test_model.objects.filter(parentExamination=379, parentSubject=34, parentStudent=27291).count()>1:
            row.delete()



class Migration(migrations.Migration):

    dependencies = [
        ('examination_app', '0018_auto_20210306_0658'),
    ]

    operations = [
        migrations.AddField(
            model_name='studenttest',
            name='absent',
            field=models.BooleanField(default=False, verbose_name='absent'),
        ),
        migrations.AlterField(
            model_name='studenttest',
            name='marksObtained',
            field=models.DecimalField(decimal_places=3, default=0, max_digits=20, verbose_name='marksObtained'),
        ),
        migrations.RunPython(delete_duplicates),
        migrations.AlterField(
            model_name='studenttest',
            name='marksObtained',
            field=models.DecimalField(decimal_places=3, default=0, max_digits=6, verbose_name='marksObtained'),
        ),

    ]
