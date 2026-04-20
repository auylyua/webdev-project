from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Book, ReadingEntry, Note, Review, UserProfile, Collection


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
        UserProfile.objects.create(user=user)
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
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'total_pages', 'genre',
            'description', 'published_year', 'cover_image', 'read_link',
            'average_rating', 'reviews_count', 'created_at',
        ]

    def get_average_rating(self, obj):
        return obj.average_rating()

    def get_reviews_count(self, obj):
        return obj.reviews.count()


class ReadingEntrySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)
    total_pages = serializers.IntegerField(source='book.total_pages', read_only=True)
    cover_image = serializers.CharField(source='book.cover_image', read_only=True)

    class Meta:
        model = ReadingEntry
        fields = [
            'id', 'user', 'book', 'book_title', 'total_pages', 'cover_image',
            'current_page', 'status', 'started_at', 'finished_at', 'rating',
        ]


class PublicReadingEntrySerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ReadingEntry
        fields = [
            'id', 'user', 'book', 'current_page', 'status',
            'started_at', 'finished_at', 'rating',
        ]


class NoteSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    book_title = serializers.ReadOnlyField(source='book.title')

    class Meta:
        model = Note
        fields = [
            'id', 'user', 'book', 'book_title',
            'text', 'page_number', 'created_at',
        ]


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_id', 'book', 'book_title',
            'rating', 'comment', 'created_at',
        ]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'bio', 'avatar_url', 'created_at']


class PublicUserSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(source='profile.bio', read_only=True)
    avatar_url = serializers.CharField(source='profile.avatar_url', read_only=True)
    reviews_count = serializers.SerializerMethodField()
    collections_count = serializers.SerializerMethodField()
    entries_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'bio', 'avatar_url',
            'reviews_count', 'collections_count', 'entries_count',
        ]

    def get_reviews_count(self, obj):
        return obj.reviews.count()

    def get_collections_count(self, obj):
        return obj.collections.filter(is_public=True).count()

    def get_entries_count(self, obj):
        return obj.reading_entries.count()


class CollectionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    books = BookSerializer(many=True, read_only=True)
    book_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Book.objects.all(),
        write_only=True,
        source='books',
        required=False
    )
    books_count = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = [
            'id', 'user', 'title', 'description',
            'is_public', 'books', 'book_ids',
            'books_count', 'created_at',
        ]

    def get_books_count(self, obj):
        return obj.books.count()