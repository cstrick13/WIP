# Generated by Django 5.0.7 on 2024-10-22 16:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Backend', '0013_user_bannericon_user_bio_user_profileicon'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='bannerIcon',
        ),
        migrations.RemoveField(
            model_name='user',
            name='bio',
        ),
        migrations.RemoveField(
            model_name='user',
            name='profileIcon',
        ),
    ]