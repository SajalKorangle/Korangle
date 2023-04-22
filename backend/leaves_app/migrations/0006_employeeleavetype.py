# Generated by Django 3.2.5 on 2023-04-22 13:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('employee_app', '0003_employee_isnonsalariedemployee'),
        ('leaves_app', '0005_employeeleaveplan'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmployeeLeaveType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parentEmployee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='employee_app.employee')),
                ('parentLeavePlan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='leaves_app.schoolleaveplan')),
                ('parentLeaveType', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='leaves_app.schoolleavetype')),
            ],
            options={
                'db_table': 'employee_leave_type',
                'unique_together': {('parentLeaveType', 'parentEmployee')},
            },
        ),
    ]
