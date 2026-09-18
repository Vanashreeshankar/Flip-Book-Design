import { motion } from "framer-motion";
import "./Left.css";

const services = [
  {
    number: "01",
    title: "3D Modeling",
    description: "Clean geometry",
  },
  {
    number: "02",
    title: "Motion Design",
    description: "Smooth & subtle",
  },
  {
    number: "03",
    title: "Interactive",
    description: "Engaging visuals",
  },
  {
    number: "04",
    title: "Brand Focused",
    description: "Meaningful impact",
  },
];

export default function Left() {
  return (
    <section className="motion-left-page">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="motion-bg" aria-hidden="true">

        <div className="motion-wave motion-wave-1" />
        <div className="motion-wave motion-wave-2" />
        <div className="motion-wave motion-wave-3" />
        <div className="motion-wave motion-wave-4" />

        <svg
          className="motion-line motion-line-left"
          viewBox="0 0 300 900"
          preserveAspectRatio="none"
        >
          <path d="M-30 45 C115 145 100 285 48 405 C-5 530 20 680 155 780" />
        </svg>

        <svg
          className="motion-line motion-line-right"
          viewBox="0 0 500 700"
          preserveAspectRatio="none"
        >
          <path d="M510 70 C360 130 295 190 302 295 C310 410 175 490 78 630" />
        </svg>

      </div>


      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <motion.header
        className="motion-top-header"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.55,
          ease: "easeOut",
        }}
      >

        <div className="motion-page-number">
          07
        </div>

        <div className="motion-header-line" />

        <div className="motion-header-title">
          3D MOTION DESIGN
        </div>

        <div className="motion-header-right">
          <span>IDEAS</span>
          <span>IN MOTION</span>
          <span>REAL IMPACT</span>
        </div>

      </motion.header>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="motion-main">

        {/* EYEBROW */}

        <motion.div
          className="motion-eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.12,
            duration: 0.5,
          }}
        >
          THINK&nbsp; · &nbsp;MODEL&nbsp; · &nbsp;ANIMATE
        </motion.div>


        {/* HEADING */}

        <motion.h1
          className="motion-heading"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.18,
            duration: 0.65,
            ease: "easeOut",
          }}
        >

          <span className="motion-heading-main">
            3D Motion
          </span>

          <span className="motion-heading-accent">
            Design
          </span>

        </motion.h1>


        {/* DIVIDER */}

        <div className="motion-divider" />


        {/* DESCRIPTION */}

        <motion.p
          className="motion-description"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.28,
            duration: 0.55,
          }}
        >
          Turning ideas into immersive
          <br />
          3D experiences. Clean, minimal
          <br />
          and purposeful motion that
          <br />
          communicates clearly.
        </motion.p>


        {/* =================================================
            SERVICES
        ================================================= */}

        <div className="motion-services">

          {services.map((service, index) => (
            <motion.div
              className="motion-service"
              key={service.number}
              initial={{
                opacity: 0,
                x: -5,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.35 + index * 0.07,
                duration: 0.4,
                ease: "easeOut",
              }}
            >

              {/* NUMBER */}

              <div className="motion-service-number">
                {service.number}
              </div>


              {/* VERTICAL DIVIDER */}

              <div className="motion-service-divider" />


              {/* TITLE + DESCRIPTION */}

              <div className="motion-service-content">

                <div className="motion-service-title">
                  {service.title}
                </div>

                <div className="motion-service-description">
                  {service.description}
                </div>

              </div>

            </motion.div>
          ))}

        </div>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="motion-footer">

        <div className="motion-footer-left">
          <span>DESIGN</span>
          <span>ANIMATE</span>
          <span>VISUALIZE</span>
          <span>REPEAT</span>
        </div>


        <div className="motion-footer-right">

          <div className="motion-footer-line" />

          <span>FROM IDEAS</span>
          <span>TO IMMERSIVE</span>
          <span>REALITIES</span>

        </div>

      </footer>

    </section>
  );
}