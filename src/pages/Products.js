import React,{ useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import _ from "lodash"
import { Link } from "react-router-dom"
import { Search, X, SlidersHorizontal, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react"

const ITEMS_PER_PAGE = 8

export default function Products() {
  // State management
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [sortOrder, setSortOrder] = useState("asc")
  const [sortBy, setSortBy] = useState("price")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const searchInputRef = useRef(null)

  // Scroll animations
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.8])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("https://fakestoreapi.com/products")
        const data = await res.json()
        setProducts(data)
        setFilteredProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter and sort products
  useEffect(() => {
    const filtered = products.filter(
        (product) =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const sorted = _.orderBy(filtered, [sortBy], [sortOrder])
    setFilteredProducts(sorted)
    setCurrentPage(1)
  }, [searchTerm, sortOrder, sortBy, products])

  // Pagination
  const pageCount = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // Categories for filtering
  const categories = [...new Set(products.map((product) => product.category))]

  // Clear search
  const clearSearch = () => {
    setSearchTerm("")
    searchInputRef.current?.focus()
  }

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
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  }

  return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Header with search */}
        <motion.header className="sticky top-0 z-10 bg-white shadow-sm" style={{ opacity: headerOpacity }}>
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <motion.h1
                  className="text-3xl font-light tracking-tight"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
              >
                <span className="font-bold">Curated</span> Collection
              </motion.h1>

              <motion.div
                  className={`relative w-full md:w-96 transition-all duration-300 ${isSearchFocused ? "md:w-[32rem]" : "md:w-96"}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.div
                    className={`flex items-center bg-gray-100 rounded-full overflow-hidden pr-4 ${isSearchFocused ? "ring-2 ring-gray-300" : ""}`}
                    whileTap={{ scale: 0.98 }}
                >
                  <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search products, categories, descriptions..."
                      className="w-full bg-transparent py-3 px-5 focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                  />
                  <AnimatePresence>
                    {searchTerm && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={clearSearch}
                            className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={18} />
                        </motion.button>
                    )}
                  </AnimatePresence>
                  <motion.div className="ml-2 text-gray-500" whileHover={{ scale: 1.1 }}>
                    <Search size={20} />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.header>

        <main className="container mx-auto px-4 py-8">
          {/* Filters and sorting */}
          <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-2">
                <motion.button
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow transition-shadow"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                  <SlidersHorizontal size={16} />
                  <span>Filters</span>
                </motion.button>

                <div className="text-sm text-gray-500">{filteredProducts.length} products found</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Sort by:</span>
                <div className="flex gap-2">
                  <motion.button
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${sortBy === "price" ? "bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                      onClick={() => {
                        setSortBy("price")
                        if (sortBy === "price") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Price</span>
                      {sortBy === "price" && (
                          <motion.div animate={{ rotate: sortOrder === "asc" ? 0 : 180 }}>
                            <ArrowUpDown size={14} />
                          </motion.div>
                      )}
                    </div>
                  </motion.button>

                  <motion.button
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${sortBy === "title" ? "bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                      onClick={() => {
                        setSortBy("title")
                        if (sortBy === "title") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Name</span>
                      {sortBy === "title" && (
                          <motion.div animate={{ rotate: sortOrder === "asc" ? 0 : 180 }}>
                            <ArrowUpDown size={14} />
                          </motion.div>
                      )}
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Expandable filter panel */}
            <AnimatePresence>
              {isFilterOpen && (
                  <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                  >
                    <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
                      <h3 className="font-medium mb-3">Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <motion.button
                                key={category}
                                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                                    searchTerm.toLowerCase() === category.toLowerCase()
                                        ? "bg-gray-900 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                                onClick={() => setSearchTerm(category)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                              {category}
                            </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Products grid */}
          {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <motion.div
                        key={index}
                        className="bg-white rounded-lg overflow-hidden h-[380px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <div className="h-48 bg-gray-200 animate-pulse" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3 mt-4" />
                      </div>
                    </motion.div>
                ))}
              </div>
          ) : (
              <>
                {filteredProducts.length === 0 ? (
                    <motion.div className="text-center py-16" variants={fadeInVariants} initial="hidden" animate="visible">
                      <p className="text-xl text-gray-500">No products found matching "{searchTerm}"</p>
                      <motion.button
                          className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-full"
                          onClick={clearSearch}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                      >
                        Clear search
                      </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                      {paginatedProducts.map((product) => (
                          <motion.div
                              key={product.id}
                              className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                              variants={itemVariants}
                              whileHover={{ y: -5 }}
                          >
                            <div className="relative h-56 bg-gray-100 overflow-hidden">
                              <motion.img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.title}
                                  className="w-full h-full object-contain p-4"
                                  initial={{ scale: 1.05, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ duration: 0.5 }}
                                  loading="lazy"
                              />
                              <motion.div
                                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"
                                  whileHover={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                              />
                            </div>

                            <div className="p-4">
                              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.category}</div>
                              <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-gray-700 transition-colors">
                                {product.title}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500 line-clamp-2 h-10">{product.description}</p>

                              <div className="mt-4 flex justify-between items-center">
                                <span className="text-lg font-medium">${product.price.toFixed(2)}</span>
                                <Link
                                    to={`/products/${product.id}`}
                                    className="relative overflow-hidden px-4 py-2 bg-gray-900 text-white rounded-full text-sm group-hover:bg-gray-800 transition-colors"
                                >
                                  <motion.span className="relative z-10" whileHover={{ x: 5 }}>
                                    View
                                  </motion.span>
                                  <motion.div
                                      className="absolute inset-0 bg-gray-700"
                                      initial={{ x: "-100%" }}
                                      whileHover={{ x: 0 }}
                                      transition={{ duration: 0.3 }}
                                  />
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                      ))}
                    </motion.div>
                )}
              </>
          )}

          {/* Pagination */}
          {pageCount > 1 && !isLoading && (
              <motion.div
                  className="mt-12 flex justify-center items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center gap-2 bg-white rounded-full shadow-sm px-2 py-1">
                  <motion.button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                      whileHover={currentPage !== 1 ? { scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" } : {}}
                      whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
                  >
                    <ChevronLeft size={20} />
                  </motion.button>

                  <div className="flex items-center gap-1 px-2">
                    {[...Array(pageCount)].map((_, index) => {
                      const pageNumber = index + 1
                      // Show limited page numbers with ellipsis
                      if (
                          pageNumber === 1 ||
                          pageNumber === pageCount ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                            <motion.button
                                key={pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                                    currentPage === pageNumber ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                                }`}
                                whileHover={currentPage !== pageNumber ? { scale: 1.1 } : {}}
                                whileTap={{ scale: 0.9 }}
                            >
                              {pageNumber}
                            </motion.button>
                        )
                      } else if (
                          (pageNumber === 2 && currentPage > 3) ||
                          (pageNumber === pageCount - 1 && currentPage < pageCount - 2)
                      ) {
                        return (
                            <span key={pageNumber} className="text-gray-400">
                        ...
                      </span>
                        )
                      }
                      return null
                    })}
                  </div>

                  <motion.button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
                      disabled={currentPage === pageCount}
                      className="p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                      whileHover={currentPage !== pageCount ? { scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" } : {}}
                      whileTap={currentPage !== pageCount ? { scale: 0.9 } : {}}
                  >
                    <ChevronRight size={20} />
                  </motion.button>
                </div>
              </motion.div>
          )}
        </main>
      </div>
  )
}

