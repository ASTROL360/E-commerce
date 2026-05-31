# Fashion Store Mobile

Expo React Native mobile app for the Spring Boot Fashion Store API.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set the API URL in `.env`:

   ```env
   EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8080/api
   ```

   Use `http://localhost:8080/api` for the iOS simulator.

3. Start the app:

   ```bash
   npm run android
   ```

   or:

   ```bash
   npm run ios
   ```

## Backend Contract

The app expects:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/cart`
- `GET /api/cart`
- `DELETE /api/cart/{itemId}`
- `POST /api/orders`
- `GET /api/orders`

Cart quantity updates use `POST /api/cart` with `{ productId, quantity }`, matching the provided API contract.
