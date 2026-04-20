from django.urls import path
from .views import home_stats
from . import views
from .views import (
    user_reviews_view,
    login_view, logout_view, register_view,
    BookListCreateAPIView, BookDetailAPIView, top_books_view, currently_reading_view,
    ReadingEntryListCreateAPIView, ReadingEntryDetailAPIView,
    NoteListCreateAPIView, ReviewListCreateAPIView,
    MyProfileAPIView, PublicUserProfileAPIView, user_reviews_view, user_collections_view,
    CollectionListCreateAPIView, CollectionDetailAPIView, collection_book_view,
    ReviewDetailAPIView, ReviewListCreateAPIView,
)

urlpatterns = [
    path('register/', register_view),
    path('login/', login_view),
    path('logout/', logout_view),
    path('books/', BookListCreateAPIView.as_view()),
    path('books/top/', top_books_view),
    path('books/currently-reading/', currently_reading_view),
    path('books/<int:pk>/', BookDetailAPIView.as_view()),
    path('entries/', ReadingEntryListCreateAPIView.as_view()),
    path('entries/<int:pk>/', ReadingEntryDetailAPIView.as_view()),
    path('notes/', NoteListCreateAPIView.as_view()),
    path('reviews/', ReviewListCreateAPIView.as_view()),
    path('reviews/<int:pk>/', ReviewDetailAPIView.as_view()),
    path('profile/', MyProfileAPIView.as_view()),
    path('users/<int:pk>/', PublicUserProfileAPIView.as_view()),
    path('users/<int:pk>/reviews/', user_reviews_view),
    path('users/<int:pk>/collections/', user_collections_view),
    path('collections/', CollectionListCreateAPIView.as_view()),
    path('collections/<int:pk>/', CollectionDetailAPIView.as_view()),
    path('collections/<int:pk>/books/<int:book_id>/', collection_book_view),
    path('profile/reviews/', views.user_reviews_view, name='user-reviews'),
    path('notes/<int:pk>/', views.NoteDetailAPIView.as_view()),
    path('home-stats/', home_stats),
]