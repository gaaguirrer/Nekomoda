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

## 🧠 Algoritmo KNN — Vecino Más Cercano

El corazón de NEKOMODA es un sistema de recomendación basado en **K-Nearest Neighbors (KNN)** que encuentra los productos, eventos y promociones más afines al perfil de estilo del usuario.

### 1. Vector de Estilo (`TasteVector`)

Cada usuario tiene un **vector de 5 dimensiones** donde cada dimensión representa un eje de estilo. Se calcula a partir de las 5 preguntas del onboarding:

| Pregunta | Respuesta a | Respuesta e |
|---|---|---|
| Estilo diario | `0.0` (muy casual) | `1.0` (muy formal) |
| Colores | `0.0` (solo neutros) | `1.0` (solo vibrantes) |
| Estampados | `0.0` (siempre lisas) | `1.0` (estampados llamativos) |
| Eventos | `0.0` (solo diario) | `1.0` (galas) |
| Inversión | `0.0` (mínimo) | `1.0` (lujo) |

Cada respuesta se mapea a un valor numérico:

| Respuesta | Valor |
|---|---|
| a | `0.0` |
| b | `0.25` |
| c | `0.5` |
| d | `0.75` |
| e | `1.0` |

Por ejemplo, unas respuestas `["c", "c", "c", "c", "c"]` generan el vector neutro `[0.5, 0.5, 0.5, 0.5, 0.5]`.

### 2. Distancia Euclidiana

Cada producto, evento y promoción también tiene un **feature vector** de 5 dimensiones. El algoritmo calcula la **distancia euclidiana** entre el vector del usuario y el de cada item:

```
distancia = √( (u₁ - i₁)² + (u₂ - i₂)² + ... + (u₅ - i₅)² )
```

Donde `u` es el vector del usuario e `i` es el vector del item.

### 3. Puntaje de Coincidencia (`matchScore`)

La distancia se normaliza a un porcentaje de coincidencia:

```
matchScore = (1 - distancia / distancia_máxima) × 100
```

La distancia máxima posible es `√5 ≈ 2.236` (la diagonal de un espacio de 5 dimensiones con valores 0-1). Así:

- **Distancia 0** → `100%` (coincidencia perfecta)
- **Distancia máxima** → `0%` (completamente opuesto)

### 4. Selección Top-K

El algoritmo ordena todos los items por distancia ascendente (menor distancia = mayor afinidad) y devuelve los **K mejores** (por defecto `k = 10`).

```
Items → distancia euclidiana → ordenar → top K → recomendaciones
```

### 5. Implementación

Todo el pipeline está en dos clases:

- **`NearestNeighborsService`** (`src/application/services/NearestNeighborsService.ts`): Implementa `euclideanDistance()` y `getNearest()` que recibe un vector de usuario, un array de items con feature vectors, y K, y devuelve los K más cercanos con su `matchScore`.
- **`TasteVector`** (`src/domain/value-objects/TasteVector.ts`): Value object que encapsula el vector de 5 dimensiones, lo construye desde las respuestas del usuario y garantiza que los valores estén en el rango [0, 1].

### Ejemplo concreto

Si un usuario responde:
```
Q1: a (muy casual)       → 0.0
Q2: b (mayoría neutros)  → 0.25
Q3: c (ambas)             → 0.5
Q4: d (cenas y fiestas)  → 0.75
Q5: e (lujo)              → 1.0
```

Su vector es `[0.0, 0.25, 0.5, 0.75, 1.0]`.

Un blazer formal con vector `[0.75, 0.0, 0.0, 0.75, 0.75]` tendría una distancia de:
```
√((0.0-0.75)² + (0.25-0.0)² + (0.5-0.0)² + (0.75-0.75)² + (1.0-0.75)²)
= √(0.5625 + 0.0625 + 0.25 + 0 + 0.0625)
= √0.9375 ≈ 0.968
```

Y un matchScore de:
```
(1 - 0.968/2.236) × 100 ≈ 56.7%
```

## 📦 Stack

- **Framework**: Next.js 16 (Pages Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Base de datos**: En memoria (InMemory repositories)
- **Arquitectura**: Hexagonal (Domain / Application / Infrastructure)
- **Algoritmo**: KNN (K-Nearest Neighbors) con distancia euclidiana
