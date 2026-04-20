from django.urls import path
from .views import (
    register_view,
    login_view,
    logout_view,
    api_root,
    BookListCreateAPIView,
    BookDetailAPIView,
    top_books_view,
    currently_reading_view,
    book_reviews_view,
    upsert_review_view,
    ReadingEntryListCreateAPIView,
    ReadingEntryDetailAPIView,
    NoteListCreateAPIView,
    NoteDetailAPIView,
    ReviewListCreateAPIView,
    ReviewDetailAPIView,
    MyProfileAPIView,
    PublicUserProfileAPIView,
    user_reviews_view,
    user_reading_entries_view,
    user_collections_view,
    CollectionListCreateAPIView,
    CollectionDetailAPIView,
    collection_book_view,
    home_stats_view,
)

urlpatterns = [
    path('', api_root),
    path('register/', register_view),
    path('login/', login_view),
    path('logout/', logout_view),

    path('home-stats/', home_stats_view),

    path('books/', BookListCreateAPIView.as_view()),
    path('books/top/', top_books_view),
    path('books/currently-reading/', currently_reading_view),
    path('books/<int:pk>/', BookDetailAPIView.as_view()),
    path('books/<int:pk>/reviews/', book_reviews_view),
    
    path('entries/', ReadingEntryListCreateAPIView.as_view()),
    path('entries/<int:pk>/', ReadingEntryDetailAPIView.as_view()),

    path('notes/', NoteListCreateAPIView.as_view()),
    path('notes/<int:pk>/', NoteDetailAPIView.as_view()),

    path('reviews/', ReviewListCreateAPIView.as_view()),
    path('reviews/upsert/', upsert_review_view),
    path('reviews/<int:pk>/', ReviewDetailAPIView.as_view()),
    
    path('profile/', MyProfileAPIView.as_view()),
    path('users/<int:pk>/', PublicUserProfileAPIView.as_view()),
    path('users/<int:pk>/reviews/', user_reviews_view),
    path('users/<int:pk>/entries/', user_reading_entries_view),
    path('users/<int:pk>/collections/', user_collections_view),

    path('collections/', CollectionListCreateAPIView.as_view()),
    path('collections/<int:pk>/', CollectionDetailAPIView.as_view()),
    path('collections/<int:pk>/books/<int:book_id>/', collection_book_view),
]