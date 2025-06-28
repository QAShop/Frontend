import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Search, Filter, User, Plus, Trash2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import './App.css'
import { useToast } from '@/components/ui/use-toast'
import { ToastProvider, ToastViewport } from '@/components/ui/toast'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductPage from './ProductPage';

const API_BASE_URL = 'http://localhost:5000/api'

// // Категории товаров
// const CATEGORIES = [
//   'Электроника',
//   'Одежда и аксессуары',
//   'Дом и сад',
//   'Красота и здоровье',
//   'Детские товары',
//   'Спорт и отдых',
//   'Продукты питания',
//   'Книги и канцелярия',
//   'Автотовары'
// ]

function AppContent() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false)
  const [filterCount, setFilterCount] = useState(0)
  const [totalProductsCount, setTotalProductsCount] = useState(0); // Убедитесь, что это объявлено
  const [totalPages, setTotalPages] = useState(0);
  const [token, setToken] = useState(localStorage.getItem('jwt_token'))
  const { toast } = useToast()
  const [categories, setCategories] = useState([]) 

  // Фильтры
  const [filters, setFilters] = useState({
    category: '',
    priceMin: '',
    priceMax: '',
    dateFrom: '',
    dateTo: '',
    inStock: ''
  })

  // Форма авторизации
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    username: ''
  })

  // Форма создания товара
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    in_stock: 'Да'
  })
// Функция для загрузки категорий с сервера  
const fetchCategories = async () => {  
  try {  
    const response = await fetch(`${API_BASE_URL}/products/categories`, {  
      headers: {  
        'Content-Type': 'application/json'  
      }  
    })  
    
    if (!response.ok) {  
      throw new Error(`HTTP error! status: ${response.status}`)  
    }  
    
    const data = await response.json()  
    console.log('Loaded categories:', data)  
    
    // Сохраняем категории в состоянии  
    // Предполагается, что сервер возвращает массив объектов с id и name  
    setCategories(data.categories || [])  
  } catch (error) {  
    console.error('Ошибка при загрузке категорий:', error)  
    setCategories([])  
  }  
}  

// Вызываем функцию загрузки категорий при монтировании компонента  
useEffect(() => {  
  fetchCategories()  
}, [])  

// Обновите обработчик изменения категории  
const handleCategoryChange = (category) => {  
  setFilters({  
    ...filters,  
    category: category // Теперь это id категории, а не название  
  })  
}  

// Загрузка продуктов  
const fetchProducts = async () => {  
  try {  
    // Базовый URL для запроса  
    let url = `${API_BASE_URL}/products/get-products`  
    
    // Query-параметры для пагинации  
    const params = new URLSearchParams()  
    params.append('page', currentPage)  
    params.append('limit', itemsPerPage)  
    url = `${url}?${params.toString()}`  

    // Формируем тело запроса с параметрами фильтрации  
    const requestBody = {}  
    
    if (searchQuery) {  
      requestBody.search_query = searchQuery  
    }  
    
    // Передаем ID категории напрямую  
    if (filters.category) {  
      requestBody.category_id = filters.category  
    }  
    
    if (filters.priceMin) {  
      requestBody.min_price = filters.priceMin  
    }  
    if (filters.priceMax) {  
      requestBody.max_price = filters.priceMax  
    }  
    if (filters.dateFrom) {  
      requestBody.created_from = filters.dateFrom  
    }  
    if (filters.dateTo) {  
      requestBody.created_to = filters.dateTo  
    }  
    if (filters.inStock !== undefined) {  
      requestBody.in_stock = filters.inStock  
    }  
    if (sortField) {  
      requestBody.sort_by = sortField  
      requestBody.sort_order = sortDirection  
    }  

    console.log('Fetching products from:', url)  
    console.log('Request body:', requestBody)  
    
    // Выполняем POST-запрос с телом запроса  
    const response = await fetch(url, {  
      method: 'POST',  
      headers: {  
        'Content-Type': 'application/json'  
      },  
      body: JSON.stringify(requestBody)  
    })  
    
    if (!response.ok) {  
      throw new Error(`HTTP error! status: ${response.status}`)  
    }  
    
    const data = await response.json()  
    console.log('Received data for products:', data)  

    // Ensure data.products is an array and extract it  
    const fetchedProducts = Array.isArray(data.products) ? data.products : [];  
    console.log('Processed products:', fetchedProducts)  
    setProducts(fetchedProducts)  
    setFilteredProducts(fetchedProducts)  
    setTotalProductsCount(data.total || 0); // Обновляем общее количество товаров  
    setTotalPages(data.pages || 0);   
  } catch (error) {  
    console.error('Ошибка при загрузке продуктов:', error)  
    setProducts([])  
    setFilteredProducts([])  
    setTotalProductsCount(0); // Сбрасываем при ошибке  
    setTotalPages(0);   
  }  
}

  // Загрузка информации о пользователе
  const fetchUser = async (jwtToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Received user data:', data)
      // Correctly extract the user object from the nested structure
      setCurrentUser(data.user)
    } catch (error) {
      console.error('Ошибка при получении информации о пользователе:', error)
      setCurrentUser(null)
      localStorage.removeItem('jwt_token')
      setToken(null)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, currentPage, itemsPerPage, sortField, sortDirection, filters]) // Re-fetch on these changes

  useEffect(() => {
    if (token) {
      fetchUser(token)
    }
  }, [token])

  // Применение фильтров
  const applyFilters = () => {
    // Re-fetch products with current filters
    fetchProducts()
    setIsFilterModalOpen(false)

    let count = 0
    if (filters.category) count++
    if (filters.priceMin || filters.priceMax) count++
    if (filters.dateFrom || filters.dateTo) count++
    if (filters.inStock) count++
    setFilterCount(count)
  }

  // Сортировка
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortField(field)
    setSortDirection(direction)
    setCurrentPage(1) // Reset to first page on sort change
  }

  // Сброс фильтров
  const resetFilters = () => {
    setFilters({
      category: '',
      priceMin: '',
      priceMax: '',
      dateFrom: '',
      dateTo: '',
      inStock: ''
    })
    setFilterCount(0)
    setCurrentPage(1)
    setIsFilterModalOpen(false)
    fetchProducts() // Fetch all products again
  }

  // Пагинация (теперь управляется бэкендом, но UI остается)
  // const totalPages = Math.ceil(totalProductsCount / itemsPerPage) // This will need to come from backend total count
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentEndIndex = Math.min(startIndex + products.length, totalProductsCount);
  const currentProducts = Array.isArray(products) ? products.slice(startIndex, endIndex) : []; // Ensure currentProducts is always an array

  // Авторизация
  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: authForm.email, password: authForm.password })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      localStorage.setItem('jwt_token', data.access_token)
      setToken(data.access_token)
      setIsAuthModalOpen(false)
      setAuthForm({ email: '', password: '', username: '' })
    } catch (error) {
      console.error('Ошибка входа:', error)
      alert(`Ошибка входа: ${error.message}`)
    }
  }

  const handleRegister = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: authForm.username, email: authForm.email, password: authForm.password })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      toast({
        title: 'Регистрация успешна!',
        description: 'Теперь вы можете войти.',
        duration: 3000,
        action: <Button onClick={() => toast.dismiss()}>ОК</Button>,
      })
      setIsAuthModalOpen(false)
      setAuthForm({ email: '', password: '', username: '' })
    } catch (error) {
      console.error('Ошибка регистрации:', error)
      alert(`Ошибка регистрации: ${error.message}`)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('jwt_token')
    setToken(null)
  }

  // Удаление товара (только для админа)
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }
        alert('Товар успешно удален!')
        fetchProducts() // Обновить список продуктов
      } catch (error) {
        console.error('Ошибка удаления товара:', error)
        alert(`Ошибка удаления товара: ${error.message}`)
      }
    }
  }

  // Создание товара (только для админа)
  const handleCreateProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      alert('Пожалуйста, заполните все обязательные поля')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: productForm.name,
          price: parseFloat(productForm.price),
          category: productForm.category,
          description: productForm.description,
          // in_stock: productForm.in_stock === 'Да' ? true : false // Adjust based on backend expectation (boolean vs string)
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      alert('Товар успешно создан!')
      setProductForm({
        name: '',
        price: '',
        category: '',
        description: '',
        in_stock: 'Да'
      })
      setIsCreateProductModalOpen(false)
      fetchProducts() // Обновить список продуктов
    } catch (error) {
      console.error('Ошибка создания товара:', error)
      alert(`Ошибка создания товара: ${error.message}`)
    }
  }


return (
  <div className="min-h-screen bg-gray-50">
    {/* Хедер */}
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-blue-600">QA Shop</h1>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-blue-600 font-medium">Продукты</Link>
              <a href="#" className="text-gray-500 hover:text-gray-700">Категории</a>
              <a href="#" className="text-gray-500 hover:text-gray-700">Акции</a>
              <a href="#" className="text-gray-500 hover:text-gray-700">О нас</a>
            </nav>
          </div>
          <div>
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Привет, {currentUser.email}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <User className="h-4 w-4 mr-2" />
                  Личный кабинет
                </Button>
              </div>
            ) : (
              <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
                <DialogTrigger asChild>
                  <Button>Войти / Зарегистрироваться</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Авторизация</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login">Вход</TabsTrigger>
                      <TabsTrigger value="register">Регистрация</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={authForm.email}
                          onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                          placeholder="admin@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                          id="password"
                          type="password"
                          value={authForm.password}
                          onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                        />
                      </div>
                      <Button onClick={handleLogin} className="w-full">Войти</Button>
                    </TabsContent>
                    <TabsContent value="register" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Имя пользователя</Label>
                        <Input
                          id="username"
                          value={authForm.username}
                          onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-email">Email</Label>
                        <Input
                          id="reg-email"
                          type="email"
                          value={authForm.email}
                          onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-password">Пароль</Label>
                        <Input
                          id="reg-password"
                          type="password"
                          value={authForm.password}
                          onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                        />
                      </div>
                      <Button onClick={handleRegister} className="w-full">Зарегистрироваться</Button>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Основной контент */}
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Продукты ({totalProductsCount}) {/* Display total products from API */}
        </h2>
        
        {/* Панель поиска и фильтров */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Введите id или наименование продукта"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser?.role === 'admin' && (
              <Dialog open={isCreateProductModalOpen} onOpenChange={setIsCreateProductModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Создать товар
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Создание товара</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Название товара *</Label>
                      <Input
                        id="product-name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        placeholder="Введите название товара"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="product-price">Цена *</Label>
                      <Input
                        id="product-price"
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Категория *</Label>
                      <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.name} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    
                    <div className="space-y-2">
                      <Label>В наличии</Label>
                      <RadioGroup value={productForm.in_stock} onValueChange={(value) => setProductForm({...productForm, in_stock: value})}>
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
                    
                    <div className="flex space-x-2 pt-4">
                      <Button onClick={handleCreateProduct} className="flex-1">
                        Создать
                      </Button>
                      <Button onClick={() => setIsCreateProductModalOpen(false)} variant="outline" className="flex-1">
                        Отмена
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            
            <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Фильтры{filterCount > 0 && `(${filterCount})`}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Фильтры</DialogTitle>
                </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Категория</Label>
                      <Select value={filters.category?.id?.toString() || "all"} onValueChange={(value) => {
                        if (value === "all") {  
                          setFilters({...filters, category: null});  
                        } else {  
                          const selectedCategory = categories.find(c => c.id.toString() === value);  
                          setFilters({...filters, category: selectedCategory});  
                        }  
                      }
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Пустой вариант для сброса фильтра */}  
                          <SelectItem value="all">Все категории</SelectItem>
                          {/* Используем категории с сервера */}  
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id.toString()}>  
                            {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Цена</Label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="От"
                          type="number"
                          value={filters.priceMin}
                          onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                        />
                        <Input
                          placeholder="До"
                          type="number"
                          value={filters.priceMax}
                          onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Дата создания</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="date"
                          value={filters.dateFrom}
                          onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                        />
                        <Input
                          type="date"
                          value={filters.dateTo}
                          onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>В наличии</Label>
                      <RadioGroup value={filters.inStock} onValueChange={(value) => setFilters({...filters, inStock: value})}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Да" id="yes" />
                          <Label htmlFor="yes">Да</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Под заказ" id="order" />
                          <Label htmlFor="order">Под заказ</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="flex space-x-2 pt-4">
                      <Button onClick={applyFilters} className="flex-1">
                        Применить
                      </Button>
                      <Button onClick={resetFilters} variant="outline" className="flex-1">
                        Сбросить
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            
            
            <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Фильтры{filterCount > 0 && `(${filterCount})`}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Фильтры</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Категория</Label>
                    <Select value={filters.category ? filters.category.toString() : ""} onValueChange={(value) => {
                      if (value === "all") {  
                        setFilters({...filters, category: null});  
                      } else {  
                        // Сохраняем только ID категории, а не весь объект  
                        setFilters({...filters, category: Number(value)});  
                      }  
                    }} 
                      >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Цена</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="От"
                        type="number"
                        value={filters.priceMin}
                        onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                      />
                      <Input
                        placeholder="До"
                        type="number"
                        value={filters.priceMax}
                        onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Дата создания</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                      />
                      <Input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>В наличии</Label>
                    <RadioGroup value={filters.inStock} onValueChange={(value) => setFilters({...filters, inStock: value})}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Да" id="yes" />
                        <Label htmlFor="yes">Да</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Под заказ" id="order" />
                        <Label htmlFor="order">Под заказ</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={applyFilters} className="flex-1">
                      Применить
                    </Button>
                    <Button onClick={resetFilters} variant="outline" className="flex-1">
                      Сбросить
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Таблица товаров */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('id')} className="font-semibold">
                    ID
                    {sortField === 'id' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('name')} className="font-semibold">
                    Наименование
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('price')} className="font-semibold">
                    Цена
                    {sortField === 'price' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('category')} className="font-semibold">
                    Категория
                    {sortField === 'category' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('created_at')} className="font-semibold">
                    Дата создания
                    {sortField === 'created_at' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('in_stock')} className="font-semibold">
                    В наличии
                    {sortField === 'in_stock' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                {currentUser?.role === 'admin' && (
                  <TableHead className="w-16"></TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(products) && products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Link to={`/product/${product.id}`} className="text-blue-600 hover:underline font-medium">
                      {product.id}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>{new Date(product.created_at).toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell>
                    <Badge variant={product.in_stock ? 'default' : 'secondary'}>
                      {product.in_stock ? 'Да' : 'Под заказ'}
                    </Badge>
                  </TableCell>
                  {currentUser?.role === 'admin' && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
        {/* Пагинация */}
        <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          {totalProductsCount > 0 ? (
            <>
              {startIndex + 1} - {currentEndIndex} из {totalProductsCount} {/* Должно отображать "1 - 20 из 47" */}
            </>
          ) : (
            "Нет товаров"
          )}
        </div>

          
          <div className="flex items-center space-x-2">
            <Button
              variant={currentPage === 1 ? 'outline' : 'default'}
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
              if (pageNum > totalPages) return null
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
            
            <Button
              variant={currentPage === totalPages ? 'outline' : 'default'}
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="items-per-page">Отображать на странице:</Label>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value))
                setCurrentPage(1) // Reset to first page when items per page changes
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </main>
    </div>
  
)
}

function App() {
return (
  <Router>
    <ToastProvider>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
      <ToastViewport />
    </ToastProvider>
  </Router>
);
}

export default App


