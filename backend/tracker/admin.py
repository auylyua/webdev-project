from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Book, ReadingEntry, Note, Review

admin.site.register(Book)
admin.site.register(ReadingEntry)
admin.site.register(Note)
admin.site.register(Review)