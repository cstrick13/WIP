# Generated by Django 5.0.7 on 2024-10-18 02:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Backend', '0004_alter_user_userid'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='userid',
            new_name='id',
        ),
    ]
