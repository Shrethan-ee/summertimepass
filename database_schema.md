# Startup Idea Platform - Database Schema

## User Model (CustomUser)
- id: Primary Key
- username: CharField
- email: EmailField
- password: CharField (hashed)
- first_name: CharField
- last_name: CharField
- role: CharField (choices: entrepreneur, investor, public)
- bio: TextField
- profile_picture: ImageField
- company_name: CharField (for entrepreneurs)
- investment_focus: CharField (for investors)
- created_at: DateTimeField
- updated_at: DateTimeField

## Category Model
- id: Primary Key
- name: CharField (unique)
- description: TextField
- created_at: DateTimeField

## Tag Model
- id: Primary Key
- name: CharField (unique)
- created_at: DateTimeField

## Idea Model
- id: Primary Key
- title: CharField
- description: TextField
- user: ForeignKey (CustomUser)
- category: ForeignKey (Category)
- tags: ManyToManyField (Tag)
- public_likes_count: PositiveIntegerField
- investor_likes_count: PositiveIntegerField
- comments_count: PositiveIntegerField
- created_at: DateTimeField
- updated_at: DateTimeField

## Like Model
- id: Primary Key
- user: ForeignKey (CustomUser)
- idea: ForeignKey (Idea)
- like_type: CharField (choices: public, investor)
- created_at: DateTimeField
- Unique constraint: (user, idea, like_type)

## Comment Model
- id: Primary Key
- user: ForeignKey (CustomUser)
- idea: ForeignKey (Idea)
- parent: ForeignKey (self, for threaded comments)
- content: TextField
- created_at: DateTimeField
- updated_at: DateTimeField

## Relationships
- User -> Idea: One-to-Many (A user can have multiple ideas)
- User -> Like: One-to-Many (A user can like multiple ideas)
- User -> Comment: One-to-Many (A user can comment on multiple ideas)
- Idea -> Like: One-to-Many (An idea can have multiple likes)
- Idea -> Comment: One-to-Many (An idea can have multiple comments)
- Idea -> Tag: Many-to-Many (An idea can have multiple tags, and a tag can be used for multiple ideas)
- Idea -> Category: Many-to-One (Multiple ideas can belong to one category)
- Comment -> Comment: One-to-Many (A comment can have multiple replies)

