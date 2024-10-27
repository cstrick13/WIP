from rest_framework import serializers
from .models import Test, User, Connection, Post, Reply

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ConnectionSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Connection
        fields = '__all__'
        
    def validate(self, data):
        if data['follower'] == data['followed']:
            raise serializers.ValidationError("A user cannot follow themselves")
        return data
    
class PostSerializer(serializers.ModelSerializer):
    userid = UserSerializer()  # Nest the UserSerializer here

    class Meta:
        model = Post
        fields = '__all__'
        
class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = '__all__'
        