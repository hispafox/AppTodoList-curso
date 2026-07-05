# AppTodoList — la demo de referencia del curso

Este repositorio es la **demo del curso GitHub Copilot para desarrolladores .NET**: el proyecto **AppTodoList**, una lista de tareas que crece de cero a producción (ASP.NET Core + React, EF Core sobre SQLite, xUnit) construida dirigiendo a GitHub Copilot, capítulo a capítulo.

## Dos repositorios, dos papeles

Tu trabajo del curso no se hace aquí. Construyes en **tu propio repositorio**, en una sola rama, dirigiendo tú a GitHub Copilot en cada capítulo. Esta demo es tu **solución de referencia**: la clonas **una sola vez**, en una carpeta aparte de la tuya, y la consultas cuando quieras comparar tu trabajo con el de clase.

```bash
git clone https://github.com/hispafox/AppTodoList-curso.git
```

## Una rama por capítulo

La demo tiene **una rama-checkpoint por capítulo**, con el nombre `submodulo-M.S/<slug>`. Cada rama deja el proyecto tal como quedó al terminar ese capítulo. Para ver cómo quedó uno, te sitúas en su rama —solo para leer, aquí no se toca nada—:

```bash
cd AppTodoList-curso
git checkout submodulo-1.1/setup
```

Abre los ficheros de la rama y ponlos al lado de los tuyos. No busques que coincidan palabra por palabra —cada quien dirige a GitHub Copilot con sus palabras, y el resultado sale algo distinto cada vez—; busca que las decisiones de fondo coincidan. Cuando termines de mirar, vuelves a tu carpeta y sigues con lo tuyo.

## Por dónde empezar

En la rama del primer capítulo, `submodulo-1.1/setup`, el proyecto es solo el fichero de reglas de la casa, `.github/copilot-instructions.md`, antes de una línea de código. El curso te va señalando la rama de referencia de cada capítulo.
