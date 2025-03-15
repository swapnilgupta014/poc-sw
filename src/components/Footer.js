import React,{ useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  GitlabIcon as GitHub,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Check,
  ChevronUp,
} from "lucide-react"

const Footer = () => {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [expandedSection, setExpandedSection] = useState(null)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email && email.includes("@")) {
      setIsSubscribed(true)
      setTimeout(() => {
        setIsSubscribed(false)
        setEmail("")
      }, 3000)
    }
  }

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 pt-16 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6">
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-2">
                  M
                </div>
                <span className="text-xl font-bold dark:text-white">Modern Products</span>
              </motion.div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Creating innovative solutions for tomorrow's challenges. Our products are designed with quality,
              sustainability, and user experience in mind.
            </p>
            <div className="space-y-3">
              <ContactItem icon={<Mail size={16} />} text="contact@modernproducts.com" />
              <ContactItem icon={<Phone size={16} />} text="+1 (555) 123-4567" />
              <ContactItem icon={<MapPin size={16} />} text="123 Innovation Way, Tech City, TC 10101" />
            </div>
          </motion.div>

          {/* Quick Links - Desktop */}
          <div className="hidden md:block">
            <h3 className="text-lg font-semibold mb-6 dark:text-white">Quick Links</h3>
            <ul className="space-y-3">
              {["Home", "About", "Products", "Services", "Portfolio", "Testimonials", "Careers"].map((link, index) => (
                <FooterLink key={link} href="#" text={link} delay={index * 0.1} />
              ))}
            </ul>
          </div>

          {/* Resources - Desktop */}
          <div className="hidden md:block">
            <h3 className="text-lg font-semibold mb-6 dark:text-white">Resources</h3>
            <ul className="space-y-3">
              {["Blog", "Documentation", "Help Center", "FAQs", "API", "Partners", "Community"].map((link, index) => (
                <FooterLink key={link} href="#" text={link} delay={index * 0.1} />
              ))}
            </ul>
          </div>

          {/* Mobile Accordion */}
          <div className="md:hidden space-y-4">
            <MobileAccordion
              title="Quick Links"
              isExpanded={expandedSection === "quick-links"}
              onToggle={() => toggleSection("quick-links")}
              links={["Home", "About", "Products", "Services", "Portfolio", "Testimonials", "Careers"]}
            />
            <MobileAccordion
              title="Resources"
              isExpanded={expandedSection === "resources"}
              onToggle={() => toggleSection("resources")}
              links={["Blog", "Documentation", "Help Center", "FAQs", "API", "Partners", "Community"]}
            />
          </div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <h3 className="text-lg font-semibold mb-6 dark:text-white">Stay Updated</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates, product news, and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
                required
              />
              <AnimatePresence mode="wait">
                {!isSubscribed ? (
                  <motion.button
                    key="subscribe"
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="hidden sm:inline mr-1">Subscribe</span>
                    <ArrowRight size={16} />
                  </motion.button>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-1 top-1 bottom-1 px-4 bg-green-500 text-white rounded-md flex items-center justify-center"
                  >
                    <Check size={16} className="mr-1" />
                    <span className="hidden sm:inline">Subscribed!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </motion.div>
        </div>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-200 dark:border-gray-800 pt-8 pb-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <p className="text-gray-600 dark:text-gray-400">
                © {currentYear} Modern Products App. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-2">
              <SocialIcon href="#" icon={<Facebook size={18} />} label="Facebook" />
              <SocialIcon href="#" icon={<Twitter size={18} />} label="Twitter" />
              <SocialIcon href="#" icon={<Instagram size={18} />} label="Instagram" />
              <SocialIcon href="#" icon={<Linkedin size={18} />} label="LinkedIn" />
              <SocialIcon href="#" icon={<GitHub size={18} />} label="GitHub" />
              <SocialIcon href="#" icon={<Youtube size={18} />} label="YouTube" />
            </div>
          </div>
        </motion.div>

        {/* Bottom Links */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-6 text-sm text-gray-500 dark:text-gray-500">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
            <a href="#" className="hover:text-blue-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-500 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-500 transition-colors">
              Cookie Policy
            </a>
            <a href="#" className="hover:text-blue-500 transition-colors">
              Accessibility
            </a>
            <a href="#" className="hover:text-blue-500 transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.a
          href="#top"
          className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 relative -top-5"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <ChevronUp size={20} />
        </motion.a>
      </motion.div>
    </footer>
  )
}

const ContactItem = ({ icon, text }) => (
  <div className="flex items-center text-gray-600 dark:text-gray-400">
    <span className="mr-2">{icon}</span>
    <span>{text}</span>
  </div>
)

const FooterLink = ({ href, text, delay = 0 }) => (
  <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay }}>
    <motion.a
      href={href}
      className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {text}
    </motion.a>
  </motion.li>
)

const MobileAccordion = ({ title, isExpanded, onToggle, links }) => (
  <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
    <button onClick={onToggle} className="flex justify-between items-center w-full text-left py-2 focus:outline-none">
      <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
        <ChevronUp size={18} className="text-gray-500" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isExpanded && (
        <motion.ul
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-2 space-y-2 overflow-hidden"
        >
          {links.map((link) => (
            <li key={link}>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                {link}
              </a>
            </li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  </div>
)

const SocialIcon = ({ href, icon, label }) => (
  <motion.a
    href={href}
    className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white transition-all"
    whileHover={{ scale: 1.1, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </motion.a>
)

export default Footer

