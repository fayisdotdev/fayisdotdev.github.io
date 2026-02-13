import { useEffect, useState } from "react";

export const useScrollSpy = (sections = []) => {
  const [active, setActive] = useState(sections[0] || "home");

  useEffect(() => {
    const handleScroll = () => {
      const current = sections.find((section) => {
        const el = document.getElementById(section);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      if (current) setActive(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return active;
};
