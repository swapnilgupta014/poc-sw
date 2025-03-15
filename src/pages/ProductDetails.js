import React from "react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
  }, [id])

  if (!product) {
    return <div className="container mx-auto px-6 py-12">Loading...</div>
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img src={product.image || "/placeholder.svg"} alt={product.title} className="w-full h-64 object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
            <button className="flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <ShoppingCart className="mr-2" size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

