import { motion } from "framer-motion";
import { createElement } from "react";
import "./Right.css";

interface RightProps {
  active?: boolean;
}

export default function Right({
  active = false,
}: RightProps) {
  return (
    <section className="motion-right">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="motion-right-glow" />

      <div className="motion-right-vignette" />


      {/* =====================================================
          TOP LEFT
      ====================================================== */}

      <motion.div
        className="motion-right-top-left"
        initial={{
          opacity: 0,
          y: -12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
      >
        <span>EXPLORE</span>
        <span>IDEAS</span>
        <span>IN 3D</span>

        <i />
      </motion.div>


      {/* =====================================================
          TOP RIGHT
      ====================================================== */}

      <motion.div
        className="motion-right-top-right"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          delay: 0.2,
        }}
      >
        {/* Editorial label */}
        <div className="motion-right-top-label">
          <span>INTERACTIVE</span>
          <span>EXPERIENCE</span>
        </div>

        {/* Divider */}
        <i />

        {/* Service number */}
        <span className="motion-right-number">
          08
        </span>
      </motion.div>


      {/* =====================================================
          SPLINE 3D
      ====================================================== */}

      {active && (
        <div className="spline-container">
          {createElement("spline-viewer", {
            url: "https://prod.spline.design/47jpVmRAF5W7Co-g/scene.splinecode",
            loading: "eager",
          })}
        </div>
      )}


      {/* =====================================================
          BOTTOM LEFT
      ====================================================== */}

      <motion.div
        className="motion-right-bottom-left"
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          delay: 0.45,
        }}
      >
        <i />

        <span>DRAG TO EXPLORE</span>
      </motion.div>


      {/* =====================================================
          BOTTOM RIGHT
      ====================================================== */}

      <motion.div
        className="motion-right-bottom-right"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.7,
          delay: 0.5,
        }}
      >
        <i />

        <div>
          <span>DESIGN</span>
          <span>TECHNOLOGY</span>
          <span>HUMANITY</span>
        </div>
      </motion.div>

    </section>
  );
}