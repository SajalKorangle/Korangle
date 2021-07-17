# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-07-17 14:10
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('school_app', '0001_initial'),
        ('student_app', '0001_initial'),
        ('class_app', '0001_initial'),
        ('subject_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CCEMarks',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('marksObtained', models.DecimalField(decimal_places=1, default=0, max_digits=6, verbose_name='marksObtained')),
                ('parentSession', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Session', verbose_name='parentSession')),
                ('parentStudent', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='student_app.Student', verbose_name='parentStudent')),
            ],
            options={
                'db_table': 'cce_marks',
            },
        ),
        migrations.CreateModel(
            name='Examination',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(default='-', verbose_name='name')),
                ('status', models.CharField(choices=[('Created', 'Created'), ('Declared', 'Declared')], default='Created', max_length=20, verbose_name='examinationStatus')),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.School', verbose_name='parentSchool')),
                ('parentSession', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Session', verbose_name='parentSession')),
            ],
            options={
                'db_table': 'examination',
            },
        ),
        migrations.CreateModel(
            name='Grade',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('maximumMarks', models.DecimalField(decimal_places=1, default=0, max_digits=6, verbose_name='maximumMarks')),
                ('minimumMarks', models.DecimalField(decimal_places=1, default=0, max_digits=6, verbose_name='minimumMarks')),
                ('value', models.CharField(choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D'), ('E', 'E')], default='A', max_length=1)),
            ],
            options={
                'db_table': 'grade',
                'ordering': ['value'],
            },
        ),
        migrations.CreateModel(
            name='MaximumMarksAllowed',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('marks', models.PositiveIntegerField(default=1, unique=True, verbose_name='marks')),
                ('orderNumber', models.IntegerField(default=0, verbose_name='marks')),
            ],
            options={
                'db_table': 'maximum_marks_allowed',
                'ordering': ['orderNumber'],
            },
        ),
        migrations.CreateModel(
            name='MpBoardReportCardMapping',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('minimumDecimalPoints', models.IntegerField(default=0, verbose_name='minimumDecimalPoint')),
                ('maximumDecimalPoints', models.IntegerField(default=1, verbose_name='maximumDecimalPoint')),
                ('attendanceJulyStart', models.DateField(null=True, verbose_name='attendanceJulyStart')),
                ('attendanceJulyEnd', models.DateField(null=True, verbose_name='attendanceJulyEnd')),
                ('attendanceAugustStart', models.DateField(null=True, verbose_name='attendanceAugustStart')),
                ('attendanceAugustEnd', models.DateField(null=True, verbose_name='attendanceAugustEnd')),
                ('attendanceSeptemberStart', models.DateField(null=True, verbose_name='attendanceSeptemberStart')),
                ('attendanceSeptemberEnd', models.DateField(null=True, verbose_name='attendanceSeptemberEnd')),
                ('attendanceOctoberStart', models.DateField(null=True, verbose_name='attendanceOctoberStart')),
                ('attendanceOctoberEnd', models.DateField(null=True, verbose_name='attendanceOctoberEnd')),
                ('attendanceHalfYearlyStart', models.DateField(null=True, verbose_name='attendanceHalfYearlyStart')),
                ('attendanceHalfYearlyEnd', models.DateField(null=True, verbose_name='attendanceHalfYearlyEnd')),
                ('attendanceDecemberStart', models.DateField(null=True, verbose_name='attendanceDecemberStart')),
                ('attendanceDecemberEnd', models.DateField(null=True, verbose_name='attendanceDecemberEnd')),
                ('attendanceJanuaryStart', models.DateField(null=True, verbose_name='attendanceJanuaryStart')),
                ('attendanceJanuaryEnd', models.DateField(null=True, verbose_name='attendanceJanuaryEnd')),
                ('attendanceFebruaryStart', models.DateField(null=True, verbose_name='attendanceFebruaryStart')),
                ('attendanceFebruaryEnd', models.DateField(null=True, verbose_name='attendanceFebruaryEnd')),
                ('attendanceFinalStart', models.DateField(null=True, verbose_name='attendanceFinalStart')),
                ('attendanceFinalEnd', models.DateField(null=True, verbose_name='attendanceFinalEnd')),
                ('attendanceQuarterlyHighStart', models.DateField(null=True, verbose_name='attendanceQuarterlyHighStart')),
                ('attendanceQuarterlyHighEnd', models.DateField(null=True, verbose_name='attendanceQuarterlyHighEnd')),
                ('attendanceHalfYearlyHighStart', models.DateField(null=True, verbose_name='attendanceHalfYearlyHighStart')),
                ('attendanceHalfYearlyHighEnd', models.DateField(null=True, verbose_name='attendanceHalfYearlyHighEnd')),
                ('attendanceFinalHighStart', models.DateField(null=True, verbose_name='attendanceFinalHighStart')),
                ('attendanceFinalHighEnd', models.DateField(null=True, verbose_name='attendanceFinalHighEnd')),
                ('reportCardType', models.CharField(choices=[('Classic', 'Classic'), ('Elegant', 'Elegant'), ('Comprehensive', 'Comprehensive')], default=None, max_length=20, null=True, verbose_name='reportCardType')),
                ('autoAttendance', models.BooleanField(default=True, verbose_name='autoAttendance')),
                ('parentExaminationAugust', models.ForeignKey(default=0, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='mpboardreportcardmapping_august', to='examination_app.Examination', verbose_name='parentExaminationAugust')),
                ('parentExaminationDecember', models.ForeignKey(default=0, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='mpboardreportcardmapping_december', to='examination_app.Examination', verbose_name='parentExaminationDecember')),
                ('parentExaminationFebruary', models.ForeignKey(default=0, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='mpboardreportcardmapping_february', to='examination_app.Examination', verbose_name='parentExaminationFebruary')),
                ('parentExaminationFinal', models.ForeignKey(default=0, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='mpboardreportcardmapping_final', to='examination_app.Examination', verbose_name='parentExaminationFinal')),
                ('parentExaminationFinalHigh', models.ForeignKey(default=0, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='mpboardreportcardmapping_final_high', to='examination_app.Examination', verbose_name='parentExaminationFinalHigh')),
                ('parentExaminationHalfYearly', models.ForeignKey(default=0, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='mpboardreportcardmapping_half_yearly', to='examination_app.Examination', verbose_name='parentExaminationHalfYearly')),
                ('parentExaminationHalfYearlyHigh', models.ForeignKey(default=0, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='mpboardreportcardmapping_half_yearly_high', to='examination_app.Examination', verbose_name='parentExaminationHalfYearlyHigh')),
                ('parentExaminationJanuary', models.ForeignKey(default=0, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='mpboardreportcardmapping_january', to='examination_app.Examination', verbose_name='parentExaminationJanuary')),
                ('parentExaminationJuly', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='mpboardreportcardmapping_july', to='examination_app.Examination', verbose_name='parentExaminationJuly')),
                ('parentExaminationOctober', models.ForeignKey(default=0, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='mpboardreportcardmapping_october', to='examination_app.Examination', verbose_name='parentExaminationOctober')),
                ('parentExaminationProject', models.ForeignKey(default=0, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='mpboardreportcardmapping_project', to='examination_app.Examination', verbose_name='parentExaminationProject')),
                ('parentExaminationQuarterlyHigh', models.ForeignKey(default=0, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='mpboardreportcardmapping_quarterly_high', to='examination_app.Examination', verbose_name='parentExaminationQuarterlyHigh')),
                ('parentExaminationSeptember', models.ForeignKey(default=0, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='mpboardreportcardmapping_september', to='examination_app.Examination', verbose_name='parentExaminationSeptember')),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.School', verbose_name='parentSchool')),
                ('parentSession', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Session', verbose_name='parentSession')),
            ],
            options={
                'db_table': 'mp_board_report_card_mapping',
            },
        ),
        migrations.CreateModel(
            name='StudentExaminationRemarks',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('remark', models.TextField(blank=True, default='-', verbose_name='remark')),
                ('parentExamination', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='examination_app.Examination', verbose_name='parentExamination')),
                ('parentStudent', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='student_app.Student', verbose_name='parentStudent')),
            ],
            options={
                'db_table': 'remarks',
            },
        ),
        migrations.CreateModel(
            name='StudentExtraSubField',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('marksObtained', models.DecimalField(decimal_places=2, default=0, max_digits=6, verbose_name='marksObtained')),
                ('parentExamination', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='examination_app.Examination', verbose_name='parentExamination')),
                ('parentExtraSubField', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='subject_app.ExtraSubField', verbose_name='parentExtraSubField')),
                ('parentStudent', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='student_app.Student', verbose_name='parentStudent')),
            ],
            options={
                'db_table': 'student_extra_sub_field',
            },
        ),
        migrations.CreateModel(
            name='StudentTest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('testType', models.CharField(choices=[('Oral', 'Oral'), ('Written', 'Written'), ('Theory', 'Theory'), ('Practical', 'Practical')], default=None, max_length=11, null=True, verbose_name='testType')),
                ('marksObtained', models.DecimalField(decimal_places=3, default=0, max_digits=20, verbose_name='marksObtained')),
                ('absent', models.BooleanField(default=False, verbose_name='absent')),
                ('parentExamination', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='examination_app.Examination', verbose_name='parentExamination')),
                ('parentStudent', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='student_app.Student', verbose_name='parentStudent')),
                ('parentSubject', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='subject_app.SubjectSecond', verbose_name='parentSubject')),
            ],
            options={
                'db_table': 'student_test',
            },
        ),
        migrations.CreateModel(
            name='StudentTestResult',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('marksObtained', models.DecimalField(decimal_places=1, default=0, max_digits=6, verbose_name='marksObtained')),
                ('absent', models.BooleanField(default=False, verbose_name='absent')),
                ('parentStudent', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='student_app.Student', verbose_name='parentStudent')),
            ],
            options={
                'db_table': 'student_test_result',
                'ordering': ['parentTest__parentSubject__orderNumber'],
            },
        ),
        migrations.CreateModel(
            name='Test',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parentClass', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='class_app.Class', verbose_name='parentClass')),
                ('parentDivision', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='class_app.Division', verbose_name='parentDivision')),
                ('parentMaximumMarks', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='examination_app.MaximumMarksAllowed', verbose_name='parentMaximumMarks')),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.School', verbose_name='parentSchool')),
                ('parentSession', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Session', verbose_name='parentSession')),
                ('parentSubject', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='subject_app.Subject', verbose_name='parentSubject')),
            ],
            options={
                'db_table': 'test',
                'ordering': ['parentSubject__orderNumber'],
            },
        ),
        migrations.CreateModel(
            name='TestSecond',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('startTime', models.DateTimeField(verbose_name='startTime')),
                ('endTime', models.DateTimeField(verbose_name='endTime')),
                ('testType', models.CharField(choices=[('Oral', 'Oral'), ('Written', 'Written'), ('Theory', 'Theory'), ('Practical', 'Practical')], default=None, max_length=10, null=True, verbose_name='testType')),
                ('maximumMarks', models.PositiveIntegerField(default=100, verbose_name='maximumMarks')),
                ('parentClass', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='class_app.Class', verbose_name='parentClass')),
                ('parentDivision', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='class_app.Division', verbose_name='parentDivision')),
                ('parentExamination', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='examination_app.Examination', verbose_name='parentExamination')),
                ('parentSubject', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='subject_app.SubjectSecond', verbose_name='parentSubject')),
            ],
            options={
                'db_table': 'test_second',
            },
        ),
        migrations.AddField(
            model_name='studenttestresult',
            name='parentTest',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='examination_app.Test', verbose_name='parentTest'),
        ),
        migrations.AddField(
            model_name='grade',
            name='parentMaximumMarksAllowed',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='examination_app.MaximumMarksAllowed', verbose_name='parentMaximumMarksAllowed'),
        ),
        migrations.AlterUniqueTogether(
            name='testsecond',
            unique_together=set([('parentExamination', 'parentSubject', 'parentClass', 'parentDivision', 'testType')]),
        ),
        migrations.AlterUniqueTogether(
            name='test',
            unique_together=set([('parentSchool', 'parentClass', 'parentDivision', 'parentSession', 'parentSubject')]),
        ),
        migrations.AlterUniqueTogether(
            name='studenttestresult',
            unique_together=set([('parentStudent', 'parentTest')]),
        ),
        migrations.AlterUniqueTogether(
            name='studenttest',
            unique_together=set([('parentExamination', 'parentSubject', 'parentStudent', 'testType')]),
        ),
        migrations.AlterUniqueTogether(
            name='studentextrasubfield',
            unique_together=set([('parentExamination', 'parentExtraSubField', 'parentStudent')]),
        ),
        migrations.AlterUniqueTogether(
            name='studentexaminationremarks',
            unique_together=set([('parentStudent', 'parentExamination')]),
        ),
        migrations.AlterUniqueTogether(
            name='mpboardreportcardmapping',
            unique_together=set([('parentSchool', 'parentSession')]),
        ),
        migrations.AlterUniqueTogether(
            name='grade',
            unique_together=set([('parentMaximumMarksAllowed', 'maximumMarks', 'minimumMarks')]),
        ),
        migrations.AlterUniqueTogether(
            name='examination',
            unique_together=set([('name', 'parentSchool', 'parentSession')]),
        ),
        migrations.AlterUniqueTogether(
            name='ccemarks',
            unique_together=set([('parentStudent', 'parentSession')]),
        ),
    ]
