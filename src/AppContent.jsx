import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.jsx";
import { Label } from "@/components/ui/label.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
import {
  Search,
  Filter,
  User,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./App.css";
import { Link } from "react-router-dom";
import Alert from "./components/ui/alert.jsx";
import "./components/ui/Alert.css";
import ConfirmDialog from "./components/ui/ConfirmDialog.jsx";
import SuccessDialog from "./components/ui/SuccessDialog.jsx";
import { useAuth } from "./context/AuthContext";
import ValidationError from "./components/ui/ValidationError.jsx";
import { validateLoginForm, validateRegistrationForm } from "./utils/validation.js";
import logo from './assets/AszeAv282h.png'



const API_BASE_URL = "http://localhost:5000/api";

export function AppContent() {
  const { currentUser, isLoadingUser, logout, login, register } = useAuth(); // Используем хук useAuth
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("error");
  const [registrationError, setRegistrationError] = useState(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    isOpen: false,
    productId: null,
    productName: "",
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  // Состояния для валидации форм
  const [validationErrors, setValidationErrors] = useState({
    login: { email: [], password: [] },
    register: { username: [], email: [], password: [] }
  });

  // Фильтры
  const [filters, setFilters] = useState({
    category: "",
    priceMin: "",
    priceMax: "",
    dateFrom: "",
    dateTo: "",
    inStock: "",
  });
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    if (isFilterModalOpen) {
      setTempFilters(filters);
    }
  }, [isFilterModalOpen]); 
  
  // // Функция для показа алерта
  // const showAlert = (message, type) => {
  //   setAlertMessage(message);
  //   setAlertType(type);
  //   setTimeout(() => {
  //     setAlertMessage(null);
  //   }, 3000);
  // };

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

  // Форма авторизации
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    username: "",
  });

  // Функция для загрузки категорий с сервера
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Loaded categories:", data);

      setCategories(data.categories || []);
    } catch (error) {
      console.error("Ошибка при загрузке категорий:", error);
      setCategories([]);
    }
  };

  // Вызываем функцию загрузки категорий при монтировании компонента
  useEffect(() => {
    fetchCategories();
  }, []);

  // Обновите обработчик изменения категории
  const handleCategoryChange = (category) => {
    setTempFilters({
      ...tempFilters,
      category: category,
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [
    searchQuery,
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
    filters,
  ]);

  // Загрузка продуктов
  const fetchProducts = async () => {
    try {
      let url = `${API_BASE_URL}/products/get-products`;

      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", itemsPerPage);
      url = `${url}?${params.toString()}`;

      const requestBody = {};

      if (searchQuery) {
        requestBody.search_query = searchQuery;
      }

      if (filters.category) {
        requestBody.category_id = filters.category;
      }
      if (filters.priceMin) {
        requestBody.min_price = filters.priceMin;
      }
      if (filters.priceMax) {
        requestBody.max_price = filters.priceMax;
      }
      if (filters.dateFrom) {
        requestBody.created_from = filters.dateFrom;
      }
      if (filters.dateTo) {
        requestBody.created_to = filters.dateTo;
      }
      if (filters.inStock !== undefined && filters.inStock !== "") {
        requestBody.in_stock = filters.inStock;
      }
      if (sortField) {
        requestBody.sort_by = sortField;
        requestBody.sort_order = sortDirection;
      }

      console.log("Fetching products from:", url);
      console.log("Request body:", requestBody);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data for products:", data);

      const fetchedProducts = Array.isArray(data.products) ? data.products : [];
      console.log("Processed products:", fetchedProducts);
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
      setTotalProductsCount(data.total || 0);
      setTotalPages(data.pages || 0);
    } catch (error) {
      console.error("Ошибка при загрузке продуктов:", error);
      setProducts([]);
      setFilteredProducts([]);
      setTotalProductsCount(0);
      setTotalPages(0);
    }
  };

  // Применение фильтров
  const applyFilters = () => {
    setFilters(tempFilters);
    setIsFilterModalOpen(false);

    let count = 0;
    if (tempFilters.category) count++;
    if (tempFilters.priceMin || tempFilters.priceMax) count++;
    if (tempFilters.dateFrom || tempFilters.dateTo) count++;
    if (tempFilters.inStock) count++;
    setFilterCount(count);
  };

  // Сортировка
  const handleSort = (field) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    if (field === "category") {
      setSortField("category.name");
    } else {
      setSortField(field);
    }
    setSortDirection(direction);
    setCurrentPage(1);
  };

  // Сброс фильтров
  const resetFilters = () => {
    const defaultFilters = {
      category: "",
      priceMin: "",
      priceMax: "",
      dateFrom: "",
      dateTo: "",
      inStock: "",
    };
    setTempFilters(defaultFilters);
    setFilters(defaultFilters);
    setFilterCount(0);
    setCurrentPage(1);
    setIsFilterModalOpen(false);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEndIndex = Math.min(
    startIndex + products.length,
    totalProductsCount
  );
  const currentProducts = Array.isArray(products)
    ? products.slice(startIndex, endIndex)
    : [];

  // Авторизация
  const handleLogin = async () => {
    // Сброс предыдущих ошибок валидации
    setValidationErrors(prev => ({
      ...prev,
      login: { email: [], password: [] }
    }));

    // Валидация формы входа
    const validation = validateLoginForm(authForm);
    
    if (!validation.isValid) {
      setValidationErrors(prev => ({
        ...prev,
        login: validation.errors
      }));
      return;
    }

    const { success, error } = await login(authForm.email, authForm.password);
    if (success) {
      setIsAuthModalOpen(false);
      setAuthForm({ email: "", password: "", username: "" });
      setValidationErrors({
        login: { email: [], password: [] },
        register: { username: [], email: [], password: [] }
      });
      showAppMessage("Вход выполнен успешно!", "success");
    } else {
      showAppMessage(`Ошибка входа: ${error}`, "error");
    }
  };

  // Регистрация
  const handleRegister = async () => {
    // Сброс предыдущих ошибок
    setRegistrationError(null);
    setValidationErrors(prev => ({
      ...prev,
      register: { username: [], email: [], password: [] }
    }));

    // Валидация формы регистрации
    const validation = validateRegistrationForm(authForm);
    
    if (!validation.isValid) {
      setValidationErrors(prev => ({
        ...prev,
        register: validation.errors
      }));
      return;
    }

    const { success, error } = await register(
      authForm.username,
      authForm.email,
      authForm.password
    );
    if (success) {
      setIsAuthModalOpen(false);
      setAuthForm({ email: "", password: "", username: "" });
      setRegistrationError(null);
      setValidationErrors({
        login: { email: [], password: [] },
        register: { username: [], email: [], password: [] }
      });
      showAppMessage("Регистрация успешна! Теперь вы можете войти.", "success");
    } else {
      if (error === "Пользователь с таким email или именем пользователя уже существует.") {
        showAppMessage(error, "error");
      } else {
        showAppMessage(`Произошла непредвиденная ошибка: ${error}`, "error");
      }
    }
  };

  // Удаление товара (только для админа)
  const handleDeleteProduct = (productId, productName) => {
    setDeleteConfirmDialog({
      isOpen: true,
      productId: productId,
      productName: productName || `товар #${productId}`,
    });
  };

  // Подтверждение удаления товара
  const confirmDeleteProduct = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/${deleteConfirmDialog.productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`, // Используем токен из localStorage
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      showAppMessage("Товар успешно удален!", "success");
      fetchProducts(); // Обновить список продуктов
    } catch (error) {
      console.error("Ошибка удаления товара:", error);
      showAppMessage(`Ошибка удаления товара: ${error.message}`, "error");
    }
  };

  // Закрытие диалога подтверждения удаления
  const closeDeleteConfirmDialog = () => {
    setDeleteConfirmDialog({
      isOpen: false,
      productId: null,
      productName: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="global-alert-container">
        <Alert message={alertMessage} type={alertType} onClose={hideAlert} />
      </div>
      <SuccessDialog
        message={successMessage}
        isOpen={isSuccessDialogOpen}
        onClose={handleCloseSuccessDialog}
        autoCloseDelay={3000} // 3 секунды
      />
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/">
                <img src={logo} alt="QA Automation Garage Logo" className="h-18" />
              </Link>
              <nav className="hidden md:flex space-x-6 ml-6">
                <Link to="/" className="text-blue-600 font-medium">
                  Продукты
                </Link>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Категории
                </a>
                <Link to="/steps" className="text-gray-500 hover:text-gray-700">
                   По шагам
                </Link>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  О проекте
                </a>
              </nav>
            </div>
            <div>
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Привет, {currentUser.email}
                  </span>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <User className="h-4 w-4 mr-2" />
                    Выйти
                  </Button>
                </div>
              ) : (
                <Dialog
                  open={isAuthModalOpen}
                  onOpenChange={setIsAuthModalOpen}
                >
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
                            onChange={(e) =>
                              setAuthForm({
                                ...authForm,
                                email: e.target.value,
                              })
                            }
                            placeholder="user@example.com"
                            className={validationErrors.login.email.length > 0 ? "border-red-500" : ""}
                          />
                          <ValidationError errors={validationErrors.login.email} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Пароль</Label>
                          <Input
                            id="password"
                            type="password"
                            value={authForm.password}
                            onChange={(e) =>
                              setAuthForm({
                                ...authForm,
                                password: e.target.value,
                              })
                            }
                            className={validationErrors.login.password.length > 0 ? "border-red-500" : ""}
                          />
                          <ValidationError errors={validationErrors.login.password} />
                        </div>
                        <Button onClick={handleLogin} className="w-full">
                          Войти
                        </Button>
                      </TabsContent>
                      <TabsContent value="register" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Имя пользователя</Label>
                          <Input
                            id="username"
                            value={authForm.username}
                            onChange={(e) =>
                              setAuthForm({
                                ...authForm,
                                username: e.target.value,
                              })
                            }
                            placeholder="Введите имя пользователя"
                            className={validationErrors.register.username.length > 0 ? "border-red-500" : ""}
                          />
                          <ValidationError errors={validationErrors.register.username} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-email">Email</Label>
                          <Input
                            id="reg-email"
                            type="email"
                            value={authForm.email}
                            onChange={(e) =>
                              setAuthForm({
                                ...authForm,
                                email: e.target.value,
                              })
                            }
                            placeholder="user@example.com"
                            className={validationErrors.register.email.length > 0 ? "border-red-500" : ""}
                          />
                          <ValidationError errors={validationErrors.register.email} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-password">Пароль</Label>
                          <Input
                            id="reg-password"
                            type="password"
                            value={authForm.password}
                            onChange={(e) =>
                              setAuthForm({
                                ...authForm,
                                password: e.target.value,
                              })
                            }
                            placeholder="Введите пароль"
                            className={validationErrors.register.password.length > 0 ? "border-red-500" : ""}
                          />
                          <ValidationError errors={validationErrors.register.password} />
                        </div>
                        {registrationError && (
                          <p className="text-red-500 text-sm mt-2">
                            {registrationError}
                          </p>
                        )}
                        <Button onClick={handleRegister} className="w-full">
                          Зарегистрироваться
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-700 mb-2">
              Продукты ({totalProductsCount})
            </h2>

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
                {!isLoadingUser && currentUser?.role === "admin" && (
                  <Link to="/create-product">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Создать товар
                    </Button>
                  </Link>
                )}

                <Dialog
                  open={isFilterModalOpen}
                  onOpenChange={setIsFilterModalOpen}
                >
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
                        <Select
                          value={
                            tempFilters.category
                              ? tempFilters.category.toString()
                              : ""
                          }
                          onValueChange={(value) => {
                            if (value === "all") {
                              setTempFilters({
                                ...tempFilters,
                                category: null,
                              });
                            } else {
                              setTempFilters({
                                ...tempFilters,
                                category: Number(value),
                              });
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
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
                            value={tempFilters.priceMin}
                            onChange={(e) =>
                              setTempFilters({
                                ...tempFilters,
                                priceMin: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="До"
                            type="number"
                            value={tempFilters.priceMax}
                            onChange={(e) =>
                              setTempFilters({
                                ...tempFilters,
                                priceMax: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Дата создания</Label>
                        <div className="flex space-x-2">
                          <Input
                            type="date"
                            value={tempFilters.dateFrom}
                            onChange={(e) =>
                              setTempFilters({
                                ...tempFilters,
                                dateFrom: e.target.value,
                              })
                            }
                          />
                          <Input
                            type="date"
                            value={tempFilters.dateTo}
                            onChange={(e) =>
                              setTempFilters({
                                ...tempFilters,
                                dateTo: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>В наличии</Label>
                        <RadioGroup
                          value={
                            tempFilters.inStock !== undefined
                              ? String(tempFilters.inStock)
                              : undefined
                          }
                          onValueChange={(value) =>
                            setTempFilters({
                              ...tempFilters,
                              inStock: value === "true" ? true : false,
                            })
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="yes" />
                            <Label htmlFor="yes">Да</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="order" />
                            <Label htmlFor="order">Под заказ</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="flex space-x-2 pt-4">
                        <Button onClick={applyFilters} className="flex-1">
                          Применить
                        </Button>
                        <Button
                          onClick={resetFilters}
                          variant="outline"
                          className="flex-1"
                        >
                          Сбросить
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("id")}
                      className="font-semibold"
                    >
                      ID
                      {sortField === "id" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("name")}
                      className="font-semibold"
                    >
                      Наименование
                      {sortField === "name" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("price")}
                      className="font-semibold"
                    >
                      Цена
                      {sortField === "price" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("category")}
                      className="font-semibold"
                    >
                      Категория
                      {sortField === "category" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("created_at")}
                      className="font-semibold"
                    >
                      Дата создания
                      {sortField === "created_at" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("in_stock")}
                      className="font-semibold"
                    >
                      В наличии
                      {sortField === "in_stock" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </Button>
                  </TableHead>
                  {currentUser?.role === "admin" && (
                    <TableHead className="w-16"></TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(products) &&
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Link
                          to={`/products/${product.id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {product.id}
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.category.name}</TableCell>
                      <TableCell>
                        {new Date(product.created_at).toLocaleDateString(
                          "ru-RU"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={product.in_stock ? "default" : "secondary"}
                        >
                          {product.in_stock ? "Да" : "Под заказ"}
                        </Badge>
                      </TableCell>
                      {currentUser?.role === "admin" && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteProduct(product.id, product.name)
                            }
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
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            {totalProductsCount > 0 ? (
              <>
                {Math.min(
                  (currentPage - 1) * itemsPerPage + 1,
                  totalProductsCount
                )}{" "}
                - {Math.min(currentPage * itemsPerPage, totalProductsCount)} из{" "}
                {totalProductsCount}
              </>
            ) : (
              "Нет товаров"
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={currentPage === 1 ? "outline" : "default"}
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum =
                Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              if (pageNum > totalPages) return null;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant={currentPage === totalPages ? "outline" : "default"}
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
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
                setItemsPerPage(Number(value));
                setCurrentPage(1);
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
        </div>
      </main>

      <footer className="bg-white shadow-sm border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500 text-sm">
          © 2025 QA Automation Garage. Все права не защищены.
        </div>
      </footer>

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
  );
}
