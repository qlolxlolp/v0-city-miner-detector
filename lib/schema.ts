import { pgTable, serial, text, timestamp, boolean, integer, real, json, uuid } from "drizzle-orm/pg-core"

// جدول کاربران
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// جدول تشخیص‌ها
export const detections = pgTable("detections", {
  id: uuid("id").primaryKey().defaultRandom(),
  location: text("location").notNull(),
  method: text("method").notNull(),
  status: text("status").notNull().default("در حال بررسی"),
  timestamp: timestamp("timestamp").defaultNow(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  confidence: real("confidence").notNull(),
  estimatedPower: real("estimated_power"),
  estimatedDevices: text("estimated_devices"),
  assignedTo: uuid("assigned_to").references(() => users.id),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// جدول داده‌های سنسور
export const sensorData = pgTable("sensor_data", {
  id: serial("id").primaryKey(),
  detectionId: uuid("detection_id")
    .references(() => detections.id)
    .notNull(),
  dataType: text("data_type").notNull(), // power, noise, rf, network
  timestamp: timestamp("timestamp").defaultNow(),
  value: real("value").notNull(),
  unit: text("unit"),
  notes: text("notes"),
})

// جدول رویدادهای زمانی
export const timelineEvents = pgTable("timeline_events", {
  id: serial("id").primaryKey(),
  detectionId: uuid("detection_id")
    .references(() => detections.id)
    .notNull(),
  eventType: text("event_type").notNull(), // detection, verification, rejection, update, assignment, note
  title: text("title").notNull(),
  description: text("description"),
  timestamp: timestamp("timestamp").defaultNow(),
  userId: uuid("user_id").references(() => users.id),
})

// جدول تشخیص‌های مرتبط
export const relatedDetections = pgTable("related_detections", {
  id: serial("id").primaryKey(),
  detectionId: uuid("detection_id")
    .references(() => detections.id)
    .notNull(),
  relatedDetectionId: uuid("related_detection_id")
    .references(() => detections.id)
    .notNull(),
  relationReason: text("relation_reason"),
  createdAt: timestamp("created_at").defaultNow(),
})

// جدول یادداشت‌ها
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  detectionId: uuid("detection_id")
    .references(() => detections.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// جدول آمار تشخیص
export const detectionStats = pgTable("detection_stats", {
  id: serial("id").primaryKey(),
  totalCount: integer("total_count").default(0),
  powerUsageCount: integer("power_usage_count").default(0),
  noiseCount: integer("noise_count").default(0),
  rfCount: integer("rf_count").default(0),
  networkCount: integer("network_count").default(0),
  confirmedCount: integer("confirmed_count").default(0),
  pendingCount: integer("pending_count").default(0),
  rejectedCount: integer("rejected_count").default(0),
  lastWeekTotal: integer("last_week_total").default(0),
  lastWeekPowerUsage: integer("last_week_power_usage").default(0),
  lastWeekNoise: integer("last_week_noise").default(0),
  lastWeekRf: integer("last_week_rf").default(0),
  lastWeekNetwork: integer("last_week_network").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
})

// جدول دستگاه‌های سخت‌افزاری
export const hardwareDevices = pgTable("hardware_devices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // sensor, scanner, router, etc.
  model: text("model"),
  serialNumber: text("serial_number"),
  firmwareVersion: text("firmware_version"),
  location: text("location"),
  ipAddress: text("ip_address"),
  macAddress: text("mac_address"),
  isConnected: boolean("is_connected").default(false),
  lastSeen: timestamp("last_seen"),
  lastChecked: timestamp("last_checked"),
  status: text("status").default("inactive"), // active, inactive, maintenance
  configuration: json("configuration"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// جدول هشدارها
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  detectionId: uuid("detection_id").references(() => detections.id),
  deviceId: integer("device_id").references(() => hardwareDevices.id),
  type: text("type").notNull(), // detection, hardware, system
  severity: text("severity").notNull(), // low, medium, high, critical
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  isResolved: boolean("is_resolved").default(false),
  timestamp: timestamp("timestamp").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: uuid("resolved_by").references(() => users.id),
})

// جدول گزارش‌های خودکار
export const scheduledReports = pgTable("scheduled_reports", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // daily, weekly, monthly
  format: text("format").notNull(), // pdf, excel, csv
  recipients: text("recipients").array(),
  schedule: json("schedule").notNull(), // { day, hour, minute }
  lastRun: timestamp("last_run"),
  nextRun: timestamp("next_run"),
  isActive: boolean("is_active").default(true),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
