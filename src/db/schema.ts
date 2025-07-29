// src/db/schema.ts
import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const project = pgTable("project", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  description: text("description"),
  isActive: boolean("isActive").default(true),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

export const analyticsEvent = pgTable("analytics_event", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  eventType: text("eventType").notNull(),
  eventName: text("eventName"),
  page: text("page").notNull(),
  referrer: text("referrer"),
  userAgent: text("userAgent"),
  ipAddress: text("ipAddress"),
  country: text("country"),
  city: text("city"),
  device: text("device"),
  browser: text("browser"),
  os: text("os"),
  sessionId: text("sessionId"),
  userId: text("userId"),
  metadata: text("metadata"),
  timestamp: timestamp("timestamp").defaultNow(),
})

export const insertUserSchema = createInsertSchema(user).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  emailVerified: true,
})

export const selectUserSchema = createSelectSchema(user)
export const insertProjectSchema = createInsertSchema(project).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
export const selectProjectSchema = createSelectSchema(project)
export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvent).omit({
  id: true,
  timestamp: true,
})
export const selectAnalyticsEventSchema = createSelectSchema(analyticsEvent)

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert
export type Session = typeof session.$inferSelect
export type NewSession = typeof session.$inferInsert
export type Account = typeof account.$inferSelect
export type NewAccount = typeof account.$inferInsert
export type Project = typeof project.$inferSelect
export type NewProject = typeof project.$inferInsert
export type AnalyticsEvent = typeof analyticsEvent.$inferSelect
export type NewAnalyticsEvent = typeof analyticsEvent.$inferInsert

export const tables = {
  user,
  session,
  account,
  project,
  analyticsEvent,
}