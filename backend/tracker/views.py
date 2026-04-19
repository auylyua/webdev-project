from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.db.models import Avg, Count

from .models import Book, ReadingEntry, Note, Review, UserProfile, Collection
from .serializers import (
    LoginSerializer,
    RegisterSerializer,
    BookSerializer,
    ReadingEntrySerializer,
    NoteSerializer,
    ReviewSerializer,
    UserProfileSerializer,
    PublicUserSerializer,
    CollectionSerializer,
)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Registration successful',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'username': user.username,
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login successful',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'username': user.username,
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    return Response(
        {'message': 'Logout successful'},
        status=status.HTTP_200_OK
    )

# --- CATALOG (Add to Reading) ---

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_progress(request, book_id):
    try:
        book = Book.objects.get(id=book_id)
        obj, created = ReadingEntry.objects.get_or_create(
            user=request.user, 
            book=book,
            defaults={'current_page': 0}
        )
        if not created:
            return Response({"message": "Книга уже есть в вашем списке"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Книга успешно добавлена в прогресс!"}, status=status.HTTP_201_CREATED)
    except Book.DoesNotExist:
        return Response({"error": "Книга не найдена"}, status=status.HTTP_404_NOT_FOUND)

# --- HOME & STATS ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def home_stats(request):
    entries = ReadingEntry.objects.filter(user=request.user)
    total_pages = sum(entry.current_page for entry in entries)
    last_entry = ReadingEntry.objects.filter(user=request.user).order_by('-id').first()
    last_book_data = ReadingEntrySerializer(last_entry).data if last_entry else None
    return Response({
        'total_pages_read': total_pages,
        'last_active_book': last_book_data
    }, status=status.HTTP_200_OK)

class BookListCreateAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        books = Book.objects.all().order_by('-created_at')
        genre = request.query_params.get('genre')
        year = request.query_params.get('year')
        search = request.query_params.get('search')
        sort = request.query_params.get('sort')

        if genre:
            books = books.filter(genre__icontains=genre)
        if year:
            books = books.filter(published_year=year)
        if search:
            books = books.filter(title__icontains=search) | books.filter(author__icontains=search)
        if sort == 'rating':
            books = books.annotate(avg_rating=Avg('reviews__rating')).order_by('-avg_rating')
        elif sort == 'year':
            books = books.order_by('-published_year')
        elif sort == 'title':
            books = books.order_by('title')

        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            book = Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = BookSerializer(book)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def top_books_view(request):
    books = (
        Book.objects
        .annotate(avg_rating=Avg('reviews__rating'), reviews_count=Count('reviews'))
        .filter(reviews_count__gte=1)
        .order_by('-avg_rating')[:10]
    )
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def currently_reading_view(request):
    book_ids = ReadingEntry.objects.filter(status='reading').values_list('book_id', flat=True).distinct()
    books = Book.objects.filter(id__in=book_ids)
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)



class ReadingEntryListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        entries = ReadingEntry.objects.filter(user=request.user).order_by('-id')
        status_filter = request.query_params.get('status')
        if status_filter:
            entries = entries.filter(status=status_filter)
        serializer = ReadingEntrySerializer(entries, many=True)
        return Response(serializer.data)
    def post(self, request):
        book_id = request.data.get('book')
        if ReadingEntry.objects.filter(user=request.user, book_id=book_id).exists():
            return Response(
                {'error': 'You already have this book in your reading list.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = ReadingEntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReadingEntryDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get_object(self, pk, user):
        try:
            return ReadingEntry.objects.get(pk=pk, user=user)
        except ReadingEntry.DoesNotExist:
            return None
    def get(self, request, pk):
        entry = self.get_object(pk, request.user)
        if not entry:
            return Response({'error': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ReadingEntrySerializer(entry)
        return Response(serializer.data)
    def patch(self, request, pk):
        entry = self.get_object(pk, request.user)
        if not entry:
            return Response({'error': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ReadingEntrySerializer(entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, pk):
        entry = self.get_object(pk, request.user)
        if not entry:
            return Response({'error': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        entry.delete()
        return Response({'message': 'Deleted.'}, status=status.HTTP_204_NO_CONTENT)

# --- PROFILE (Notes & Reviews) ---


class NoteListCreateAPIView(generics.ListCreateAPIView): 
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ПЕРЕИМЕНОВАНО: ReviewListCreateAPIView (было UserReviewList)
class ReviewListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reviews = Review.objects.filter(user=request.user).order_by('-created_at')
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request):
        book_id = request.data.get('book')
        if Review.objects.filter(user=request.user, book_id=book_id).exists():
            return Response(
                {'error': 'You have already reviewed this book.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
       
        return Review.objects.filter(user=self.request.user)

class MyProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PublicUserProfileAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = PublicUserSerializer(user)
        return Response(serializer.data)


class NoteDetailAPIView(generics.RetrieveUpdateDestroyAPIView): 
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)

@api_view(['GET'])
@permission_classes([AllowAny])
def user_reviews_view(request, pk):
    reviews = Review.objects.filter(user_id=pk).order_by('-created_at')
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def user_collections_view(request, pk):
    collections = Collection.objects.filter(user_id=pk, is_public=True).order_by('-created_at')
    serializer = CollectionSerializer(collections, many=True)
    return Response(serializer.data)


class CollectionListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        collections = Collection.objects.filter(user=request.user).order_by('-created_at')
        serializer = CollectionSerializer(collections, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CollectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CollectionDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Collection.objects.get(pk=pk, user=user)
        except Collection.DoesNotExist:
            return None

    def get(self, request, pk):
        collection = self.get_object(pk, request.user)
        if not collection:
            return Response({'error': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CollectionSerializer(collection)
        return Response(serializer.data)

    def patch(self, request, pk):
        collection = self.get_object(pk, request.user)
        if not collection:
            return Response({'error': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CollectionSerializer(collection, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        collection = self.get_object(pk, request.user)
        if not collection:
            return Response({'error': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        collection.delete()
        return Response({'message': 'Collection deleted.'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def collection_book_view(request, pk, book_id):
    try:
        collection = Collection.objects.get(pk=pk, user=request.user)
    except Collection.DoesNotExist:
        return Response({'error': 'Collection not found.'}, status=status.HTTP_404_NOT_FOUND)

    try:
        book = Book.objects.get(pk=book_id)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'POST':
        collection.books.add(book)
        return Response({'message': f'Book "{book.title}" added to collection.'})
    else:
        collection.books.remove(book)
        return Response({'message': f'Book "{book.title}" removed from collection.'})
    
@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    return Response({
        "message": "Welcome to Reading Progress Tracker API",
        "endpoints": {
            "auth": "/api/register/, /api/login/, /api/logout/",
            "books": "/api/books/, /api/books/<id>/, /api/books/top/, /api/books/currently-reading/",
            "reading_entries": "/api/entries/, /api/entries/<id>/",
            "notes": "/api/notes/",
            "reviews": "/api/reviews/",
            "profile": "/api/profile/, /api/users/<id>/",
            "collections": "/api/collections/, /api/collections/<id>/",
        }
    })
