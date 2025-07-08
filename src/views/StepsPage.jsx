
import React, { useState } from 'react';

const AccordionItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ border: '1px solid #ccc', marginBottom: '10px', borderRadius: '5px' }}>
      <div
        style={{
          padding: '10px',
          backgroundColor: '#f0f0f0',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onClick={toggleAccordion}
      >
        <h3>{title}</h3>
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div style={{ padding: '10px', borderTop: '1px solid #eee' }}>
          {content}
        </div>
      )}
    </div>
  );
};

const StepsPage = () => {
  const accordionData = [
    {
      title: 'Шпаргалка №2: Создание `venv`',
      content: (
        <>
          <p>Чтобы не устраивать свалку из библиотек, создаем для нашего проекта изолированное пространство. Это делается всего двумя командами.</p>
          <ol>
            <li>
              <strong>Создаем папку для проекта.</strong> Заходим в нее через командную строку. Например:
              <ul>
                <li><code>mkdir my-test-project</code></li>
                <li><code>cd my-test-project</code></li>
              </ul>
            </li>
            <li>
              <strong>Создаем виртуальное окружение.</strong> Выполняем команду:
              <ul>
                <li><code>python -m venv venv</code></li>
                <li><em>Что это значит:</em> <code>python, запусти модуль venv и создай окружение в папке с именем venv</code>.</li>
              </ul>
            </li>
            <li>
              <strong>Активируем его.</strong> Это нужно делать каждый раз, когда вы начинаете работать над проектом.
              <ul>
                <li><strong>Для Windows:</strong> <code>venv\\Scripts\\activate</code></li>
                <li><strong>Для MacOS/Linux:</strong> <code>source venv/bin/activate</code></li>
              </ul>
            </li>
          </ol>
          <p>После активации в начале строки терминала появится <code>(venv)</code>. Это значит, что вы в "чистой комнате", и все библиотеки, которые вы установите, попадут только сюда.</p>
        </>
      ),
    },
    // Add more accordion items here if needed
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>По шагам</h1>
      {accordionData.map((item, index) => (
        <AccordionItem key={index} title={item.title} content={item.content} />
      ))}
    </div>
  );
};

export default StepsPage;


