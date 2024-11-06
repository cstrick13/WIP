from rest_framework.routers import DefaultRouter
from django.urls import path, re_path, include
from Backend import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'connections', views.ConnectionViewSet)
router.register(r'posts', views.PostViewSet)
router.register(r'replies', views.ReplyViewSet)

urlpatterns = [
   path('', include(router.urls)),
   # Custom paths
   path('tests/',views.testApi),
   path('create-user/', views.createUser),
   path('create-post/', views.createPost),
   path('get-posts/', views.getPosts),
   path('get-for-you-feed/', views.getRelaventFeed),
   path('get-following-feed/', views.getFollowingFeed),
   path('posts/<int:post_id>/like/', views.increment_like, name='increment_like'),
   path('get-similar-users/', views.getSimilarUsers),
   path('search-users/', views.searchUsers),
   path('search-posts/', views.searchPosts),
]