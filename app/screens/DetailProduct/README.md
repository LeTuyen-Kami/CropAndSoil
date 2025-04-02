# DetailProduct Components

This directory contains components used in the DetailProduct screen.

## Rating (`Rating.tsx`)

A component for displaying product ratings and reviews.

**Props:**

- `rating`: (number, optional, default: 5) The current average rating of the product.
- `totalReviews`: (number, optional, default: 20) The total number of reviews for the product.
- `onViewAllPress`: (function, optional) Callback function for when the "View All" button is pressed.

**Features:**

- Displays the average product rating with star icons
- Shows filter tabs for viewing different types of reviews
- Lists review items with ReviewItem component
- Responsive design following Figma specs

**Usage:**

```tsx
<Rating
  rating={4.5}
  totalReviews={42}
  onViewAllPress={() => navigation.navigate("AllReviews")}
/>
```

## ReviewItem (`ReviewItem.tsx`)

A component for displaying individual product reviews.

**Props:**

- `reviewer`: (Object, required) Information about the reviewer.
  - `name`: (string, required) The name of the reviewer.
  - `avatar`: (string, required) URL for the reviewer's avatar image.
- `rating`: (number, required) The rating given by the reviewer (1-5).
- `quality`: (string, required) Description of product quality.
- `date`: (string, required) The date of the review.
- `productVariant`: (string, required) The specific variant of the product reviewed.
- `comment`: (string, optional) The text review from the reviewer.
- `likes`: (number, required) The number of likes on the review.
- `media`: (Array, optional) Images or videos attached to the review.
  - `type`: ('image' | 'video') The type of media.
  - `uri`: (string) URL for the media.
  - `duration`: (string, for videos) The duration of the video.
- `sellerResponse`: (string, optional) Response from the seller to the review.

**Features:**

- Displays user information and rating
- Shows review details with date and product variant
- Handles media attachments (images and videos)
- Displays seller responses when available
- Like button for interacting with reviews

**Usage:**

```tsx
<ReviewItem
  reviewer={{
    name: "Thanh Trần",
    avatar: "https://example.com/avatar.jpg",
  }}
  rating={5}
  quality="Chất lượng sản phẩm: Tốt"
  date="10/01/2025 12:14"
  productVariant="NPK Rau Phú Mỹ"
  likes={0}
  media={[
    {
      type: "image",
      uri: "https://example.com/image.jpg",
    },
  ]}
  sellerResponse="Cảm ơn bạn đã đánh giá sản phẩm!"
/>
```
