from django.db import migrations, models
import django.db.models.deletion
class Migration(migrations.Migration):
    initial = True
    dependencies = [
        ('school_app', '0004_auto_20221216_2152'),
    ]

    operations = [
        migrations.CreateModel(
            name='SchoolLeaveType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('leaveTypeName', models.TextField(default='invalid_type', verbose_name='leave_name')),
                ('leaveType', models.IntegerField(default=0)),
                ('color', models.TextField(default='#ffffff', verbose_name='color')),
                ('parentSchool', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='school_app.school', verbose_name='parentSchool')),
            ],
            options={
                'db_table': 'school_leave_type',
            },
        ),
    ]