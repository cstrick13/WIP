# Generated by Django 5.0.7 on 2024-10-18 14:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Backend', '0007_alter_user_username'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='username',
            new_name='userid',
        ),
    ]
