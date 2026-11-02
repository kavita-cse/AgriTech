# Backend Mongoose Models
Mongoose schemas to be defined per Architecture Version 2.3 ER diagram:
- `User.js` (Role-based schema, password hashing)
- `Farm.js` (Farmer plot definitions)
- `Crop.js` (Crop lifecycle tracking)
- `SoilRecord.js` (Soil test parameters with agronomic units)
- `Product.js` (Marketplace inventory)
- `Cart.js` & `CartItem.js` (User cart with unique userId index)
- `Order.js` & `OrderItem.js` (Order records with single-seller validation)
- `Consultation.js` (Farmer-to-expert consultation with optional expert assignment)
- `ForumPost.js` & `ForumComment.js` (Community forum)

