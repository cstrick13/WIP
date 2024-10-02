from django.db import models

# Create your models here.
class Test(models.Model):
    name = models.CharField(max_length=255,null=True)
    
class User(models.Model):
    username = models.CharField(max_length=30, unique=True)
    f_name = models.CharField(max_length=30, blank=True)
    l_name = models.CharField(max_length=30, blank=True)
    bio = models.CharField(max_length=300)
    
    def __str__(self):
        return self.username
    
class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.CharField(max_length=300)
    media_type = models.CharField(max_length=15)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField()
    
    def __str__(self):
        return self.content[:50]
    
class Reply(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.CharField(max_length=300)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.content[:50]
    
class Connection(models.Model):
    follower = models.ForeignKey(User, related_name="following", on_delete=models.CASCADE)
    followed = models.ForeignKey(User, related_name="followers", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.follower} follows {self.followed}"