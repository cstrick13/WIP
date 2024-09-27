from django.shortcuts import render
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt
from Backend.models import (Test)
from Backend.serializers import (TestSerializer)

#Create your views here.

@csrf_exempt
def testApi(request,id=0):
    tests = Test.objects.all()
    tests_serializer = TestSerializer(tests,many=True)
    return JsonResponse(tests_serializer.data,safe=False)