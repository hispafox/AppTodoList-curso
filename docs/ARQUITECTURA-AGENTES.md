# El equipo de agentes coordinados (en GitHub Copilot)

Ampliar una API a mano tiene un ritmo conocido: piensas qué hay que hacer, lo escribes, compruebas que no has roto nada y lo subes. Cuatro sombreros distintos puestos por la misma persona. Aquí cada sombrero es un agente, y tú solo das la orden de salida con `@orquestador-apptodolist`. El resto — el plan, el código, la verificación y el commit — pasa solo.

Este documento cuenta cómo está montado por dentro y por qué se tomó cada decisión.

---

## 1. El mapa, de un vistazo

Tú hablas con uno solo. Ese uno reparte.

```mermaid
flowchart LR
    U([👤 Usuario]) -->|@orquestador funcionalidad| O[🧭 Orquestador<br/>agente coordinador]
    O -->|agent| P[🔎 Planificador<br/>subagente]
    O -->|agent| D[⚙️ Desarrollador<br/>subagente]
    O -->|agent| V[✅ Verificador<br/>subagente]
    O -->|git| GH[(🐙 Git<br/>commit + push)]

    P -.escribe.-> PL[/docs/plan-*.md/]
    D -.edita.-> C[/*.cs/]
    V -.lee + dotnet build.-> C

    classDef orq fill:#1f6feb,color:#fff,stroke:#0b3d91;
    classDef sub fill:#238636,color:#fff,stroke:#0b3d91;
    classDef ext fill:#6e40c9,color:#fff,stroke:#0b3d91;
    class O orq;
    class P,D,V sub;
    class GH ext;
```

El orquestador es el único que toca Git. Los tres especialistas ni se enteran de que se va a hacer commit: lo suyo es leer, planear, escribir código y dar un veredicto. Esa separación es a propósito, y enseguida verás por qué importa.

---

## 2. Quién hace qué

| Rol | Qué es en GitHub Copilot | ¿Toca código? | Herramientas | Lo que deja |
|-----|---------------------|---------------|--------------|------------|
| **Orquestador** | Agente `@orquestador-apptodolist` | No | `agent, execute, read, search` | Commit + resumen |
| **Planificador** | Agente `@planificador-apptodolist` | Solo el plan `.md` | `read, search, edit` | `docs/plan-<slug>.md` |
| **Desarrollador** | Agente `@desarrollador-apptodolist` | Sí | `read, search, edit, execute` | Código que compila |
| **Verificador** | Agente `@verificador-apptodolist` | No | `read, search, execute` | Veredicto APROBADO / REVISAR |

Fíjate en una cosa: el planificador y el verificador **no escriben código de producción**. El planificador solo deja un `.md`; el verificador solo lee y compila. Es la versión software del principio de que quien diseña el examen no debería ser quien lo aprueba. El que verifica no arregla — señala. Y el que arregla es siempre el desarrollador.
