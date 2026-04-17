from django.contrib import admin
from .models import Book, ReadingEntry, Note, Review, UserProfile, Collection

class CollectionAdmin(admin.ModelAdmin):
    filter_horizontal = ('books',)
    list_display = ('id', 'title', 'user', 'is_public', 'created_at')
    list_filter = ('is_public', 'user')
    search_fields = ('title', 'description')

admin.site.register(Book)
admin.site.register(ReadingEntry)
admin.site.register(Note)
admin.site.register(Review)
admin.site.register(UserProfile)
admin.site.register(Collection, CollectionAdmin)