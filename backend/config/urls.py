from django.contrib import admin
from django.urls import path, include
from tracker.views import api_root

urlpatterns = [
    path('', api_root),
    path('admin/', admin.site.urls),
    path('api/', include('tracker.urls')),
]