import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from '../assets/AszeAv282h.png';
import { useState } from 'react';

function Header() {
  const { currentUser, logout, login, register } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [registrationError, setRegistrationError] = useState(null);

  const handleLogin = async () => {
    const { success, error } = await login(authForm.email, authForm.password);
    if (success) {
      setIsAuthModalOpen(false);
      setAuthForm({ email: "", password: "", username: "" });
    } else {
      console.error(`Ошибка входа: ${error}`);
    }
  };

  const handleRegister = async () => {
    setRegistrationError(null);
    const { success, error } = await register(
      authForm.username,
      authForm.email,
      authForm.password
    );
    if (success) {
      setIsAuthModalOpen(false);
      setAuthForm({ email: "", password: "", username: "" });
      setRegistrationError(null);
    } else {
      if (error.includes("409")) {
        setRegistrationError(
          error.replace("HTTP error! status: 409: ", "") ||
            "Пользователь с таким email или именем пользователя уже существует."
        );
      } else {
        console.error(`Произошла непредвиденная ошибка: ${error}`);
      }
    }
  };

  return (
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
              <Link to="/roadmap" className="text-gray-500 hover:text-gray-700">
               Roadmap
              </Link>
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
                          placeholder="admin@example.com"
                        />
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
                        />
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
                        />
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
                        />
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
                        />
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
  );
}

export default Header;


