# Startup Idea Platform API Documentation

## Overview

This document provides comprehensive documentation for the Startup Idea Platform API. The API allows users to share, discover, and interact with startup ideas through a role-based system with entrepreneurs, investors, and public users.

## Base URL

```
https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api
```

## Authentication

The API uses JWT (JSON Web Token) authentication. To access protected endpoints, you need to include the JWT token in the Authorization header of your requests.

### Obtaining a Token

**Endpoint:** `POST /api/users/token/`

**Request Body:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Using the Token

Include the access token in the Authorization header of your requests:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### Refreshing the Token

**Endpoint:** `POST /api/users/token/refresh/`

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## User Management

### User Registration

**Endpoint:** `POST /api/users/register/`

**Request Body:**
```json
{
  "username": "new_user",
  "email": "user@example.com",
  "password": "secure_password",
  "password2": "secure_password",
  "first_name": "John",
  "last_name": "Doe",
  "role": "entrepreneur",
  "bio": "Experienced entrepreneur with a passion for tech.",
  "company_name": "TechStartup Inc.",
  "investment_focus": null
}
```

**Response:**
```json
{
  "username": "new_user",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "entrepreneur",
  "bio": "Experienced entrepreneur with a passion for tech.",
  "company_name": "TechStartup Inc.",
  "investment_focus": null
}
```

### Get Current User

**Endpoint:** `GET /api/users/current/`

**Response:**
```json
{
  "id": 1,
  "username": "entrepreneur1",
  "email": "entrepreneur1@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "entrepreneur",
  "bio": "Entrepreneur 1 bio",
  "profile_picture": null,
  "company_name": "Startup 1",
  "investment_focus": null
}
```

### Update User Profile

**Endpoint:** `PATCH /api/users/update/`

**Request Body:**
```json
{
  "first_name": "Updated",
  "last_name": "Name",
  "bio": "Updated bio information"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "entrepreneur1",
  "email": "entrepreneur1@example.com",
  "first_name": "Updated",
  "last_name": "Name",
  "role": "entrepreneur",
  "bio": "Updated bio information",
  "profile_picture": null,
  "company_name": "Startup 1",
  "investment_focus": null
}
```

## Categories

### List Categories

**Endpoint:** `GET /api/categories/`

**Response:**
```json
{
  "count": 7,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "AI & Machine Learning",
      "description": "Ideas related to AI & Machine Learning"
    },
    {
      "id": 2,
      "name": "Fintech",
      "description": "Ideas related to Fintech"
    }
  ]
}
```

### Get Category

**Endpoint:** `GET /api/categories/{id}/`

**Response:**
```json
{
  "id": 1,
  "name": "AI & Machine Learning",
  "description": "Ideas related to AI & Machine Learning"
}
```

## Tags

### List Tags

**Endpoint:** `GET /api/tags/`

**Response:**
```json
{
  "count": 15,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "innovation"
    },
    {
      "id": 2,
      "name": "technology"
    }
  ]
}
```

### Search Tags

**Endpoint:** `GET /api/tags/?search=tech`

**Response:**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 2,
      "name": "technology"
    },
    {
      "id": 15,
      "name": "tech"
    }
  ]
}
```

## Ideas

### List Ideas

**Endpoint:** `GET /api/ideas/`

**Response:**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "AI-Powered Personal Finance Assistant",
      "description": "An AI assistant that helps users manage their finances, track expenses, and provide personalized financial advice.",
      "user": {
        "id": 1,
        "username": "entrepreneur1",
        "role": "entrepreneur"
      },
      "category": {
        "id": 1,
        "name": "AI & Machine Learning",
        "description": "Ideas related to AI & Machine Learning"
      },
      "tags": [
        {
          "id": 1,
          "name": "innovation"
        },
        {
          "id": 2,
          "name": "technology"
        }
      ],
      "public_likes_count": 3,
      "investor_likes_count": 2,
      "comments_count": 5,
      "created_at": "2025-06-06T17:35:46.580002Z"
    }
  ]
}
```

### Get Idea

**Endpoint:** `GET /api/ideas/{id}/`

**Response:**
```json
{
  "id": 1,
  "title": "AI-Powered Personal Finance Assistant",
  "description": "An AI assistant that helps users manage their finances, track expenses, and provide personalized financial advice.",
  "user": {
    "id": 1,
    "username": "entrepreneur1",
    "role": "entrepreneur"
  },
  "category": {
    "id": 1,
    "name": "AI & Machine Learning",
    "description": "Ideas related to AI & Machine Learning"
  },
  "tags": [
    {
      "id": 1,
      "name": "innovation"
    },
    {
      "id": 2,
      "name": "technology"
    }
  ],
  "public_likes_count": 3,
  "investor_likes_count": 2,
  "comments_count": 5,
  "created_at": "2025-06-06T17:35:46.580002Z",
  "updated_at": "2025-06-06T17:35:46.580002Z",
  "is_owner": false,
  "has_liked_public": false,
  "has_liked_investor": false
}
```

### Create Idea

**Endpoint:** `POST /api/ideas/`

**Request Body:**
```json
{
  "title": "New Startup Idea",
  "description": "Detailed description of the startup idea.",
  "category": 1,
  "tags": ["innovation", "technology", "mobile"]
}
```

**Response:**
```json
{
  "id": 11,
  "title": "New Startup Idea",
  "description": "Detailed description of the startup idea.",
  "category": 1,
  "tags": ["innovation", "technology", "mobile"]
}
```

### Update Idea

**Endpoint:** `PATCH /api/ideas/{id}/`

**Request Body:**
```json
{
  "title": "Updated Idea Title",
  "description": "Updated description of the startup idea."
}
```

**Response:**
```json
{
  "id": 11,
  "title": "Updated Idea Title",
  "description": "Updated description of the startup idea.",
  "category": 1,
  "tags": ["innovation", "technology", "mobile"]
}
```

### Delete Idea

**Endpoint:** `DELETE /api/ideas/{id}/`

**Response:** `204 No Content`

## Idea Sorting and Filtering

### Filter Ideas by Category

**Endpoint:** `GET /api/ideas/?category=1`

### Filter Ideas by User

**Endpoint:** `GET /api/ideas/?user=1`

### Filter Ideas by Tag

**Endpoint:** `GET /api/ideas/?tag=innovation`

### Search Ideas

**Endpoint:** `GET /api/ideas/?search=finance`

### Sort Ideas

**Endpoint:** `GET /api/ideas/?ordering=-created_at`

Available ordering fields:
- `created_at` (newest first with `-created_at`)
- `public_likes_count` (most public likes first with `-public_likes_count`)
- `investor_likes_count` (most investor likes first with `-investor_likes_count`)
- `comments_count` (most comments first with `-comments_count`)

### Feed Sorting Algorithms

#### Recent Ideas

**Endpoint:** `GET /api/ideas/recent/`

Returns ideas sorted by creation date (newest first).

#### Popular Ideas

**Endpoint:** `GET /api/ideas/popular/`

Returns ideas sorted by popularity (total likes and comments).

#### Trending Ideas

**Endpoint:** `GET /api/ideas/trending/`

Returns ideas with recent activity (likes and comments in the last 7 days).

**Parameters:**
- `days`: Number of days to consider for trending (default: 7)

**Example:** `GET /api/ideas/trending/?days=3`

#### Ideas by Investor Likes

**Endpoint:** `GET /api/ideas/investor_likes/`

Returns ideas sorted by investor likes count.

#### Ideas by Public Likes

**Endpoint:** `GET /api/ideas/public_likes/`

Returns ideas sorted by public likes count.

#### Most Commented Ideas

**Endpoint:** `GET /api/ideas/most_commented/`

Returns ideas sorted by comment count.

#### Recommended Ideas

**Endpoint:** `GET /api/ideas/recommended/`

Returns ideas sorted by a comprehensive algorithm that considers:
- Investor likes (weighted 3x)
- Public likes (weighted 1x)
- Comments (weighted 0.5x)
- Recency (factor decreases over time)

## Likes

### List Likes

**Endpoint:** `GET /api/likes/`

**Response:**
```json
{
  "count": 30,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "user": 3,
      "username": "user1",
      "idea": 1,
      "like_type": "public",
      "created_at": "2025-06-06T17:35:46.580002Z"
    }
  ]
}
```

### Filter Likes

**Endpoint:** `GET /api/likes/?idea=1&type=public`

Available filters:
- `idea`: Filter by idea ID
- `user`: Filter by user ID
- `type`: Filter by like type (`public` or `investor`)

### Add Public Like

**Endpoint:** `POST /api/ideas/{id}/like/public/`

**Response:**
```json
{
  "id": 31,
  "user": 3,
  "username": "user1",
  "idea": 1,
  "like_type": "public",
  "created_at": "2025-06-06T17:40:08.112902Z"
}
```

### Add Investor Like

**Endpoint:** `POST /api/ideas/{id}/like/investor/`

**Response:**
```json
{
  "id": 32,
  "user": 5,
  "username": "investor1",
  "idea": 1,
  "like_type": "investor",
  "created_at": "2025-06-06T17:41:32.943579Z"
}
```

### Toggle Like

**Endpoint:** `POST /api/likes/toggle/`

**Request Body:**
```json
{
  "idea_id": 1,
  "like_type": "public"
}
```

**Response (when creating):**
```json
{
  "id": 31,
  "user": 3,
  "username": "user1",
  "idea": 1,
  "like_type": "public",
  "created_at": "2025-06-06T17:40:08.112902Z"
}
```

**Response (when removing):**
```json
{
  "detail": "Like removed."
}
```

### Delete Like

**Endpoint:** `DELETE /api/likes/{id}/`

**Response:** `204 No Content`

## Comments

### List Comments

**Endpoint:** `GET /api/comments/`

**Response:**
```json
{
  "count": 50,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "user": {
        "id": 3,
        "username": "user1",
        "role": "public"
      },
      "idea": 1,
      "parent": null,
      "content": "This is a great idea!",
      "created_at": "2025-06-06T17:35:46.580002Z",
      "reply_count": 2
    }
  ]
}
```

### Filter Comments

**Endpoint:** `GET /api/comments/?idea=1&parent=null`

Available filters:
- `idea`: Filter by idea ID
- `user`: Filter by user ID
- `parent`: Filter by parent comment ID (use `null` for top-level comments)

### Get Comments for an Idea

**Endpoint:** `GET /api/ideas/{id}/comments/`

**Response:**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "user": {
        "id": 3,
        "username": "user1",
        "role": "public"
      },
      "idea": 1,
      "parent": null,
      "content": "This is a great idea!",
      "replies": [
        {
          "id": 2,
          "user": {
            "id": 1,
            "username": "entrepreneur1",
            "role": "entrepreneur"
          },
          "idea": 1,
          "parent": 1,
          "content": "Thank you for your feedback!",
          "replies": [],
          "created_at": "2025-06-06T17:35:46.580002Z",
          "updated_at": "2025-06-06T17:35:46.580002Z",
          "is_owner": false
        }
      ],
      "created_at": "2025-06-06T17:35:46.580002Z",
      "updated_at": "2025-06-06T17:35:46.580002Z",
      "is_owner": false
    }
  ]
}
```

### Get Replies to a Comment

**Endpoint:** `GET /api/comments/{id}/replies/`

**Response:**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 2,
      "user": {
        "id": 1,
        "username": "entrepreneur1",
        "role": "entrepreneur"
      },
      "idea": 1,
      "parent": 1,
      "content": "Thank you for your feedback!",
      "replies": [],
      "created_at": "2025-06-06T17:35:46.580002Z",
      "updated_at": "2025-06-06T17:35:46.580002Z",
      "is_owner": false
    }
  ]
}
```

### Add Comment to an Idea

**Endpoint:** `POST /api/ideas/{id}/comment/`

**Request Body:**
```json
{
  "content": "This is a comment on the idea."
}
```

**Response:**
```json
{
  "id": 51,
  "user": {
    "id": 3,
    "username": "user1",
    "role": "public"
  },
  "idea": 1,
  "parent": null,
  "content": "This is a comment on the idea.",
  "replies": [],
  "created_at": "2025-06-06T17:50:08.112902Z",
  "updated_at": "2025-06-06T17:50:08.112902Z",
  "is_owner": true
}
```

### Add Reply to a Comment

**Endpoint:** `POST /api/ideas/{idea_id}/comments/{comment_id}/reply/`

**Request Body:**
```json
{
  "content": "This is a reply to the comment."
}
```

**Response:**
```json
{
  "id": 52,
  "user": {
    "id": 3,
    "username": "user1",
    "role": "public"
  },
  "idea": 1,
  "parent": 51,
  "content": "This is a reply to the comment.",
  "replies": [],
  "created_at": "2025-06-06T17:51:08.112902Z",
  "updated_at": "2025-06-06T17:51:08.112902Z",
  "is_owner": true
}
```

### Update Comment

**Endpoint:** `PATCH /api/comments/{id}/`

**Request Body:**
```json
{
  "content": "Updated comment content."
}
```

**Response:**
```json
{
  "id": 51,
  "user": {
    "id": 3,
    "username": "user1",
    "role": "public"
  },
  "idea": 1,
  "parent": null,
  "content": "Updated comment content.",
  "replies": [],
  "created_at": "2025-06-06T17:50:08.112902Z",
  "updated_at": "2025-06-06T17:52:08.112902Z",
  "is_owner": true
}
```

### Delete Comment

**Endpoint:** `DELETE /api/comments/{id}/`

**Response:** `204 No Content`

## Error Handling

The API returns standard HTTP status codes to indicate the success or failure of a request:

- `200 OK`: The request was successful
- `201 Created`: The resource was successfully created
- `204 No Content`: The request was successful but no content is returned
- `400 Bad Request`: The request was invalid or cannot be served
- `401 Unauthorized`: Authentication is required or failed
- `403 Forbidden`: The request is understood but not allowed
- `404 Not Found`: The requested resource could not be found
- `500 Internal Server Error`: An error occurred on the server

Error responses include a JSON object with details about the error:

```json
{
  "detail": "Error message"
}
```

## Pagination

List endpoints return paginated results with the following structure:

```json
{
  "count": 100,
  "next": "https://api.example.com/api/ideas/?page=2",
  "previous": null,
  "results": [
    // Array of items
  ]
}
```

To navigate through pages, use the `page` query parameter:

```
GET /api/ideas/?page=2
```

The default page size is 10 items. You can change it using the `page_size` parameter (up to a maximum of 100):

```
GET /api/ideas/?page=1&page_size=20
```

## Rate Limiting

The API implements rate limiting to prevent abuse. If you exceed the rate limit, you will receive a `429 Too Many Requests` response with a `Retry-After` header indicating how many seconds to wait before making another request.

## Conclusion

This documentation covers the main endpoints and features of the Startup Idea Platform API. For any questions or issues, please contact the API administrator.

