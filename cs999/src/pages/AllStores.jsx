import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AllStores = ({ user, onLogout }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:3000/store/getAll', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch stores');
        }
        
        const data = await response.json();
        setStores(data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching stores');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStores();
  }, []);

  return (
    <div className="product-container">
      <div className="product-header">
        <h1 className="text-2xl font-bold">All Stores</h1>
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
          <div className="text-lg">Loading stores...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {stores.map((store) => (
            <div key={store.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{store.name}</h2>
              <p className="text-gray-600 mb-4">{store.description || 'No description available'}</p>
              <div className="flex space-x-3">
                <Link 
                  to={`/store/${store.id}`} 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Store Details
                </Link>
                <Link 
                  to={`/products/${store.id}`} 
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  View Products
                </Link>
              </div>
            </div>
          ))}
          
          {stores.length === 0 && !loading && (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 text-lg">No stores found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllStores;