### Create New Models 
1. #### Add Models to Models.py
   1. Define model requirements
   2. Add model structure to models.py
   3. ```python
        class User(models.Model):
          username = models.CharField(max_length=30, unique=True)
          f_name = models.CharField(max_length=30, blank=True)
          l_name = models.CharField(max_length=30, blank=True)
          bio = models.CharField(max_length=300)
          
          def __str__(self):
              return self.username
    
2. #### Create Migration and apply migration
   1. Run **python migrations.py makemigrations**
   2. Apply migrations: **python migrations.py migrate**

