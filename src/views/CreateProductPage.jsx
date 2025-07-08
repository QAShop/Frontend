import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { ArrowLeft } from 'lucide-react';
import Alert from '../components/ui/alert.jsx';
import '../components/ui/Alert.css';
import SuccessDialog from '../components/ui/SuccessDialog';

import { API_BASE_URL } from '../config';

function CreateProductPage() {
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem('jwt_token'));
  const [categories, setCategories] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('error');
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  // Форма создания товара
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: 0, // Будет хранить ID категории как число
    description: '',
    image_url: '',
    in_stock: 'Да'
  });

  // Модифицированная функция для показа сообщений (объединяет showAlert и SuccessDialog)
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

  // Функция для скрытия алерта
  const hideAlert = () => {
    setAlertMessage(null);
  };

  // Загрузка категорий
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Создание товара
  const handleCreateProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.category || productForm.category === 0) {
      showAppMessage('Пожалуйста, заполните все обязательные поля', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: productForm.name,
          price: parseFloat(productForm.price),
          category: productForm.category, // Теперь отправляем ID категории
          description: productForm.description,
          image_url: productForm.image_url,
          in_stock: productForm.in_stock === 'Да'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      showAppMessage('Товар успешно создан!', 'success');
      
      // Сбрасываем форму
      setProductForm({
        name: '',
        price: '',
        category: 0,
        description: '',
        image_url: '',
        in_stock: 'Да'
      });

      // Перенаправляем на главную страницу через 2 секунды
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Ошибка создания товара:', error);
      showAppMessage(`Ошибка создания товара: ${error.message}`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Контейнер для глобального алерта */}
      <div className="global-alert-container">
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={hideAlert}
        />
      </div>
      <SuccessDialog
        message={successMessage}
        isOpen={isSuccessDialogOpen}
        onClose={handleCloseSuccessDialog}
        autoCloseDelay={3000} // 3 секунды
      />

      {/* Хедер */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-blue-600">QA Shop</h1>
              <nav className="hidden md:flex space-x-6">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/')}
                  className="text-blue-600 font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад к продуктам
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Создание нового товара
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="product-name">Название товара *</Label>
              <Input
                id="product-name"
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                placeholder="Введите название товара"
              />
            </div>
            
            {/* Поля цены и категории в одной строке */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Поле цены: убраны стрелки, уменьшена ширина */}
              <div className="space-y-2 w-full sm:w-32">
                <Label htmlFor="product-price">Цена *</Label>
                <Input
                  id="product-price"
                  type="text" // Изменено на text для скрытия стрелок
                  inputMode="numeric" // Подсказка для мобильных устройств
                  pattern="[0-9]*[.,]?[0-9]*" // Для валидации числового ввода
                  value={productForm.price}
                  onChange={(e) => {
                    // Разрешаем только числа и одну точку/запятую
                    const value = e.target.value;
                    if (value === '' || /^[0-9]*[.,]?[0-9]*$/.test(value)) {
                      setProductForm({...productForm, price: value});
                    }
                  }}
                  placeholder="0.00"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2 flex-1">
                <Label>Категория *</Label>
                <Select 
                  value={productForm.category.toString()} 
                  onValueChange={(value) => setProductForm({...productForm, category: parseInt(value)})} // Сохраняем ID как число
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}> {/* Используем ID как value */}
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product-description">Описание</Label>
              <Input
                id="product-description"
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                placeholder="Описание товара"
              />
            </div>

            {/* Поле для URL изображения и предпросмотр */}
            <div className="space-y-2">
              <Label htmlFor="product-image-url">URL изображения</Label>
              <Input
                id="product-image-url"
                value={productForm.image_url}
                onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                placeholder="Введите URL изображения"
              />
              {productForm.image_url && (
                <div className="mt-4 p-2 border rounded-md bg-gray-100 flex justify-center items-center overflow-hidden">
                  <img 
                    src={productForm.image_url} 
                    alt="Предпросмотр изображения" 
                    className="max-w-full max-h-48 object-contain"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/150?text=Неверный+URL" }} // Запасное изображение при ошибке
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>В наличии</Label>
              <RadioGroup 
                value={productForm.in_stock} 
                onValueChange={(value) => setProductForm({...productForm, in_stock: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Да" id="stock-yes" />
                  <Label htmlFor="stock-yes">Да</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Под заказ" id="stock-order" />
                  <Label htmlFor="stock-order">Под заказ</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex space-x-4 pt-6">
              <Button onClick={handleCreateProduct} className="flex-1">
                Создать товар
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                className="flex-1"
              >
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default CreateProductPage;


