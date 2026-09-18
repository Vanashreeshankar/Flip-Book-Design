import { motion } from "framer-motion";
import { useState } from "react";
import "./Right.css";

type TechType =
  | "frontend"
  | "backend"
  | "database"
  | "deploy";

type TechBlockProps = {
  className: string;
  items: string[];
  active: boolean;
  type: TechType;
};

function TechConnector({ type }: { type: TechType }) {
  /*
    FRONTEND:
    Simple horizontal connector to the right.

    BACKEND / DATABASE / DEPLOY:
    Continuous L-shaped connector:
      layer
        |
        |
        └──────── technologies
  */

  if (type === "frontend") {
    return (
      <svg
        className="fs-tech-connector-svg fs-tech-connector-frontend"
        viewBox="0 0 52 30"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 0 22 L 22 2 L 52 2"
          pathLength="1"
        />
      </svg>
    );
  }

  return (
    <svg
      className={`fs-tech-connector-svg fs-tech-connector-${type}`}
      viewBox="0 0 54 78"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 5 2 L 5 57 L 54 57"
        pathLength="1"
      />
    </svg>
  );
}


function TechBlock({
  className,
  items,
  active,
  type,
}: TechBlockProps) {
  return (
    <motion.div
      className={`fs-tech-block ${className} ${
        active ? "is-active" : ""
      }`}
      initial={false}
      animate={{
        opacity: active ? 1 : 0,
        x: active ? 0 : 7,
      }}
      transition={{
        duration: 0.22,
        ease: [0.22, 1, 0.36, 1],
      }}
      aria-hidden={!active}
    >

      <TechConnector type={type} />

      <div className="fs-tech-items">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

    </motion.div>
  );
}


type TechHotspotProps = {
  type: TechType;
  onEnter: (type: TechType) => void;
  onLeave: () => void;
};


function TechHotspot({
  type,
  onEnter,
  onLeave,
}: TechHotspotProps) {
  return (
    <div
      className={`fs-tech-hotspot fs-hotspot-${type}`}
      onMouseEnter={() => onEnter(type)}
      onMouseLeave={onLeave}
      aria-label={`Show ${type} technologies`}
    />
  );
}


export default function FullStackRight() {
  const [activeTech, setActiveTech] =
    useState<TechType | null>(null);

  return (
    <section className="fs-right">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="fs-light-glow" />

      <div className="fs-vertical-light" />

      <div className="fs-vertical-light-soft" />

      <div className="fs-grid" />


      {/* =====================================================
          MAIN ARCHITECTURE IMAGE

          !!! DO NOT CHANGE IMAGE GEOMETRY !!!
      ===================================================== */}

      <motion.div
        className="fs-image-stage"
        initial={{
          opacity: 0,
          scale: 0.96,
          x: 18,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          x: 0,
        }}
        transition={{
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <img
          src="/img.png"
          alt="Full Stack architecture"
          className="fs-architecture-image"
          draggable={false}
        />
      </motion.div>


      {/* =====================================================
          INVISIBLE HOVER AREAS
      ===================================================== */}

      <TechHotspot
        type="frontend"
        onEnter={setActiveTech}
        onLeave={() => setActiveTech(null)}
      />

      <TechHotspot
        type="backend"
        onEnter={setActiveTech}
        onLeave={() => setActiveTech(null)}
      />

      <TechHotspot
        type="database"
        onEnter={setActiveTech}
        onLeave={() => setActiveTech(null)}
      />

      <TechHotspot
        type="deploy"
        onEnter={setActiveTech}
        onLeave={() => setActiveTech(null)}
      />


      {/* =====================================================
          TOP RIGHT
      ===================================================== */}

      <div className="fs-right-heading">
        <span>MODERN</span>
        <span>SCALABLE</span>
        <span>REAL SOLUTIONS</span>

        <div className="fs-right-heading-line" />
      </div>


      {/* =====================================================
          FRONTEND

          Stays beside the frontend layer.
      ===================================================== */}

      <TechBlock
        type="frontend"
        className="fs-tech-frontend"
        active={activeTech === "frontend"}
        items={[
          "React",
          "Angular",
          "HTML / CSS",
          "JavaScript",
        ]}
      />


      {/* =====================================================
          BACKEND

          Technologies appear BELOW backend.
      ===================================================== */}

      <TechBlock
        type="backend"
        className="fs-tech-backend"
        active={activeTech === "backend"}
        items={[
          "Node.js",
          "Express.js",
          "APIs",
          "Authentication",
        ]}
      />


      {/* =====================================================
          DATABASE

          Technologies appear BELOW database.
      ===================================================== */}

      <TechBlock
        type="database"
        className="fs-tech-database"
        active={activeTech === "database"}
        items={[
          "MongoDB",
          "Cloud Storage",
        ]}
      />


      {/* =====================================================
          DEPLOY

          Technologies appear BELOW deploy.
      ===================================================== */}

      <TechBlock
        type="deploy"
        className="fs-tech-deploy"
        active={activeTech === "deploy"}
        items={[
          "Vercel",
          
        ]}
      />


      {/* =====================================================
          QUOTE
      ===================================================== */}

      <div className="fs-quote">

        <div className="fs-quote-mark">
          “
        </div>

        <div className="fs-quote-line" />

        <div className="fs-quote-text">
          <span>FROM IDEAS</span>
          <span>TO REAL SOLUTIONS</span>
        </div>

      </div>


      {/* =====================================================
          PAGE NUMBER
      ===================================================== */}

      <div className="fs-right-footer">

        <div className="fs-footer-line" />

        <span>04</span>

      </div>

    </section>
  );
}