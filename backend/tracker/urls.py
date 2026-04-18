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
    ReviewListCreateAPIView,
    add_to_progress  # Добавил этот импорт, чтобы кнопка в каталоге работала
)

urlpatterns = [
    # AUTH
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    
    # HOME
    path('home-stats/', home_stats, name='home-stats'),
    
    # CATALOG
    path('books/', BookListView.as_view(), name='book-list'),
    path('books/<int:book_id>/add/', add_to_progress, name='add-to-progress'),
    
    # PROGRESS
    path('entries/', ReadingEntryListCreateAPIView.as_view(), name='entry-list'),
    path('entries/<int:pk>/', ReadingEntryDetailAPIView.as_view(), name='entry-detail'),
    
    # PROFILE (Notes & Reviews)
    path('notes/', NoteListCreateAPIView.as_view(), name='note-list'),
    path('reviews/', ReviewListCreateAPIView.as_view(), name='review-list'),
]