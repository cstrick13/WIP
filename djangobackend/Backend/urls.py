from rest_framework.routers import DefaultRouter
from django.urls import path, re_path, include
from Backend import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'connections', views.ConnectionViewSet)
router.register(r'posts', views.PostViewSet)
router.register(r'replies', views.ReplyViewSet)

urlpatterns = [
   path('tests/',views.testApi),
   path('', include(router.urls))
]