import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const StoreDetails = ({ user, onLogout }) => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`http://localhost:3000/store/${storeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch store details');
        }
        
        const data = await response.json();
        setStore(data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching store details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStoreDetails();
  }, [storeId]);

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
          <h1 className="text-2xl font-bold">Store Details</h1>
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
          <div className="text-lg">Loading store details...</div>
        </div>
      ) : store ? (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-2xl font-bold mb-4">{store.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Store Information</h3>
              <p className="text-gray-700 mb-2">
                <span className="font-medium">Description:</span> {store.description || 'No description available'}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-medium">Address:</span> {store.address || 'No address available'}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-medium">Phone:</span> {store.phone || 'No phone available'}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Owner:</span> {store.ownerName || 'Unknown'}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Store Metrics</h3>
              <p className="text-gray-700 mb-2">
                <span className="font-medium">Total Products:</span> {store.productCount || 0}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-medium">Rating:</span> {store.rating || 'No ratings yet'}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Established:</span> {store.createdAt ? new Date(store.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <Link
              to={`/products/${storeId}`}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-lg font-medium"
            >
              View Store Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Store not found</div>
        </div>
      )}
    </div>
  );
};

export default StoreDetails;