import { pgTable, text, timestamp, uuid, integer, pgEnum, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', ['guest', 'host']);
export const vacationTypeEnum = pgEnum('vacation_type', ['relax', 'adventure', 'city_break', 'family']);
export const bookingStatusEnum = pgEnum('booking_status', ['confirmed', 'cancelled']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  fullName: text('full_name').notNull(),
  role: userRoleEnum('role').notNull().default('guest'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const accommodations = pgTable('accommodations', {
  id: uuid('id').primaryKey().defaultRandom(),
  hostId: uuid('host_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  location: text('location').notNull(),
  description: text('description').notNull(),
  vacationType: vacationTypeEnum('vacation_type').notNull(),
  pricePerNight: decimal('price_per_night', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  accommodationId: uuid('accommodation_id').notNull().references(() => accommodations.id, { onDelete: 'cascade' }),
  guestId: uuid('guest_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  checkIn: timestamp('check_in').notNull(),
  checkOut: timestamp('check_out').notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  status: bookingStatusEnum('status').notNull().default('confirmed'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accommodations: many(accommodations),
  bookings: many(bookings),
}));

export const accommodationsRelations = relations(accommodations, ({ one, many }) => ({
  host: one(users, {
    fields: [accommodations.hostId],
    references: [users.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  accommodation: one(accommodations, {
    fields: [bookings.accommodationId],
    references: [accommodations.id],
  }),
  guest: one(users, {
    fields: [bookings.guestId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Accommodation = typeof accommodations.$inferSelect;
export type NewAccommodation = typeof accommodations.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
