# Startup Idea Platform API - Example Requests and Responses

This document provides example requests and responses for the most common API endpoints in the Startup Idea Platform.

## Authentication

### User Login

**Request:**
```bash
curl -X POST https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/users/token/ \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=entrepreneur1&password=password123"
```

**Response:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcxODc2ODY2NywiaWF0IjoxNzE4NjgyMjY3LCJqdGkiOiI1YzQ3ZjU0ZTJkZjQ0ZWE5OWJmODRhZmM5ZGJmMzUxYyIsInVzZXJfaWQiOjJ9.8Z5-QU8hZjQ5Z9X9Y8X9Y8X9Y8X9Y8X9Y8X9Y8X9Y8X",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE4NjgyNTY3LCJpYXQiOjE3MTg2ODIyNjcsImp0aSI6IjJmMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyIiwidXNlcl9pZCI6Mn0.8Z5-QU8hZjQ5Z9X9Y8X9Y8X9Y8X9Y8X9Y8X9Y8X9Y8X"
}
```

### User Registration

**Request:**
```bash
curl -X POST https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_entrepreneur",
    "email": "new@example.com",
    "password": "secure_password",
    "password2": "secure_password",
    "first_name": "New",
    "last_name": "User",
    "role": "entrepreneur",
    "bio": "A new entrepreneur with great ideas.",
    "company_name": "New Startup Inc."
  }'
```

**Response:**
```json
{
  "username": "new_entrepreneur",
  "email": "new@example.com",
  "first_name": "New",
  "last_name": "User",
  "role": "entrepreneur",
  "bio": "A new entrepreneur with great ideas.",
  "company_name": "New Startup Inc.",
  "investment_focus": null
}
```

## User Management

### Get Current User

**Request:**
```bash
curl -X GET https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/users/current/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

**Response:**
```json
{
  "id": 2,
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

**Request:**
```bash
curl -X PATCH https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/users/update/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Updated bio information",
    "company_name": "Updated Company Name"
  }'
```

**Response:**
```json
{
  "id": 2,
  "username": "entrepreneur1",
  "email": "entrepreneur1@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "entrepreneur",
  "bio": "Updated bio information",
  "profile_picture": null,
  "company_name": "Updated Company Name",
  "investment_focus": null
}
```

## Ideas

### List Ideas

**Request:**
```bash
curl -X GET https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/ideas/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

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
        "id": 2,
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
    },
    // More ideas...
  ]
}
```

### Get Idea Details

**Request:**
```bash
curl -X GET https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/ideas/1/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

**Response:**
```json
{
  "id": 1,
  "title": "AI-Powered Personal Finance Assistant",
  "description": "An AI assistant that helps users manage their finances, track expenses, and provide personalized financial advice.",
  "user": {
    "id": 2,
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

**Request:**
```bash
curl -X POST https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/ideas/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Startup Idea",
    "description": "Detailed description of the startup idea.",
    "category": 1,
    "tags": ["innovation", "technology", "mobile"]
  }'
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

**Request:**
```bash
curl -X PATCH https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/ideas/11/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Idea Title",
    "description": "Updated description of the startup idea."
  }'
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

**Request:**
```bash
curl -X DELETE https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/ideas/11/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

**Response:**
```
204 No Content
```

## Likes

### Add Public Like

**Request:**
```bash
curl -X POST https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/ideas/1/like/public/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

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

**Request:**
```bash
curl -X POST https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/ideas/1/like/investor/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

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

**Request:**
```bash
curl -X POST https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/likes/toggle/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "idea_id": 1,
    "like_type": "public"
  }'
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

## Comments

### Add Comment to an Idea

**Request:**
```bash
curl -X POST https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/ideas/1/comment/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a comment on the idea."
  }'
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

**Request:**
```bash
curl -X POST https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/ideas/1/comments/51/reply/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a reply to the comment."
  }'
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

### Get Comments for an Idea

**Request:**
```bash
curl -X GET https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/ideas/1/comments/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

**Response:**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
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
      "replies": [
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
      ],
      "created_at": "2025-06-06T17:50:08.112902Z",
      "updated_at": "2025-06-06T17:50:08.112902Z",
      "is_owner": true
    }
  ]
}
```

## Feed Sorting

### Recent Ideas

**Request:**
```bash
curl -X GET https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/ideas/recent/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### Popular Ideas

**Request:**
```bash
curl -X GET https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/ideas/popular/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### Trending Ideas

**Request:**
```bash
curl -X GET https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/ideas/trending/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### Ideas by Investor Likes

**Request:**
```bash
curl -X GET https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/ideas/investor_likes/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### Ideas by Public Likes

**Request:**
```bash
curl -X GET https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/ideas/public_likes/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### Most Commented Ideas

**Request:**
```bash
curl -X GET https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/ideas/most_commented/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### Recommended Ideas

**Request:**
```bash
curl -X GET https://8000-i5j4gy5j1fbpcd2mf9zjp-23a4ab7d.manusvm.computer/api/ideas/recommended/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

