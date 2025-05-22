import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Service Materials table
export const serviceMaterials = pgTable("service_materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  status: text("status").notNull().default("not-up-to-date"),
  icon: text("icon"),
  fileName: text("file_name"),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  fileData: text("file_data"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertServiceMaterialSchema = createInsertSchema(serviceMaterials).pick({
  name: true,
  description: true,
  category: true,
  status: true,
  fileName: true,
  fileSize: true,
  mimeType: true,
  fileData: true,
});

export type InsertServiceMaterial = z.infer<typeof insertServiceMaterialSchema>;

// Extended ServiceMaterial type with editor information
export type ServiceMaterial = Omit<typeof serviceMaterials.$inferSelect, 'createdAt' | 'updatedAt'> & {
  editor: {
    name: string;
    avatarUrl?: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
};
