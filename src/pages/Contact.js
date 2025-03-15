import React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Send, Search, ArrowUpDown, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

// Sample FAQ data for search functionality
const faqs = [
  {
    id: 1,
    question: "How do I reset my password?",
    answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page.",
    category: "Account",
  },
  {
    id: 2,
    question: "How long does shipping take?",
    answer: "Shipping typically takes 3-5 business days for domestic orders and 7-14 days for international orders.",
    category: "Shipping",
  },
  {
    id: 3,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and Apple Pay.",
    category: "Payment",
  },
  {
    id: 4,
    question: "Can I cancel my order?",
    answer: "Orders can be cancelled within 24 hours of placement. Please contact our support team.",
    category: "Orders",
  },
  {
    id: 5,
    question: "Do you offer refunds?",
    answer: "Yes, we offer full refunds within 30 days of purchase if you're not satisfied with your product.",
    category: "Returns",
  },
  {
    id: 6,
    question: "How can I track my order?",
    answer:
        "You can track your order by logging into your account or using the tracking number provided in your shipping confirmation email.",
    category: "Shipping",
  },
  {
    id: 7,
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 100 countries worldwide.",
    category: "Shipping",
  },
  {
    id: 8,
    question: "How do I change my shipping address?",
    answer:
        "You can update your shipping address in your account settings or contact our support team within 24 hours of placing your order.",
    category: "Shipping",
  },
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
}

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export default function ContactPage() {
  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("idle")

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFaqs, setFilteredFaqs] = useState(faqs)
  const [sortOrder, setSortOrder] = useState("asc")
  const [activeCategory, setActiveCategory] = useState(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("loading")

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify({ name, email, message }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })

      if (response.ok) {
        setStatus("success")
        setName("")
        setEmail("")
        setMessage("")
      } else {
        setStatus("error")
      }
    } catch (error) {
      setStatus("error")
    }
  }

  // Filter and sort FAQs based on search query and sort order
  useEffect(() => {
    let results = [...faqs]

    // Filter by search query
    if (searchQuery) {
      results = results.filter(
          (faq) =>
              faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (activeCategory) {
      results = results.filter((faq) => faq.category === activeCategory)
    }

    // Sort results
    results.sort((a, b) => {
      const comparison = a.question.localeCompare(b.question)
      return sortOrder === "asc" ? comparison : -comparison
    })

    setFilteredFaqs(results)
  }, [searchQuery, sortOrder, activeCategory])

  // Get unique categories
  const categories = Array.from(new Set(faqs.map((faq) => faq.category)))

  return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <motion.div className="space-y-16" initial="hidden" animate="visible" variants={containerVariants}>
            {/* Header */}
            <motion.div className="text-center space-y-4" variants={itemVariants}>
              <h1 className="text-5xl font-bold tracking-tight">Get in Touch</h1>
              <p className="text-lg text-zinc-600  max-w-2xl mx-auto">
                Have questions or need assistance? We're here to help. Search our FAQs below or send us a message
                directly.
              </p>
            </motion.div>

            {/* Search and Filter Section */}
            <motion.div className="space-y-8" variants={itemVariants}>
              <div className="relative max-w-2xl mx-auto">
                <motion.div
                    className={`relative flex items-center rounded-full border ${
                        isSearchFocused
                            ? "border-zinc-500 ring-2 ring-zinc-200 "
                            : "border-zinc-300 "
                    } transition-all duration-300 bg-white`}
                    animate={{
                      scale: isSearchFocused ? 1.02 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Search className="absolute left-4 h-5 w-5 text-zinc-500" />
                  <input
                      type="text"
                      placeholder="Search our FAQs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className="w-full py-4 pl-12 pr-12 bg-transparent focus:outline-none text-zinc-900 placeholder:text-zinc-500"
                  />
                  {searchQuery && (
                      <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute right-4"
                          onClick={() => setSearchQuery("")}
                      >
                        <X className="h-5 w-5 text-zinc-500 hover:text-zinc-700" />
                      </motion.button>
                  )}
                </motion.div>
              </div>

              {/* Filter and Sort Controls */}
              <div className="flex flex-wrap justify-center gap-3">
                <motion.button
                    onClick={() => setActiveCategory(null)}
                    className={`px-4 py-2 rounded-full text-sm ${
                        activeCategory === null
                            ? "bg-zinc-900 text-white"
                            : "bg-zinc-200 text-zinc-700"
                    } transition-colors`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                  All
                </motion.button>

                {categories.map((category) => (
                    <motion.button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm ${
                            activeCategory === category
                                ? "bg-zinc-900 text-white"
                                : "bg-zinc-200 text-zinc-700"
                        } transition-colors`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                      {category}
                    </motion.button>
                ))}

                <motion.button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="px-4 py-2 rounded-full text-sm bg-zinc-200 text-zinc-700 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
                </motion.button>
              </div>

              {/* FAQ Results */}
              <AnimatePresence mode="wait">
                <motion.div
                    key={`${searchQuery}-${sortOrder}-${activeCategory}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 max-w-3xl mx-auto"
                >
                  {filteredFaqs.length > 0 ? (
                      filteredFaqs.map((faq) => (
                          <motion.div
                              key={faq.id}
                              className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          >
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-lg">{faq.question}</h3>
                              <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-600">
                          {faq.category}
                        </span>
                            </div>
                            <p className="mt-2 text-zinc-600">{faq.answer}</p>
                          </motion.div>
                      ))
                  ) : (
                      <motion.div className="text-center py-12" variants={fadeInVariants}>
                        <p className="text-zinc-500">No results found. Try a different search term.</p>
                      </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Contact Form Section */}
            <motion.div
                className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
                variants={itemVariants}
            >
              <div className="p-8 md:p-12">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div whileFocus={{ scale: 1.01 }} className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
                      Name
                    </label>
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-50 border-0 rounded-lg focus:ring-2 focus:ring-zinc-400 transition-all duration-200"
                          required
                          placeholder="Your name"
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div whileFocus={{ scale: 1.01 }} className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                      Email
                    </label>
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-50 border-0 rounded-lg focus:ring-2 focus:ring-zinc-400 transition-all duration-200"
                          required
                          placeholder="your.email@example.com"
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div whileFocus={{ scale: 1.01 }} className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-zinc-700">
                      Message
                    </label>
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 border-0 rounded-lg focus:ring-2 focus:ring-zinc-400 transition-all duration-200 min-h-[120px]"
                        rows={4}
                        required
                        placeholder="How can we help you?"
                    ></textarea>
                    </motion.div>
                  </motion.div>

                  <motion.button
                      type="submit"
                      className="w-full flex items-center justify-center px-6 py-4 bg-zinc-900 text-white rounded-lg font-medium"
                      disabled={status === "loading"}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {status === "loading" ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                        >
                          <Loader2 className="h-5 w-5" />
                        </motion.div>
                    ) : (
                        <>
                          Send Message <Send className="ml-2" size={18} />
                        </>
                    )}
                  </motion.button>
                </form>

                {/* Status Messages */}
                <AnimatePresence>
                  {status === "success" && (
                      <motion.div
                          className="mt-6 p-4 rounded-lg bg-green-50 text-green-700 flex items-center gap-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                      >
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                        <p>Your message has been sent successfully! We'll get back to you soon.</p>
                      </motion.div>
                  )}

                  {status === "error" && (
                      <motion.div
                          className="mt-6 p-4 rounded-lg bg-red-50 text-red-700 flex items-center gap-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                      >
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p>An error occurred while sending your message. Please try again later.</p>
                      </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Additional Contact Information */}
            <motion.div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto" variants={containerVariants}>
              <motion.div
                  className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 text-center"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="mx-auto w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-zinc-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Phone</h3>
                <p className="text-zinc-600">+1 (555) 123-4567</p>
              </motion.div>

              <motion.div
                  className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 text-center"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="mx-auto w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-zinc-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Email</h3>
                <p className="text-zinc-600">support@example.com</p>
              </motion.div>

              <motion.div
                  className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 text-center"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="mx-auto w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-zinc-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Location</h3>
                <p className="text-zinc-600">
                  123 Business Ave, Suite 100
                  <br />
                  San Francisco, CA 94107
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
  )
}