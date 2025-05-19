"use client"

import { useState, useEffect, useRef } from "react"
import { format } from "date-fns-jalali"

export function DateTimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hourSoundRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // به‌روزرسانی زمان هر ثانیه
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      // بررسی شروع ساعت جدید
      if (now.getMinutes() === 0 && now.getSeconds() === 0) {
        playHourSound(now.getHours())
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // پخش صدای ساعت
  const playHourSound = (hour: number) => {
    if (isPlaying) return

    setIsPlaying(true)

    // ابتدا صدای اصلی ساعت را پخش می‌کنیم
    if (audioRef.current) {
      audioRef.current.play()

      // پس از پایان صدای اصلی، صدای تعداد ساعت را پخش می‌کنیم
      audioRef.current.onended = () => {
        playHourBeeps(hour % 12 || 12)
      }
    }
  }

  // پخش صدای بوق به تعداد ساعت
  const playHourBeeps = (count: number) => {
    let beepCount = 0

    const playNextBeep = () => {
      if (beepCount < count && hourSoundRef.current) {
        beepCount++
        hourSoundRef.current.play()

        hourSoundRef.current.onended = () => {
          // تأخیر کوتاه بین بوق‌ها
          setTimeout(playNextBeep, 300)
        }
      } else {
        setIsPlaying(false)
      }
    }

    playNextBeep()
  }

  // فرمت تاریخ شمسی
  const persianDate = format(currentTime, "yyyy/MM/dd")

  // فرمت زمان با میلی‌ثانیه
  const timeWithMilliseconds = `${currentTime.getHours().toString().padStart(2, "0")}:${currentTime.getMinutes().toString().padStart(2, "0")}:${currentTime.getSeconds().toString().padStart(2, "0")}.${currentTime.getMilliseconds().toString().padStart(3, "0")}`

  return (
    <div className="flex flex-col items-center justify-center bg-slate-800 text-white p-4 rounded-lg">
      <div className="text-2xl font-bold">{persianDate}</div>
      <div className="text-3xl font-mono">{timeWithMilliseconds}</div>

      {/* صدای اصلی ساعت */}
      <audio ref={audioRef} src="/sounds/hour-chime.mp3" preload="auto" />

      {/* صدای بوق ساعت */}
      <audio ref={hourSoundRef} src="/sounds/hour-beep.mp3" preload="auto" />
    </div>
  )
}
