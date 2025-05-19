import { NextResponse } from "next/server"
import { createUser, generateRandomPassword } from "@/lib/auth"
import nodemailer from "nodemailer"

// تنظیمات ارسال ایمیل
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "ایمیل الزامی است" }, { status: 400 })
    }

    // تولید رمز عبور تصادفی
    const randomPassword = generateRandomPassword()

    // ایجاد کاربر جدید
    const user = await createUser(email, randomPassword)

    // ارسال ایمیل تأییدیه به ادمین
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "erfanrajabee@gmail.com", // آدرس ایمیل ادمین جدید
      subject: "تأییدیه ثبت‌نام کاربر جدید در سامانه شکارچی برق",
      html: `
        <div dir="rtl" style="font-family: Tahoma, Arial; line-height: 1.6;">
          <h2>کاربر جدید در سامانه شکارچی برق ثبت‌نام کرده است</h2>
          <p><strong>ایمیل کاربر:</strong> ${email}</p>
          <p><strong>رمز عبور تولید شده:</strong> ${randomPassword}</p>
          <p>این کاربر می‌تواند با استفاده از ایمیل و رمز عبور فوق وارد سیستم شود.</p>
          <hr />
          <p>سامانه هوشمند شکارچی برق</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in signup:", error)
    return NextResponse.json({ error: "خطای سرور در ثبت‌نام" }, { status: 500 })
  }
}
