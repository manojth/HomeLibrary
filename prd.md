# Product Requirements Document (PRD)

**Project Name:** Home Library Minimalist Web App
**Status:** Planning / Ideation
**Goal:** To build a lightweight, focused web application that allows a single user (or small family) to manage their physical book collection, track reading progress by page number, and monitor books loaned to friends.

## 1. Target Audience
* Avid readers who want to digitize their physical home library.
* Users who frequently lend books to friends and lose track of them.
* Readers prioritizing a clean, distraction-free environment without social media features (like Goodreads).

## 2. Core Features (Scope)

### Epic 0: User Authentication
* **Requirement 0.1 - Sign Up:** The user can create an account with their email and password.
* **Requirement 0.2 - Sign In:** The user can sign in with their email and password.
* **Requirement 0.3 - Sign Out:** The user can sign out of their account.
* **Requirement 0.4 - Forgot Password:** The user can reset their password.
* **Requirement 0.5 - Change Password:** The user can change their password.

### Epic 1: Book Management (Add & Edit)
* **Requirement 1.1 - Manual Entry:** The user can add a book by providing basic details: Title, Author, Total Pages, and Current Status. Optional fields include Cover Image URL.
* **Requirement 1.2 - Edit/Delete:** The user can update a book's details or remove it entirely from the library.
* **Requirement 1.3 - Book Status:** A book can be assigned a status (e.g., *Unread*, *Reading*, *Read*).

### Epic 2: Personal Shelving & Categorization
* **Requirement 2.1 - Custom Shelves:** Users can create custom named shelves/categories (e.g., "Non-Fiction", "Sci-Fi", "To Read 2024").
* **Requirement 2.2 - Multi-shelf Assignment:** A single book can be assigned to one or multiple custom shelves.

### Epic 3: Search and Multi-Filter
* **Requirement 3.1 - Global Search:** A single search bar that queries against Book Titles and Authors.
* **Requirement 3.2 - Multi-Filtering:** Users can filter their library view by combining parameters:
    * *Filter by Status* (e.g., only show "Unread")
    * *Filter by Shelf* (e.g., only show "Sci-Fi")
    * *Filter by Loan Status* (e.g., only show "Borrowed")

### Epic 4: Lending Tracker
* **Requirement 4.1 - Loan a Book:** The user can mark any book as "Loaned Out", capturing the borrower's name and the date loaned.
* **Requirement 4.2 - Return a Book:** The user can mark a previously loaned book as "Returned", optionally logging the return date.
* **Requirement 4.3 - Loan Dashboard:** A dedicated view or filter to see all currently loaned-out books, who has them, and how long they've been gone.

### Epic 5: Reading Progress Tracking
* **Requirement 5.1 - Update Page Number:** For books marked as "Reading," the user can update their current page number.
* **Requirement 5.2 - Progress Calculation:** The system will calculate and display the percentage completed (`(Current Page / Total Pages) * 100`).


## 3. Tech Stack
* **Frontend & API:** Next.js (React Framework)
* **Styling:** Tailwind CSS
* **Database:** MongoDB (using Mongoose ODM)
