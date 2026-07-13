# Orquestación de Skills — AppTodoList

Este documento describe el conjunto de skills disponibles en el proyecto, su propósito, las dependencias entre ellos y cómo se coordinan para construir la aplicación de forma incremental.

---

## 0. Agentes vs. Skills: la arquitectura completa

Los **skills** son las herramientas. Los **agentes** son quienes las usan.

```mermaid
flowchart TD
    U[Usuario] --> O[Orquestador]
    O --> P[Planificador]
    O --> D[Desarrollador]
    O --> V[Verificador]

    P --> PLAN[docs/plan-slug.md]
    D --> PLAN
    D --> SKILLS[Skills]

    SKILLS --> SK1[diseno-analisis]
    SKILLS --> SK2[modelo]
    SKILLS --> SK3[dto]
    SKILLS --> SK4[base-de-datos]
    SKILLS --> SK5[logica-negocio]
    SKILLS --> SK6[validaciones]
    SKILLS --> SK7[servicio]
    SKILLS --> SK8[controlador]
    SKILLS --> SK9[frontend-react]

    D --> CODE[Codigo]
    V --> CODE
```

Un skill no decide cuándo actuar: describe **cómo** se hace algo. El agente es quien lee la petición, elige los skills y los ejecuta en orden. Por eso el catálogo de abajo se lee siempre desde el agente que lo va a usar.

---

## 1. Catálogo de skills

| Skill | Carpeta generada | Responsabilidad |
|---|---|---|
| `diseño-analisis` | `docs/` | Documento de análisis y diseño — fuente de verdad de todo lo demás |
| `modelo` | `Models/` | Entidades de dominio (clases C#) |
| `dto` | `Dtos/` | Contratos de entrada y salida de la API |
| `base-de-datos` | `Data/` | AppDbContext, Fluent API, migraciones, seeder |
| `logica-negocio` | `LogicaNegocio/` | Reglas de negocio + acceso a `DbContext` |
| `validaciones` | `Dtos/` + `LogicaNegocio/` | Anotaciones de validación y reglas de dominio |
| `servicio` | `Services/` | Orquestación: mapeo DTO ↔ entidad, delegación a lógica |
| `controlador` | `Controllers/` | Capa HTTP: recibe peticiones, llama al servicio, devuelve respuesta |
| `ui-ux-pro-max` | — | Patrones de diseño y accesibilidad. Se consulta **antes** del frontend; si solo trae la ficha de catálogo, se sigue con los principios básicos y se dice |
| `frontend-react` | `frontend/` | Tipos TypeScript espejo de los DTOs, servicios fetch, páginas y componentes |
| `nueva-feature` | _las que toque_ | **Detecta el alcance** de una petición en lenguaje natural y encadena los skills de las capas afectadas, del análisis al commit. No implementa nada por su cuenta: coordina a los demás |
| `actualizar-documentacion` | `docs/` | Audita la documentación contra el código real y corrige lo que se ha quedado desfasado |
| `commit-message` | — | Genera el mensaje de commit siguiendo convenciones del proyecto |

---

## 2. Flujo de ejecución — orden obligatorio

Los skills tienen dependencias estrictas. El diagrama muestra el orden en que deben ejecutarse y qué artefacto produce cada uno:

```mermaid
flowchart TD
    A([Inicio]) --> DA

    DA["🔍 diseño-analisis\ndocs/analisis-diseño.md"]
    M["📦 modelo\nModels/*.cs"]
    DTO["📄 dto\nDtos/*Dto.cs"]
    BD["🗄️ base-de-datos\nData/AppDbContext.cs\nappsettings.json"]
    LN["⚙️ logica-negocio\nLogicaNegocio/I*Logica.cs\nLogicaNegocio/*Logica.cs"]
    VA["✔️ validaciones\nDtos/ + LogicaNegocio/"]
    SV["🔀 servicio\nServices/I*Service.cs\nServices/*Service.cs"]
    CT["🌐 controlador\nControllers/*Controller.cs"]
    CM["✅ commit-message\nMensaje de commit"]

    DA --> M
    M --> DTO
    DTO --> BD
    BD --> LN
    LN --> VA
    VA --> SV
    SV --> CT
    CT --> CM

    style DA fill:#dbeafe,stroke:#3b82f6
    style M  fill:#dcfce7,stroke:#16a34a
    style DTO fill:#fef9c3,stroke:#ca8a04
    style BD fill:#e0f2fe,stroke:#0284c7
    style LN fill:#fce7f3,stroke:#db2777
    style VA fill:#fef3c7,stroke:#d97706
    style SV fill:#ede9fe,stroke:#7c3aed
    style CT fill:#ffedd5,stroke:#ea580c
    style CM fill:#f1f5f9,stroke:#64748b
```

---

## 3. Dependencias entre skills

Cada skill lee los artefactos de los skills anteriores como fuente de verdad. Nunca infiere ni inventa — si el prerequisito no existe, detiene la ejecución.

```mermaid
graph LR
    AD["docs/analisis-diseño.md"]
    MO["Models/"]
    DT["Dtos/"]
    DB["Data/AppDbContext.cs"]
    LN["LogicaNegocio/"]
    SV["Services/"]
    CT["Controllers/"]
    PR["Program.cs"]
    AP["appsettings.json"]

    AD -->|"secciones 4 y 5"| MO
    AD -->|"secciones 4 y 5"| DT
    AD -->|"sección 4"| DB
    AD -->|"sección 5"| LN
    AD -->|"sección 5"| SV
    AD -->|"sección 5"| CT

    MO -->|"tipos de entidad"| DB
    MO -->|"tipos de entidad"| LN
    MO -->|"tipos de entidad"| SV
    DT -->|"campos a validar"| DT
    DT -->|"firmas de métodos"| SV
    DT -->|"parámetros de acción"| CT
    DB -->|"AppDbContext inyectado"| LN
    LN -->|"validación de existencia"| LN
    LN -->|"interfaz I*Logica"| SV
    SV -->|"interfaz I*Service"| CT

    DB -->|"AddDbContext"| PR
    DB -->|"ConnectionStrings"| AP
    LN -->|"AddScoped I*Logica"| PR
    SV -->|"AddScoped I*Service"| PR
```

---

## 4. Arquitectura de capas generada

Una vez ejecutados todos los skills, la aplicación queda estructurada en capas con responsabilidades claramente separadas:

```mermaid
flowchart LR
    subgraph HTTP["Capa HTTP"]
        C["Controller\n[ApiController]"]
    end

    subgraph DTO_IN["DTOs de entrada (validados)"]
        DI["Crear*Dto\n[Required][MaxLength]\nActualizar*Dto"]
    end

    subgraph DTO_OUT["DTOs de salida"]
        DO["*Dto"]
    end

    subgraph SVC["Capa de Orquestación"]
        SI["I*Service"]
        SS["*Service"]
        SI -.implementa.- SS
    end

    subgraph BL["Lógica de Negocio + Validaciones"]
        LI["I*Logica"]
        LS["*Logica\n(reglas de dominio,\nvalidación de existencia)"]
        LI -.implementa.- LS
    end

    subgraph DATA["Acceso a Datos"]
        DB["AppDbContext\n(EF Core + SQLite)"]
    end

    subgraph DOM["Dominio"]
        MO["Models/*.cs"]
    end

    C -->|"recibe"| DI
    C -->|"llama"| SI
    SI -->|"devuelve"| DO
    C -->|"responde"| DO

    SS -->|"mapea DTO → entidad"| MO
    SS -->|"delega"| LI
    LS -->|"usa"| MO
    LS -->|"accede"| DB
```

---

## 5. Flujo de una petición en runtime

Cómo viajan los datos desde el cliente HTTP hasta la base de datos y de vuelta, incluyendo las validaciones:

```mermaid
sequenceDiagram
    actor Cliente
    participant C as Controller
    participant S as Service
    participant L as LogicaNegocio
    participant DB as AppDbContext

    Cliente->>C: POST /api/tareas\n{ "titulo": "..." }
    Note over C: [ApiController] valida ModelState automáticamente<br/>(anotaciones [Required], [MaxLength] del DTO)
    alt ModelState inválido
        C-->>Cliente: 400 Bad Request\n{ "errors": { ... } }
    else ModelState válido
        C->>S: CrearAsync(CrearTareaDto)
        Note over S: Mapea DTO → entidad TodoItem
        S->>L: CrearAsync(TodoItem)
        Note over L: Valida reglas de negocio<br/>(título no vacío, sin duplicados, etc.)
        alt Regla de negocio violada
            L-->>S: throws InvalidOperationException
            S-->>C: excepción propagada
            C-->>Cliente: 400 Bad Request
        else Todo correcto
            L->>DB: Add(todoItem) + SaveChangesAsync()
            DB-->>L: todoItem con Id asignado
            L-->>S: TodoItem creado
            Note over S: Mapea entidad → TareaDto
            S-->>C: TareaDto
            C-->>Cliente: 201 Created\n{ "id": 1, "titulo": "...", ... }
        end
    end
```

---

## 6. Gestión de `Program.cs`

Cada skill que genera clases registrables actualiza `Program.cs` con los registros de inyección de dependencias. El resultado final queda así:

```mermaid
flowchart TD
    PR["Program.cs"]

    BD_REG["builder.Services\n.AddDbContext&lt;AppDbContext&gt;(SQLite)"]
    LN_REG["builder.Services\n.AddScoped&lt;I*Logica, *Logica&gt;()"]
    SV_REG["builder.Services\n.AddScoped&lt;I*Service, *Service&gt;()"]
    CT_REG["builder.Services\n.AddControllers()"]
    MAP["app.MapControllers()"]

    PR --> BD_REG
    PR --> LN_REG
    PR --> SV_REG
    PR --> CT_REG
    PR --> MAP

    BD_REG -->|"registrado por"| SK_BD["skill base-de-datos"]
    LN_REG -->|"registrado por"| SK_LN["skill logica-negocio"]
    SV_REG -->|"registrado por"| SK_SV["skill servicio"]
    CT_REG -->|"verificado por"| SK_CT["skill controlador"]
    MAP    -->|"verificado por"| SK_CT

    style SK_BD fill:#e0f2fe,stroke:#0284c7
    style SK_LN fill:#fce7f3,stroke:#db2777
    style SK_SV fill:#ede9fe,stroke:#7c3aed
    style SK_CT fill:#ffedd5,stroke:#ea580c
```

---

## 7. Cuándo usar cada skill

```mermaid
flowchart TD
    START([Nueva feature / nuevo recurso]) --> Q1{¿Existe\ndocs/analisis-diseño.md?}

    Q1 -->|No| DA["▶ Ejecutar\ndiseño-analisis"]
    Q1 -->|Sí| Q2{¿Existen\nlos modelos?}
    DA --> Q2

    Q2 -->|No| MO["▶ Ejecutar\nmodelo"]
    Q2 -->|Sí| Q3{¿Existen\nlos DTOs?}
    MO --> Q3

    Q3 -->|No| DTO["▶ Ejecutar\ndto"]
    Q3 -->|Sí| Q4{¿Existe\nAppDbContext?}
    DTO --> Q4

    Q4 -->|No| BD["▶ Ejecutar\nbase-de-datos"]
    Q4 -->|Sí| Q5{¿Existe\nlógica de negocio?}
    BD --> Q5

    Q5 -->|No| LN["▶ Ejecutar\nlogica-negocio"]
    Q5 -->|Sí| Q6{¿Tiene\nvalidaciones?}
    LN --> Q6

    Q6 -->|No| VA["▶ Ejecutar\nvalidaciones"]
    Q6 -->|Sí| Q7{¿Existen\nlos servicios?}
    VA --> Q7

    Q7 -->|No| SV["▶ Ejecutar\nservicio"]
    Q7 -->|Sí| Q8{¿Existen\nlos controladores?}
    SV --> Q8

    Q8 -->|No| CT["▶ Ejecutar\ncontrolador"]
    Q8 -->|Sí| CM["▶ Ejecutar\ncommit-message"]
    CT --> CM

    CM --> END([Listo para commit])

    style DA  fill:#dbeafe,stroke:#3b82f6
    style MO  fill:#dcfce7,stroke:#16a34a
    style DTO fill:#fef9c3,stroke:#ca8a04
    style BD  fill:#e0f2fe,stroke:#0284c7
    style LN  fill:#fce7f3,stroke:#db2777
    style VA  fill:#fef3c7,stroke:#d97706
    style SV  fill:#ede9fe,stroke:#7c3aed
    style CT  fill:#ffedd5,stroke:#ea580c
    style CM  fill:#f1f5f9,stroke:#64748b
```

---

## 8. Convenciones de nomenclatura por capa

| Capa | Interfaz | Implementación | Ejemplo |
|---|---|---|---|
| Lógica de negocio | `I<Recurso>Logica` | `<Recurso>Logica` | `ITareaLogica` / `TareaLogica` |
| Servicio | `I<Recurso>Service` | `<Recurso>Service` | `ITareaService` / `TareaService` |
| Controlador | — | `<Recurso>Controller` | `TareasController` |
| DTO entrada crear | — | `Crear<Recurso>Dto` | `CrearTareaDto` |
| DTO entrada actualizar | — | `Actualizar<Recurso>Dto` | `ActualizarTareaDto` |
| DTO salida | — | `<Recurso>Dto` | `TareaDto` |
| Entidad de dominio | — | `<Recurso>` | `TodoItem` |
| Contexto de datos | — | `AppDbContext` | `AppDbContext` |

