# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-03-19 11:24
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('school_app', '0017_auto_20180302_0115'),
    ]

    operations = [
        migrations.CreateModel(
            name='SchoolSession',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('workingDays', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'school_session',
            },
        ),
        migrations.RemoveField(
            model_name='expense',
            name='parentUser',
        ),
        migrations.AddField(
            model_name='session',
            name='orderNumber',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='marks',
            name='marks',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10, verbose_name='marks'),
        ),
        migrations.AlterField(
            model_name='marks',
            name='parentStudent',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Student', verbose_name='parentStudent'),
        ),
        migrations.AlterField(
            model_name='marks',
            name='parentSubject',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Subject', verbose_name='parentSubject'),
        ),
        migrations.AlterModelTable(
            name='concession',
            table='concession',
        ),
        migrations.AlterModelTable(
            name='fee',
            table='fee',
        ),
        migrations.AlterModelTable(
            name='marks',
            table='marks',
        ),
        migrations.AlterModelTable(
            name='school',
            table='school',
        ),
        migrations.AlterModelTable(
            name='session',
            table='session',
        ),
        migrations.AlterModelTable(
            name='student',
            table='student',
        ),
        migrations.AlterModelTable(
            name='subfee',
            table='sub_fee',
        ),
        migrations.AlterModelTable(
            name='subject',
            table='subject',
        ),
        migrations.DeleteModel(
            name='Expense',
        ),
        migrations.AddField(
            model_name='schoolsession',
            name='parentSchool',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.School', verbose_name='parentSchool'),
        ),
        migrations.AddField(
            model_name='schoolsession',
            name='parentSession',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Session', verbose_name='parentSession'),
        ),
    ]
