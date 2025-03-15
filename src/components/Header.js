import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Home, Info, Package, Mail, User, Settings } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const notifications = [
    {
      icon: <Info className="text-blue-500" size={16} />,
      heading: "New Feature",
      description: "Check out our latest platform updates",
      time: "2 hrs ago",
    },
    {
      icon: <Mail className="text-green-500" size={16} />,
      heading: "New Message",
      description: "You have received a new message from Alex",
      time: "5 hrs ago",
    },
    {
      icon: <User className="text-purple-500" size={16} />,
      heading: "Profile Update",
      description: "Your profile has been updated successfully",
      time: "1 day ago",
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Simpplr
              </h1>
            </Link>
          </div>

          <nav className="hidden md:block">
            <ul className="flex justify-center space-x-8">
              <NavItem to="/" icon={<Home size={18} />} text="Home" />
              <NavItem to="/about" icon={<Info size={18} />} text="About" />
              <NavItem
                to="/products"
                icon={<Package size={18} />}
                text="Products"
              />
              <NavItem to="/contact" icon={<Mail size={18} />} text="Contact" />
              <NavItem to="/profile" icon={<User size={18} />} text="Profile" />
            </ul>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3 mt-1">
                            {notification.icon}
                          </div>
                          <div className="flex flex-col">
                            <h4 className="flex text-sm font-medium text-gray-800">
                              {notification.heading}
                            </h4>
                            <p className="flex text-xs text-gray-500 mt-1">
                              {notification.description}
                            </p>
                            <span className="flex text-xs text-gray-400 mt-1 block">
                              {notification.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button className="text-xs text-blue-500 hover:text-blue-700 font-medium w-full text-center">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="relative">
              <button className="h-9 w-9 rounded-full overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
                <img
                  src="https://avatar.iran.liara.run/public/31"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavItem = ({ to, icon, text }) => (
  <li>
    <Link
      to={to}
      className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors group relative py-2"
    >
      <span className="group-hover:scale-110 transition-transform duration-200">
        {icon}
      </span>
      <span className="group-hover:font-medium">{text}</span>
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
    </Link>
  </li>
);

export default Header;
