# 🐱 NEKOMODA — Personal Shopping con IA

**NEKOMODA** es una aplicación web de recomendación de moda impulsada por inteligencia artificial. Responde 5 preguntas sobre tu estilo y el algoritmo KNN encuentra las prendas, eventos y promociones perfectas para ti.

## 🧪 Rama Demo

Esta rama (`demo`) está configurada para funcionar **sin necesidad de registro, cuentas de usuario ni Firebase**. Todo el estado se mantiene en memoria durante la sesión del servidor.

### Cómo probar

```bash
npm install
npm run dev
```

Abre `http://localhost:3000` — la app ya está lista para usar con el usuario demo (`Demo Nekoda`). Puedes navegar por todas las funcionalidades sin registrarte.

## ✨ Funcionalidades

### Landing Page `/`
- Presentación de la marca con productos destacados y colecciones populares
- Acceso directo a Dashboard, Ajustes y Perfil

### Dashboard `/dashboard`
- Recomendaciones personalizadas de ropa, eventos y promociones
- Tabs para filtrar por tipo
- Las recomendaciones usan el perfil de estilo del usuario demo

### Onboarding `/onboarding`
- 5 preguntas para definir tu perfil de estilo
- Las respuestas se guardan en memoria y alimentan el algoritmo KNN

### Feed Social `/feed`
- Outfits creados por la comunidad (datos semilla)
- Pestañas "Descubrir" y "Siguiendo"
- Interacción básica (likes)

### Crear Outfit `/outfit/new`
- Selecciona productos del catálogo para armar un outfit
- Elige visibilidad: público, seguidores o privado
- El outfit se guarda en memoria y aparece en el feed

### Favoritos `/favorites`
- Guarda productos como favoritos desde cualquier vista
- Vista dedicada para ver y gestionar tus favoritos

### Perfil `/profile`
- Información del usuario demo
- Acceso a outfits creados

### Ajustes `/settings`
- Modifica tu perfil de estilo en cualquier momento
- Las respuestas se re-procesan para afinar recomendaciones

## 🏗️ Arquitectura

```
src/
├── pages/              # Next.js Pages Router
│   ├── api/            # API routes (backend)
│   │   ├── auth/       # Login/register (redirigen en demo)
│   │   ├── outfits/    # Like, compatibility
│   │   ├── collections.ts
│   │   ├── favorites.ts
│   │   ├── feed.ts
│   │   ├── onboarding.ts
│   │   ├── products.ts
│   │   ├── recommendations.ts
│   │   └── suggestions.ts
│   ├── _app.tsx        # Auto-entra en modo demo
│   ├── index.tsx       # Landing page
│   ├── dashboard.tsx
│   ├── favorites.tsx
│   ├── feed.tsx
│   ├── login.tsx       # Redirige a /dashboard
│   ├── onboarding.tsx
│   ├── profile.tsx
│   ├── register.tsx    # Redirige a /onboarding
│   ├── settings.tsx
│   └── outfit/
│       └── new.tsx     # Crear outfit
├── components/         # UI components
│   ├── CatLogo.tsx     # Logo Snowshoe
│   ├── Navbar.tsx
│   ├── ItemCard.tsx
│   ├── SkeletonLoader.tsx
│   └── EmptyState.tsx
├── domain/             # Capa de dominio (hexagonal)
│   ├── entities/       # User, Outfit, ClothingItem, etc.
│   ├── ports/          # Interfaces de repositorio
│   ├── services/       # UserAffinityService, KNN
│   └── value-objects/  # TasteVector
├── application/        # Casos de uso
│   └── use-cases/      # CreateOutfit, RecommendItems, etc.
└── infrastructure/     # Implementaciones concretas
    ├── demo/           # demoMode.ts, demoMiddleware.ts
    ├── firebase/       # InMemory*Repository, Firestore*
    └── web/lib/        # apiClient.ts, recommendations.ts
```

## 🔧 Modo Demo

El modo demo se activa automáticamente:
- **Client-side**: `_app.tsx` llama a `enterDemoMode()` al cargar, que establece el usuario demo en `localStorage`
- **API calls**: `apiClient.ts` agrega automáticamente el header `x-demo-mode: true` a todas las peticiones
- **Server-side**: Las API routes detectan el header y usan repositorios en memoria (`InMemory*Repository`) que comparten estado durante la sesión del servidor

### Datos de prueba

- **24 productos** en 5 categorías (parte superior, inferior, vestidos, calzado, accesorios)
- **3 eventos** de moda
- **3 promociones** exclusivas
- **8 outfits** semilla creados por usuarios de prueba
- **3 colecciones** temáticas
- **Usuario demo**: `Demo Nekoda` con perfil de estilo neutro

## 📦 Stack

- **Framework**: Next.js 16 (Pages Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Base de datos**: En memoria (InMemory repositories)
- **Arquitectura**: Hexagonal (Domain / Application / Infrastructure)
- **Algoritmo**: KNN (K-Nearest Neighbors) para recomendaciones
