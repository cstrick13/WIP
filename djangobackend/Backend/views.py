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
from .models import User, Connection, Post, Reply, Progress

from .serializers import UserSerializer, ConnectionSerializer, PostSerializer, ReplySerializer, ProgressSerializer

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
        content = request.data.get("content")
        post_id = request.data.get("post")
        user_id = request.data.get("user")

        # Ensure all required data is provided
        if not content or not post_id or not user_id:
            return JsonResponse({"success": False, "message": "Missing required fields (content, post, or user)"}, status=400)

        try:
            # Correctly reference the post and user objects
            post = Post.objects.get(id=post_id)  # Use 'id' to get the Post by its primary key
            user = User.objects.get(userid=user_id)  # Use 'userid' to get the User by its primary key
        except Post.DoesNotExist:
            return JsonResponse({"success": False, "message": "Post not found"}, status=404)
        except User.DoesNotExist:
            return JsonResponse({"success": False, "message": "User not found"}, status=404)

        # Create and save the reply
        try:
            reply = Reply.objects.create(content=content, post=post, userid=user)  # Use 'userid' to assign the User
            reply.save()

            return JsonResponse({
                "success": True,
                "id": reply.id,
                "content": reply.content,
                "user": reply.userid.username,  # Access the username through the 'userid' field
                "timestamp": reply.timestamp
            }, status=200)
        except Exception as e:
            return JsonResponse({"success": False, "message": f"Error saving reply: {str(e)}"}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Failed to add reply. Not a POST request"}, status=405)


from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import Reply
from .serializers import ReplySerializer

@api_view(['GET'])
def get_replies_from_post(request):
    if request.method == 'GET':
        # Extract 'post_id' from the query parameters
        post_id = request.GET.get('post_id')

        if post_id is None:
            return JsonResponse({'error': 'post_id is required'}, status=400)

        try:
            # Ensure the post ID is an integer
            post_id = int(post_id)
            replies = Reply.objects.filter(post=post_id)

            # Prepare the replies data, including the username
            replies_data = []
            for reply in replies:
                # Assuming the Reply model has a foreign key to User and User has a 'username' field
                reply_data = ReplySerializer(reply).data
                reply_data['username'] = reply.userid.username  # Get the username from the related user
                replies_data.append(reply_data)

            return JsonResponse(replies_data, safe=False)

        except ValueError:
            return JsonResponse({'error': 'Invalid post_id format. Must be an integer.'}, status=400)

        except Reply.DoesNotExist:
            return JsonResponse({'error': 'Replies not found for the specified post'}, status=404)

    return JsonResponse({"error": "Method Not Allowed"}, status=405)


api_view(['GET', 'POST', 'PUT'])
def getProgress(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        user_id = data.get('userid')

        if user_id is not None:
            progress = Progress.objects.filter(userid=user_id)
            if progress.exists():
                progress_serializer = ProgressSerializer(progress, many=True)
                return JsonResponse(progress_serializer.data, safe=False)
            else:
                return JsonResponse({"message": "No progress records found for the user."}, status=404)
        else:
            return JsonResponse({"error": "User ID is required."}, status=400)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        user_id = data.get('userid')
        new_progress = data.get('current_progress')
        print("helo")

        #if not user_id or not workout_type or new_progress is None:
            #return JsonResponse({"error": "User ID, workout type, and current progress are required."}, status=400)

        #try:
            #progress = Progress.objects.get(userid=user_id, workout_type=workout_type)
            #progress.current_progress = new_progress
            #progress.save()

            #progress_serializer = ProgressSerializer(progress)
            #return JsonResponse(progress_serializer.data, safe=False, status=status.HTTP_200_OK)

        #except Progress.DoesNotExist:
            #return JsonResponse({"error": "Progress record not found."}, status=404)
    
    elif request.method == '/progress/':
        print("error1")
        return JsonResponse({"error": "Method not allowed2."}, status=407)

    else:
        print("error2")
        return JsonResponse({"error": "Method not allowed."}, status=406)


    
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

class ProgressViewSet(viewsets.ModelViewSet):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer
