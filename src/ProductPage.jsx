import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Добавил Link для кнопки "Назад"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Добавил Button
import { ChevronLeft } from 'lucide-react'; // Добавил иконку для кнопки "Назад"

const API_BASE_URL = 'http://localhost:5000/api';

function ProductPage( ) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Предполагаем, что одиночный товар приходит в поле 'product'
        // Если ваш API возвращает товар напрямую, используйте setProduct(data);
        setProduct(data.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
              <div className="md:w-1/2 flex justify-center items-center bg-gray-100 rounded-md p-4">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="max-w-full h-auto max-h-96 object-contain rounded-md"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-500 rounded-md">
                    Нет изображения
                  </div>
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
                      {product.category.name || product.category} {/* Учитываем, что category может быть объектом или строкой */}
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

                {/* Кнопки действий, если нужны (например, "Добавить в корзину") */}
                <div className="pt-4">
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3">
                    Добавить в корзину
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProductPage;
