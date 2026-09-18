import { motion } from "framer-motion";
import "./Right.css";

interface RightProps {
  active?: boolean;
}

export default function IntroRight({ active = false }: RightProps) {
  return (
    <section className={`intro-right ${active ? "is-active" : ""}`}>
      <div className="intro-page">

        {/* =====================================================
            TOP HEADER
        ===================================================== */}

        <motion.header
          className="intro-top"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="intro-top-left">
            <span className="intro-kicker">
              PROLOGUE
            </span>

            <span className="intro-rule" />
          </div>

          <div className="intro-top-right">
            <span>IDEAS</span>
            <span>INTO</span>
            <span>EXPERIENCES</span>
          </div>
        </motion.header>


        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <motion.main
          className="intro-main"
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
            delay: 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          <h1 className="intro-title">
            <span className="intro-title-main">
              Ideas take
            </span>

            <span className="intro-title-italic">
              different forms.
            </span>
          </h1>


          <div className="intro-divider" />


          <div className="intro-description">
            <p>
              Design. Code. Motion.
              <br />
              Systems. Details. Experiments.
            </p>

            <p>
              Some are shown.
              <br />
              Some reveal themselves.
            </p>
          </div>

        </motion.main>


        {/* =====================================================
            TURN THE PAGE
        ===================================================== */}

        <motion.div
          className="intro-turn"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.45,
            delay: 0.3,
          }}
        >
          <div className="intro-turn-label">
            <span>TURN</span>
            <span>THE PAGE</span>
          </div>

          <div className="intro-arrow">
            <span className="intro-arrow-line" />
            <span className="intro-arrow-head" />
          </div>
        </motion.div>


        {/* =====================================================
            BOTTOM NAVIGATION
        ===================================================== */}

        <motion.footer
          className="intro-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.45,
            delay: 0.38,
          }}
        >
          <span>WEB</span>
          <i>·</i>

          <span>FULL STACK</span>
          <i>·</i>

          <span>UI</span>
          <i>·</i>

          <span>3D</span>
          <i>·</i>

          <span>MOTION</span>
        </motion.footer>

      </div>
    </section>
  );
}