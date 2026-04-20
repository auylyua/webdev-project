from django.db import models
from django.contrib.auth.models import User
from django.db.models import Avg


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=150)
    total_pages = models.PositiveIntegerField()
    genre = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    published_year = models.PositiveIntegerField(null=True, blank=True)
    cover_image = models.URLField(blank=True)
    read_link = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def average_rating(self):
        result = self.reviews.aggregate(avg=Avg('rating'))
        avg = result['avg']
        return round(avg, 1) if avg else None

    def __str__(self):
        return f"{self.title} by {self.author}"


class ReadingEntry(models.Model):
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('reading', 'Reading'),
        ('finished', 'Finished'),
        ('dropped', 'Dropped'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reading_entries')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reading_entries')
    current_page = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    started_at = models.DateField(null=True, blank=True)
    finished_at = models.DateField(null=True, blank=True)
    rating = models.IntegerField(default=0)
    comment = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.book.title} ({self.status})"


class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='notes')
    text = models.TextField()
    page_number = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Note by {self.user.username} for {self.book.title}"


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'book')

    def __str__(self):
        return f"Review by {self.user.username} for {self.book.title}"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True, null=True)
    avatar_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"Profile of {self.user.username}"


class Collection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='collections')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    books = models.ManyToManyField(Book, related_name='collections', blank=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'"{self.title}" by {self.user.username}'