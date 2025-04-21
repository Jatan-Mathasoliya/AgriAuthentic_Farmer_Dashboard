import React, { useState, useEffect } from 'react';

function Profile() {
  // State to store form data
  const [formData, setFormData] = useState({
    farmerFirstName: '',
    farmerLastName: '',
    farmerEmail: '',
    farmerPhone: '',
    farmerAddress: {
      address: '',
      city: '',
      state: '',
      zipcode: '',
      country: ''
    },
    farmsAddress: [
      {
        address: '',
        city: '',
        state: '',
        zipcode: '',
        country: ''
      }
    ],
    totalFarms: 1,
    farmsSize: [''],
    primaryCrops: ['']
  });

  // State to track loading status
  const [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState({ status: '', message: '' });

  // Fetch farmer data from localStorage on component mount
  useEffect(() => {
    const fetchFarmerData = () => {
      try {
        // Get data from localStorage
        const savedData = localStorage.getItem('farmerProfileData');
        
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);
        }
      } catch (error) {
        console.error('Error fetching farmer data from localStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerData();
  }, []);

  // Handle input changes for basic fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle input changes for nested farmer address
  const handleFarmerAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      farmerAddress: {
        ...formData.farmerAddress,
        [name]: value
      }
    });
  };

  // Handle input changes for farm addresses
  const handleFarmAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFarmsAddress = [...formData.farmsAddress];
    updatedFarmsAddress[index] = {
      ...updatedFarmsAddress[index],
      [name]: value
    };
    setFormData({
      ...formData,
      farmsAddress: updatedFarmsAddress
    });
  };

  // Handle input changes for farm sizes
  const handleFarmSizeChange = (index, e) => {
    const { value } = e.target;
    const updatedFarmSizes = [...formData.farmsSize];
    updatedFarmSizes[index] = value;
    setFormData({
      ...formData,
      farmsSize: updatedFarmSizes
    });
  };

  // Handle input changes for primary crops
  const handleCropChange = (index, e) => {
    const { value } = e.target;
    const updatedCrops = [...formData.primaryCrops];
    updatedCrops[index] = value;
    setFormData({
      ...formData,
      primaryCrops: updatedCrops
    });
  };

  // Add new farm
  const addFarm = () => {
    setFormData({
      ...formData,
      farmsAddress: [
        ...formData.farmsAddress,
        { address: '', city: '', state: '', zipcode: '', country: '' }
      ],
      farmsSize: [...formData.farmsSize, ''],
      totalFarms: formData.totalFarms + 1
    });
  };

  // Add new crop
  const addCrop = () => {
    setFormData({
      ...formData,
      primaryCrops: [...formData.primaryCrops, '']
    });
  };

  // Remove farm
  const removeFarm = (index) => {
    if (formData.farmsAddress.length > 1) {
      const updatedFarmsAddress = formData.farmsAddress.filter((_, i) => i !== index);
      const updatedFarmSizes = formData.farmsSize.filter((_, i) => i !== index);
      
      setFormData({
        ...formData,
        farmsAddress: updatedFarmsAddress,
        farmsSize: updatedFarmSizes,
        totalFarms: formData.totalFarms - 1
      });
    }
  };

  // Remove crop
  const removeCrop = (index) => {
    if (formData.primaryCrops.length > 1) {
      const updatedCrops = formData.primaryCrops.filter((_, i) => i !== index);
      
      setFormData({
        ...formData,
        primaryCrops: updatedCrops
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ status: 'loading', message: 'Saving profile...' });
    
    try {
      // Save data to localStorage
      localStorage.setItem('farmerProfileData', JSON.stringify(formData));
      
      setSubmitStatus({ status: 'success', message: 'Profile saved successfully!' });
      setTimeout(() => setSubmitStatus({ status: '', message: '' }), 3000);
    } catch (error) {
      console.error('Error saving profile to localStorage:', error);
      setSubmitStatus({ status: 'error', message: 'Error saving profile. Please try again.' });
      setTimeout(() => setSubmitStatus({ status: '', message: '' }), 3000);
    }
  };

  // Clear profile data
  const clearProfile = () => {
    if (window.confirm('Are you sure you want to clear your profile data?')) {
      localStorage.removeItem('farmerProfileData');
      setFormData({
        farmerFirstName: '',
        farmerLastName: '',
        farmerEmail: '',
        farmerPhone: '',
        farmerAddress: {
          address: '',
          city: '',
          state: '',
          zipcode: '',
          country: ''
        },
        farmsAddress: [
          {
            address: '',
            city: '',
            state: '',
            zipcode: '',
            country: ''
          }
        ],
        totalFarms: 1,
        farmsSize: [''],
        primaryCrops: ['']
      });
      setSubmitStatus({ status: 'success', message: 'Profile data cleared successfully!' });
      setTimeout(() => setSubmitStatus({ status: '', message: '' }), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">Farmer Profile Setup</h1>
          {localStorage.getItem('farmerProfileData') && (
            <button
              type="button"
              onClick={clearProfile}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Clear Profile Data
            </button>
          )}
        </div>
        
        {submitStatus.message && (
          <div className={`mb-4 p-3 rounded ${
            submitStatus.status === 'success' ? 'bg-green-100 text-green-800' : 
            submitStatus.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {submitStatus.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="farmerFirstName"
                  value={formData.farmerFirstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="farmerLastName"
                  value={formData.farmerLastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="farmerEmail"
                  value={formData.farmerEmail}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="farmerPhone"
                  value={formData.farmerPhone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Farmer Address */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Residence Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.farmerAddress.address}
                  onChange={handleFarmerAddressChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.farmerAddress.city}
                  onChange={handleFarmerAddressChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.farmerAddress.state}
                  onChange={handleFarmerAddressChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Zipcode</label>
                <input
                  type="text"
                  name="zipcode"
                  value={formData.farmerAddress.zipcode}
                  onChange={handleFarmerAddressChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.farmerAddress.country}
                  onChange={handleFarmerAddressChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Farm Information */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Farm Information</h2>
              <span className="text-gray-600">Total Farms: {formData.totalFarms}</span>
            </div>
            
            {formData.farmsAddress.map((farm, index) => (
              <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-700">Farm #{index + 1}</h3>
                  {formData.farmsAddress.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeFarm(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Remove Farm
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-1">Farm Address</label>
                    <input
                      type="text"
                      name="address"
                      value={farm.address}
                      onChange={(e) => handleFarmAddressChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={farm.city}
                      onChange={(e) => handleFarmAddressChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={farm.state}
                      onChange={(e) => handleFarmAddressChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Zipcode</label>
                    <input
                      type="text"
                      name="zipcode"
                      value={farm.zipcode}
                      onChange={(e) => handleFarmAddressChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={farm.country}
                      onChange={(e) => handleFarmAddressChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Farm Size (in acres)</label>
                    <input
                      type="number"
                      value={formData.farmsSize[index]}
                      onChange={(e) => handleFarmSizeChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addFarm}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Another Farm
            </button>
          </div>
          
          {/* Primary Crops */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Primary Crops</h2>
            
            {formData.primaryCrops.map((crop, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={crop}
                  onChange={(e) => handleCropChange(index, e)}
                  className="flex-grow p-2 border border-gray-300 rounded"
                  placeholder="Enter crop name"
                  required
                />
                {formData.primaryCrops.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCrop(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={addCrop}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Another Crop
            </button>
          </div>
          
          <div className="mt-8">
            <button
              type="submit"
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;