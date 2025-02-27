# Generated by Django 3.2.5 on 2023-02-25 06:22

from django.db import migrations, models
import django.db.models.deletion
import library_app.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('school_app', '0004_auto_20221216_2152'),
    ]

    operations = [
        migrations.CreateModel(
            name='BookParameter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('parameterType', models.CharField(choices=[('TEXT', 'TEXT'), ('FILTER', 'FILTER'), ('DOCUMENT', 'DOCUMENT')], max_length=20)),
                ('filterValues', models.TextField(blank=True, null=True)),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='school_app.school', verbose_name='parentSchool')),
            ],
            options={
                'db_table': 'book_parameter',
            },
        ),
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('author', models.TextField()),
                ('publisher', models.TextField()),
                ('dateOfPurchase', models.DateField(null=True)),
                ('bookNumber', models.TextField(null=True)),
                ('edition', models.TextField()),
                ('numberOfPages', models.IntegerField(default=1)),
                ('printedCost', models.TextField()),
                ('coverType', models.TextField()),
                ('frontImage', models.ImageField(upload_to=library_app.models.upload_to)),
                ('backImage', models.ImageField(upload_to=library_app.models.upload_to)),
                ('typeOfBook', models.TextField()),
                ('location', models.TextField()),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='school_app.school')),
            ],
            options={
                'db_table': 'book',
            },
        ),
    ]
