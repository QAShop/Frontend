import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Edit, Trash2 } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import ConfirmDialog from '@/components/ui/ConfirmDialog.jsx';
import SuccessDialog from '@/components/ui/SuccessDialog.jsx'; // Импорт SuccessDialog
import Alert from '@/components/ui/alert.jsx'; // Импорт Alert для ошибок
import '@/components/ui/Alert.css'; // Импорт стилей Alert
import placeholderImage from '@/assets/197dfaf0172a5.jpg'; 

const API_BASE_URL = 'http://localhost:5000/api';

function ProductPage( ) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    isOpen: false,
    productName: ''
  });

  // Новые состояния для SuccessDialog и Alert
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('error');

  // Модифицированная функция для показа сообщений (объединяет Alert и SuccessDialog)
  const showAppMessage = (message, type) => {
    if (type === 'success') {
      setSuccessMessage(message);
      setIsSuccessDialogOpen(true);
    } else {
      setAlertMessage(message);
      setAlertType(type);
      setTimeout(() => {
        setAlertMessage(null);
      }, 5000); // Ошибки могут висеть дольше
    }
  };

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
    setSuccessMessage(null);
  };

  const hideAlert = () => {
    setAlertMessage(null);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleDeleteProduct = () => {
    setDeleteConfirmDialog({
      isOpen: true,
      productName: product?.name || `товар #${productId}`
    });
  };

  const confirmDeleteProduct = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      showAppMessage('Товар успешно удален!', 'success'); // Используем showAppMessage
      setTimeout(() => {
        navigate('/'); // Редирект на главную страницу после показа сообщения
      }, 2000); // Задержка перед редиректом

    } catch (error) {
      console.error('Ошибка удаления товара:', error);
      showAppMessage(`Ошибка удаления товара: ${error.message}`, 'error'); // Используем showAppMessage
    }
  };

  const closeDeleteConfirmDialog = () => {
    setDeleteConfirmDialog({
      isOpen: false,
      productName: ''
    });
  };

  const handleEditProduct = () => {
    navigate(`/edit-product/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-700">Загрузка товара...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-red-500">Ошибка при загрузке товара: {error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-700">Товар не найден.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Контейнер для глобального алерта */}
      <div className="global-alert-container">
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={hideAlert}
        />
      </div>

      {/* Success Dialog (для успешных сообщений) */}
      <SuccessDialog
        message={successMessage}
        isOpen={isSuccessDialogOpen}
        onClose={handleCloseSuccessDialog}
        autoCloseDelay={3000} // 3 секунды
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Назад к продуктам
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg rounded-lg overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Секция изображения */}
              <div className="md:w-1/2 flex justify-center items-start bg-gray-100 rounded-md p-4">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="max-w-full h-auto max-h-96 object-contain rounded-md"
                    style={{ alignSelf: 'flex-start' }} 
                  />
                ) : (
                  <img
                    src={placeholderImage}
                    alt="Изображение отсутствует"
                    className="max-w-full h-auto max-h-96 object-contain rounded-md"
                    style={{ alignSelf: 'flex-start' }} 
                  />
                )}
              </div>

              {/* Секция информации о товаре */}
              <div className="md:w-1/2 space-y-6">
                <CardTitle className="text-4xl font-extrabold text-gray-900 leading-tight">
                  {product.name}
                </CardTitle>

                <div className="flex items-baseline space-x-4">
                  <p className="text-5xl font-bold text-blue-600">
                    {product.price.toFixed(2)} QAZ
                  </p>
                  <p className="text-lg text-gray-500">за шт.</p>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-700 text-lg">
                    <strong>Категория:</strong>{' '}
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {product.category.name || product.category}
                    </Badge>
                  </p>
                  <p className="text-gray-700 text-lg">
                    <strong>Наличие:</strong>{' '}
                    <Badge variant={product.in_stock ? 'default' : 'secondary'} className="text-base px-3 py-1">
                      {product.in_stock ? 'Да' : 'Под заказ'}
                    </Badge>
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Описание:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description || 'Описание товара отсутствует.'}
                  </p>
                </div>

                {/* Кнопки действий */}
                <div className="pt-4 space-y-3">
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3">
                    Добавить в корзину
                  </Button>
                  
                  {/* Кнопки для администратора */}
                  {currentUser?.role === 'admin' && (
                    <div className="flex space-x-3">
                      <Button 
                        onClick={handleEditProduct}
                        size="lg" 
                        variant="outline" 
                        className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Редактировать
                      </Button>
                      <Button 
                        onClick={handleDeleteProduct}
                        size="lg" 
                        variant="outline" 
                        className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Удалить
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Диалог подтверждения удаления */}
        <ConfirmDialog
          isOpen={deleteConfirmDialog.isOpen}
          onClose={closeDeleteConfirmDialog}
          onConfirm={confirmDeleteProduct}
          title="Удаление товара"
          message={`Вы уверены, что хотите удалить "${deleteConfirmDialog.productName}"? Это действие нельзя отменить.`}
          confirmText="Удалить"
          cancelText="Отмена"
          variant="destructive"
        />
      </div>
    </div>
  );
}

export default ProductPage;


