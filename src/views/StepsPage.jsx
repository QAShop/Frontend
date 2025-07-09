import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { ChevronUp, ChevronDown } from "lucide-react";
import step1Instructions from '/content/step1';
import step2Instructions from '/content/step2'; // Импорт контента для первого шага

const AccordionItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Card className="mb-4">
      <CardHeader
        className="flex flex-row items-center justify-between p-4 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-t-lg"
        onClick={toggleAccordion}
      >
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <span>
          {isOpen ? <ChevronUp className="h-5 w-5 text-gray-600" /> : <ChevronDown className="h-5 w-5 text-gray-600" />}
        </span>
      </CardHeader>
      {isOpen && (
        <CardContent className="p-4 border-t border-gray-200">
          {content}
        </CardContent>
      )}
    </Card>
  );
};

const StepsPage = () => {
  const accordionData = [
    {
      title: 'Шаг 1: Установка Python',
      content: step1Instructions,  // Использование импортированных инструкций для шага 1
    },
    {
      title: 'Шаг 2: Новые инструкции', // Шаблон для второй инструкции
      content: step2Instructions,
    },
    {
      title: 'Шаг 3: ', // Шаблон для третьей инструкции
      content: <p>Контент для шага 3...</p>,
    },
    {
      title: 'Шаг 4: ', // Шаблон для четвертой инструкции
      content: <p>Контент для шага 4...</p>,
    },
    {
      title: 'Шаг 5: ', // Шаблон для пятой инструкции
      content: <p>Контент для шага 5...</p>,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-700 mb-6">По шагам</h1>
          {accordionData.map((item, index) => (
            <AccordionItem key={index} title={item.title} content={item.content} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default StepsPage;