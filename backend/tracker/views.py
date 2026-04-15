from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Book, ReadingEntry, Note, Review
from .serializers import (
    LoginSerializer,
    ProgressUpdateSerializer,
    BookSerializer,
    ReadingEntrySerializer,
    NoteSerializer,
    ReviewSerializer,
    RegisterSerializer,
)

# --- AUTH VIEWS ---

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
    # На бэкенде JWT обычно не инвалидируется принудительно без Blacklist.
    # Фронтенд просто удаляет токен из localStorage.
    return Response(
        {'message': 'Logout successful (client should delete token)'},
        status=status.HTTP_200_OK
    )


# --- BOOK VIEWS ---

class BookListCreateAPIView(APIView):
    # Доступно всем, чтобы пользователи видели каталог без логина
    permission_classes = [AllowAny] 

    def get(self, request):
        books = Book.objects.all().order_by('-created_at')
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- READING PROGRESS VIEWS ---

class ReadingEntryListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Показываем записи только текущего пользователя
        entries = ReadingEntry.objects.filter(user=request.user).order_by('-id')
        serializer = ReadingEntrySerializer(entries, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ReadingEntrySerializer(data=request.data)
        if serializer.is_valid():
            # Важно: привязываем запись к юзеру из токена
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
            return Response({'error': 'Reading entry not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ReadingEntrySerializer(entry)
        return Response(serializer.data)

    def patch(self, request, pk):
        """Метод для частичного обновления (например, только текущей страницы)"""
        entry = self.get_object(pk, request.user)
        if not entry:
            return Response({'error': 'Reading entry not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Используем partial=True, чтобы не требовать все поля при обновлении
        serializer = ReadingEntrySerializer(entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        entry = self.get_object(pk, request.user)
        if not entry:
            return Response({'error': 'Reading entry not found.'}, status=status.HTTP_404_NOT_FOUND)
        entry.delete()
        return Response({'message': 'Reading entry deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


# --- NOTES & REVIEWS VIEWS ---

class NoteListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notes = Note.objects.filter(user=request.user).order_by('-created_at')
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reviews = Review.objects.filter(user=request.user).order_by('-created_at')
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)