import { motion, type Variants } from "framer-motion";

import {
  FiFeather,
  FiGrid,
  FiSmartphone,
  FiBarChart2,
} from "react-icons/fi";

import DoodleReveal from "./DoodleReveal";

import "./Right.css";


/* =========================================================
   FEATURE DATA
   ========================================================= */

const features = [
  {
    icon: FiFeather,
    title: "User First",
    description: (
      <>
        Designs that understand
        <br />
        real needs.
      </>
    ),
  },

  {
    icon: FiGrid,
    title: "Clean Aesthetics",
    description: (
      <>
        Simple, modern
        <br />
        and distraction-free.
      </>
    ),
  },

  {
    icon: FiSmartphone,
    title: "Consistent Systems",
    description: (
      <>
        UI that scales
        <br />
        seamlessly.
      </>
    ),
  },

  {
    icon: FiBarChart2,
    title: "Real Impact",
    description: (
      <>
        Better experiences.
        <br />
        Brighter tomorrows.
      </>
    ),
  },
];


/* =========================================================
   ANIMATIONS
   ========================================================= */

const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};


const phoneAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
    scale: 0.985,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.85,
      delay: 0.04,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};


const featureAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 7,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};


const featureContainer: Variants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};


/* =========================================================
   RIGHT PAGE
   ========================================================= */

export default function UiRight() {
  return (
    <DoodleReveal>
      <div className="ui-mag-page ui-mag-right">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <motion.header
          className="ui-mag-right-top"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="ui-mag-right-section">
            <span>DESIGN</span>
            <span>FOR A BRIGHTER</span>
            <span>TOMORROW</span>
          </div>

          <div className="ui-mag-right-page-number">
            <i />
            <span>06</span>
          </div>
        </motion.header>


        {/* =====================================================
            LONG EDITORIAL DIVIDER
        ===================================================== */}

        <motion.div
          className="ui-mag-editorial-divider"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.7,
            delay: 0.18,
          }}
        />


        {/* =====================================================
            ORGANIC PEACH SHAPE
        ===================================================== */}

        <motion.div
          className="ui-mag-phone-backdrop"
          initial={{
            opacity: 0,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
        />


        {/* =====================================================
            PHONE
        ===================================================== */}

        <motion.div
          className="ui-mag-phone-wrap"
          initial="hidden"
          animate="visible"
          variants={phoneAnimation}
        >
          <img
            src="/mobile.png"
            alt="Mobile UI design"
            className="ui-mag-phone"
            draggable={false}
          />
        </motion.div>


        {/* =====================================================
            FEATURES
        ===================================================== */}

        <motion.section
          className="ui-mag-features"
          initial="hidden"
          animate="visible"
          variants={featureContainer}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                className={
                  index === 0
                    ? "ui-mag-feature ui-mag-feature-first"
                    : "ui-mag-feature"
                }
                variants={featureAnimation}
              >
                <div className="ui-mag-feature-icon">
                  <Icon />
                </div>

                <div className="ui-mag-feature-content">
                  <h3>
                    {feature.title}
                  </h3>

                  <p>
                    {feature.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </motion.section>


        {/* =====================================================
            QUOTE
        ===================================================== */}

        <motion.div
          className="ui-mag-quote"
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="ui-mag-quote-line" />

          <blockquote>
            “Small design
            <br />
            choices create
            <br />
            big changes.”
          </blockquote>
        </motion.div>

      </div>
    </DoodleReveal>
  );
}