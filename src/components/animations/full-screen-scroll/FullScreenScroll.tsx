"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import styles from "./FullScreenScroll.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type Props = {
  children: React.ReactNode;
  className?: string;
};

export function FullScreenScroll({ children, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sections = React.Children.toArray(children);

  useEffect(() => {
    ScrollTrigger.defaults({
      toggleActions: "restart pause resume pause",
      scroller: containerRef.current,
    });
  }, []);

  return (
    <div className="relative z-10">
      <div ref={containerRef} className={`${cn(className)} ${styles.wrapper}`}>
        {sections.map((section, index) => (
          <div key={index} className={styles.panel}>
            {section}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FullScreenScroll;
