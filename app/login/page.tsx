"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSignup, setIsSignup] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn(email, password)
      if (!result.success) {
        setError("ایمیل یا رمز عبور اشتباه است")
      }
    } catch (err) {
      setError("خطا در ورود به سیستم")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await signUp(email)
      if (result.success) {
        setSuccess("درخواست ثبت‌نام شما با موفقیت ارسال شد. لطفاً منتظر تأیید ادمین باشید.")
        setEmail("")
      } else {
        setError("خطا در ثبت‌نام")
      }
    } catch (err) {
      setError("خطا در ثبت‌نام")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // اینجا می‌توانید کد بازیابی رمز عبور را پیاده‌سازی کنید
      setSuccess("ایمیل بازیابی رمز عبور ارسال شد. لطفاً صندوق ورودی خود را بررسی کنید.")
      setEmail("")
    } catch (err) {
      setError("خطا در ارسال ایمیل بازیابی رمز عبور")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // تولید اسپن‌ها برای انیمیشن
  const renderSpans = () => {
    const spans = []
    // ما ۹۴ اسپن داریم (بر اساس HTML ارائه شده)
    for (let i = 0; i < 94; i++) {
      spans.push(<span key={i} style={{ "--i": i } as React.CSSProperties}></span>)
    }
    return spans
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1f293a]">
      <style jsx global>{`
        .container {
          position: relative;
          width: 400px;
          height: 400px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          overflow: hidden;
        }

        .container span {
          position: absolute;
          left: 0;
          width: 32px;
          height: 6px;
          background: #2c4766;
          border-radius: 80px;
          transform-origin: 200px;
          transform: rotate(calc(var(--i) * (360deg / 50)));
          animation: blink 3s linear infinite;
          animation-delay: calc(var(--i) * (3s / 50));
        }

        @keyframes blink {
          100% {
            background: #0ef;
          }
          25% {
            background: #2c4766;
          }
        }

        .login-box {
          position: absolute;
          width: 80%;
          max-width: 300px;
          z-index: 1;
          padding: 20px;
          border-radius: 20px;
        }

        form {
          width: 100%;
          padding: 0 10px;
        }

        h2 {
          font-size: 1.8em;
          color: #2ef;
          text-align: center;
          margin-bottom: 10px;
        }

        .input-box {
          position: relative;
          margin: 15px 0;
        }

        input {
          width: 100%;
          height: 45px;
          background: transparent;
          border: 2px solid #2c4766;
          outline: none;
          border-radius: 100px;
          font-size: 1em;
          color: #fff;
          padding: 0 15px;
          transition: 1s ease;
        }

        input:focus {
          border-color: #0ef;
        }

        input[value]:not([value=""]) ~ label,
        input:focus ~ label {
          top: -10px;
          font-size: 0.8em;
          background: #1f293a;
          padding: 0 6px;
          color: #0ef;
        }

        label {
          position: absolute;
          top: 50%;
          left: 15px;
          transform: translateY(-50%);
          font-size: 1em;
          pointer-events: none;
          transition: 0.5s ease;
          color: #fff;
        }

        .forgot-pass {
          margin: -10px 0 10px;
          text-align: center;
        }

        .forgot-pass a {
          font-size: 0.85em;
          color: #fff;
          text-decoration: none;
        }

        .btn {
          width: 100%;
          height: 45px;
          background: #0ef;
          border: none;
          outline: none;
          border-radius: 40px;
          cursor: pointer;
          font-size: 1em;
          color: #1f293a;
          font-weight: 600;
        }

        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .signup-link {
          margin: 10px 0;
          text-align: center;
        }

        .signup-link a {
          font-size: 1em;
          color: #0ef;
          text-decoration: none;
          font-weight: 600;
        }

        .alert-box {
          margin: 10px 0;
          padding: 10px;
          border-radius: 10px;
          text-align: center;
          font-size: 0.9em;
        }

        .alert-error {
          background: rgba(220, 38, 38, 0.2);
          color: #ef4444;
          border: 1px solid #ef4444;
        }

        .alert-success {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid #22c55e;
        }
      `}</style>

      <div className="container">
        {mounted && renderSpans()}
        <div className="login-box">
          {!isSignup && !isForgotPassword ? (
            <>
              <h2>ورود به سامانه</h2>
              <form onSubmit={handleLogin}>
                <div className="input-box">
                  <input value={email} required type="email" onChange={(e) => setEmail(e.target.value)} />
                  <label>نام کاربری (ایمیل)</label>
                </div>
                <div className="input-box">
                  <input value={password} required type="password" onChange={(e) => setPassword(e.target.value)} />
                  <label>رمز عبور</label>
                </div>
                {error && (
                  <div className="alert-box alert-error">
                    <AlertCircle className="inline-block h-4 w-4 ml-1" />
                    {error}
                  </div>
                )}
                <div className="forgot-pass">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsForgotPassword(true)
                    }}
                  >
                    رمز عبور را فراموش کرده اید؟ (کلیک کنید)
                  </a>
                </div>
                <button className="btn" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="inline-block ml-2 h-4 w-4 animate-spin" />
                      در حال ورود...
                    </>
                  ) : (
                    "تایید"
                  )}
                </button>
                <div className="signup-link">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsSignup(true)
                    }}
                  >
                    ثبت درخواست عضویت کاشف
                  </a>
                </div>
              </form>
            </>
          ) : isSignup ? (
            <>
              <h2>ثبت درخواست عضویت</h2>
              <form onSubmit={handleSignup}>
                <div className="input-box">
                  <input value={email} required type="email" onChange={(e) => setEmail(e.target.value)} />
                  <label>ایمیل</label>
                </div>
                {error && (
                  <div className="alert-box alert-error">
                    <AlertCircle className="inline-block h-4 w-4 ml-1" />
                    {error}
                  </div>
                )}
                {success && <div className="alert-box alert-success">{success}</div>}
                <button className="btn" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="inline-block ml-2 h-4 w-4 animate-spin" />
                      در حال ثبت‌نام...
                    </>
                  ) : (
                    "ثبت درخواست"
                  )}
                </button>
                <div className="signup-link">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsSignup(false)
                    }}
                  >
                    بازگشت به صفحه ورود
                  </a>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2>بازیابی رمز عبور</h2>
              <form onSubmit={handleForgotPassword}>
                <div className="input-box">
                  <input value={email} required type="email" onChange={(e) => setEmail(e.target.value)} />
                  <label>ایمیل</label>
                </div>
                {error && (
                  <div className="alert-box alert-error">
                    <AlertCircle className="inline-block h-4 w-4 ml-1" />
                    {error}
                  </div>
                )}
                {success && <div className="alert-box alert-success">{success}</div>}
                <button className="btn" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="inline-block ml-2 h-4 w-4 animate-spin" />
                      در حال ارسال...
                    </>
                  ) : (
                    "ارسال لینک بازیابی"
                  )}
                </button>
                <div className="signup-link">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsForgotPassword(false)
                    }}
                  >
                    بازگشت به صفحه ورود
                  </a>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
