# Generated by Django 4.2.6 on 2023-11-01 05:26

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='date',
            field=models.DateField(default=api.models.Order.get_default_date, verbose_name='Order Date'),
        ),
    ]
