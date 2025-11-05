To effectively implement your news classification system with clear relationships and easy retrieval, here is a set of data models (schema) that can be used in a database (NoSQL or SQL) or as types/interfaces in your frontend/backend code.

---

## Data Models for News Website Content Classification

### 1. Article Model (Base)

This represents any article or story:

```ts
interface Article {
  id: string; // unique identifier
  title: string; // headline/title
  summary: string; // brief summary or excerpt
  content: string; // full editorial content (HTML or markdown)
  authorId: string; // reference to an Author/User entity
  publishDate: Date; // original publication timestamp
  updatedDate?: Date; // last update timestamp
  tags: string[]; // array of tags/keywords, e.g. ['politics', 'health']
  category: ArticleCategory; // see below
  status: ArticleStatus; // e.g. 'draft', 'published', 'archived'
  featuredImageUrl?: string; // for hero image or preview
  multimedia?: Multimedia[]; // optional array of images/videos/audio
}
```

### 2. ArticleCategory Enum

Classify type of article:

```ts
enum ArticleCategory {
  SIDE_STORY = "side_story", // Short, sidebar update (news category)
  REGULAR_STORY = "regular_story", // Standard daily news (news category)
  EXCLUSIVE_STORY = "exclusive_story", // Featured hot news (news category)
  MAGAZINE_STORY = "magazine_story", // Profile/in-depth piece (profile content)
  EDITORIAL_STORY = "editorial_story", // Full article format (used for content rendering)
}
```

### 3. ArticleStatus Enum

Track article lifecycle:

```ts
enum ArticleStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}
```

### 4. Multimedia Type

For attaching images/videos/audio to articles:

```ts
interface Multimedia {
  id: string;
  type: "image" | "video" | "audio";
  url: string;
  altText?: string;
  caption?: string;
  order?: number; // To control display order
}
```

### 5. Author/Contributor Model

Information about writers or contributors:

```ts
interface Author {
  id: string;
  name: string;
  designation?: string; // Journalist, Editor, Columnist, etc.
  profilePhotoUrl?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
}
```

### 6. ArticleRelationship Model (Optional)

For linking related articles (e.g., exclusive story links to editorial):

```ts
interface ArticleRelationship {
  sourceArticleId: string;
  targetArticleId: string;
  relationType: "related" | "follow-up" | "featured" | "similar";
}
```

---

## Implementation Notes

- **Tagging Logic:**  
  Articles tagged as side, regular, or exclusive stories are part of the **news category**. Magazine stories represent **profile content**. Editorial story is the display format for full reading.

- **Frontend Usage:**  
  Your UI can query articles by `category` to show appropriate sections: sidebar (side stories), main feed (regular/exclusive), profile page (magazine), reading page (editorial).

- **Backend/API:**  
  Support filtering for latest exclusive stories, side stories within last 24 hours, magazine feature articles, etc.

- **Storage:**  
  Use embedded document models to store multimedia alongside articles, or reference external media services.

- **Extensibility:**  
  Easily add more categories or statuses if needed.

---
