import React, { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import styles from './FullScreenScrolling.module.css'
import { Text, Title } from '@mantine/core'

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

function FullScreenScrolling() {
  const container = useRef<HTMLDivElement | null>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const totalSections = 7

  // Handle full page scroll
  const handleScroll = (direction: string) => {
    if (isScrolling) return

    const nextSection = direction === 'down' ? Math.min(currentSection + 1, totalSections - 1) : Math.max(currentSection - 1, 0)

    if (nextSection !== currentSection) {
      setIsScrolling(true)

      // Scroll to the next section with animation
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: `#section-${nextSection}`, autoKill: false },
        ease: 'power2.inOut',
        onComplete: () => {
          setCurrentSection(nextSection)
          setIsScrolling(false)
        },
      })
    }
  }

  // Handle wheel events
  useEffect(() => {
    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault()
      const direction = e.deltaY > 0 ? 'down' : 'up'
      handleScroll(direction)
    }

    // Handle touch events for mobile
    let touchStartY = 0
    const touchStartHandler = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const touchEndHandler = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const direction = touchStartY > touchEndY ? 'down' : 'up'

      // Only trigger if the swipe is long enough
      if (Math.abs(touchStartY - touchEndY) > 50) {
        handleScroll(direction)
      }
    }

    // Add event listeners
    window.addEventListener('wheel', wheelHandler, { passive: false })
    window.addEventListener('touchstart', touchStartHandler)
    window.addEventListener('touchend', touchEndHandler)

    // Clean up
    return () => {
      window.removeEventListener('wheel', wheelHandler)
      window.removeEventListener('touchstart', touchStartHandler)
      window.removeEventListener('touchend', touchEndHandler)
    }
  }, [currentSection, isScrolling])

  // Handle keyboard navigation
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        handleScroll('down')
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        handleScroll('up')
      }
    }

    window.addEventListener('keydown', keyHandler)
    return () => window.removeEventListener('keydown', keyHandler)
  }, [currentSection, isScrolling])

  // GSAP animations
  useGSAP(
    () => {
      const sections: Array<HTMLElement> = gsap.utils.toArray('.panel')

      sections.forEach((section) => {
        // Add animation for content
        gsap.fromTo(
          section.querySelector('.content'),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            scrollTrigger: {
              trigger: section,
              start: 'top center',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    },
    { scope: container }
  )

  // Navigation dots component
  // const NavigationDots = () => {
  //   return (
  //     <div className={styles['navigation-dots']}>
  //       {Array.from({ length: totalSections }, (_, i) => (
  //         <div
  //           key={i}
  //           className={`${styles.dot} ${currentSection === i ? 'active' : ''}`}
  //           onClick={() => {
  //             if (!isScrolling) {
  //               setIsScrolling(true)
  //               gsap.to(window, {
  //                 duration: 1,
  //                 scrollTo: { y: `#section-${i}`, autoKill: false },
  //                 ease: 'power2.inOut',
  //                 onComplete: () => {
  //                   setCurrentSection(i)
  //                   setIsScrolling(false)
  //                 },
  //               })
  //             }
  //           }}
  //         />
  //       ))}
  //     </div>
  //   )
  // }

  return (
    <div className="container overflow-hidden" ref={container}>
      <section id="section-0" className={`${styles.panel} panel1`}>
        <div className="content">
          <Text c="wedding-red.9" ff="var(--font-title)" fz={{ base: 36, sm: 64 }} mb={8}>
            LỄ VU QUY
          </Text>
          <Title c="wedding-red.9" fz={{ base: 68, sm: 128 }}>
            Hồng Trinh
          </Title>
          <Title c="wedding-red.9" fz={{ base: 68, sm: 128 }}>
            &
          </Title>
          <Title c="wedding-red.9" fz={{ base: 68, sm: 128 }}>
            Thế Phương
          </Title>
        </div>
      </section>

      {/* <section id="section-1" className={`${styles.panel} panel2`}>
        <div className="content">
          <h1>Section 2</h1>
          <p>Each scroll event moves exactly one full page</p>
        </div>
      </section>

      <section id="section-2" className={`${styles.panel} panel3`}>
        <div className="content">
          <h1>Section 3</h1>
          <p>Smooth transitions between sections</p>
        </div>
      </section>

      <section id="section-3" className={`${styles.panel} panel4`}>
        <div className="content">
          <h1>Section 4</h1>
          <p>The end of our full page scrolling example</p>
        </div>
      </section>

      <section id="section-4" className={`${styles.panel} panel5`}>
        <div className="content">
          <h1>Section 4</h1>
          <p>The end of our full page scrolling example</p>
        </div>
      </section>

      <section id="section-5" className={`${styles.panel} panel6`}>
        <div className="content">
          <h1>Section 4</h1>
          <p>The end of our full page scrolling example</p>
        </div>
      </section>

      <section id="section-6" className={`${styles.panel} panel7`}>
        <div className="content">
          <h1>Section 4</h1>
          <p>The end of our full page scrolling example</p>
        </div>
      </section> */}

      {/* <NavigationDots /> */}
    </div>
  )
}

export { FullScreenScrolling }
