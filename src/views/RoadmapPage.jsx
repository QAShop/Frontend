
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RoadmapPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const phases = [
    {
      id: 1,
      icon: '🧱',
      title: 'Этап 1: Основы и подготовка',
      subtitle: '"Закладываем фундамент"',
      borderColor: 'border-blue-500',
      items: [
        { icon: '🏁', title: 'Старт!', desc: 'Мой путь, цели и демонстрация приложения.' },
        { icon: '🛠️', title: 'Выбор инструментов:', desc: 'Python, Pytest, Requests для API.' },
        { icon: '💻', title: 'Настройка рабочего места:', desc: 'PyCharm, Git, venv.' },
        { icon: '🌿', title: 'Git для начинающих:', desc: 'commit, push, pull.' },
        { icon: '🔍', title: '"Разведка":', desc: 'Исследование API через Postman/Swagger.' },
        { icon: '🐍', title: 'Практика Python:', desc: 'Работа с JSON и словарями.' }
      ],
      result: 'Готовое к работе окружение, понимание основ Git и API тестируемого приложения. Написаны первые скрипты для работы с данными.'
    },
    {
      id: 2,
      icon: '🏗️',
      title: 'Этап 2: Строим API-фреймворк',
      subtitle: '"Общение с сервером на \'ты\'"',
      borderColor: 'border-orange-500',
      items: [
        { icon: '✅', title: 'Первый API-тест', desc: 'с `requests` и `pytest`.' },
        { icon: '📂', title: 'Структура фреймворка:', desc: 'папки, клиенты, модели.' },
        { icon: '📦', title: 'API-клиент', desc: 'для инкапсуляции запросов.' },
        { icon: '📄', title: 'Валидация схем', desc: 'ответа с `Pydantic`.' },
        { icon: '🔄', title: 'Тестируем CRUD', desc: '(POST, GET, PUT, DELETE).' },
        { icon: '⚙️', title: 'Фикстуры PyTest', desc: 'для независимости тестов.' },
        { icon: '🔑', title: 'Авторизация', desc: 'и работа с токенами.' }
      ],
      result: 'Полноценный, структурированный и расширяемый фреймворк для API-тестирования, покрывающий основной функционал.'
    },
    {
      id: 3,
      icon: '🎨',
      title: 'Этап 3: Переходим к UI',
      subtitle: '"Рисуем автоматизацию"',
      borderColor: 'border-yellow-600',
      items: [
        { icon: '🎬', title: 'Новый старт:', desc: 'Выбор Playwright/Selenium.' },
        { icon: '🏛️', title: 'Структура UI-фреймворка:', desc: 'Page Object Model.' },
        { icon: '🖱️', title: 'Первый UI-тест:', desc: 'логин и проверка результата.' },
        { icon: '🎯', title: 'Локаторы и ожидания,', desc: 'борьба с "flaky".' },
        { icon: '🎭', title: 'Генерация данных', desc: 'с `Faker` для форм.' },
        { icon: '🚶‍♂️', title: 'Сквозной сценарий:', desc: 'Покрываем путь юзера.' }
      ],
      result: 'Создан второй фреймворк для UI-тестов на базе паттерна POM, способный автоматизировать ключевые пользовательские сценарии.'
    },
    {
      id: 4,
      icon: '🚀',
      title: 'Этап 4: Интеграция и CI/CD',
      subtitle: '"Два фреймворка — одна команда"',
      borderColor: 'border-green-500',
      items: [
        { icon: '🔗', title: 'Синергия:', desc: 'Готовим данные через API для UI-тестов.' },
        { icon: '📊', title: 'Allure Reports:', desc: 'Единый красивый отчёт для всего.' },
        { icon: '🤖', title: 'GitHub Actions:', desc: 'Автозапуск тестов в CI.' },
        { icon: '⚡', title: 'Оптимизация:', desc: 'Параллельный и Headless-запуск.' },
        { icon: '🔔', title: 'Уведомления', desc: 'о результатах в Telegram.' },
        { icon: '🏆', title: 'Финал!', desc: 'Ретроспектива и демонстрация.' }
      ],
      result: 'Два фреймворка интегрированы в единый CI/CD-пайплайн с автоматическим запуском, сборкой отчётов и отправкой уведомлений.'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % phases.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + phases.length) % phases.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Роадмап "QA Automation garage"
          </h1>
          <p className="text-lg text-gray-600">
            От старта до полной автоматизации с CI/CD
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative pt-4 pb-12">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            disabled={currentSlide === 0}
          >
            <ChevronLeft className={`w-6 h-6 ${currentSlide === 0 ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            disabled={currentSlide === phases.length - 1}
          >
            <ChevronRight className={`w-6 h-6 ${currentSlide === phases.length - 1 ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>

          {/* Carousel Content */}
          <div className="overflow-x-hidden overflow-y-visible">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {phases.map((phase, index) => (
                <div key={phase.id} className="w-full flex-shrink-0 px-4 pb-4">
                  <div className={`bg-white rounded-xl shadow-lg border-t-4 ${phase.borderColor} p-6 mx-auto max-w-4xl`}>
                    {/* Phase Header */}
                    <div className="flex items-center mb-5">
                      <div className="text-4xl mr-4">{phase.icon}</div>
                      <div className="flex flex-col">
                        <div className="text-xl font-bold text-gray-800">
                          {phase.title}
                        </div>
                        <div className="text-sm italic text-gray-600">
                          {phase.subtitle}
                        </div>
                      </div>
                    </div>

                    {/* Content - Two columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Items List */}
                      <div>
                        <div className="space-y-3">
                          {phase.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-start">
                              <span className="text-lg mr-3 flex-shrink-0 pt-0.5">{item.icon}</span>
                              <div className="text-sm leading-relaxed">
                                <strong>{item.title}</strong> {item.desc}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Result */}
                      <div className="lg:border-l-2 lg:border-gray-200 lg:pl-6">
                        <div className="font-semibold text-gray-700 mb-3 text-base">
                          Ключевой результат модуля:
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed">
                          {phase.result}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-6 space-x-2">
            {phases.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="text-center mt-3">
            <span className="text-sm text-gray-500">
              {currentSlide + 1} из {phases.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
