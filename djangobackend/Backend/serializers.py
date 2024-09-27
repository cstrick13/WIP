from rest_framework import serializers
from Backend.models import (Test)

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = '__all__'
