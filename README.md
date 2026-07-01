# AppTodoList — proyecto del curso

Este es el repositorio del curso **GitHub Copilot para desarrolladores .NET**. El proyecto es **AppTodoList**, una lista de tareas que crece de cero a producción (ASP.NET Core + React, EF Core sobre SQLite, xUnit) **dirigiendo a Copilot**, capítulo a capítulo.

## Cómo se trabaja: una rama por capítulo

Hay **una rama-checkpoint por capítulo**, con el nombre `submodulo-M.S/<slug>`. Cada rama deja el proyecto tal como queda al terminar ese capítulo, compilando.

En cada capítulo:

1. Te sitúas en la rama de partida del capítulo: `git checkout submodulo-M.S/<slug>`.
2. Haces el trabajo que el capítulo dirige —tú, dirigiendo a Copilot—.
3. Te comparas con la rama de referencia (`git diff`) para ver cómo debería quedar.

Así nunca trabajas en el vacío: en cada paso tienes a mano la solución.

## Por dónde empezar

El primer capítulo:

```bash
git checkout submodulo-1.1/setup
```

En esa rama, el proyecto es solo el fichero de reglas de la casa, `.github/copilot-instructions.md`, antes de una línea de código. Ábrelo y síguelo desde el capítulo 1.
