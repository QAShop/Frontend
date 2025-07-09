// content/step1.js
import React from 'react';

const step1Instructions = (
  <div class="container">
  <p className="mb-2">Мы начинаем новый проект для автоматизированного тестирования и настраиваем виртуальное окружение, чтобы всё было изолировано и аккуратно. Назовём его <strong className="font-semibold text-burgundy">QAshop</strong>.</p>
  
  <ol className="list-decimal list-inside space-y-2">
    <li>
      <strong className="font-semibold">Мы создаём каталог проекта:</strong> Сначала, создаём папку для проекта. Это поможет нам организовать все файлы. Например, назовём её <strong className="font-semibold text-burgundy">QAshop_test</strong>.
    </li>
    <li>
      <strong className="font-semibold">Мы устанавливаем виртуальное окружение:</strong> Переходим в созданную папку и устанавливаем виртуальное окружение с именем <strong className="font-semibold text-burgundy">QAshop</strong>. Это позволит избежать конфликтов версий библиотек с другими проектами. Выполняем команду:
      <pre><code className="bg-gray-100 p-1 rounded">python3 -m venv QAshop</code></pre>
    </li>
    <li>
      <strong className="font-semibold">Мы активируем виртуальное окружение:</strong> Теперь нам нужно активировать это окружение.
      <ul className="list-disc list-inside ml-4">
        <li><strong className="font-semibold">В Linux/macOS:</strong>
          <pre><code className="bg-gray-100 p-1 rounded">source QAshop/bin/activate</code></pre>
        </li>
        <li><strong className="font-semibold">В Windows:</strong>
          <pre><code className="bg-gray-100 p-1 rounded">QAshop\Scripts\activate</code></pre>
        </li>
      </ul>
      <p className="mt-2">После активации, вы увидите <strong className="font-semibold text-burgundy">QAshop</strong> в начале строки командной строки.</p>
    </li>
    <li>
      <strong className="font-semibold">Мы устанавливаем необходимые зависимости:</strong> Теперь установим <strong className="font-semibold text-burgundy">pytest</strong> и <strong className="font-semibold text-burgundy">requests</strong>:
      <pre><code className="bg-gray-100 p-1 rounded">pip install pytest requests</code></pre>
    </li>
    <li>
      <strong className="font-semibold">Мы создаём простой тест:</strong> Создадим файл <strong className="font-semibold text-burgundy">test_example.py</strong> в каталоге <strong className="font-semibold text-burgundy">QAshop_test</strong> и добавим туда простой тест:
      <pre><code className="bg-gray-100 p-1 rounded"> import requests                                                                  </code></pre>
      <pre><code className="bg-gray-100 p-1 rounded"> def test_connection():                                                           </code></pre>
      <pre><code className="bg-gray-100 p-1 rounded">      response = requests.get("https://www.example.com")  # Замените на ваш URL   </code></pre>
      <pre><code className="bg-gray-100 p-1 rounded">      assert response.status_code == 200, "Сайт не отвечает"                      </code></pre>
    </li>
    <li>
      <strong className="font-semibold">Мы запускаем тест:</strong> Запускаем тест, чтобы убедиться, что всё работает:
      <pre><code className="bg-gray-100 p-1 rounded">pytest</code></pre>
      <p className="mt-2">Если тест проходит успешно, вы увидите что-то вроде <code className="bg-gray-100 p-1 rounded">1 passed</code> в выводе <code className="bg-gray-100 p-1 rounded">pytest</code>.</p>
    </li>
  </ol>
</div>
);

export default step1Instructions;