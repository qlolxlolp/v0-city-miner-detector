import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerClient()

    // ایجاد تابع به‌روزرسانی آمار در پایگاه داده
    const { error: functionError } = await supabase.rpc("create_update_stats_function")

    if (functionError) {
      // اگر تابع وجود نداشت، آن را ایجاد می‌کنیم
      const { error: createFunctionError } = await supabase.sql(`
        CREATE OR REPLACE FUNCTION update_detection_stats()
        RETURNS VOID AS $$
        DECLARE
          total INT;
          power_usage INT;
          noise INT;
          rf INT;
          network INT;
          confirmed INT;
          pending INT;
          rejected INT;
          last_week_start TIMESTAMP;
          last_week_end TIMESTAMP;
          last_week_total INT;
          last_week_power INT;
          last_week_noise INT;
          last_week_rf INT;
          last_week_network INT;
        BEGIN
          -- محاسبه تاریخ شروع و پایان هفته گذشته
          last_week_start := NOW() - INTERVAL '7 days';
          last_week_end := NOW();
          
          -- محاسبه آمار کلی
          SELECT COUNT(*) INTO total FROM detections;
          SELECT COUNT(*) INTO power_usage FROM detections WHERE method = 'مصرف برق';
          SELECT COUNT(*) INTO noise FROM detections WHERE method = 'نویز صوتی';
          SELECT COUNT(*) INTO rf FROM detections WHERE method = 'سیگنال RF';
          SELECT COUNT(*) INTO network FROM detections WHERE method = 'ترافیک شبکه';
          
          -- محاسبه آمار بر اساس وضعیت
          SELECT COUNT(*) INTO confirmed FROM detections WHERE status = 'تایید شده';
          SELECT COUNT(*) INTO pending FROM detections WHERE status = 'در حال بررسی';
          SELECT COUNT(*) INTO rejected FROM detections WHERE status = 'رد شده';
          
          -- محاسبه آمار هفته گذشته
          SELECT COUNT(*) INTO last_week_total 
          FROM detections 
          WHERE timestamp BETWEEN last_week_start AND last_week_end;
          
          SELECT COUNT(*) INTO last_week_power 
          FROM detections 
          WHERE method = 'مصرف برق' AND timestamp BETWEEN last_week_start AND last_week_end;
          
          SELECT COUNT(*) INTO last_week_noise 
          FROM detections 
          WHERE method = 'نویز صوتی' AND timestamp BETWEEN last_week_start AND last_week_end;
          
          SELECT COUNT(*) INTO last_week_rf 
          FROM detections 
          WHERE method = 'سیگنال RF' AND timestamp BETWEEN last_week_start AND last_week_end;
          
          SELECT COUNT(*) INTO last_week_network 
          FROM detections 
          WHERE method = 'ترافیک شبکه' AND timestamp BETWEEN last_week_start AND last_week_end;
          
          -- به‌روزرسانی جدول آمار
          UPDATE detection_stats SET
            total_count = total,
            power_usage_count = power_usage,
            noise_count = noise,
            rf_count = rf,
            network_count = network,
            confirmed_count = confirmed,
            pending_count = pending,
            rejected_count = rejected,
            last_week_total = last_week_total,
            last_week_power_usage = last_week_power,
            last_week_noise = last_week_noise,
            last_week_rf = last_week_rf,
            last_week_network = last_week_network,
            last_updated = NOW();
        END;
        $$ LANGUAGE plpgsql;
      `)

      if (createFunctionError) {
        console.error("خطا در ایجاد تابع به‌روزرسانی آمار:", createFunctionError)
        return NextResponse.json({ error: createFunctionError.message }, { status: 500 })
      }
    }

    // اجرای تابع به‌روزرسانی آمار
    const { error: updateError } = await supabase.rpc("update_detection_stats")

    if (updateError) {
      console.error("خطا در به‌روزرسانی آمار:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "آمار با موفقیت به‌روزرسانی شد" })
  } catch (error) {
    console.error("خطا در سرور:", error)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}
