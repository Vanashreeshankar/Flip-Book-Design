import { motion } from "framer-motion";

import DoodleReveal from "./DoodleReveal";

import "./Left.css";

export default function UiLeft() {
  return (
    <DoodleReveal>
      <section className="ui-left">

        {/* =====================================================
            TOP HEADER
        ===================================================== */}

        <motion.header
          className="ui-left-header"
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
          <div className="ui-page-number">
            05
          </div>

          <div className="ui-header-line" />

          <div className="ui-section-name">
            UI DESIGN
          </div>
        </motion.header>


        {/* =====================================================
            TOP RIGHT LABEL
        ===================================================== */}

        <motion.div
          className="ui-left-top-label"
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
            delay: 0.08,
          }}
        >
          <span>IDEAS</span>
          <span>INTO</span>
          <span>INTERFACES</span>
        </motion.div>


        {/* =====================================================
            MAIN TITLE
        ===================================================== */}

        <motion.div
          className="ui-left-title"
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
          <div>Interfaces</div>
          <div>that feel</div>

          <div className="ui-title-accent">
            human.
          </div>
        </motion.div>


        {/* =====================================================
            TITLE DIVIDER
        ===================================================== */}

        <motion.div
          className="ui-title-divider"
          initial={{
            width: 0,
            opacity: 0,
          }}
          animate={{
            width: "5.2cqw",
            opacity: 1,
          }}
          transition={{
            duration: 0.45,
            delay: 0.55,
          }}
        />


        {/* =====================================================
            DESCRIPTION
        ===================================================== */}

        <motion.div
          className="ui-left-description"
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
          <div>Thoughtful UI design</div>
          <div>for real people and</div>
          <div>real moments.</div>
        </motion.div>


        {/* =====================================================
            COMPLETE STILL-LIFE IMAGE

            IMPORTANT:
            Do not build the arch / block / light using CSS.
            The supplied image remains visually intact.
        ===================================================== */}

        <motion.div
          className="ui-left-image"
          initial={{
            opacity: 0,
            scale: 0.985,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.9,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <img
            src="/vase.png"
            alt=""
            className="ui-left-image-file"
            draggable={false}
          />
        </motion.div>


        {/* =====================================================
            IMAGE SIDE MESSAGE
        ===================================================== */}

        <motion.div
          className="ui-visual-message"
          initial={{
            opacity: 0,
            x: 8,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.55,
            delay: 0.32,
          }}
        >
          <div className="ui-visual-message-text">
            <span>GOOD</span>
            <span>UI TURNS</span>
            <span>IDEAS INTO</span>
            <span>IMPACT.</span>
          </div>

          <div className="ui-visual-message-line" />
        </motion.div>


        {/* =====================================================
            BOTTOM KEYWORDS
        ===================================================== */}

        <motion.div
          className="ui-keywords"
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
          <span>SIMPLE</span>
          <span>USABLE</span>
          <span>BEAUTIFUL</span>
          <span>MEANINGFUL</span>
        </motion.div>

      </section>
    </DoodleReveal>
  );
}