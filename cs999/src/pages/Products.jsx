import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const Products = ({ user, onLogout }) => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch store details
        const storeResponse = await fetch(`http://localhost:3000/store/${storeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!storeResponse.ok) {
          throw new Error('Failed to fetch store details');
        }
        
        const storeData = await storeResponse.json();
        setStore(storeData);
        
        // Fetch products by store ID
        const productsResponse = await fetch(`http://localhost:3000/item/byStoreId/${storeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [storeId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="product-container">
      <div className="product-header">
        <div className="flex items-center space-x-4">
          <button
            onClick={goBack}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back
          </button>
          <h1 className="text-2xl font-bold">
            {store ? `Products from ${store.name}` : 'Products'}
          </h1>
        </div>
        <div className="flex space-x-4">
          <span className="text-gray-700">Welcome, {user?.name || 'User'}</span>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading products...</div>
        </div>
      ) : (
<div className="product-grid">
  {products.length > 0 ? products.map((product) => (
    <div key={product.id} className="product-card">
      <img 
        src={product.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name)}`} 
        alt={product.name} 
        className="product-image" 
        onError={(e) => {
          e.target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name)}`;
        }}
      />
      <div className="product-info">
        <h2 className="product-name">{product.name}</h2>
        <p className="product-price">{formatPrice(product.price)}</p>
        <Link 
          to={`/product/${product.id}`} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  )) : (
    <div className="text-center text-gray-500">
      No products available.
    </div>
  )}
</div>
</div>
  
  );
};

export default Products;