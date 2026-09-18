import { motion } from "framer-motion";

import "./Left.css";

export default function FullStackLeft() {
  return (
    <section className="fs-left">

      {/* =====================================================
          CINEMATIC BLUE ATMOSPHERE
      ===================================================== */}

      <div className="fs-left-glow" />

      <div className="fs-left-beam" />

      <div className="fs-left-floor-glow" />


      {/* =====================================================
          3D IMAGE SPILL

          This is the SAME image used by the right page.

          Only the portion that belongs to the left side
          is visible here.

          This makes the stack visually continue through
          the center gutter instead of creating separate
          CSS cards.
      ===================================================== */}

      <motion.div
        className="fs-left-image-stage"
        initial={{
          opacity: 0,
          x: 12,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          x: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.9,
          delay: 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
        aria-hidden="true"
      >
        <img
          src="/img.png"
          alt=""
          className="fs-left-architecture-image"
          draggable={false}
        />
      </motion.div>


      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <motion.header
        className="fs-left-header"
        initial={{
          opacity: 0,
          y: -8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.55,
          ease: "easeOut",
        }}
      >

        <div className="fs-page-number">
          03
        </div>

        <div className="fs-header-line" />

        <div className="fs-section-name">
          FULLSTACK DEVELOPMENT
        </div>

      </motion.header>


      {/* =====================================================
          PROCESS
      ===================================================== */}

      <motion.div
        className="fs-process"
        initial={{
          opacity: 0,
          x: -8,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.12,
        }}
      >
        <span>PLAN</span>
        <span>BUILD</span>
        <span>INTEGRATE</span>
        <span>DEPLOY</span>
      </motion.div>


      {/* =====================================================
          MAIN TITLE
      ===================================================== */}

      <motion.div
        className="fs-left-title"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.75,
          delay: 0.12,
          ease: [0.22, 1, 0.36, 1],
        }}
      >

        <div className="fs-title-white">
          Full Stack
        </div>

        <div className="fs-title-blue">
          Development
        </div>

      </motion.div>


      {/* =====================================================
          TITLE DIVIDER
      ===================================================== */}

      <motion.div
        className="fs-title-divider"
        initial={{
          width: 0,
          opacity: 0,
        }}
        animate={{
          width: 40,
          opacity: 1,
        }}
        transition={{
          duration: 0.45,
          delay: 0.55,
        }}
      />


      {/* =====================================================
          TAGLINE
      ===================================================== */}

      <motion.div
        className="fs-tagline"
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.55,
          delay: 0.42,
        }}
      >
        <div>One stack.</div>
        <div>Endless possibilities.</div>
      </motion.div>


      {/* =====================================================
          BOTTOM STATEMENT
      ===================================================== */}

      <motion.div
        className="fs-bottom-copy"
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.58,
        }}
      >
        <span>SAME TECH.</span>
        <span>BIGGER IMPACT.</span>
      </motion.div>


      <motion.div
        className="fs-bottom-line"
        initial={{
          width: 0,
        }}
        animate={{
          width: 42,
        }}
        transition={{
          duration: 0.45,
          delay: 0.75,
        }}
      />

    </section>
  );
}