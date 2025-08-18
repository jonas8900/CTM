'use client'

import { FiSun, FiMoon } from "react-icons/fi"
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from "next/image"
import Loading from "../loading/Loading"

export default function SwitchingThemes() {

  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Loading/>
    )
  }

  return (
    <button
      className="flex items-center cursor-pointer text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? (
        <>
          <FiSun />
          <span className="mx-2 text-m font-medium">Lightmode</span>
        </>
      ) : (
        <>
          <FiMoon />
          <span className="mx-2 text-m font-medium">Darkmode</span>
        </>
      )}
    </button>
  )
}
