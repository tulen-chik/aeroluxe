Название проекта: AeroLuxe
Стек технологий: Next.js, Supabase, Tailwind CSS

Описание:
AeroLuxe — это удобное веб-приложение для поиска и покупки авиабилетов. Проект разработан с использованием Next.js для обеспечения высокой производительности и SEO-оптимизации. Supabase используется в качестве базы данных и бэкенда, предоставляя мощный API для управления данными и аутентификации пользователей. Интерфейс создан с использованием Tailwind CSS, что делает его современным и адаптивным.

Основные функции:
Поиск авиабилетов по направлениям и датам.
Аутентификация пользователей через Supabase Auth.
Возможность бронирования билетов для авторизованных пользователей.
Просмотр истории бронирований и управление ими.
Адаптивный дизайн для удобного использования на любых устройствах.

Ссылки: https://aeroluxe.vercel.app/

Как запустить проект локально:
Клонируйте репозиторий:

bash
Copy
git clone https://github.com/tulen-chik/aeroluxe.git
Установите зависимости:
bash
Copy
cd aeroluxe
npm install
Создайте файл .env.local и добавьте переменные окружения для Supabase:

env
Copy
NEXT_PUBLIC_SUPABASE_URL=ваш_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_ключ
Запустите проект:

bash
Copy
npm run dev
Вклад в проект:
Если вы хотите внести свой вклад в проект, пожалуйста, создайте pull request. Мы приветствуем любые улучшения, исправления багов и новые идеи!
