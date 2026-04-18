from django.urls import path
from .views import (
    register_view,
    login_view,
    logout_view,
    home_stats,  
    BookListView,
    ReadingEntryListCreateAPIView,
    ReadingEntryDetailAPIView,
    NoteListCreateAPIView,
    ReviewListCreateAPIView
)

urlpatterns = [
    
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    
    
    path('home-stats/', home_stats, name='home-stats'),
    
    
    path('books/', BookListView.as_view(), name='book-list'),
    
    
    path('entries/', ReadingEntryListCreateAPIView.as_view(), name='entry-list'),
    path('entries/<int:pk>/', ReadingEntryDetailAPIView.as_view(), name='entry-detail'),
    
    
    path('notes/', NoteListCreateAPIView.as_view(), name='note-list'),
    path('reviews/', ReviewListCreateAPIView.as_view(), name='review-list'),
]