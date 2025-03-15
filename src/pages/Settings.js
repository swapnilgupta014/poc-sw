import React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Moon, Sun, Bell, BellOff } from "lucide-react"
import { Line } from "react-chartjs-2"
import _ from "lodash"

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // In a real app, you would apply the dark mode to the entire app here
  }

  const toggleNotifications = () => {
    setNotifications(!notifications)
  }

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Usage Statistics",
        data: _.shuffle([65, 59, 80, 81, 56, 55, 40]),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Weekly Usage Statistics",
      },
    },
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div
        className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8 text-center">Settings</h1>
        <div className="space-y-6">
          <SettingItem
            icon={darkMode ? <Moon size={24} /> : <Sun size={24} />}
            label="Dark Mode"
            description="Toggle dark mode for a different visual experience"
            toggle={toggleDarkMode}
            enabled={darkMode}
          />
          <SettingItem
            icon={notifications ? <Bell size={24} /> : <BellOff size={24} />}
            label="Notifications"
            description="Receive notifications about important updates"
            toggle={toggleNotifications}
            enabled={notifications}
          />
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Usage Statistics</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Line options={chartOptions} data={chartData} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function SettingItem({ icon, label, description, toggle, enabled }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="text-gray-400">{icon}</div>
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <button
        onClick={toggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
          enabled ? "bg-gray-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
}

