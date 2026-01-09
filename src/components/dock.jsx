import React, { useRef } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import { dockApps } from "#constants";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import useWindowStore from "#store/window";

const Dock = () => {
  const {openWindow, closeWindow, windows} = useWindowStore();
  const dockRef = useRef(null);

  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const icons = dock.querySelectorAll(".dock-icon img");

    const animateIcons = (mouseX) => {
      icons.forEach((icon) => {
        const rect = icon.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;

        const distance = Math.abs(mouseX - centerX);
        const intensity = Math.exp(-(distance ** 3) / 20000);

        gsap.to(icon, {
          scale: 1 + 0.25 * intensity,
          y: -15 * intensity,
          duration: 0.2,
          ease: "power1.out",
        });
      });
    };

    const handleMouseMove = (e) => {
      animateIcons(e.clientX);
    };

    const resetIcons = () => {
      icons.forEach((icon) => {
        gsap.to(icon, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power1.out",
        });
      });
    };

    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", resetIcons);

    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", resetIcons);
    };
  }, []);

  const toggleApp = (app) => {
    if (!app.canOpen) return;
    
    const window = windows[app.id];
    if (window.isOpen) {
      closeWindow(app.id);
    } else {
      openWindow(app.id);
    }

  };

  /*const toggleApp = (app) => {
    // 1. Log immediately to confirm the click happened
    console.log("toggleApp called with:", app); 

    if (!app.canOpen) {
        console.log("Cannot open this app, returning early.");
        return;
    }
    
    const window = windows[app.id];
    // ... rest of logic
    
    // Note: If 'windows' is React state, this log might show the OLD state 
    // because state updates are asynchronous.
    console.log("Windows state:", windows); 
};*/




  return (
    <section id="dock">
      <div ref={dockRef} className="dock-container">
        {dockApps.map(({ id, name, icon, canOpen}) => (
          <div key={id} className="relative flex justify-center">
            <button
              type="button"
              className="dock-icon"
              aria-label={name}
              data-tooltip-id="dock-tooltip"
              data-tooltip-content={name}
              data-tooltip-delay-show={150}
              disabled={!canOpen}
              onClick={() => toggleApp({id, canOpen})}
            >
              <img
                src={`./public/images/${icon}`}
                alt={name}
                loading="lazy"
                className={canOpen ? "" : "opacity-60"}
              />
            </button>
          </div>
        ))}

        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  );
};

export default Dock;
