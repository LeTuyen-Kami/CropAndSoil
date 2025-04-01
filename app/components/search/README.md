# Search Components

This directory contains components specific to the search functionality of the application.

## SearchSuggestionItem (`SearchSuggestionItem.tsx`)

A component that displays a single search suggestion item with an image and name.

**Props:**

- `name`: (string, required) The name of the suggestion item.
- `image`: (ImageSourcePropType, required) The image source for the suggestion item.
- `onPress`: (function, optional) Callback function to handle when the suggestion item is pressed.

**Usage:**

Used in the SearchSuggestions component to display individual suggestion items.

## SearchSuggestions (`SearchSuggestions.tsx`)

A component that displays a grid of search suggestion items.

**Props:**

- `onSuggestionPress`: (function, optional) Callback function that receives the selected suggestion item.

**Usage:**

Used in the SearchScreen to display search suggestions to the user.

## SearchHistoryItem (`SearchHistoryItem.tsx`)

A component that displays a single search history item with a history icon and delete button.

**Props:**

- `text`: (string, required) The search term text.
- `onPress`: (function, required) Callback function that is called when the item is pressed.
- `onDelete`: (function, required) Callback function that is called when the delete button is pressed.

**Usage:**

Used in the SearchResults component to display individual search history items.

## SearchSuggestionTerm (`SearchSuggestionTerm.tsx`)

A component that displays a single suggested search term with a magnifier icon.

**Props:**

- `text`: (string, required) The suggested search term text.
- `onPress`: (function, required) Callback function that is called when the item is pressed.

**Usage:**

Used in the SearchResults component to display individual suggested search terms.

## SearchResults (`SearchResults.tsx`)

A component that displays a list of search history items and suggested search terms based on the current query.

**Props:**

- `query`: (string, required) The current search query.
- `searchHistory`: (string[], required) An array of search history items.
- `suggestedTerms`: (string[], required) An array of suggested search terms.
- `onHistoryItemPress`: (function, required) Callback function that is called when a history item is pressed.
- `onHistoryItemDelete`: (function, required) Callback function that is called when a history item's delete button is pressed.
- `onSuggestionPress`: (function, required) Callback function that is called when a suggested term is pressed.
- `onViewMorePress`: (function, required) Callback function that is called when the "View More" button is pressed.

**Usage:**

Used in the SearchScreen to display search results based on the current query.
