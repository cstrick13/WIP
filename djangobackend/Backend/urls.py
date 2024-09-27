from django.urls import path, re_path
from Backend import views

urlpatterns = [
   path('tests/',views.testApi),
]