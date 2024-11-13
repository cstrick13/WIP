from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.http.response import JsonResponse
from django.shortcuts import render
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework import viewsets
from django.db.models import Q

from django.core.exceptions import ValidationError


from Backend.serializers import (TestSerializer)
from Backend.models import (Test)
from .models import User, Connection, Post, Reply

from .serializers import UserSerializer, ConnectionSerializer, PostSerializer, ReplySerializer

#Create your views here.

@csrf_exempt
def testApi(request,id=0):
    tests = Test.objects.all()
    tests_serializer = TestSerializer(tests,many=True)
    return JsonResponse(tests_serializer.data,safe=False)

@api_view(['POST'])
def createUser(request):
    print("Request: ",request) # DEBUG
    if request.method == 'POST':
        user_data = JSONParser().parse(request)
        print("User Data: ",user_data) # DEBUG
        user_serializer = UserSerializer(data=user_data)
        try:
            if user_serializer.is_valid(raise_exception=True):
                user_serializer.save()
                return JsonResponse("Added Successfully",safe=False)
            else:
                print("Failed to Add. User is not valid.") # DEBUG
        except ValidationError as e:
            print("Error: " + e) # DEBUG
            return JsonResponse("Failed to Add",safe=False)
            
        return JsonResponse("Failed to Add",safe=False)
    else:
        print("Failed to Add") # DEBUG
        return JsonResponse("Failed to Add. Not POST.",safe=False)

@csrf_exempt
def increment_like(request, post_id):
    try:
        # Get the post by ID
        post = Post.objects.get(id=post_id)

        # If likes is None, set it to 0 before incrementing
        if post.likes is None:
            post.likes = 0

        # Increment like count
        post.likes += 1
        post.save()

        return JsonResponse({'message': 'Post liked successfully', 'likes': post.likes})
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=404)

@api_view(['POST'])
def createPost(request):
    if request.method == 'POST':
        post_data = JSONParser().parse(request)
        post_serializer = PostSerializer(data=post_data)

        if post_serializer.is_valid():
            post_serializer.save()
            return JsonResponse({"success": True, "message": "Added Successfully"}, status=200)

        # Return detailed validation errors if serializer fails
        return JsonResponse({"success": False, "errors": post_serializer.errors, "message": "Failed to Add"}, status=400)

    return JsonResponse({"success": False, "message": "Failed to Add. Not a POST request"}, status=405)
    
# Get all posts from a user
@api_view(['POST'])
def getPosts(request):
    if request.method == 'POST':
        user_id = JSONParser().parse(request)['userid']
        posts = Post.objects.filter(userid=user_id)
        post_serializer = PostSerializer(posts,many=True)
        return JsonResponse(post_serializer.data,safe=False)
    else:
        return JsonResponse("Failed to Get. Not POST.",safe=False)
    

@api_view(['POST'])
def getRelaventFeed(request):
    if request.method == 'POST':
        
        user_id = JSONParser().parse(request)['userid']
        print("User ID: ",user_id)
        
        user = User.objects.get(userid=user_id)
        user_preferences = user.selectedInterests
        print("User Preferences: ",user_preferences)
        
        posts = Post.objects.all()
        filtered_posts = [
            post for post in posts 
            if any(preference in post.tags for preference in user_preferences)
        ]
        print("\nPosts: ", filtered_posts)
        
        return JsonResponse(PostSerializer(filtered_posts,many=True).data,safe=False)
    else:
        return JsonResponse("Failed to Get. Not POST.",safe=False)
        
        
@api_view(['POST'])
def getFollowingFeed(request):
    if(request.method == 'POST'):
        
        user_id = JSONParser().parse(request)['userid']
        print("User ID: ",user_id)
        
        # Get all connections
        connections = Connection.objects.filter(follower=user_id)
        connection_ids = connections.values_list('followed', flat=True)
        print("Connections: ",connections)
        
        posts = Post.objects.filter(userid__in=connection_ids)
        return JsonResponse(PostSerializer(posts,many=True).data,safe=False)
    else:
        return JsonResponse("Failed to Get. Not POST.",safe=False)
    

@api_view(['GET'])
def getSimilarUsers(request):
    if(request.method == 'GET'):
        user_id = JSONParser().parse(request)['userid']
        print("User ID: ",user_id)
        
        user = User.objects.get(userid=user_id)
        user_preferences = user.selectedInterests
        print("User Preferences: ",user_preferences)
        
        users = User.objects.all()

        filtered_users = [
            user for user in users 
            if user.selectedInterests and any(preference in user.selectedInterests for preference in user_preferences)
        ]
        
        # Pick 4 random users from the list to return
        import random
        random.shuffle(filtered_users)
        filtered_users = filtered_users[:4]
        
        return JsonResponse(UserSerializer(filtered_users,many=True).data,safe=False)
    else:
        return JsonResponse("Failed to Get. Not POST.",safe=False)
    
@api_view(['GET'])
def searchUsers(request):
    if(request.method == 'GET'):
        search_query = JSONParser().parse(request)['search_query']
        print("Search Query: ",search_query)
        
        users = User.objects.filter(Q(username__icontains=search_query))
        print("Users: ",users)
        
        return JsonResponse(UserSerializer(users,many=True).data,safe=False)
    else:
        return JsonResponse("Failed to Get. Not GET.",safe=False)

@api_view(['GET'])
def searchPosts(request):
    if(request.method == 'GET'):
        search_query = JSONParser().parse(request)['search_query']
        print("Search Query: ",search_query)
        
        posts = Post.objects.filter(Q(content__icontains=search_query))
        print("Posts: ",posts)
        
        return JsonResponse(PostSerializer(posts,many=True).data,safe=False)
    else:
        return JsonResponse("Failed to Get. Not GET.",safe=False)

@api_view(['POST'])
def create_replies(request):
    if request.method == 'POST':
        print("Request: ",request)
        data = JSONParser().parse(request)
        post_id = data.get('post_id')
        user_id = data.get('userid')
        content = data.get('content')
        
        print("Post ID: ",post_id)
        print("User ID: ",user_id)
        print("Content: ",content)
        reply = ReplySerializer(data={'post': post_id, 'userid': user_id, 'content': content})
        
        if reply.is_valid():
            reply.save()
            return JsonResponse({"success": True, "message": "Reply added successfully"}, status=200)
        else:
            return JsonResponse({"success": False, "message": "Failed to add reply", "errors": reply.errors}, status=400)
    else:
        return JsonResponse({"success": False, "message": "Failed to add reply. Not a POST request"}, status=405)
            
@api_view(['GET'])
def get_replies_from_post(request):
    if request.method == 'GET':
        post_id = JSONParser().parse(request)['post_id']
        print("Post ID: ",post_id)
        try:
            
            replies = Reply.objects.filter(post=post_id)
            return JsonResponse(ReplySerializer(replies, many=True).data, safe=False)
        
        except Post.DoesNotExist:
            return JsonResponse({'error': 'Post not found'}, status=404)
    else:
        return JsonResponse("Failed to Get. Not GET.", safe=False)
    
    
# Get all users
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Get all connections    
class ConnectionViewSet(viewsets.ModelViewSet):
    queryset = Connection.objects.all()
    serializer_class = ConnectionSerializer
    
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
class ReplyViewSet(viewsets.ModelViewSet):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer