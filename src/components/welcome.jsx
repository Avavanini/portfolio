import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const FONT_WEIGHTS = {
  title: { min: 400, max: 900, default: 400 },
  subtitle: { min: 100, max: 400, default: 100 },
};

const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <span
      key={i}
      className={`inline-block ${className}`}
      style={{ fontVariationSettings: `"wght" ${baseWeight}` }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

const Welcome = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useGSAP(() => {
    const setupEffect = (container, type) => {
      if (!container) return;

      const letters = container.querySelectorAll("span");
      const { min, max, default: base } = FONT_WEIGHTS[type];

      let letterMetrics = [];
      const updateMetrics = () => {
        const { left: containerLeft } = container.getBoundingClientRect();
        letterMetrics = Array.from(letters).map((letter) => {
          const rect = letter.getBoundingClientRect();
          return {
            el: letter,
            centerX: rect.left - containerLeft + rect.width / 2,
          };
        });
      };
      
      updateMetrics();
      window.addEventListener("resize", updateMetrics);

      const handleMouseMove = (e) => {
        const { left } = container.getBoundingClientRect();
        const mouseX = e.clientX - left;

        letterMetrics.forEach(({ el, centerX }) => {
          const distance = Math.abs(mouseX - centerX);
          const intensity = Math.exp(-(distance ** 2) / 2500); 

          gsap.quickSetter(el, "css")({
            fontVariationSettings: `"wght" ${min + (max - min) * intensity}`,
          });
        });
      };

      const handleMouseLeave = () => {
        letters.forEach((letter) => {
          gsap.to(letter, {
            fontVariationSettings: `"wght" ${base}`,
            duration: 0.5,
            ease: "power2.out",
          });
        });
      };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        window.removeEventListener("resize", updateMetrics);
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    };

    const cleanupTitle = setupEffect(titleRef.current, "title");
    const cleanupSubtitle = setupEffect(subtitleRef.current, "subtitle");

    return () => {
      if (cleanupTitle) cleanupTitle();
      if (cleanupSubtitle) cleanupSubtitle();
    };
  }, []); 

  return (
    <section id="welcome" className="p-10 w-full min-h-screen flex flex-col justify-center">
      
      <p ref={subtitleRef} className="block w-fit text-center"> 
        {renderText(
          "Hey, I'm Avani! Welcome to my",
          "text-3xl font-georama text-moss",
          100
        )}
      </p>

      <h1 ref={titleRef} className="mt-7 block w-fit text-center ">
        {renderText("Portfolio", "text-9xl font-georama text-earth", 400)}
      </h1>
    </section>
  );
};

export default Welcome;
