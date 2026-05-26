# Documento de Especificaciones para Desarrollo de Aplicación de Moda
## Arquitectura Hexagonal, Principios SOLID, Clean Code y UI/UX

---

## 1. Visión General de la Aplicación

Aplicación web de moda que, en el primer acceso, formula **5 preguntas** al usuario sobre sus gustos (estilo, color, ocasión, presupuesto, etc.). Con las respuestas se genera un **perfil de gusto vectorial**. A partir de ese perfil, el sistema utiliza el **algoritmo del vecino más cercano (KNN)** para recomendar:

- Prendas de vestir disponibles en la tienda.
- Eventos relacionados con moda.
- Promociones personalizadas.

La aplicación se despliega en **Netlify**, usa **Firestore** como base de datos y se adhiere estrictamente a los principios **SOLID**, **Clean Code** y una **arquitectura hexagonal** (puertos y adaptadores).

---

## 2. Stack Tecnológico Seleccionado

| Capa               | Tecnología                         | Justificación                                                                 |
|--------------------|------------------------------------|-------------------------------------------------------------------------------|
| **Lenguaje**       | TypeScript                         | Tipado estático, facilita mantenimiento, evita errores en la lógica de dominio. |
| **Frontend**       | Next.js (React)                    | SSR/SSG, excelente soporte para Netlify, estructura de páginas y API routes. |
| **Estilos**        | Tailwind CSS                       | Utilidades, rápido prototipado, consistencia visual.                          |
| **Backend (API)**  | Next.js API Routes + Netlify Functions | Serverless, despliegue integrado, bajo coste.                                |
| **Base de datos**  | Firebase Firestore                 | NoSQL, tiempo real, escalable, integración directa con Firebase Auth (opcional). |
| **Autenticación**  | Firebase Authentication (opcional) | Permite guardar perfiles de usuario y personalizar (si se requiere login).   |
| **Despliegue**     | Netlify                            | CI/CD desde repositorio Git, funciones serverless, variables de entorno.      |
| **Testing**        | Jest + Testing Library             | Unitarios, integración para casos de uso y adaptadores.                       |
| **Linting/Format**| ESLint + Prettier                  | Mantener Clean Code.                                                          |

---

## 3. Arquitectura Hexagonal (Puertos y Adaptadores)

La organización del código se divide en tres grandes capas:

```
src/
├── domain/           # Entidades, value objects, excepciones de dominio
├── application/      # Casos de uso (puertos de entrada), interfaces de puertos (salida)
└── infrastructure/   # Adaptadores: Firestore, API, UI (Next.js), etc.
```

### 3.1 Capa de Dominio
- **Entidades**: `User`, `UserTasteProfile`, `ClothingItem`, `Event`, `Promotion`.
- **Value Objects**: `TasteVector` (vector numérico que representa gustos), `Price`, `Style`, `Color`.
- **Interfaces de repositorio** (puertos de salida): `UserRepository`, `ItemRepository`, `EventRepository`, `PromotionRepository`.

### 3.2 Capa de Aplicación
- **Casos de uso (puertos de entrada)**:
  - `OnboardingUser` (procesa las 5 preguntas, genera perfil).
  - `RecommendItems` (ejecuta KNN sobre los items activos).
  - `RecommendEvents` (misma lógica, adaptada a entidades de eventos).
  - `RecommendPromotions` (promociones segmentadas por perfil).
- **DTOs**: `AnswerDTO`, `RecommendationDTO`.
- **Servicios de dominio**: `NearestNeighborsService` (implementación pura del algoritmo KNN).

### 3.3 Capa de Infraestructura
- **Adaptadores de persistencia**: `FirestoreUserRepository`, `FirestoreItemRepository`, etc.
- **Adaptadores web**:
  - Páginas Next.js: `pages/index.tsx` (onboarding), `pages/dashboard.tsx` (recomendaciones).
  - API Routes: `pages/api/recommendations.ts` (endpoint para obtener recomendaciones vía POST/GET).
- **Configuración de Firebase**: inicialización y helpers.

---

## 4. Principios SOLID y Clean Code

- **Single Responsibility**: Cada clase/módulo tiene una única razón para cambiar (ej. `NearestNeighborsService` solo calcula vecinos).
- **Open/Closed**: El algoritmo KNN puede extenderse con diferentes métricas de distancia sin modificar su núcleo.
- **Liskov Substitution**: Los repositorios implementan interfaces definidas en dominio, permitiendo cambiar Firestore por otra DB.
- **Interface Segregation**: Puertos pequeños y específicos (ej. `ItemRepository` no contiene métodos de usuario).
- **Dependency Inversion**: Los casos de uso dependen de abstracciones (interfaces), no de implementaciones concretas.
- **Clean Code**: Nombres significativos, funciones pequeñas, sin efectos secundarios ocultos, tests unitarios para la lógica de negocio.

---

## 5. Modelo de Datos (Firestore)

### Colecciones y documentos

```
users/{userId}
  - tasteProfile: {               // mapa
        vector: [number, ...],    // array de 5 números normalizados (0 a 1)
        answers: { q1: string, q2: string, ... } // opcional para auditoría
    }
  - createdAt: timestamp
  - lastActivity: timestamp

items/{itemId}
  - name: string
  - description: string
  - images: [string]
  - price: number
  - category: string
  - featureVector: [number, ...]  // vector de características (misma dimensionalidad)
  - stock: number
  - active: boolean

events/{eventId}
  - title: string
  - date: timestamp
  - featureVector: [number, ...]
  - ...

promotions/{promotionId}
  - title: string
  - discount: number
  - targetVector: [number, ...]   // vector del segmento objetivo
  - ...
```

**Índices necesarios**: Ninguno compuesto especial para las consultas planeadas, ya que se cargan colecciones pequeñas y se filtra en memoria. Si se requieren búsquedas por vector, se puede implementar un índice en el servidor (opcional).

---

## 6. Algoritmo del Vecino más Cercano (KNN)

### 6.1 Representación vectorial
- La dimensionalidad del vector es fija (ej. 5 dimensiones).
- Las 5 preguntas mapean a esas 5 dimensiones.
- Cada respuesta se codifica como un valor numérico entre 0 y 1 (escalas de Likert o codificación one-hot normalizada).

**Ejemplo de dimensiones**:
1. Estilo: 0 (casual) – 1 (formal)
2. Paleta de color: 0 (neutros) – 1 (vibrantes)
3. Preferencia de estampados: 0 (lisos) – 1 (estampados complejos)
4. Ocasión: 0 (diario) – 1 (fiesta)
5. Presupuesto: 0 (económico) – 1 (premium)

### 6.2 Distancia
Se usará la **distancia euclidiana** entre el vector de perfil del usuario y el `featureVector` de cada ítem. Para eventos y promociones, se aplica la misma métrica.

### 6.3 Algoritmo (pseudocódigo limpio)
```
function findNearest(userVector, items, k):
    calcular distancias = items.map(item => ({item, dist: euclidean(userVector, item.featureVector)}))
    ordenar por distancia ascendente
    devolver los primeros k elementos
```

Si algún ítem no está activo o no tiene stock, se filtra antes.

---

## 7. Las 5 Preguntas del Onboarding

Deben ser claras, con opciones predefinidas que se traducen a valores numéricos.

1. **¿Cómo defines tu estilo diario?**
   - a) Muy casual (0.0) – b) Casual (0.25) – c) Semi-formal (0.5) – d) Formal (0.75) – e) Muy formal (1.0)

2. **¿Qué colores predominan en tu armario?**
   - a) Sólo neutros (0.0) – b) Mayoría neutros (0.25) – c) Equilibrio (0.5) – d) Mayoría vibrantes (0.75) – e) Sólo vibrantes (1.0)

3. **¿Prefieres prendas lisas o con estampados/detalles?**
   - a) Siempre lisas (0.0) – b) Casi lisas (0.25) – c) Ambas (0.5) – d) Detalles moderados (0.75) – e) Estampados llamativos (1.0)

4. **¿Qué tipo de eventos frecuentas?**
   - a) Solo diario/trabajo (0.0) – b) Reuniones informales (0.25) – c) Salidas casuales (0.5) – d) Cenas/fiestas ocasionales (0.75) – e) Fiestas y galas (1.0)

5. **¿Cuánto inviertes normalmente en una prenda?**
   - a) Mínimo indispensable (0.0) – b) Económico (0.25) – c) Moderado (0.5) – d) Alto (0.75) – e) Lujo (1.0)

El vector resultante se normaliza (si es necesario) y se guarda.

---

## 8. Estructura del Proyecto (Hexagonal)

```
mi-app-moda/
├── public/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── User.ts
│   │   │   ├── ClothingItem.ts
│   │   │   ├── Event.ts
│   │   │   └── Promotion.ts
│   │   ├── value-objects/
│   │   │   └── TasteVector.ts
│   │   └── ports/
│   │       ├── IUserRepository.ts
│   │       ├── IItemRepository.ts
│   │       └── ...
│   ├── application/
│   │   ├── use-cases/
│   │   │   ├── OnboardingUser.ts
│   │   │   ├── RecommendItems.ts
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── NearestNeighborsService.ts
│   │   └── dto/
│   │       ├── UserAnswersDTO.ts
│   │       └── RecommendationDTO.ts
│   ├── infrastructure/
│   │   ├── firebase/
│   │   │   ├── firebaseConfig.ts
│   │   │   ├── FirestoreUserRepository.ts
│   │   │   └── ...
│   │   └── web/
│   │       ├── pages/
│   │       │   ├── index.tsx          (onboarding)
│   │       │   ├── dashboard.tsx      (recomendaciones)
│   │       │   └── api/
│   │       │       └── recommendations.ts
│   │       ├── components/
│   │       └── hooks/
├── .env.local
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 9. Flujo de la Aplicación

1. **Primer acceso** → página de onboarding (`/`).
2. Se presentan las 5 preguntas. Al enviarlas:
   - El frontend llama a `POST /api/onboarding` con las respuestas.
   - El endpoint crea o actualiza el documento de usuario en Firestore con el `tasteProfile` (vector).
3. Redirige al dashboard (`/dashboard`).
4. El dashboard consume `GET /api/recommendations?userId=...&type=items|events|promotions`.
   - El endpoint recupera el vector del usuario de Firestore.
   - Obtiene la colección correspondiente (items, etc.).
   - Ejecuta `NearestNeighborsService` para obtener los top K (ej. K=10).
   - Devuelve los resultados.
5. El usuario puede interactuar con las recomendaciones (ver detalle, añadir al carrito – fuera del alcance actual).

---

## 10. Diseño UI/UX

### 10.1 Principios Generales
- **Simplicidad**: Onboarding en 5 pasos secuenciales, sin distracciones.
- **Personalización visual**: La paleta de colores se adapta ligeramente al perfil del usuario (neutra o vibrante) después del onboarding.
- **Mobile First**: La aplicación está optimizada para dispositivos móviles, ya que la mayoría de las interacciones serán desde smartphones.
- **Accesibilidad**: Contraste suficiente, etiquetas semánticas, navegación por teclado, soporte para lectores de pantalla.
- **Microinteracciones**: Transiciones suaves al responder preguntas, animaciones al cargar recomendaciones, feedback táctil.
- **Jerarquía visual clara**: Las recomendaciones se muestran en tarjetas con imagen predominante, nombre, precio y un botón de acción.

### 10.2 Wireframe conceptual (descripción)

**Pantalla de Onboarding (1 pregunta a la vez)**
- Barra de progreso superior (5 pasos).
- Ilustración o icono representativo del tema.
- Pregunta en tipografía grande y legible.
- Opciones como botones grandes con descripción corta (ej. "Casual", "Formal").
- Botón "Siguiente" deshabilitado hasta seleccionar.
- Al completar, animación de carga y redirección al dashboard.

**Dashboard (recomendaciones)**
- Saludo personalizado: "Hola [nombre], esto es para ti".
- Tabs o secciones: "Ropa", "Eventos", "Promociones".
- Carrusel horizontal de tarjetas para cada categoría, con swipe en móvil.
- Tarjeta tipo:
  - Imagen de la prenda/evento (con fallback si no hay).
  - Nombre del producto.
  - Precio (si es producto) o fecha (si es evento).
  - Indicador visual de coincidencia (p.ej. "% de ajuste" basado en la distancia).
- Botón flotante para volver a hacer el test de gustos (opcional).
- Modo oscuro automático según preferencias del sistema.

### 10.3 Paleta de colores dinámica
- Se define un color primario base (ej. un tono coral). Después del onboarding, si el usuario prefiere colores neutros, los acentos se vuelven más sobrios; si prefiere vibrantes, se intensifican. Esto se logra con variables CSS y clases condicionales.
- Fuente: Inter para textos, con buen espaciado y legibilidad.

### 10.4 Experiencia de vacío (Empty State)
- Cuando no hay suficientes recomendaciones, se muestra una ilustración amigable y un mensaje como "Estamos preparando más sorpresas para ti" con un botón para explorar el catálogo general.

### 10.5 Feedback de carga y errores
- Spinners esqueléticos mientras se cargan las tarjetas.
- Mensajes de error claros: "No pudimos cargar las recomendaciones. Intenta de nuevo."
- Botón de reintentar.

### 10.6 Onboarding sin fricción
- No se requiere registro para ver las preguntas; se puede generar un userId anónimo al iniciar. Opcionalmente, al final se invita a crear cuenta para guardar el perfil.
- Las preguntas usan lenguaje natural y cercano: "Cuéntanos, ¿cómo te vistes en tu día a día?".

---

## 11. Despliegue en Netlify

- Repositorio Git (GitHub/GitLab).
- Conectar Netlify al repo.
- Configurar build command: `next build && next export` (si se desea estático) o usar el plugin `@netlify/plugin-nextjs` para SSR/API routes.
- Variables de entorno en Netlify: credenciales de Firebase (`FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, etc.).
- Las funciones serverless se empaquetan automáticamente si se usan API routes de Next.js.
- Firestore debe tener reglas de seguridad para permitir lecturas/escrituras desde el dominio de Netlify (o autenticación anónima mientras se prueba, luego Firebase Auth).

---

## 12. Especificaciones para la IA Desarrolladora (Paso a Paso)

### Paso 1: Inicializar proyecto Next.js con TypeScript y Tailwind
- `npx create-next-app@latest my-fashion-app --typescript --tailwind --eslint`
- Configurar alias de ruta `@/domain`, `@/application`, `@/infrastructure`.

### Paso 2: Implementar dominio
- Crear `TasteVector` (clase con array de 5 números, método `static fromAnswers(answers)`, validación de longitud).
- Crear entidades básicas: `ClothingItem`, `Event`, `Promotion` con sus properties.
- Definir interfaces de repositorio (`IItemRepository`, etc.) con métodos `getAll()` que devuelven promesas.

### Paso 3: Implementar el servicio KNN
- `NearestNeighborsService` con método `getNearest(userVector, items, k)` que implementa distancia euclidiana.
- Tests unitarios para el cálculo de distancia y selección.

### Paso 4: Casos de uso
- `OnboardingUser` recibe `IUserRepository` y las respuestas; construye el vector y lo guarda.
- `RecommendItems` recibe `IItemRepository`, `userVector` y `k`, llama al servicio KNN y devuelve DTOs.

### Paso 5: Adaptadores Firestore
- Configurar Firebase Admin SDK en el backend (API routes) y Firebase Client SDK en frontend si es necesario.
- `FirestoreItemRepository`: inicializa Firestore, implementa `getAll` leyendo colección `items` y mapeando documentos a `ClothingItem`.
- Similar para `UserRepository` (CRUD básico).

### Paso 6: API Routes
- `/api/onboarding` (POST): recibe `{userId, answers: string[]}`, inyecta repositorio Firestore, ejecuta caso de uso, responde éxito.
- `/api/recommendations` (GET): recibe `userId` y `type`, obtiene vector del usuario, obtiene items/eventos/promociones, aplica KNN, devuelve lista.
- Asegurar manejo de errores (404 si usuario no existe, etc.).

### Paso 7: Frontend con UI/UX
- Página de onboarding: formulario paso a paso con barra de progreso, opciones como botones grandes y animaciones.
- Página dashboard: tabs o secciones, tarjetas con imagen, nombre, precio y porcentaje de coincidencia.
- Componentes reutilizables: `QuestionCard`, `ItemCard`, `EmptyState`, `SkeletonLoader`.
- Implementar paleta dinámica según perfil (clases condicionales con Tailwind).

### Paso 8: Despliegue y configuración final
- Archivo `netlify.toml` con plugin `@netlify/plugin-nextjs`.
- Variables de entorno en panel de Netlify.
- Reglas de Firestore: permitir lectura en colecciones públicas y escritura controlada.

---

## 13. Consideraciones Finales

- **Escalabilidad**: Si la tienda tiene muchos ítems (>10k), considerar implementar un índice aproximado (FAISS, etc.) en lugar de distancia en memoria. Para versión inicial, KNN en servidor con colecciones filtradas es suficiente.
- **Personalización futura**: Se puede añadir feedback del usuario para refinar el vector de gusto (aprendizaje por refuerzo simple).
- **Seguridad**: No exponer claves de Firebase Admin en cliente. Las API routes las mantienen en el servidor.
- **UI/UX iterativo**: Realizar pruebas de usabilidad con usuarios reales para ajustar el flujo y el diseño de las tarjetas.

---

**Este documento contiene toda la información necesaria para que una IA generativa de código (como GitHub Copilot o un desarrollador automático) pueda implementar la aplicación pieza por pieza siguiendo buenas prácticas y una experiencia de usuario cuidada.**