import React,{ useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { ChevronDown, Award, Users, Target } from "lucide-react"

const teamMembers = [
    { name: "John Doe", role: "Founder & CEO", joinDate: "2020-01-01" },
    { name: "Jane Smith", role: "CTO", joinDate: "2020-03-15" },
    { name: "Mike Johnson", role: "Lead Designer", joinDate: "2021-02-01" },
]

const values = [
    {
        icon: <Target className="size-6" />,
        title: "Innovation",
        description: "We constantly push boundaries and explore new possibilities.",
    },
    {
        icon: <Users className="size-6" />,
        title: "Collaboration",
        description: "We believe great ideas emerge from diverse perspectives working together.",
    },
    {
        icon: <Award className="size-6" />,
        title: "Excellence",
        description: "We strive for the highest quality in everything we create.",
    },
]

const milestones = [
    { year: "2020", title: "Company Founded", description: "Our journey began with a small team and big dreams." },
    { year: "2021", title: "First Major Product", description: "Launched our flagship product to critical acclaim." },
    { year: "2022", title: "International Expansion", description: "Opened offices in three new countries." },
    { year: "2023", title: "Award Recognition", description: "Received industry awards for design and innovation." },
]

const stats = [
    { value: "15+", label: "Team Members" },
    { value: "3", label: "Global Offices" },
    { value: "25k+", label: "Happy Users" },
    { value: "99%", label: "Customer Satisfaction" },
]

export default function About() {
    // Refs for scroll animations
    const heroRef = useRef(null)
    const teamRef = useRef(null)
    const valuesRef = useRef(null)
    const timelineRef = useRef(null)
    const statsRef = useRef(null)

    // Check if sections are in view
    const heroInView = useInView(heroRef, { once: false, amount: 0.3 })
    const teamInView = useInView(teamRef, { once: false, amount: 0.2 })
    const valuesInView = useInView(valuesRef, { once: false, amount: 0.2 })
    const timelineInView = useInView(timelineRef, { once: false, amount: 0.2 })
    const statsInView = useInView(statsRef, { once: false, amount: 0.2 })

    // Scroll progress for parallax effects
    const { scrollYProgress } = useScroll()
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
    }

    return (
        <div className="relative w-full bg-zinc-50 text-zinc-900 overflow-hidden">
            {/* Background decoration */}
            <motion.div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ y: backgroundY }}>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_800px_at_100%_200px,#000,transparent)]"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_800px_at_0%_80%,#000,transparent)]"></div>
            </motion.div>

            {/* Hero section */}
            <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center px-6 py-24">
                <div className="max-w-4xl mx-auto text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 30 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                            We build <span className="text-zinc-500">experiences</span> that matter
                        </h1>
                        <p className="text-xl text-zinc-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Modern Products App was founded with a vision to create clean, efficient, and user-friendly applications.
                            Our mission is to simplify complex processes and deliver intuitive solutions.
                        </p>

                        <motion.div
                            className="flex justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                        >
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
                            >
                                <ChevronDown className="size-8 text-zinc-400" />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Team section */}
            <section ref={teamRef} className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={teamInView ? "visible" : "hidden"}
                        className="mb-16 text-center"
                    >
                        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                            Meet our team
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-lg text-zinc-600 max-w-2xl mx-auto">
                            A passionate group of individuals dedicated to creating exceptional products and experiences.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={teamInView ? "visible" : "hidden"}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
                    >
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="group"
                            >
                                <div className="relative overflow-hidden rounded-2xl bg-zinc-100 aspect-square mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 group-hover:scale-105 transition-transform duration-500"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-5xl font-bold text-zinc-400 opacity-50">{member.name.charAt(0)}</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                                <p className="text-zinc-500 mb-2">{member.role}</p>
                                <p className="text-sm text-zinc-400">
                                    Joined {new Date(member.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Values section */}
            <section ref={valuesRef} className="py-24 px-6 bg-zinc-100">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={valuesInView ? "visible" : "hidden"}
                        className="mb-16 text-center"
                    >
                        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                            Our core values
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-lg text-zinc-600 max-w-2xl mx-auto">
                            The principles that guide our decisions and shape our culture.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={valuesInView ? "visible" : "hidden"}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.03 }}
                                className="bg-white p-8 rounded-2xl shadow-sm"
                            >
                                <div className="mb-4 text-zinc-700">{value.icon}</div>
                                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                                <p className="text-zinc-600">{value.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Timeline section */}
            <section ref={timelineRef} className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={timelineInView ? "visible" : "hidden"}
                        className="mb-16 text-center"
                    >
                        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                            Our journey
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-lg text-zinc-600 max-w-2xl mx-auto">
                            Key milestones that have shaped our growth and evolution.
                        </motion.p>
                    </motion.div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-zinc-200 transform md:translate-x-[-0.5px]"></div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate={timelineInView ? "visible" : "hidden"}
                            className="space-y-12 relative"
                        >
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className={`flex flex-col md:flex-row gap-8 md:gap-0 ${
                                        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                    }`}
                                >
                                    <div className="md:w-1/2 flex md:justify-end md:pr-12">
                                        <div className={`text-left ${index % 2 === 1 ? "md:text-left" : "md:text-right"}`}>
                                            <div className="text-sm font-semibold text-zinc-400 mb-1">{milestone.year}</div>
                                            <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                                            <p className="text-zinc-600">{milestone.description}</p>
                                        </div>
                                    </div>

                                    <div className="absolute left-0 md:left-1/2 transform md:translate-x-[-50%]">
                                        <div className="w-4 h-4 rounded-full bg-zinc-700 border-4 border-zinc-100"></div>
                                    </div>

                                    <div className="md:w-1/2 md:pl-12">
                                        {index % 2 === 0 ? null : (
                                            <div className="hidden md:block">
                                                <div className="text-sm font-semibold text-zinc-400 mb-1">{milestone.year}</div>
                                                <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                                                <p className="text-zinc-600">{milestone.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats section */}
            <section ref={statsRef} className="py-24 px-6 bg-zinc-900 text-white">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={statsInView ? "visible" : "hidden"}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {stats.map((stat, index) => (
                            <motion.div key={index} variants={itemVariants} className="text-center">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={statsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="text-4xl md:text-5xl font-bold mb-2"
                                >
                                    {stat.value}
                                </motion.div>
                                <p className="text-zinc-400">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA section */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Ready to get started?</h2>
                        <p className="text-lg text-zinc-600 mb-8 max-w-2xl mx-auto">
                            Join us on our mission to create exceptional digital experiences that make a difference.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-3 bg-zinc-900 text-white rounded-full font-medium"
                        >
                            Contact Us
                        </motion.button>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

