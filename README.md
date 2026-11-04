# CineBook

Angular frontend for the Movie Ticket Booking API.

## Run locally

1. Start the backend API on `http://localhost:5081` (its development launch profile uses this address).
2. From this directory, run `npm install` if dependencies are not already installed.
3. Run `npm start` and open `http://localhost:4200`.

The API base URL is set in `src/app/services/api.ts`. The backend must allow the Angular origin through CORS.

## Customer booking flow

The app loads movies, then retrieves showtimes and seat availability for the selected movie and show. Customers can register or sign in, select available seats, and submit a booking. Booking creation requires the backend JWT and uses the `POST /api/Bookings` contract; the shared HTTP interceptor adds the signed-in token. The confirmation view displays the booking reference returned by the API.

The frontend uses these backend endpoints:

- `GET /api/Movies`
- `GET /api/Shows/movie/{movieId}`
- `GET /api/Shows/{showId}/seats`
- `POST /api/Auth/register` and `POST /api/Auth/login`
- `POST /api/Bookings`

## Validate

- `npm run build`
- `npm test -- --watch=false`
