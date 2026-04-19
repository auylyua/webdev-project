from django.contrib import admin
from django.urls import path, include
from tracker.views import api_root

urlpatterns = [
<<<<<<< HEAD
    path('admin/', admin.site.norm_admin.urls if hasattr(admin.site, 'norm_admin') else admin.site.urls),
    # Весь твой API будет доступен по адресу /api/...
    path('api/', include('tracker.urls')), 
=======
    path('', api_root),
    path('admin/', admin.site.urls),
    path('api/', include('tracker.urls')),
>>>>>>> 98cf248e4634986f554a895889a8c20f07279ba7
]