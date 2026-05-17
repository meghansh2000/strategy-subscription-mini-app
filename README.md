# Strategy Subscription Mini App

A full-stack mini application built by Meghansh Mamidi as part of the Modern Algos technical assignment.

The application allows users to browse algorithmic trading strategies and subscribe to them based on available capital and business validation rules.

---

# Tech Stack

## Backend

* ASP.NET Core 8 Web API
* Entity Framework Core
* MySQL
* FluentValidation
* Swagger / OpenAPI

## Frontend

* React Native (Expo)
* TypeScript
* Expo Router
* Axios

## Database

* MySQL 8

---

# Project Structure

```bash
/db
/api
/mobile
```

* `db` → MySQL schema and seed data
* `api` → ASP.NET Core backend API
* `mobile` → Expo React Native application

---

# Features

## Strategy List

* Fetch active strategies
* Filter by risk level
* Pull-to-refresh support
* Loading and error states
* Responsive strategy cards

## Strategy Detail + Subscription

* View complete strategy details
* Subscribe with allocated capital
* Validation handling
* Inline API error display
* Success confirmation flow

## Backend Features

* Transactional subscription flow
* Validation using FluentValidation
* DTO-based API responses
* Global exception middleware
* Swagger API documentation
* Business rule enforcement

---

# Business Rules Implemented

* A user cannot subscribe to the same strategy twice while the subscription is Active.
* Allocated capital must be greater than or equal to the strategy minimum capital.
* Total allocated capital across active subscriptions cannot exceed available capital.

---

# Database Setup

## 1. Create Database

```sql
CREATE DATABASE strategy_subscription_app;
```

## 2. Run Schema

Execute the file below in MySQL Workbench:

```bash
/db/schema.sql
```

This will:

* create all tables
* create constraints
* insert sample strategies
* insert sample users

---

# Backend Setup

Navigate to:

```bash
/api
```

## Install Packages

```bash
dotnet restore
```

## Configure Connection String

Update `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "server=localhost;database=strategy_subscription_app;user=root;password=root"
}
```

## Run API

```bash
dotnet run
```

API will start on:

```bash
http://localhost:5050
```

Swagger:

```bash
http://localhost:5050/swagger
```

---

# Frontend Setup

Navigate to:

```bash
/mobile
```

## Install Dependencies

```bash
npm install
```

## Configure API Base URL

Update:

```bash
src/services/api.ts
```


Example:

```ts
baseURL: 'http://192.168.1.3:5050/api'
```

> Note:
> Use local IPv4 instead of localhost when testing on mobile devices.

---

## Start Expo

```bash
npx expo start
```

Then:

* press `w` for web
* or scan QR using Expo Go

---

# API Endpoints

## Strategies

```http
GET /api/strategies
GET /api/strategies/{id}
```

## Subscriptions

```http
POST /api/users/{userId}/subscriptions
PATCH /api/subscriptions/{id}
GET /api/users/{userId}/subscriptions
```

---

# Validation & Error Handling

The API returns proper HTTP status codes:

| Status Code | Description                      |
| ----------- | -------------------------------- |
| 400         | Validation errors                |
| 404         | Resource not found               |
| 409         | Duplicate subscription           |
| 422         | Capital/business rule violations |

---

# Sample Users

| User       | Available Capital |
| ---------- | ----------------- |
| Meghansh M | 200000            |
| Saurabh    | 150000            |

---

# What I'd Do With Another Day

If given additional time, I would improve the application in the following areas:

* Add JWT authentication and user login flow
* Add unit/integration tests for services and controllers
* Introduce pagination and search for strategies
* Add optimistic UI updates and caching
* Improve mobile responsiveness and animations
* Dockerize the entire application
* Deploy backend and database to cloud infrastructure
* Add CI/CD pipelines using GitHub Actions
* Add subscription analytics/dashboard
* Improve accessibility and dark mode support

---

# Notes

* Authentication was intentionally skipped as per assignment instructions.
* UserId is hardcoded to `1` in the mobile application.
* Focus was primarily on clean architecture, business validations, and transactional integrity.

---
