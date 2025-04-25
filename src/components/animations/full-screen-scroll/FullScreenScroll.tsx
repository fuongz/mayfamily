'use client'

import React, { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export type FullScreenScrollProps = {
  children: React.ReactNode
  className?: string
  showDots?: boolean
  dotsPosition?: 'left' | 'right'
  dotsClassName?: string
  dotClassName?: string
  activeDotClassName?: string
  onSectionChange?: (index: number) => void
}

export function FullScreenScroll({ children, className, showDots = true, dotsPosition = 'right', dotsClassName, dotClassName, activeDotClassName, onSectionChange }: FullScreenScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState(0)
  const sections = React.Children.toArray(children)

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const sectionHeight = container.clientHeight
      const newActiveSection = Math.round(scrollTop / sectionHeight)

      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection)
        onSectionChange?.(newActiveSection)
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [activeSection, onSectionChange])

  // Handle dot navigation
  const scrollToSection = (index: number) => {
    const container = containerRef.current
    if (!container) return

    const sectionHeight = container.clientHeight
    container.scrollTo({
      top: index * sectionHeight,
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={containerRef} className={cn('w-full h-full overflow-y-auto snap-y snap-mandatory scroll-smooth', className)}>
        {sections.map((section, index) => (
          <div key={index} className="w-full h-full snap-start snap-always">
            {section}
          </div>
        ))}
      </div>

      {showDots && (
        <div className={cn('fixed top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 p-4', dotsPosition === 'right' ? 'right-4' : 'left-4', dotsClassName)}>
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-300',
                index === activeSection ? cn('bg-white scale-125', activeDotClassName) : cn('bg-white/50 hover:bg-white/75', dotClassName)
              )}
              aria-label={`Go to section ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FullScreenScroll
