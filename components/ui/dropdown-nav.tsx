"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  items?: MenuItem[]
}

interface DropdownNavProps {
  items: MenuItem[]
  className?: string
}

export function DropdownNav({ items, className }: DropdownNavProps) {
  return (
    <nav className={cn("dropdown-nav bg-white rounded-md shadow-md p-2", className)}>
      <ul className="space-y-1">
        {items.map((item) => (
          <MenuItemComponent key={item.id} item={item} level={0} />
        ))}
      </ul>
    </nav>
  )
}

interface MenuItemComponentProps {
  item: MenuItem
  level: number
}

function MenuItemComponent({ item, level }: MenuItemComponentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = item.items && item.items.length > 0

  const handleMouseEnter = () => {
    if (hasChildren) {
      setIsOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (hasChildren) {
      setIsOpen(false)
    }
  }

  const handleClick = () => {
    if (item.onClick) {
      item.onClick()
    }
    if (hasChildren) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <li
      className={cn("relative", level === 0 ? "" : "w-full")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn(
          "flex items-center justify-between px-4 py-2 text-sm rounded-md cursor-pointer transition-colors",
          "hover:bg-slate-100",
          level === 0 ? "font-medium" : "",
        )}
        onClick={handleClick}
      >
        <div className="flex items-center gap-2">
          {item.icon && <span className="text-slate-500">{item.icon}</span>}
          <span>{item.label}</span>
        </div>
        {hasChildren && (
          <span className="text-slate-500">
            {level === 0 ? <ChevronDown className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </span>
        )}
      </div>

      {hasChildren && isOpen && (
        <ul
          className={cn(
            "z-50 bg-white rounded-md shadow-md overflow-hidden transition-all duration-200",
            level === 0
              ? "absolute top-full right-0 min-w-[200px] mt-1"
              : "relative border-r border-slate-200 mr-2 pr-2 mt-1",
          )}
        >
          {item.items.map((child) => (
            <MenuItemComponent key={child.id} item={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}
