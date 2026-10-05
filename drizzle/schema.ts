import { pgTable, text, varchar, timestamp, integer, doublePrecision, boolean, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }),
  passwordHash: text("password_hash"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const companyProfiles = pgTable("company_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull().default("Your Electrical Company"),
  tagline: varchar("tagline", { length: 255 }).default("Electrical Contractors & Suppliers"),
  address: text("address").default("Shop No. 1, Main Road, Your City"),
  phone: varchar("phone", { length: 50 }).default("+91 98765 43210"),
  email: varchar("email", { length: 255 }).default("info@yourcompany.in"),
  gstin: varchar("gstin", { length: 50 }).default(""),
  bank: text("bank").default("Bank: \nA/c No: \nIFSC: "),
  quoteTerms: text("quote_terms").default("Prices valid for 15 days.\nPayment: 50% advance, balance on completion.\nGST as applicable."),
  invoiceTerms: text("invoice_terms").default("Payment due within 15 days.\nGoods once sold will not be taken back.\nSubject to local jurisdiction."),
  signatoryName: varchar("signatory_name", { length: 255 }).default("Authorised Signatory"),
  logo: text("logo").default(""),
  signature: text("signature").default(""),
  stamp: text("stamp").default(""),
  letterhead: text("letterhead").default(""),
  style: varchar("style", { length: 50 }).default("classic"),
  color: varchar("color", { length: 50 }).default("#1f5a4c"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const inventoryItems = pgTable("inventory_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sku: varchar("sku", { length: 100 }),
  category: varchar("category", { length: 100 }),
  unit: varchar("unit", { length: 50 }).default("pcs"),
  cost: doublePrecision("cost").default(0),
  price: doublePrecision("price").default(0),
  gst: integer("gst").default(18),
  stock: integer("stock").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 20 }).notNull(), // 'quote' | 'invoice'
  number: varchar("number", { length: 100 }).notNull(),
  date: varchar("date", { length: 20 }).notNull(),
  dueDate: varchar("due_date", { length: 20 }),
  clientName: text("client_name").default(""),
  clientAddress: text("client_address").default(""),
  clientGstin: varchar("client_gstin", { length: 50 }).default(""),
  clientPhone: varchar("client_phone", { length: 50 }).default(""),
  subject: text("subject").default(""),
  notes: text("notes").default(""),
  terms: text("terms").default(""),
  status: varchar("status", { length: 50 }).default("Draft"),
  interState: boolean("inter_state").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const documentLines = pgTable("document_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id").references(() => documents.id, { onDelete: "cascade" }).notNull(),
  itemId: uuid("item_id"),
  name: text("name").notNull(),
  unit: varchar("unit", { length: 50 }).default("pcs"),
  qty: doublePrecision("qty").default(1),
  rate: doublePrecision("rate").default(0),
  cost: doublePrecision("cost").default(0),
  gst: integer("gst").default(18),
  discount: doublePrecision("discount").default(0),
});
