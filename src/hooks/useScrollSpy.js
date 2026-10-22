import { useEffect, useState } from "react";

export const useScrollSpy = (sections = []) => {
  const [active, setActive] = useState(sections[0] || "home");

  useEffect(() => {
    const handleScroll = () => {
      const navigationBottom =
        document.querySelector("nav[aria-label='Main navigation']")?.getBoundingClientRect().bottom || 0;
      let current = sections[0];

      for (const section of sections) {
        const el = document.getElementById(section);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const scrollMarginTop =
          Number.parseFloat(window.getComputedStyle(el).scrollMarginTop) || 0;
        const activationLine = Math.max(navigationBottom + 8, scrollMarginTop + 8);
        if (rect.top > activationLine) break;
        current = section;
      }

      if (current) setActive(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [sections]);

  return active;
};
