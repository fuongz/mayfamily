import { motion } from 'motion/react'
import React from 'react'

const itemVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    transition: { type: 'spring', bounce: 0.4 },
  },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', bounce: 0.4 } },
}

interface Props {
  children: React.ReactNode
  asChild?: React.ElementType
  as?: React.ElementType
  onClick?: () => void
}

function SimpleAnimatedItem({ children, asChild = 'div', onClick }: Props) {
  const MotionChild = React.useMemo(() => motion.create(asChild), [asChild])
  return React.Children.map(children, (child, index) => (
    <MotionChild key={index} variants={itemVariants} initial="hidden" animate="show" onClick={onClick} className="cursor-pointer">
      {child}
    </MotionChild>
  ))
}

export { SimpleAnimatedItem }
