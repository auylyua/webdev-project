from django.contrib.auth import authenticate
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Book, ReadingEntry, Note, Review


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data.get('username'),
            password=data.get('password')
        )
        if not user:
            raise serializers.ValidationError("Invalid username or password.")
        data['user'] = user
        return data




class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class ReadingEntrySerializer(serializers.ModelSerializer):
    # StringRelatedField покажет имя пользователя вместо его ID
    user = serializers.StringRelatedField(read_only=True)
    # Позволяет получить название книги напрямую из связанной модели Book
    book_title = serializers.CharField(source='book.title', read_only=True)
    # Получаем общее кол-во страниц из модели Book для расчета % в Angular
    total_pages = serializers.IntegerField(source='book.total_pages', read_only=True)

    class Meta:
        model = ReadingEntry
        fields = [
            'id',
            'user',
            'book', 
            'book_title',
            'total_pages',
            'current_page',
            'status',
            'started_at',
            'finished_at',
        ]

class ProgressUpdateSerializer(serializers.Serializer):
    """Специальный сериализатор только для обновления страниц"""
    current_page = serializers.IntegerField(min_value=0)
    status = serializers.ChoiceField(choices=ReadingEntry.STATUS_CHOICES)


class NoteSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)

    class Meta:
        model = Note
        fields = [
            'id',
            'user',
            'book',
            'book_title',
            'text',
            'page_number',
            'created_at',
        ]

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id',
            'user',
            'book',
            'book_title',
            'rating',
            'comment',
            'created_at',
        ]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value