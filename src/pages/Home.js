import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Shield, Smile, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Filler,
} from "chart.js";
import { Doughnut, Line, Bar, Radar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Filler
);

// Features data
const features = [
  {
    icon: <Zap className="text-gray-900" size={28} />,
    title: "Lightning Fast",
    description: "Optimized architecture delivering 2x faster performance than industry standard solutions.",
  },
  {
    icon: <Shield className="text-gray-900" size={28} />,
    title: "Enterprise Security",
    description: "SOC 2 compliant with end-to-end encryption and advanced threat protection systems.",
  },
  {
    icon: <Smile className="text-gray-900" size={28} />,
    title: "Intuitive Interface",
    description: "User-centric design with 97% positive feedback from usability testing sessions.",
  },
];

// Testimonials data
const testimonials = [
  {
    quote: "Simpplr transformed our procurement process, reducing time-to-purchase by 68% in the first quarter.",
    author: "Sarah Johnson",
    position: "CPO at TechGlobal Inc.",
    company: "TechGlobal",
  },
  {
    quote: "The analytics dashboard alone justified our investment. We've identified $2.3M in savings opportunities.",
    author: "Michael Chen",
    position: "Director of Operations",
    company: "Nexus Industries",
  },
  {
    quote: "Implementation was seamless. Their support team set the gold standard for enterprise software onboarding.",
    author: "Priya Sharma",
    position: "CIO",
    company: "Meridian Group",
  },
];

// Case studies data
const caseStudies = [
  {
    title: "Manufacturing Efficiency",
    company: "Industrial Dynamics",
    metric: "43%",
    description: "Reduction in procurement cycle time",
    tags: ["Manufacturing", "Procurement", "Efficiency"],
  },
  {
    title: "Healthcare Supply Chain",
    company: "MediCorp Systems",
    metric: "$4.2M",
    description: "Annual savings through vendor consolidation",
    tags: ["Healthcare", "Supply Chain", "Cost Reduction"],
  },
  {
    title: "Tech Sector Scaling",
    company: "Horizon Software",
    metric: "5x",
    description: "Supplier network growth in 12 months",
    tags: ["Technology", "Scaling", "Network Growth"],
  },
];

// FAQ data
const faqs = [
  {
    question: "How quickly can we implement Simpplr in our existing workflow?",
    answer:
      "Most clients achieve full implementation within 2-4 weeks. Our dedicated onboarding team works directly with your stakeholders to ensure a smooth transition with minimal disruption to your operations.",
  },
  {
    question: "What integration capabilities does the platform offer?",
    answer:
      "Simpplr offers native integrations with major ERP systems (SAP, Oracle, Microsoft), CRM platforms (Salesforce, HubSpot), and financial software (QuickBooks, Xero). We also provide a robust API for custom integrations with your proprietary systems.",
  },
  {
    question: "How does your pricing model work?",
    answer:
      "We offer tiered subscription plans based on user count and feature requirements. All plans include core functionality, with enterprise features available at higher tiers. Custom pricing is available for organizations with specific needs.",
  },
  {
    question: "What security certifications does Simpplr maintain?",
    answer:
      "Simpplr maintains SOC 2 Type II, ISO 27001, and GDPR compliance. We undergo regular third-party security audits and penetration testing to ensure the highest standards of data protection.",
  },
];

// Generate more comprehensive chart data
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const quarters = ["Q1", "Q2", "Q3", "Q4"];

// Line chart data with multiple datasets
const generateLineData = (timeframe) => {
  const labels = timeframe === "monthly" ? months : quarters;

  return {
    labels,
    datasets: [
      {
        label: "User Growth",
        data: labels.map(() => faker.number.int({ min: 1000, max: 5000 })),
        borderColor: "rgb(0, 0, 0)",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Transaction Volume",
        data: labels.map(() => faker.number.int({ min: 500, max: 3000 })),
        borderColor: "rgb(75, 75, 75)",
        backgroundColor: "rgba(75, 75, 75, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };
};

// Bar chart data
const generateBarData = (year) => {
  return {
    labels: ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East"],
    datasets: [
      {
        label: `${year} Revenue`,
        data: [
          faker.number.int({ min: 2000, max: 5000 }),
          faker.number.int({ min: 1500, max: 4000 }),
          faker.number.int({ min: 1000, max: 3500 }),
          faker.number.int({ min: 500, max: 2000 }),
          faker.number.int({ min: 300, max: 1500 }),
        ],
        backgroundColor: "rgba(0, 0, 0, 0.8)",
      },
      {
        label: `${year - 1} Revenue`,
        data: [
          faker.number.int({ min: 1500, max: 4000 }),
          faker.number.int({ min: 1000, max: 3000 }),
          faker.number.int({ min: 800, max: 2500 }),
          faker.number.int({ min: 400, max: 1500 }),
          faker.number.int({ min: 200, max: 1000 }),
        ],
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      },
    ],
  };
};

// Radar chart data
const radarData = {
  labels: ["Speed", "Security", "Usability", "Integration", "Scalability", "Support"],
  datasets: [
    {
      label: "Simpplr",
      data: [90, 95, 88, 92, 85, 90],
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      borderColor: "rgba(0, 0, 0, 0.8)",
      borderWidth: 2,
    },
    {
      label: "Industry Average",
      data: [70, 65, 60, 68, 72, 65],
      backgroundColor: "rgba(75, 75, 75, 0.2)",
      borderColor: "rgba(75, 75, 75, 0.8)",
      borderWidth: 2,
    },
  ],
};

// Doughnut chart data
const doughnutData = {
  labels: ["Procurement", "Vendor Management", "Analytics", "Compliance", "Integration"],
  datasets: [
    {
      data: [35, 25, 20, 10, 10],
      backgroundColor: [
        "rgba(0, 0, 0, 0.8)",
        "rgba(0, 0, 0, 0.6)",
        "rgba(0, 0, 0, 0.4)",
        "rgba(0, 0, 0, 0.3)",
        "rgba(0, 0, 0, 0.2)",
      ],
      borderColor: "rgb(255, 255, 255)",
      borderWidth: 2,
    },
  ],
};

// Chart options
const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Platform Growth Metrics",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Revenue by Region",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const radarOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Platform Capabilities Comparison",
    },
  },
  scales: {
    r: {
      angleLines: {
        color: "rgba(0, 0, 0, 0.2)",
      },
      grid: {
        color: "rgba(0, 0, 0, 0.2)",
      },
      pointLabels: {
        font: {
          size: 12,
        },
      },
      ticks: {
        backdropColor: "transparent",
        showLabelBackdrop: false,
      },
    },
  },
};

const doughnutOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "Feature Usage Distribution",
    },
  },
  cutout: "70%",
};

export default function Home() {
  // State for interactive elements
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [timeframe, setTimeframe] = useState("monthly");
  const [year, setYear] = useState(2023);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Refs for scroll animations
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const metricsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const caseStudiesRef = useRef(null);
  const faqRef = useRef(null);

  // Scroll animations
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.2]);

  // Chart data state
  const [lineChartData, setLineChartData] = useState(generateLineData(timeframe));
  const [barChartData, setBarChartData] = useState(generateBarData(year));

  // Update chart data when filters change
  useEffect(() => {
    setLineChartData(generateLineData(timeframe));
  }, [timeframe]);

  useEffect(() => {
    setBarChartData(generateBarData(year));
  }, [year]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Toggle FAQ
  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 z-0" style={{ opacity }} />

        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              erdtfgvhbjn Simpplrerdtfgvhbjn Simpplrerdtfgvhbjn Simpplrerdtfgvhbjn Simpplrerdtfgvhbjn Simpplr
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Streamline procurement, optimize supplier relationships, and drive business growth with our intelligent
              B2B platform.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.a
                href="/products"
                className="px-8 py-4 bg-black text-white rounded-lg text-lg font-medium inline-flex items-center justify-center hover:bg-gray-900 transition-colors shadow-lg shadow-gray-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Products <ArrowRight className="ml-2" size={20} />
              </motion.a>

              <motion.a
                href="/demo"
                className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-lg text-lg font-medium inline-flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg shadow-gray-100"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Request Demo
              </motion.a>
            </motion.div>
          </div>

          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              { value: "10,000+", label: "Active Users" },
              { value: "98.7%", label: "Uptime SLA" },
              { value: "$2.3B+", label: "Transaction Volume" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-xl shadow-gray-100 text-center"
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              Enterprise-Grade Features
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Built for scale, designed for simplicity, optimized for results
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  borderColor: "rgba(0, 0, 0, 0.3)",
                }}
              >
                <div className="bg-gray-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section ref={metricsRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              Platform Analytics
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Real-time insights driving business decisions
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Growth Metrics</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setTimeframe("monthly")}
                    className={`px-3 py-1 text-sm rounded-md ${
  timeframe === "monthly"
      ? "bg-gray-100 text-gray-900"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
}`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setTimeframe("quarterly")}
                    className={`px-3 py-1 text-sm rounded-md ${
  timeframe === "quarterly"
      ? "bg-gray-100 text-gray-900"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
}`}
                  >
                    Quarterly
                  </button>
                </div>
              </div>
              <Line options={lineOptions} data={lineChartData} height={80} />
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Regional Performance</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setYear(2022)}
                    className={`px-3 py-1 text-sm rounded-md ${
  year === 2022 ? "bg-gray-100 text-gray-900" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
}`}
                  >
                    2022
                  </button>
                  <button
                    onClick={() => setYear(2023)}
                    className={`px-3 py-1 text-sm rounded-md ${
  year === 2023 ? "bg-gray-100 text-gray-900" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
}`}
                  >
                    2023
                  </button>
                </div>
              </div>
              <Bar options={barOptions} data={barChartData} height={80} />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-6">Competitive Analysis</h3>
              <Radar options={radarOptions} data={radarData} height={80} />
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-6">Feature Usage</h3>
              <Doughnut options={doughnutOptions} data={doughnutData} height={80} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              What Our Clients Say
            </motion.h2>
            <motion.p
              className="text-xl text-gray-200 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Success stories from industry leaders
            </motion.p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="h-80">
              <AnimatePresence mode="wait">
                {testimonials.map(
                  (testimonial, index) =>
                    activeTestimonial === index && (
                      <motion.div
                        key={index}
                        className="bg-gray-800 p-10 rounded-2xl shadow-xl absolute w-full"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="text-4xl text-gray-300 mb-6">"</div>
                        <p className="text-xl mb-8 text-gray-100 italic">{testimonial.quote}</p>
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-xl font-bold">
                            {testimonial.author.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <p className="font-semibold">{testimonial.author}</p>
                            <p className="text-gray-300 text-sm">
                              {testimonial.position}, {testimonial.company}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${activeTestimonial === index ? "bg-white" : "bg-gray-600"}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section ref={caseStudiesRef} className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              Success Stories
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Real results from organizations like yours
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{study.title}</h3>
                      <p className="text-gray-600">{study.company}</p>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{study.metric}</div>
                  </div>
                  <p className="text-gray-700 mb-4">{study.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {study.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="bg-gray-100 text-gray-900 text-xs px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-100 p-4 flex justify-between items-center">
                  <span className="text-sm text-gray-900 font-medium">View Full Case Study</span>
                  <ExternalLink size={16} className="text-gray-900" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Everything you need to know about our platform
            </motion.p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full text-left p-6 flex justify-between items-center rounded-xl ${
  expandedFaq === index ? "bg-gray-100 text-gray-900" : "bg-white text-gray-900 hover:bg-gray-50"
} transition-colors shadow-sm border border-gray-100`}
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp size={20} className="text-gray-900" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-white border border-t-0 border-gray-100 rounded-b-xl">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your B2B Operations?</h2>
            <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Join thousands of businesses that have streamlined their procurement process and accelerated growth with
              Simpplr.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/demo"
                className="px-8 py-4 bg-white text-gray-900 rounded-lg text-lg font-medium inline-flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Schedule a Demo
              </motion.a>

              <motion.a
                href="/contact"
                className="px-8 py-4 bg-transparent text-white border-2 border-gray-300 rounded-lg text-lg font-medium inline-flex items-center justify-center hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Sales
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}