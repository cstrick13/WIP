from rest_framework.routers import DefaultRouter
from django.urls import path, re_path, include
from Backend import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'connections', views.ConnectionViewSet)
router.register(r'posts', views.PostViewSet)
router.register(r'replies', views.ReplyViewSet)
router.register(r'progress', views.ProgressViewSet)

urlpatterns = [
   path('', include(router.urls)),
   # Custom paths
   path('tests/',views.testApi),
   path('create-user/', views.createUser),
   path('create-post/', views.createPost),
   path('get-posts/', views.getPosts),
   path('get-for-you-feed/', views.getRelaventFeed),
   path('get-following-feed/', views.getFollowingFeed),
   path('progress/<int:id>/', views.getProgress)
]