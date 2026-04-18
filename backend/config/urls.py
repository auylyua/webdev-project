from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.norm_admin.urls if hasattr(admin.site, 'norm_admin') else admin.site.urls),
    # Весь твой API будет доступен по адресу /api/...
    path('api/', include('tracker.urls')), 
]