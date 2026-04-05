from django.urls import path
from .views import (
    login_view,
    logout_view,
    register_view,
    BookListCreateAPIView,
    ReadingEntryListCreateAPIView,
    ReadingEntryDetailAPIView,
    NoteListCreateAPIView,
    ReviewListCreateAPIView,
)

urlpatterns = [
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('books/', BookListCreateAPIView.as_view(), name='books-list-create'),
    path('entries/', ReadingEntryListCreateAPIView.as_view(), name='entries-list-create'),
    path('entries/<int:pk>/', ReadingEntryDetailAPIView.as_view(), name='entry-detail'),
    path('notes/', NoteListCreateAPIView.as_view(), name='notes-list-create'),
    path('reviews/', ReviewListCreateAPIView.as_view(), name='reviews-list-create'),
    path('register/', register_view, name='register'),
]