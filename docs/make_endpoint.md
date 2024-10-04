### Create GET Endpoint
1. #### Create Serializer for model
   1. Before any data can be retrieved from the database, it needs to be serialized as json
   2. Create [model]Serializer class and add the fields to the meta data
   3. ``` python
        class UserSerializer(serializers.ModelSerializer):
           class Meta:
               model = User
               fields = ['id', 'username', 'f_name', 'l_name', 'bio']
 2. #### Create View (endpoint)
    1. Define the view as a method
       - ```python
         class UserViewSet(viewsets.ModelViewSet):
           queryset = User.objects.all()
           serializer_class = UserSerializer
    2. Specify which attributes to get from the model/models
       - ```python
            queryset = User.objects.all() 
    3. Add the view to the url list
       - ``` python
            router.register(r'users', views.UserViewSet) 
- Run the server with: **python manage.py runserver**