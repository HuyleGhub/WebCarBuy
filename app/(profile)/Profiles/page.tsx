"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, User, Mail, Phone, MapPin, Camera, Edit2 } from 'lucide-react';
import { UserAuth } from '@/app/types/auth';
import Footer from '@/app/components/Footer';
import { Fileupload } from "@/app/components/Fileupload";

const ProfilePage = () => {
  const [user, setUser] = useState<UserAuth | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    Tentaikhoan: '',
    Email: '',
    Hoten: '',
    Sdt: '',
    Diachi: '',
    Avatar: [] as string[],
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) throw new Error('Failed to fetch user data');
        const userData = await response.json();
        setUser(userData);
        
        // Convert Avatar string to array if it exists
        const avatarArray = userData.Avatar ? 
          (typeof userData.Avatar === 'string' ? userData.Avatar.split('|') : userData.Avatar) : 
          [];
        
        setFormData({
          Tentaikhoan: userData.Tentaikhoan || '',
          Email: userData.Email || '',
          Hoten: userData.Hoten || '',
          Sdt: userData.Sdt || '',
          Diachi: userData.Diachi || '',
          Avatar: avatarArray,
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login');
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${user?.idUsers}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          Avatar: Array.isArray(formData.Avatar) ? formData.Avatar : [formData.Avatar]
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Cập nhật thông tin thành công!');
        setMessageType('success');
        setIsEditing(false);
        // Update local user data
        setUser(prev => ({
          ...prev!,
          ...formData,
        }));
      } else {
        setMessage(data.error || 'Không thể cập nhật thông tin');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Đã xảy ra lỗi khi cập nhật thông tin');
      setMessageType('error');
    }
    
    setTimeout(() => {
      setMessage('');
      setMessageType(null);
    }, 3000);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <span className="loading loading-spinner text-blue-600 loading-lg"></span>
        <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 pt-20">
      <div className="container mx-auto px-4 pt-20 pb-44">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 relative">
            <div className="absolute right-8 top-8">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all shadow-md ${
                  isEditing
                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700 border border-white'
                }`}
              >
                {isEditing ? 'Hủy' : <><Edit2 size={16} /> Chỉnh sửa</>}
              </button>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Thông tin cá nhân</h1>
            <p className="text-blue-100">Quản lý thông tin của bạn</p>
          </div>

          {/* Alert Message */}
          {message && (
            <div className={`mx-8 mt-6 p-4 rounded-lg flex items-center gap-3 shadow-sm ${
              messageType === 'success' ? 'bg-green-50 text-green-700 border-l-4 border-green-500' : 'bg-red-50 text-red-700 border-l-4 border-red-500'
            }`}>
              {messageType === 'success' ? (
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
              )}
              <span className="font-medium">{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left column - Avatar */}
              <div className="flex flex-col items-center md:w-1/3">
                <div className="relative group">
                  {formData.Avatar && formData.Avatar.length > 0 ? (
                    <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img 
                        src={formData.Avatar[0]} 
                        alt="Profile Avatar" 
                        className="w-full h-full object-cover"
                      />
                      {isEditing && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Camera size={32} className="text-white" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 font-bold flex items-center justify-center shadow-lg">
                      <span className="text-white text-6xl">
                        {formData.Hoten ? formData.Hoten.charAt(0).toUpperCase() : <User size={64} />}
                      </span>
                      {isEditing && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                          <Camera size={32} className="text-white" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <div className="mt-6 w-full">
                    <p className="text-center text-sm font-medium text-gray-600 mb-3">
                      Ảnh đại diện
                    </p>
                    <Fileupload 
                      endpoint='imageUploader'
                      onChange={(urls) => setFormData(prev => ({ ...prev, Avatar: urls }))}
                      value={formData.Avatar}
                    />
                  </div>
                )}

                {!isEditing && (
                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold text-gray-800">{formData.Hoten}</h2>
                    <p className="text-gray-500">{formData.Tentaikhoan}</p>
                  </div>
                )}
              </div>

              {/* Right column - User details */}
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                  Thông tin liên hệ
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Mail size={16} className="text-blue-500" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`block w-full rounded-lg border ${
                        !isEditing 
                          ? "bg-gray-50 text-gray-700 border-gray-200" 
                          : "bg-white text-gray-800 border-gray-300"
                      } px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 transition-all`}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <User size={16} className="text-blue-500" />
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="Hoten"
                      value={formData.Hoten}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`block w-full rounded-lg border ${
                        !isEditing 
                          ? "bg-gray-50 text-gray-700 border-gray-200" 
                          : "bg-white text-gray-800 border-gray-300"
                      } px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 transition-all`}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="text-blue-500" />
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="Sdt"
                      value={formData.Sdt}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`block w-full rounded-lg border ${
                        !isEditing 
                          ? "bg-gray-50 text-gray-700 border-gray-200" 
                          : "bg-white text-gray-800 border-gray-300"
                      } px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 transition-all`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} className="text-blue-500" />
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      name="Diachi"
                      value={formData.Diachi}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`block w-full rounded-lg border ${
                        !isEditing 
                          ? "bg-gray-50 text-gray-700 border-gray-200" 
                          : "bg-white text-gray-800 border-gray-300"
                      } px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 transition-all`}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end mt-8">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 size={18} />
                      Lưu thay đổi
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ProfilePage;