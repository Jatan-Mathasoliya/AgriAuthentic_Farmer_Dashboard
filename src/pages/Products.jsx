import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, AlertCircle, X, Box, ChevronLeft, Clock, MapPin, Award, Tag, ChevronRight, Phone, Mail } from 'lucide-react';
import axios from 'axios';
import OrdersComponent from '../components/Order';

function Products() {
  const { t } = useTranslation(); // Add this line
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    unit: "per kg",
    stock: 0,
    harvestLocation: "",
    harvestDate: "",
    certificates: "",
    tags: []
  });
  const [loading, setLoading] = useState(true);
  const [orderPage, setorderPage] = useState(false);

  const availableTags = [
    { id: 1, name: "All Fruits & Vegetables" },
    { id: 2, name: "Fresh Fruits" },
    { id: 3, name: "Mangoes & Melons" },
    { id: 4, name: "Seasonal" },
    { id: 5, name: "Exotics" },
    { id: 6, name: "Freshly Cut & Sprouts" },
    { id: 7, name: "Frozen Veg" },
    { id: 8, name: "Leafies & Herbs" },
    { id: 9, name: "Flowers & Leaves" },
    { id: 10, name: "Combo & Recipes" },
    { id: 11, name: "Apples & Pears" },
    { id: 12, name: "Fresh Vegetables" },
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://agriauthenic-poc-backend.onrender.com/product');
        if (response.data && Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data && response.data.products && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else {
          console.error('Unexpected API response format:', response.data);
          setProducts([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Replace static text with t('key')
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagChange = (tagName) => {
    const updatedTags = formData.tags.includes(tagName)
      ? formData.tags.filter(tag => tag !== tagName)
      : [...formData.tags, tagName];
    setFormData({ ...formData, tags: updatedTags });
  };

  const handleAddProduct = async () => {
    try {
      await axios.post('https://agriauthenic-poc-backend.onrender.com/product', formData);
      const updatedProductsResponse = await axios.get('https://agriauthenic-poc-backend.onrender.com/product');
      setProducts(updatedProductsResponse.data);
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      productDescription: "",
      productPrice: "",
      unit: "per kg",
      stock: 0,
      harvestLocation: "",
      harvestDate: "",
      certificates: "",
      tags: []
    });
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const productsToRender = Array.isArray(products) ? products : [];

  return (
    <div className="bg-green-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{t('products.title')}</h1>
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => setorderPage(true)}
              className="flex items-center gap-2 bg-[#0b9a32] hover:bg-[#0a8a2d] text-white py-2 px-4 rounded-lg shadow transition-colors duration-200"
            >
              <Box size={24} color="#ffffff" />
              <span>{t('products.orders')}</span>
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-[#0b9a32] hover:bg-[#0a8a2d] text-white py-2 px-4 rounded-lg shadow transition-colors duration-200"
            >
              <Plus size={20} />
              {t('products.addProduct')}
            </button>
          </div>
        </div>

        {/* Add Product Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{t('products.addProduct')}</h2>
                <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-gray-700 mb-1">{t('products.productName')}</label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b9a32]"
                    required
                  />
                </div>
                {/* Add other form fields similarly */}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  {t('products.cancel')}
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-[#0b9a32] hover:bg-[#0a8a2d] text-white rounded-md transition-colors duration-200"
                >
                  {t('products.addProduct')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product List */}
        {orderPage ? (
          <div className="flex flex-col justify-center gap-4">
            <div className="flex items-center gap-2">
              <ChevronLeft color="#000000" size={26} onClick={() => setorderPage(false)} />
              <span className="text-sm text-gray-600 font-medium">Back to Products</span>
            </div>
            <OrdersComponent />
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0b9a32]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsToRender.length === 0 ? (
                  <div className="col-span-full p-8 text-center bg-white rounded-lg shadow">
                    <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700">{t('products.noProducts')}</h3>
                    <p className="text-gray-500 mt-2">{t('products.addFirstProduct')}</p>
                  </div>
                ) : (
                  productsToRender.map((product, index) => (
                    <div
                      key={product.id || index}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                      onClick={() => openProductDetail(product)}
                    >
                      <div className="relative h-48">
                        <img
                          src={product.imageLink || "/api/placeholder/400/320"}
                          alt={product.productName || product.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${(product.stock > 0) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {(product.stock > 0) ? `${t('products.inStock')}: ${product.stock}` : t('products.outOfStock')}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-lg text-gray-800">{product.productName || product.name || "Unnamed Product"}</h3>
                          <div className="text-[#0b9a32] font-bold">
                            ${product.productPrice || product.price || 0} {product.unit || "per kg"}
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.productDescription || product.description || "No description available"}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.tags && Array.isArray(product.tags) && product.tags.map((tag, tagIndex) => (
                            <div key={tagIndex} className="bg-blue-100 text-blue-800 flex items-center gap-1 px-2 py-1 rounded-full text-xs">
                              {typeof tag === 'string' ? tag : (tag.name || "Tag")}
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <div className="text-gray-500">
                            {(product.harvestDate || product.harvest_date) &&
                              `${t('products.harvestedOn')}: ${new Date(product.harvestDate || product.harvest_date).toLocaleDateString()}`
                            }
                          </div>
                          <ChevronRight size={18} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;