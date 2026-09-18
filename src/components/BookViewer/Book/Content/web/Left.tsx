import { motion } from "framer-motion";

import {
    SiHtml5,
    SiCss,
    SiJavascript,
    SiReact,
    SiAngular,
} from "react-icons/si";

import "./Left.css";


export default function WebLeft() {
    return (
        <section className="home-front">

            {/* =========================================
                HEADER
            ========================================= */}

            <motion.header
                className="front-header"
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

                <div className="front-number">
                    <span>01</span>
                    <i />
                </div>

                <div className="front-meta">
                    <span>IDEAS</span>
                    <b>·</b>
                    <span>DESIGN</span>
                    <b>·</b>
                    <span>DEVELOP</span>
                    <b>·</b>
                    <span>IMPACT</span>
                </div>

            </motion.header>



            {/* =========================================
                MAIN EDITORIAL CONTENT
            ========================================= */}

            <div className="front-content">

                <motion.div
                    className="front-eyebrow"
                    initial={{
                        opacity: 0,
                        y: 8,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.1,
                        duration: 0.5,
                    }}
                >
                    DIGITAL EXPERIENCES
                </motion.div>



                <motion.h1
                    className="front-title"
                    initial={{
                        opacity: 0,
                        y: 18,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.15,
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                >
                    Web Design &amp;
                    <br />
                    <em>Development</em>
                </motion.h1>



                <motion.div
                    className="front-divider"
                    initial={{
                        width: 0,
                        opacity: 0,
                    }}
                    animate={{
                        width: 46,
                        opacity: 1,
                    }}
                    transition={{
                        delay: 0.42,
                        duration: 0.45,
                    }}
                />



                <motion.p
                    className="front-description"
                    initial={{
                        opacity: 0,
                        y: 8,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.36,
                        duration: 0.55,
                    }}
                >
                    Crafting simple, meaningful
                    <br />
                    and scalable digital experiences
                    <br />
                    that make an impact.
                </motion.p>



                {/* =========================================
                    TECHNOLOGY INDEX
                ========================================= */}

                <motion.div
                    className="front-technologies"
                    initial={{
                        opacity: 0,
                        y: 12,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.48,
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                >

                    <article className="technology-card">

                        <div className="technology-icon">
                            <SiHtml5 />
                        </div>

                        <div className="technology-name">
                            HTML
                        </div>

                        <div className="technology-description">
                            Structure
                        </div>

                    </article>



                    <article className="technology-card">

                        <div className="technology-icon">
                            <SiCss />
                        </div>

                        <div className="technology-name">
                            CSS
                        </div>

                        <div className="technology-description">
                            Style
                        </div>

                    </article>



                    <article className="technology-card">

                        <div className="technology-icon">
                            <SiJavascript />
                        </div>

                        <div className="technology-name">
                            JavaScript
                        </div>

                        <div className="technology-description">
                            Interactivity
                        </div>

                    </article>



                    <article className="technology-card">

                        <div className="technology-icon">
                            <SiReact />
                        </div>

                        <div className="technology-name">
                            React
                        </div>

                        <div className="technology-description">
                            Modern UI
                        </div>

                    </article>



                    <article className="technology-card">

                        <div className="technology-icon">
                            <SiAngular />
                        </div>

                        <div className="technology-name">
                            Angular
                        </div>

                        <div className="technology-description">
                            Enterprise
                        </div>

                    </article>

                </motion.div>

            </div>



            {/* =========================================
                FOOTER
            ========================================= */}

            <motion.div
                className="front-footer"
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    delay: 0.65,
                    duration: 0.5,
                }}
            >
                <span>SIMPLE</span>
                <span>IDEAS.</span>
                <span>REAL IMPACT.</span>
            </motion.div>

        </section>
    );
}