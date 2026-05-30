import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function useCursor(container, amount, lag = 0.04) {
  useGSAP(() => {
    const el = container.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add("(hover: hover) and (pointer: fine)", () => {
      // Start centered
      gsap.set(el, { backgroundPosition: "50% 50%" });

      let currentX = 50;
      let currentY = 50;
      let targetX = 50;
      let targetY = 50;

      const move = (e) => {
        const xPerc = (e.clientX / window.innerWidth - 0.5) * amount;
        const yPerc = (e.clientY / window.innerHeight - 0.5) * amount;

        targetX = 50 - xPerc;
        targetY = 50 - yPerc;
      };

      const tick = () => {
        currentX += (targetX - currentX) * lag;
        currentY += (targetY - currentY) * lag;

        gsap.set(el, {
          backgroundPosition: `${currentX}% ${currentY}%`,
        });
      };

      window.addEventListener("mousemove", move);
      gsap.ticker.add(tick);

      // CLEANUP when media query no longer matches
      return () => {
        window.removeEventListener("mousemove", move);
        gsap.ticker.remove(tick);
        gsap.set(el, { backgroundPosition: "50% 50%" });
      };
    });

    return () => mm.revert();
  }, { scope: container, dependencies: [amount, lag] });
}
