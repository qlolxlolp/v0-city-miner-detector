import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    // ایجاد جدول کاربران
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    // ایجاد جدول تشخیص‌ها
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS detections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        location TEXT NOT NULL,
        method TEXT NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        status TEXT DEFAULT 'در حال بررسی',
        lat DOUBLE PRECISION NOT NULL,
        lng DOUBLE PRECISION NOT NULL,
        confidence DOUBLE PRECISION NOT NULL,
        sensor_id TEXT,
        estimated_power TEXT,
        estimated_devices TEXT,
        processing_time TEXT,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        assigned_to UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    // ایجاد جدول داده‌های سنسور
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS sensor_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        detection_id UUID REFERENCES detections(id) ON DELETE CASCADE,
        data_type TEXT NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        value DOUBLE PRECISION NOT NULL,
        unit TEXT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    // ایجاد جدول رویدادهای زمانی
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS timeline_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        detection_id UUID REFERENCES detections(id) ON DELETE CASCADE,
        event_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        user_id UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    // ایجاد جدول تشخیص‌های مرتبط
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS related_detections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        detection_id UUID REFERENCES detections(id) ON DELETE CASCADE,
        related_detection_id UUID REFERENCES detections(id) ON DELETE CASCADE,
        relation_type TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(detection_id, related_detection_id)
      );
    `)

    // ایجاد جدول یادداشت‌ها
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS notes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        detection_id UUID REFERENCES detections(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    // ایجاد جدول آمار تشخیص‌ها
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS detection_stats (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        total_count INTEGER DEFAULT 0,
        power_usage_count INTEGER DEFAULT 0,
        noise_count INTEGER DEFAULT 0,
        rf_count INTEGER DEFAULT 0,
        network_count INTEGER DEFAULT 0,
        confirmed_count INTEGER DEFAULT 0,
        pending_count INTEGER DEFAULT 0,
        rejected_count INTEGER DEFAULT 0,
        last_week_total INTEGER DEFAULT 0,
        last_week_power_usage INTEGER DEFAULT 0,
        last_week_noise INTEGER DEFAULT 0,
        last_week_rf INTEGER DEFAULT 0,
        last_week_network INTEGER DEFAULT 0,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    // ایجاد ایندکس‌ها برای بهبود عملکرد
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_detections_location ON detections(location);`)
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_detections_method ON detections(method);`)
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_detections_status ON detections(status);`)
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_detections_timestamp ON detections(timestamp);`)
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_sensor_data_detection_id ON sensor_data(detection_id);`)
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_sensor_data_data_type ON sensor_data(data_type);`)
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_timeline_events_detection_id ON timeline_events(detection_id);`)
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_notes_detection_id ON notes(detection_id);`)

    // ایجاد یک رکورد اولیه در جدول آمار
    await executeQuery(`
      INSERT INTO detection_stats (id)
      SELECT gen_random_uuid()
      WHERE NOT EXISTS (SELECT 1 FROM detection_stats);
    `)

    return NextResponse.json({ success: true, message: "مهاجرت با موفقیت انجام شد" })
  } catch (error) {
    console.error("Error during migration:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
