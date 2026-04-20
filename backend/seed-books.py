import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from tracker.models import Book

books = [
    {
        "title": "1984",
        "author": "George Orwell",
        "total_pages": 328,
        "genre": "Dystopian, Political Fiction, Classic",
        "description": "A dystopian novel about surveillance, control, and the loss of freedom in a totalitarian society.",
        "published_year": 1949,
        "cover_image": "https://cdn.corenexis.com/files/c/5571196720.jpg",
        "read_link": "https://openlibrary.org/books/OL24382006M/1984",
    },
    {
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "total_pages": 310,
        "genre": "Fantasy, Adventure, Classic",
        "description": "Bilbo Baggins goes on an unexpected journey full of dwarves, treasure, dragons, and courage.",
        "published_year": 1937,
        "cover_image": "https://upload.wikimedia.org/wikipedia/en/4/4a/TheHobbit_FirstEdition.jpg",
        "read_link": "https://openlibrary.org/works/OL262756W/The_Hobbit",
    },
    {
        "title": "Harry Potter and the Philosopher's Stone",
        "author": "J.K. Rowling",
        "total_pages": 223,
        "genre": "Fantasy, Young Adult, Adventure",
        "description": "The first year of Harry Potter at Hogwarts begins a magical journey full of friendship and mystery.",
        "published_year": 1997,
        "cover_image": "https://upload.wikimedia.org/wikipedia/en/6/6b/Harry_Potter_and_the_Philosopher%27s_Stone_Book_Cover.jpg",
        "read_link": "https://openlibrary.org/works/OL82563W/Harry_Potter_and_the_Philosopher%27s_Stone",
    },
    {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "total_pages": 180,
        "genre": "Classic, Romance, Drama",
        "description": "A story of wealth, illusion, and the American dream in the Jazz Age.",
        "published_year": 1925,
        "cover_image": "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg",
        "read_link": "https://openlibrary.org/works/OL468431W/The_Great_Gatsby",
    },
    {
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "total_pages": 279,
        "genre": "Classic, Romance, Social Commentary",
        "description": "A witty and timeless story of love, pride, misunderstanding, and class expectations.",
        "published_year": 1813,
        "cover_image": "https://upload.wikimedia.org/wikipedia/commons/1/17/PrideAndPrejudiceTitlePage.jpg",
        "read_link": "https://openlibrary.org/works/OL66554W/Pride_and_Prejudice",
    },
    {
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "total_pages": 281,
        "genre": "Classic, Historical Fiction, Drama",
        "description": "A powerful novel about justice, prejudice, and moral courage in the American South.",
        "published_year": 1960,
        "cover_image": "https://cdn.corenexis.com/files/c/7184839720.jpg",
        "read_link": "https://openlibrary.org/works/OL450948W/To_Kill_a_Mockingbird",
    },
    {
        "title": "The Catcher in the Rye",
        "author": "J.D. Salinger",
        "total_pages": 214,
        "genre": "Classic, Coming-of-Age, Drama",
        "description": "Holden Caulfield reflects on alienation, adolescence, and the world around him.",
        "published_year": 1951,
        "cover_image": "https://upload.wikimedia.org/wikipedia/commons/8/89/The_Catcher_in_the_Rye_%281951%2C_first_edition_cover%29.jpg",
        "read_link": "https://openlibrary.org/works/OL3335492W/The_Catcher_in_the_Rye",
    },
    {
        "title": "Brave New World",
        "author": "Aldous Huxley",
        "total_pages": 268,
        "genre": "Dystopian, Science Fiction, Classic",
        "description": "A futuristic society built on comfort, control, and engineered happiness.",
        "published_year": 1932,
        "cover_image": "https://cdn.corenexis.com/files/c/1597128720.jpg",
        "read_link": "https://openlibrary.org/works/OL519564W/Brave_New_World",
    },
    {
        "title": "Animal Farm",
        "author": "George Orwell",
        "total_pages": 112,
        "genre": "Political Satire, Classic, Allegory",
        "description": "A short allegorical story about revolution, power, and corruption.",
        "published_year": 1945,
        "cover_image": "https://cdn.corenexis.com/files/c/3649291720.jpg",
        "read_link": "https://openlibrary.org/works/OL1168007W/Animal_Farm",
    },
    {
        "title": "The Book Thief",
        "author": "Markus Zusak",
        "total_pages": 552,
        "genre": "Historical Fiction, Drama, Young Adult",
        "description": "A moving story narrated by Death, set during World War II in Nazi Germany.",
        "published_year": 2005,
        "cover_image": "https://cdn.corenexis.com/files/c/7511481720.webp",
        "read_link": "https://openlibrary.org/works/OL8372469W/The_Book_Thief",
    },
    {
        "title": "The Alchemist",
        "author": "Paulo Coelho",
        "total_pages": 208,
        "genre": "Philosophical Fiction, Adventure, Drama",
        "description": "A shepherd named Santiago follows his dream in search of treasure and meaning.",
        "published_year": 1988,
        "cover_image": "https://cdn.corenexis.com/files/c/2976365720.jpg",
        "read_link": "https://openlibrary.org/works/OL257943W/The_Alchemist",
    },
    {
        "title": "The Lord of the Rings",
        "author": "J.R.R. Tolkien",
        "total_pages": 1178,
        "genre": "Fantasy, Adventure, Epic",
        "description": "An epic quest across Middle-earth to destroy the One Ring.",
        "published_year": 1954,
        "cover_image": "https://cdn.corenexis.com/files/c/1331737720.jpg",
        "read_link": "https://openlibrary.org/works/OL27482W/The_Lord_of_the_Rings",
    },
    {
        "title": "Jane Eyre",
        "author": "Charlotte Brontë",
        "total_pages": 500,
        "genre": "Classic, Romance, Gothic",
        "description": "A strong-willed young woman searches for independence, belonging, and love.",
        "published_year": 1847,
        "cover_image": "https://cdn.corenexis.com/files/c/7864257720.webp",
        "read_link": "https://openlibrary.org/works/OL1192738W/Jane_Eyre",
    },
    {
        "title": "Little Women",
        "author": "Louisa May Alcott",
        "total_pages": 759,
        "genre": "Classic, Coming-of-Age, Family",
        "description": "The lives, dreams, and struggles of the four March sisters.",
        "published_year": 1868,
        "cover_image": "https://cdn.corenexis.com/files/c/8485989720.jpg",
        "read_link": "https://openlibrary.org/works/OL14595W/Little_Women",
    },
    {
        "title": "Moby-Dick",
        "author": "Herman Melville",
        "total_pages": 585,
        "genre": "Adventure, Classic, Sea Story",
        "description": "Captain Ahab becomes consumed by his obsession with the white whale.",
        "published_year": 1851,
        "cover_image": "https://cdn.corenexis.com/files/c/5285559720.webp",
        "read_link": "https://openlibrary.org/works/OL102749W/Moby-Dick",
    },
    {
        "title": "The Chronicles of Narnia",
        "author": "C.S. Lewis",
        "total_pages": 767,
        "genre": "Fantasy, Adventure, Classic",
        "description": "Children discover the magical world of Narnia and become part of its destiny.",
        "published_year": 1956,
        "cover_image": "https://cdn.corenexis.com/files/c/7895912720.jpg",
        "read_link": "https://openlibrary.org/works/OL27990W/The_Chronicles_of_Narnia",
    },
    {
        "title": "The Fault in Our Stars",
        "author": "John Green",
        "total_pages": 313,
        "genre": "Young Adult, Romance, Drama",
        "description": "A heartfelt story about love, illness, and finding meaning in limited time.",
        "published_year": 2012,
        "cover_image": "https://www.image2url.com/r2/default/images/1776668044449-336f708d-c8af-4d02-b8e7-4740bb26c624.webp",
        "read_link": "https://openlibrary.org/works/OL16804437W/The_Fault_in_Our_Stars",
    },
    {
        "title": "Dune",
        "author": "Frank Herbert",
        "total_pages": 412,
        "genre": "Science Fiction, Adventure, Epic",
        "description": "A legendary science fiction story about power, prophecy, and survival on Arrakis.",
        "published_year": 1965,
        "cover_image": "https://www.image2url.com/r2/default/images/1776667942942-f250cdec-e27c-4274-92f2-c69c84addc27.jpg",
        "read_link": "https://openlibrary.org/works/OL18392W/Dune",
    },
    {
        "title": "A Game of Thrones",
        "author": "George R.R. Martin",
        "total_pages": 694,
        "genre": "Fantasy, Epic, Drama",
        "description": "Noble families struggle for power in a brutal and complex fantasy world.",
        "published_year": 1996,
        "cover_image": "https://www.image2url.com/r2/default/images/1776667850666-039850c7-6cb7-4769-8a88-4c14c0fb13c9.jpg",
        "read_link": "https://openlibrary.org/works/OL1968501W/A_Game_of_Thrones",
    },
    {
        "title": "The Silent Patient",
        "author": "Alex Michaelides",
        "total_pages": 336,
        "genre": "Thriller, Mystery, Psychological",
        "description": "A woman stops speaking after a shocking crime, and a therapist tries to uncover the truth.",
        "published_year": 2019,
        "cover_image": "https://www.image2url.com/r2/default/images/1776667665481-5f25237e-986e-4e8c-86d7-ba54cc1f570e.png",
        "read_link": "https://openlibrary.org/works/OL19734098W/The_Silent_Patient",
    },
]

created_count = 0

for data in books:
    obj, created = Book.objects.get_or_create(
        title=data["title"],
        author=data["author"],
        defaults=data
    )
    if not created:
        obj.read_link = data["read_link"]
        obj.cover_image = data["cover_image"]
        obj.save()
    if created:
        created_count += 1

print(f"Done. Added {created_count} new books.")