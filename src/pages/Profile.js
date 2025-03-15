import React,{ useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Globe,
  Calendar,
  Shield,
  Activity,
  CreditCard,
  FileText,
  Settings,
  ChevronRight,
  Clock,
  Award,
  Zap,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showIdCard, setShowIdCard] = useState(false)

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch("https://jsonplaceholder.typicode.com/users/1")
        const userData = await userResponse.json()

        // Fetch random user for additional data
        const randomUserResponse = await fetch("https://randomuser.me/api/")
        const randomUserData = await randomUserResponse.json()
        const randomUser = randomUserData.results[0]

        // Combine data
        setUser({
          ...userData,
          picture: randomUser.picture.large,
          dob: randomUser.dob,
          registered: randomUser.registered,
          nationality: randomUser.nat,
          gender: randomUser.gender,
          id: {
            name: randomUser.id.name,
            value: randomUser.id.value || "AB123456C",
          },
        })

        // Simulate loading
        setTimeout(() => setLoading(false), 800)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Activity data for charts
  const activityData = [
    { name: "Jan", logins: 20, tasks: 15, points: 30 },
    { name: "Feb", logins: 15, tasks: 20, points: 25 },
    { name: "Mar", logins: 25, tasks: 18, points: 32 },
    { name: "Apr", logins: 30, tasks: 25, points: 40 },
    { name: "May", logins: 22, tasks: 30, points: 35 },
    { name: "Jun", logins: 28, tasks: 22, points: 38 },
    { name: "Jul", logins: 32, tasks: 28, points: 42 },
  ]

  const skillsData = [
    { name: "Design", value: 85 },
    { name: "Coding", value: 70 },
    { name: "Analytics", value: 60 },
    { name: "Marketing", value: 45 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  // Recent activities
  const recentActivities = [
    { id: 1, action: "Updated profile picture", time: "2 hours ago", icon: <User size={16} /> },
    { id: 2, action: "Completed weekly report", time: "Yesterday", icon: <FileText size={16} /> },
    { id: 3, action: "Changed password", time: "3 days ago", icon: <Shield size={16} /> },
    { id: 4, action: "Earned achievement badge", time: "1 week ago", icon: <Award size={16} /> },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading profile data...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-red-500">Failed to load user data</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">User Profile</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your account and view your activity</p>
        </motion.div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 mb-4"
                  >
                    <img
                      src={user.picture || "/placeholder.svg?height=96&width=96"}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <motion.div
                    className="absolute bottom-4 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  />
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">@{user.username}</p>
                <div className="flex items-center text-sm text-blue-500 mb-4">
                  <Zap size={14} className="mr-1" />
                  <span>Premium Member</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Edit Profile
                </motion.button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Navigation
                </h3>
                <nav className="space-y-1">
                  {[
                    { id: "overview", label: "Overview", icon: <User size={18} /> },
                    { id: "activity", label: "Activity", icon: <Activity size={18} /> },
                    { id: "documents", label: "Documents", icon: <FileText size={18} /> },
                    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
                  ].map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center py-2 px-3 rounded-lg text-left ${
                        activeTab === item.id
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </motion.button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Projects", value: "12", icon: <Briefcase size={18} />, color: "bg-purple-500" },
                { label: "Tasks", value: "42", icon: <FileText size={18} />, color: "bg-green-500" },
                { label: "Points", value: "1,254", icon: <Award size={18} />, color: "bg-yellow-500" },
                { label: "Rank", value: "#28", icon: <Activity size={18} />, color: "bg-red-500" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
                >
                  <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center text-white mb-2`}>
                    {stat.icon}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main content area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Personal Information */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ProfileItem icon={<Mail />} label="Email" value={user.email} />
                      <ProfileItem icon={<Phone />} label="Phone" value={user.phone} />
                      <ProfileItem icon={<Globe />} label="Website" value={user.website} />
                      <ProfileItem
                        icon={<MapPin />}
                        label="Address"
                        value={`${user.address.street}, ${user.address.city}`}
                      />
                      <ProfileItem icon={<Briefcase />} label="Company" value={user.company.name} />
                      <ProfileItem
                        icon={<Calendar />}
                        label="Date of Birth"
                        value={user.dob ? new Date(user.dob.date).toLocaleDateString() : "Not available"}
                      />
                      <ProfileItem icon={<Globe />} label="Nationality" value={user.nationality || "US"} />
                      <ProfileItem icon={<User />} label="Gender" value={user.gender || "Male"} />
                    </div>
                  </div>

                  {/* Skills & Performance */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Skills & Performance</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">Skills Distribution</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={skillsData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {skillsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Monthly Activity</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="name" />
                              <YAxis />
                              <CartesianGrid strokeDasharray="3 3" />
                              <Tooltip />
                              <Area
                                type="monotone"
                                dataKey="logins"
                                stroke="#8884d8"
                                fillOpacity={1}
                                fill="url(#colorLogins)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                        >
                          <div className="mr-4 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-500">
                            {activity.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Clock size={12} className="mr-1" /> {activity.time}
                            </p>
                          </div>
                          <ChevronRight size={16} className="text-gray-400" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "activity" && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Activity Charts */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Activity Overview</h2>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={activityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="logins" stroke="#8884d8" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="tasks" stroke="#82ca9d" />
                          <Line type="monotone" dataKey="points" stroke="#ffc658" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Task Completion */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Task Completion</h2>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="tasks" fill="#82ca9d" />
                          <Bar dataKey="points" fill="#ffc658" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Activity Log */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Activity Log</h2>
                    <div className="space-y-4">
                      {[...Array(8)].map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex items-start border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="mr-4 bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                            {
                              [<User size={16} />, <FileText size={16} />, <Shield size={16} />, <Award size={16} />][
                                index % 4
                              ]
                            }
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">
                              {
                                [
                                  "Logged in from new device",
                                  "Updated profile information",
                                  "Completed task: Quarterly report",
                                  "Earned achievement: Early bird",
                                  "Changed password",
                                  "Uploaded new document",
                                  "Joined new project",
                                  "Reached 1000 points milestone",
                                ][index]
                              }
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {
                                [
                                  "2 hours ago",
                                  "Yesterday at 2:30 PM",
                                  "2 days ago",
                                  "3 days ago",
                                  "Last week",
                                  "2 weeks ago",
                                  "Last month",
                                  "2 months ago",
                                ][index]
                              }
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "documents" && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* ID Cards */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">ID Cards & Documents</h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-blue-500 flex items-center text-sm font-medium"
                        onClick={() => setShowIdCard(!showIdCard)}
                      >
                        {showIdCard ? "Hide" : "View"} ID Card
                      </motion.button>
                    </div>

                    <AnimatePresence>
                      {showIdCard && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="mb-6"
                        >
                          <div className="relative w-full max-w-md mx-auto h-56 rounded-xl overflow-hidden shadow-lg">
                            {/* ID Card Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 p-6">
                              <div className="absolute top-4 right-4 text-white/80 text-xs">
                                <div>ID: {user.id.value || "AB123456C"}</div>
                                <div>Issued: 01/01/2022</div>
                                <div>Expires: 01/01/2032</div>
                              </div>

                              <div className="flex items-start mt-6">
                                <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-white/50">
                                  <img
                                    src={user.picture || "/placeholder.svg?height=80&width=80"}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="ml-4 text-white">
                                  <h3 className="text-lg font-bold">{user.name}</h3>
                                  <p className="text-white/80 text-sm">{user.email}</p>
                                  <div className="mt-2 text-sm">
                                    <div className="flex items-center">
                                      <Calendar size={12} className="mr-1" />
                                      <span>
                                        DOB: {user.dob ? new Date(user.dob.date).toLocaleDateString() : "01/01/1990"}
                                      </span>
                                    </div>
                                    <div className="flex items-center mt-1">
                                      <MapPin size={12} className="mr-1" />
                                      <span>
                                        {user.address.city}, {user.address.zipcode}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="absolute bottom-4 left-6 right-6">
                                <div className="h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-between px-4">
                                  <div className="text-white text-xs">National ID Card</div>
                                  <div className="text-white/80 text-xs">Verified ✓</div>
                                </div>
                              </div>

                              {/* Holographic effect */}
                              <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
                              <div className="absolute top-0 left-0 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          title: "National ID Card",
                          status: "Verified",
                          date: "Uploaded on Jan 15, 2023",
                          icon: <CreditCard size={20} />,
                        },
                        {
                          title: "Passport",
                          status: "Pending",
                          date: "Uploaded on Mar 3, 2023",
                          icon: <FileText size={20} />,
                        },
                        {
                          title: "Driver's License",
                          status: "Verified",
                          date: "Uploaded on Feb 10, 2023",
                          icon: <CreditCard size={20} />,
                        },
                        {
                          title: "Health Insurance",
                          status: "Expired",
                          date: "Uploaded on Nov 5, 2022",
                          icon: <FileText size={20} />,
                        },
                      ].map((doc, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl"
                        >
                          <div className="flex items-start">
                            <div className="mr-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-500">
                              {doc.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{doc.title}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{doc.date}</p>
                              <div
                                className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${
                                  doc.status === "Verified"
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                    : doc.status === "Pending"
                                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                                      : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                }`}
                              >
                                {doc.status}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Other Documents */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Other Documents</h2>
                    <div className="space-y-3">
                      {[
                        { name: "Tax_Return_2022.pdf", size: "2.4 MB", date: "Apr 15, 2023" },
                        { name: "Employment_Contract.docx", size: "1.8 MB", date: "Jan 10, 2023" },
                        { name: "Medical_Records.pdf", size: "4.2 MB", date: "Mar 22, 2023" },
                        { name: "Property_Deed.pdf", size: "3.1 MB", date: "Feb 5, 2023" },
                        { name: 'Insurance_  size: "3.1 MB', date: "Feb 5, 2023" },
                        { name: "Insurance_Policy.pdf", size: "1.5 MB", date: "May 12, 2023" },
                      ].map((doc, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                        >
                          <div className="mr-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500">
                            <FileText size={18} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {doc.size} • Uploaded on {doc.date}
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-blue-500 text-sm"
                          >
                            View
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Account Settings */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Account Settings</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Full Name</label>
                          <input
                            type="text"
                            defaultValue={user.name}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Username</label>
                          <input
                            type="text"
                            defaultValue={user.username}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <input
                            type="email"
                            defaultValue={user.email}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Phone</label>
                          <input
                            type="tel"
                            defaultValue={user.phone}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Bio</label>
                        <textarea
                          defaultValue="Professional software developer with 5+ years of experience in web development and UI/UX design."
                          rows={3}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        />
                      </div>
                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                        >
                          Save Changes
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Preferences</h2>
                    <div className="space-y-4">
                      {[
                        {
                          id: "notifications",
                          label: "Email Notifications",
                          description: "Receive email notifications for account activity",
                        },
                        {
                          id: "marketing",
                          label: "Marketing Emails",
                          description: "Receive promotional emails and offers",
                        },
                        { id: "darkMode", label: "Dark Mode", description: "Use dark theme across the application" },
                        {
                          id: "twoFactor",
                          label: "Two-Factor Authentication",
                          description: "Enable additional security for your account",
                        },
                      ].map((pref) => (
                        <div key={pref.id} className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{pref.label}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{pref.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              defaultChecked={pref.id === "notifications" || pref.id === "darkMode"}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Security</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Current Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        />
                      </div>
                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                        >
                          Update Password
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="text-gray-400 dark:text-gray-500 mt-0.5">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  )
}

