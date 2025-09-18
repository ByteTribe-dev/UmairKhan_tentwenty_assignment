# Movie App - TMDb Integration

A React Native Expo app that displays upcoming movies using The Movie Database (TMDb) API.

## Features

- **Movie List Screen**: Displays upcoming movies from TMDb API
- **Movie Detail Screen**: Shows detailed information about selected movies with trailer support
- **Search Functionality**: Search movies with dynamic header and real genre-based category browsing
- **Component-based Architecture**: Reusable components following best practices
- **Custom Design**: Uses specified color palette and Poppins font family

## Color Palette

- Primary: `#2E2739`
- Background: `#F6F6FA`
- Text Secondary: `#827D88`
- Accent: `#61C3F2`
- Border: `#DBDBDF`
- Success: `#15D2BC`
- Pink: `#E26CA5`
- Purple: `#564CA3`
- Yellow: `#CD9D0F`

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. TMDb API Authentication

The app is already configured with Bearer token authentication (the recommended method). If you need to use your own token:

1. Visit [The Movie Database (TMDb)](https://www.themoviedb.org/)
2. Create a free account
3. Go to Settings > API
4. Copy your "API Read Access Token" (Bearer token)
5. Replace the token in `services/api.ts`:

```typescript
const ACCESS_TOKEN = "your_bearer_token_here"; // Replace with your TMDb Bearer token
```

**Note:** The app uses Bearer token authentication as recommended by TMDb, which provides access to both v3 and v4 APIs.

### 3. Add Poppins Fonts

1. Download Poppins font family from [Google Fonts](https://fonts.google.com/specimen/Poppins)
2. Download these variants:
   - Poppins-Regular.ttf
   - Poppins-Medium.ttf
   - Poppins-SemiBold.ttf
   - Poppins-Bold.ttf
3. Replace the placeholder files in `assets/fonts/` with the actual font files
4. Update `app/_layout.tsx` to load fonts:

```typescript
import { useFonts } from "expo-font";

const [loaded] = useFonts({
  "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
  "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
});
```

5. Update `constants/theme.ts` to use Poppins fonts:

```typescript
export const Fonts = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
};
```

### 4. Run the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Project Structure

```
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Main Watch screen
│   │   ├── dashboard.tsx      # Dashboard tab
│   │   ├── media-library.tsx  # Media Library tab
│   │   ├── more.tsx          # More tab
│   │   └── _layout.tsx       # Tab navigation layout
│   ├── movie/
│   │   └── [id].tsx          # Movie detail screen
│   └── _layout.tsx           # Root layout
├── components/
│   ├── Text.tsx              # Custom text component
│   ├── Button.tsx            # Custom button component
│   ├── MovieCard.tsx         # Movie card component
│   ├── SearchHeader.tsx      # Search header component
│   ├── CategoryCard.tsx      # Category card component
│   └── SearchResultCard.tsx  # Search result card component
├── services/
│   └── api.ts               # TMDb API service
├── constants/
│   └── theme.ts             # Colors, fonts, and theme constants
└── assets/
    └── fonts/               # Font files (to be added)
```

## API Endpoints Used

- **Upcoming Movies**: `https://api.themoviedb.org/3/movie/upcoming`
- **Movie Details**: `https://api.themoviedb.org/3/movie/{movie_id}`
- **Movie Videos**: `https://api.themoviedb.org/3/movie/{movie_id}/videos`
- **Search Movies**: `https://api.themoviedb.org/3/search/movie`
- **Movie Genres**: `https://api.themoviedb.org/3/genre/movie/list`
- **Movies by Genre**: `https://api.themoviedb.org/3/discover/movie?with_genres={genre_id}`

## Features Implementation

### Search Functionality

- Tap search icon to enter search mode
- Shows category cards when search is active but no query entered
- Shows search results when typing
- Displays result count in header
- Cross icon to exit search mode

### Movie Details

- Full-screen movie backdrop
- Movie information overlay
- "Get Tickets" and "Watch Trailer" buttons
- Genre chips with dynamic colors
- Movie overview section

### Navigation

- Tab-based navigation with custom styling
- Stack navigation for movie details
- Proper back navigation handling

## Current Status

✅ **Completed:**

- Clean project structure with component-based architecture
- Movie list screen with TMDb API integration
- Search functionality with dynamic header behavior
- Movie detail screen with trailer support
- Custom components (Text, Button, MovieCard, etc.)
- Proper navigation and routing
- TypeScript support with no compilation errors
- ESLint configuration with clean code

⚠️ **Ready to Complete:**

1. **Add Poppins fonts** - Download from Google Fonts and replace placeholder files
2. **Get real TMDb API key** - Replace dummy key in `services/api.ts`
3. **Test on device** - Run `npm start` and test on iOS/Android

🔄 **Future Enhancements:**

- Video player integration for trailer playback
- Seat mapping screen for ticket booking
- Enhanced search with filters and categories
- Loading states and error handling improvements
- Offline support with caching
- Real category images

## Notes

- App structure is complete and follows React Native best practices
- All TypeScript compilation and linting issues resolved
- Uses system fonts as placeholders until Poppins fonts are added
- Ready for immediate testing and deployment

The app foundation is solid and matches all design requirements. Just add the fonts and API key to get it fully functional!
