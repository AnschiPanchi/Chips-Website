import mongoose from "mongoose";

// ── User ─────────────────────────────────────────────────────
const addressSchema = new mongoose.Schema({
  label:   { type: String, default: "Home" },
  name:    String,
  phone:   String,
  line1:   String,
  line2:   String,
  city:    String,
  state:   String,
  pincode: String,
});

const userSchema = new mongoose.Schema({
  name:            { type: String, required: true, trim: true },
  email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:           { type: String, default: "" },
  passwordHash:    { type: String, required: true },
  role:            { type: String, enum: ["customer", "admin"], default: "customer" },
  addresses:       [addressSchema],
  refreshTokens:   [String],
  resetToken:      String,
  resetTokenExpiry:Date,
  createdAt:       { type: Date, default: Date.now },
}, { versionKey: false });

export const User = mongoose.model("User", userSchema);

// ── Product ──────────────────────────────────────────────────
const variantSchema = new mongoose.Schema({
  weight: String,
  price:  Number,
  mrp:    Number,
  stock:  { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema({
  slug:         { type: String, required: true, unique: true },
  name:         { type: String, required: true },
  category:     String,
  flavour:      String,
  tagline:      String,
  description:  String,
  price:        Number,
  mrp:          Number,
  weight:       String,
  image:        String,
  gallery:      [String],
  variants:     [variantSchema],
  rating:       { type: Number, default: 0 },
  reviewCount:  { type: Number, default: 0 },
  badges:       [String],
  heat:         Number,
  oil:          String,
  ingredients:  [String],
  nutrition:    [{ label: String, value: String }],
  allergens:    String,
  storage:      String,
  shelfLife:    String,
  nutritionNote:String,
  active:       { type: Boolean, default: true },
  createdAt:    { type: Date, default: Date.now },
}, { versionKey: false });

export const Product = mongoose.model("Product", productSchema);

// ── Order ────────────────────────────────────────────────────
const orderItemSchema = new mongoose.Schema({
  productId: String,
  slug:      String,
  name:      String,
  image:     String,
  weight:    String,
  qty:       Number,
  price:     Number,
  mrp:       Number,
});

const orderSchema = new mongoose.Schema({
  orderNumber:    { type: String, required: true, unique: true },
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  guestEmail:     String,
  customer:       String,
  email:          String,
  phone:          String,
  items:          [orderItemSchema],
  subtotal:       Number,
  discount:       { type: Number, default: 0 },
  shipping:       { type: Number, default: 0 },
  total:          Number,
  couponCode:     String,
  status:         { type: String, enum: ["placed","packed","shipped","out-for-delivery","delivered","cancelled"], default: "placed" },
  delivery:       { type: String, enum: ["standard","express"], default: "standard" },
  paymentMethod:  { type: String, enum: ["cod","razorpay"], default: "cod" },
  paymentStatus:  { type: String, enum: ["pending","paid","failed","refunded"], default: "pending" },
  razorpayOrderId:String,
  razorpayPaymentId:String,
  razorpaySignature:String,
  address:        {
    name: String, phone: String,
    line1: String, line2: String,
    city: String, state: String, pincode: String,
  },
  notes:          String,
  placedAt:       { type: Date, default: Date.now },
  updatedAt:      { type: Date, default: Date.now },
}, { versionKey: false });

orderSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

export const Order = mongoose.model("Order", orderSchema);

// ── Coupon ───────────────────────────────────────────────────
const couponSchema = new mongoose.Schema({
  code:        { type: String, required: true, unique: true, uppercase: true },
  type:        { type: String, enum: ["percent","flat","shipping"], required: true },
  value:       { type: Number, default: 0 },
  minOrder:    { type: Number, default: 0 },
  maxDiscount: Number,
  active:      { type: Boolean, default: true },
  usageLimit:  Number,
  usedCount:   { type: Number, default: 0 },
  expiresAt:   Date,
  description: String,
  createdAt:   { type: Date, default: Date.now },
}, { versionKey: false });

export const Coupon = mongoose.model("Coupon", couponSchema);

// ── Review ───────────────────────────────────────────────────
const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name:      String,
  rating:    { type: Number, min: 1, max: 5 },
  title:     String,
  body:      String,
  verified:  { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });

export const Review = mongoose.model("Review", reviewSchema);

// ── Subscriber (Newsletter & Marketing Broadcasts) ───────────
const subscriberSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:        { type: String, default: "" },
  source:       { type: String, default: "website_footer" },
  active:       { type: Boolean, default: true },
  subscribedAt: { type: Date, default: Date.now },
}, { versionKey: false });

export const Subscriber = mongoose.model("Subscriber", subscriberSchema);

