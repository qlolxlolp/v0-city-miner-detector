import { db } from "./db"
import { users } from "./schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

// کلید رمزنگاری JWT
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

// تابع هش کردن رمز عبور
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

// تابع مقایسه رمز عبور
export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

// تابع ایجاد کاربر جدید
export async function createUser(email: string, password: string, fullName?: string) {
  const passwordHash = await hashPassword(password)

  try {
    const result = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        fullName,
        role: "user",
      })
      .returning()

    return result[0]
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

// تابع احراز هویت کاربر
export async function authenticateUser(email: string, password: string) {
  try {
    const result = await db.select().from(users).where(eq(users.email, email))

    if (result.length === 0) {
      return null
    }

    const user = result[0]
    const passwordMatch = await comparePasswords(password, user.passwordHash)

    if (!passwordMatch) {
      return null
    }

    return user
  } catch (error) {
    console.error("Error authenticating user:", error)
    throw error
  }
}

// تابع ایجاد توکن JWT
export async function createToken(user: any) {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)

  return token
}

// تابع تأیید توکن JWT
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

// تابع ذخیره توکن در کوکی
export function setAuthCookie(token: string) {
  cookies().set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
  })
}

// تابع حذف توکن از کوکی
export function removeAuthCookie() {
  cookies().delete("auth_token")
}

// تابع دریافت کاربر فعلی از توکن
export async function getCurrentUser(req?: NextRequest) {
  try {
    const token = req ? req.cookies.get("auth_token")?.value : cookies().get("auth_token")?.value

    if (!token) {
      return null
    }

    const payload = await verifyToken(token)

    if (!payload || !payload.id) {
      return null
    }

    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.id as string))

    if (result.length === 0) {
      return null
    }

    const user = result[0]
    delete user.passwordHash // حذف هش رمز عبور از نتیجه

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// تابع تولید رمز عبور تصادفی 8 رقمی
export function generateRandomPassword() {
  return Math.floor(10000000 + Math.random() * 90000000).toString()
}
