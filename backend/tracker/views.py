from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Book, ReadingEntry, Note, Review
from .serializers import (
    LoginSerializer,
    BookSerializer,
    ReadingEntrySerializer,
    NoteSerializer,
    ReviewSerializer,
    RegisterSerializer,
)

# --- AUTHENTICATION ---

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

# --- BOOK VIEWS ---

class BookListView(generics.ListAPIView):
    queryset = Book.objects.all().order_by('-created_at')
    serializer_class = BookSerializer
    permission_classes = [AllowAny]

# --- READING PROGRESS ---

class ReadingEntryListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        entries = ReadingEntry.objects.filter(user=request.user).order_by('-id')
        serializer = ReadingEntrySerializer(entries, many=True)
        return Response(serializer.data)
    def post(self, request):
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
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ReadingEntrySerializer(entry)
        return Response(serializer.data)
    def patch(self, request, pk):
        entry = self.get_object(pk, request.user)
        if not entry:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ReadingEntrySerializer(entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, pk):
        entry = self.get_object(pk, request.user)
        if not entry:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# --- PROFILE (Notes & Reviews) ---

# ПЕРЕИМЕНОВАНО: NoteListCreateAPIView (было UserNoteList)
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
    def get_queryset(self):
        return Review.objects.filter(user=self.request.user).order_by('-created_at')
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)