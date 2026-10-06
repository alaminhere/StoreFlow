
comp
/* ----------------------------------------------
 * WHAT: Store Card component for displaying store information
 * WHY: Show store details in the store list
 * INPUT: Store data and optional UI props
 * OUTPUT: Store card UI
 * NOTE: UI only, no data fetching
 * ---------------------------------------------- */

fnc
 /* ----------------------------------------------
 * WHAT: Calculate the total price of purchase items
 * WHY: Calculate the purchase subtotal
 * INPUT: Purchase items with quantity and price
 * OUTPUT: Calculated total amount
 * NOTE: Pure function, no API call
 * ---------------------------------------------- */

 api
 /* ----------------------------------------------
 * WHAT: Create Store API
 * WHY: Create a new store for the current user
 * INPUT: Store name, email, phone, address
 * OUTPUT: Created store data
 * NOTE: Backend handles validation and database operation
 * ---------------------------------------------- */

 hook
 /* ----------------------------------------------
 * WHAT: useCurrentStore hook
 * WHY: Provide the active store information to components
 * INPUT: None
 * OUTPUT: Current store, member and role information
 * NOTE: Data comes from the store API
 * ---------------------------------------------- */
 service
 /* ----------------------------------------------
 * WHAT: Store service for handling store-related API requests
 * WHY: Keep store API communication separate from UI
 * INPUT: Store-related request data
 * OUTPUT: API response data
 * NOTE: Contains API communication only
 * ---------------------------------------------- */
 utility
 /* ----------------------------------------------
 * WHAT: Format currency utility
 * WHY: Display monetary values in a consistent format
 * INPUT: Numeric amount
 * OUTPUT: Formatted currency string
 * NOTE: No API or external dependency
 * ---------------------------------------------- */
 type
 /* ----------------------------------------------
 * WHAT: Store type definition
 * WHY: Define the structure of store data across the application
 * INPUT: Store-related properties
 * OUTPUT: TypeScript Store type
 * NOTE: Type definition only
 * ---------------------------------------------- */

 middleware
 /* ----------------------------------------------
 * WHAT: Authentication middleware
 * WHY: Protect routes that require authentication
 * INPUT: Incoming request and authentication cookie
 * OUTPUT: Allowed request or redirect response
 * NOTE: Runs before protected route access
 * ---------------------------------------------- */
 redux slice
 /* ----------------------------------------------
 * WHAT: Auth slice for managing authentication state
 * WHY: Store and update user authentication information
 * INPUT: Authentication actions and API results
 * OUTPUT: Updated authentication state
 * NOTE: Global client-side state
 * ---------------------------------------------- */
 redux endpoint
 /* ----------------------------------------------
 * WHAT: Get current user API endpoint
 * WHY: Fetch authenticated user's account information
 * INPUT: None
 * OUTPUT: User data with associated stores
 * NOTE: Uses the authenticated user cookie
 * ---------------------------------------------- */