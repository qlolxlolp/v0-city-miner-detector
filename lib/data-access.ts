import { db } from "./db"
import { detections, sensorData, timelineEvents, relatedDetections, notes, detectionStats, users } from "./schema"
import { eq, desc, and, gte, like, or } from "drizzle-orm"

// توابع مربوط به تشخیص‌ها
export async function getDetections() {
  try {
    return await db.select().from(detections).orderBy(desc(detections.timestamp))
  } catch (error) {
    console.error("Error fetching detections:", error)
    return []
  }
}

export async function getDetectionById(id: string) {
  try {
    const result = await db.select().from(detections).where(eq(detections.id, id))
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error(`Error fetching detection with id ${id}:`, error)
    return null
  }
}

export async function updateDetectionStatus(id: string, status: string) {
  try {
    const result = await db
      .update(detections)
      .set({
        status: status,
        lastUpdated: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(detections.id, id))
      .returning()

    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error(`Error updating detection status for id ${id}:`, error)
    return null
  }
}

export async function assignDetection(id: string, userId: string) {
  try {
    const result = await db
      .update(detections)
      .set({
        assignedTo: userId,
        lastUpdated: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(detections.id, id))
      .returning()

    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error(`Error assigning detection ${id} to user ${userId}:`, error)
    return null
  }
}

// توابع مربوط به داده‌های سنسور
export async function getSensorDataByDetectionId(detectionId: string, dataType?: string) {
  try {
    let query = db
      .select()
      .from(sensorData)
      .where(eq(sensorData.detectionId, detectionId))
      .orderBy(sensorData.timestamp)

    if (dataType) {
      query = query.where(eq(sensorData.dataType, dataType))
    }

    return await query
  } catch (error) {
    console.error(`Error fetching sensor data for detection ${detectionId}:`, error)
    return []
  }
}

export async function addSensorData(data: any) {
  try {
    const result = await db.insert(sensorData).values(data).returning()
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error adding sensor data:", error)
    return null
  }
}

// توابع مربوط به رویدادهای زمانی
export async function getTimelineByDetectionId(detectionId: string) {
  try {
    const result = await db
      .select({
        ...timelineEvents,
        userName: users.fullName,
      })
      .from(timelineEvents)
      .leftJoin(users, eq(timelineEvents.userId, users.id))
      .where(eq(timelineEvents.detectionId, detectionId))
      .orderBy(desc(timelineEvents.timestamp))

    return result
  } catch (error) {
    console.error(`Error fetching timeline for detection ${detectionId}:`, error)
    return []
  }
}

export async function addTimelineEvent(event: any) {
  try {
    const result = await db.insert(timelineEvents).values(event).returning()
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error adding timeline event:", error)
    return null
  }
}

// توابع مربوط به یادداشت‌ها
export async function getNotesByDetectionId(detectionId: string) {
  try {
    const result = await db
      .select({
        ...notes,
        userName: users.fullName,
      })
      .from(notes)
      .leftJoin(users, eq(notes.userId, users.id))
      .where(eq(notes.detectionId, detectionId))
      .orderBy(desc(notes.createdAt))

    return result
  } catch (error) {
    console.error(`Error fetching notes for detection ${detectionId}:`, error)
    return []
  }
}

export async function addNote(note: any) {
  try {
    const result = await db.insert(notes).values(note).returning()
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error adding note:", error)
    return null
  }
}

// توابع مربوط به تشخیص‌های مرتبط
export async function getRelatedDetections(detectionId: string) {
  try {
    const result = await db
      .select({
        ...relatedDetections,
        relatedDetection: detections,
      })
      .from(relatedDetections)
      .innerJoin(detections, eq(relatedDetections.relatedDetectionId, detections.id))
      .where(eq(relatedDetections.detectionId, detectionId))

    return result
  } catch (error) {
    console.error(`Error fetching related detections for ${detectionId}:`, error)
    return []
  }
}

export async function addRelatedDetection(relation: any) {
  try {
    const result = await db.insert(relatedDetections).values(relation).returning()
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error adding related detection:", error)
    return null
  }
}

// توابع مربوط به کاربران
export async function getUsers() {
  try {
    return await db.select().from(users).orderBy(users.fullName)
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export async function getUserById(id: string) {
  try {
    const result = await db.select().from(users).where(eq(users.id, id))
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error)
    return null
  }
}

// توابع مربوط به آمار
export async function getDetectionStats() {
  try {
    const result = await db.select().from(detectionStats)
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error fetching detection stats:", error)
    return null
  }
}

export async function updateDetectionStats() {
  try {
    // محاسبه آمار کلی
    const totalCount = await db.select().from(detections).count()
    const powerUsageCount = await db.select().from(detections).where(eq(detections.method, "مصرف برق")).count()
    const noiseCount = await db.select().from(detections).where(eq(detections.method, "نویز صوتی")).count()
    const rfCount = await db.select().from(detections).where(eq(detections.method, "سیگنال RF")).count()
    const networkCount = await db.select().from(detections).where(eq(detections.method, "ترافیک شبکه")).count()

    // محاسبه آمار بر اساس وضعیت
    const confirmedCount = await db.select().from(detections).where(eq(detections.status, "تایید شده")).count()
    const pendingCount = await db.select().from(detections).where(eq(detections.status, "در حال بررسی")).count()
    const rejectedCount = await db.select().from(detections).where(eq(detections.status, "رد شده")).count()

    // محاسبه آمار هفته گذشته
    const lastWeekStart = new Date()
    lastWeekStart.setDate(lastWeekStart.getDate() - 7)

    const lastWeekTotal = await db.select().from(detections).where(gte(detections.timestamp, lastWeekStart)).count()
    const lastWeekPowerUsage = await db
      .select()
      .from(detections)
      .where(and(eq(detections.method, "مصرف برق"), gte(detections.timestamp, lastWeekStart)))
      .count()
    const lastWeekNoise = await db
      .select()
      .from(detections)
      .where(and(eq(detections.method, "نویز صوتی"), gte(detections.timestamp, lastWeekStart)))
      .count()
    const lastWeekRf = await db
      .select()
      .from(detections)
      .where(and(eq(detections.method, "سیگنال RF"), gte(detections.timestamp, lastWeekStart)))
      .count()
    const lastWeekNetwork = await db
      .select()
      .from(detections)
      .where(and(eq(detections.method, "ترافیک شبکه"), gte(detections.timestamp, lastWeekStart)))
      .count()

    // به‌روزرسانی جدول آمار
    const result = await db
      .update(detectionStats)
      .set({
        totalCount: Number(totalCount[0].count),
        powerUsageCount: Number(powerUsageCount[0].count),
        noiseCount: Number(noiseCount[0].count),
        rfCount: Number(rfCount[0].count),
        networkCount: Number(networkCount[0].count),
        confirmedCount: Number(confirmedCount[0].count),
        pendingCount: Number(pendingCount[0].count),
        rejectedCount: Number(rejectedCount[0].count),
        lastWeekTotal: Number(lastWeekTotal[0].count),
        lastWeekPowerUsage: Number(lastWeekPowerUsage[0].count),
        lastWeekNoise: Number(lastWeekNoise[0].count),
        lastWeekRf: Number(lastWeekRf[0].count),
        lastWeekNetwork: Number(lastWeekNetwork[0].count),
        lastUpdated: new Date(),
      })
      .returning()

    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error updating detection stats:", error)
    return null
  }
}

// تابع جستجوی تشخیص‌ها
export async function searchDetections(query: string, filters: any = {}) {
  try {
    let dbQuery = db.select().from(detections)

    // اعمال فیلتر جستجو
    if (query) {
      dbQuery = dbQuery.where(
        or(
          like(detections.location, `%${query}%`),
          like(detections.method, `%${query}%`),
          like(detections.status, `%${query}%`),
        ),
      )
    }

    // اعمال فیلترهای دیگر
    if (filters.method) {
      dbQuery = dbQuery.where(eq(detections.method, filters.method))
    }

    if (filters.status) {
      dbQuery = dbQuery.where(eq(detections.status, filters.status))
    }

    if (filters.startDate) {
      dbQuery = dbQuery.where(gte(detections.timestamp, new Date(filters.startDate)))
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate)
      endDate.setDate(endDate.getDate() + 1) // تا پایان روز
      dbQuery = dbQuery.where(gte(detections.timestamp, endDate))
    }

    // مرتب‌سازی
    dbQuery = dbQuery.orderBy(desc(detections.timestamp))

    return await dbQuery
  } catch (error) {
    console.error("Error searching detections:", error)
    return []
  }
}
