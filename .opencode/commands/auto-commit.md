# Auto Commit - Comando personalizado para commits automáticos

## Descripción general

Este comando automatiza el proceso de crear commits en git desde opencode. Maneja todas las etapas del flujo de trabajo de commit incluyendo: detección de cambios, staging, confección de mensaje de commit, y ejecución del commit.

## Parámetros

### Contexto adicional (parámetro principal)

Si se proporciona texto después del comando, se trata como contexto adicional que debe incluirse en el mensaje de commit. Este contexto se añade al final del mensaje de commit en una sección "Contexto adicional:".

**Ejemplos de uso:**
- `/commit修复了登录页面的验证问题` - Añade contexto sobre qué problema se resolvió
- `/commit更新了依赖包的版本` - Añade contexto sobre el cambio realizado

## Flujo de trabajo completo

### 1. Verificar que estamos en un repositorio git

- Ejecutar `git status` para verificar que el directorio actual es un repositorio git
- Si no hay repositorio git, mostrar error: "Error: No estás en un repositorio git. Inicializa uno con `git init` primero."

### 2. Detectar cambios no comprometidas

- Ejecutar `git status` para ver todos los archivos modificados, añadidos o eliminados
- Identificar:
  - Archivos modificados (tracked files con cambios)
  - Archivos nuevos no trackeados (untracked files)
  - Archivos eliminados
- Mostrar al usuario un resumen de los cambios detectados en formato claro

### 3. Análisis de cambios (diff)

Para cada archivo modificado:
- Ejecutar `git diff [archivo]` para ver las diferencias específicas
- Analizar el tipo de cambio:
  - Nuevas líneas añadidas
  - Líneas eliminadas
  - Modificaciones de líneas existentes
- Identificar patrones comunes para determinar el tipo de cambio:
  - `+` línea nueva: característica nueva o bug fix
  - `-` línea eliminada: eliminación de funcionalidad
  - Cambios en archivos de configuración: actualización de configuración
  - Cambios en tests: añadir/actualizar pruebas
  - Cambios en dependencias (package.json, requirements.txt): actualización de dependencias

### 4. Determinar tipo de cambio

Basado en el análisis, clasificar el commit en una de estas categorías:

- **feat**: Nueva funcionalidad o característica
- **fix**: Corrección de bug
- **docs**: Cambios en documentación
- **style**: Cambios de formato (sin cambio en lógica)
- **refactor**: Refactorización de código
- **test**: Añadir o actualizar tests
- **chore**: Tareas de mantenimiento, configuración, dependencias
- **perf**: Mejora de rendimiento
- **build**: Cambios en sistema de build o dependencias

### 5. Generar mensaje de commit

El mensaje de commit sigue el formato Conventional Commits:

```
[tipo]([ámbito opcional]): [descripción corta]

[descripción larga opcional]

Contexto adicional: [texto proporcionado por usuario]
```

**Componentes:**

1. **Tipo**: Determinación automática basada en el análisis de cambios
2. **Descripción corta**: 
   - Máximo 50 caracteres
   - En infinitivo (qué hace este commit)
   - Primera letra en minúscula
   - Sin punto al final
3. **Descripción larga** (opcional):
   - Explica el "qué" y el "porqué"
   - Máximo 72 caracteres por línea
   - Incluye referencia a issues/tickets si se detectan en los cambios
4. **Contexto adicional**: 
   - Incluir solo si el usuario proporcionó parámetro de contexto
   - Añadir al final del mensaje

**Ejemplos de mensajes generados:**

```
feat(auth): añadir validación deemail en formulario de registro

- Añadido regex de validación de email
- Mostrado mensaje de error si el email es inválido
- Validación tanto en cliente como en servidor

Contexto adicional: Actualización de validación para cumplir con RFC 5322
```

```
fix(api): corregir error de timeout en peticiones POST

- Aumentado timeout de conexión a 30 segundos
- Añadido retry automático para peticiones fallidas

Contexto adicional: Problema reportado por usuarios en producción
```

### 6. Confirmar con el usuario

**IMPORTANTE**: Siempre solicitar confirmación antes de proceder con el commit.

Mostrar al usuario:
1. Resumen de archivos que se van a commitear
2. Mensaje de commit generado (en formato conventional commits)
3. Preguntar: "¿Proceder con el commit? (sí/no)"

Si el usuario responde "sí" o "si", continuar con el commit.
Si el usuario responde "no", cancelar y mostrar mensaje "Commit cancelado."
Si el usuario responde otra cosa, pedir confirmación nuevamente.

### 7. Stage de archivos

- Si hay archivos no trackeados que deben incluirse, añadirlos con `git add [archivo]`
- Añadir todos los archivos detectados al staging area con `git add -A` (o `git add .` en Windows)

### 8. Ejecutar el commit

- Ejecutar `git commit -m "[mensaje de commit]"`
- Si el commit incluye descripción larga, usar multilínea:
  ```
  git commit -m "[tipo]: descripción" -m "[descripción larga]" -m "[contexto adicional]"
  ```

### 9. Verificar éxito

- Mostrar resultado del commit:
  - Si успеoso: Mostrar mensaje del commit con hash (ejemplo: `[main a1b2c3d] mensaje de commit`)
  - Si/error: Mostrar error y qué hacer

### 10. Mostrar estado final

- Ejecutar `git status` para mostrar el estado actual del repositorio después del commit

## Manejo de errores

### Error: No hay cambios para commitear

- Si `git status` no muestra cambios: "No hay cambios para commitear. Haz cambios en tus archivos primero."
- No proceder con el commit

### Error: Falla en git add

- Si `git add` falla: Mostrar el error específico
- Preguntar si desea reintentar o cancelar

### Error: Falla en git commit

- Si `git commit` falla: Mostrar el error específico
- No mostrar nada más, el proceso termina

### Error: Usuario cancela

- Si el usuario ingresa "no" en la confirmación: "Commit cancelado."
- No hacer nada más

## Argumentos especiales

### dry-run

Si el usuario escribe `commit --dry-run` o similar, mostrar lo que haría el commit sin ejecutarlo:
- Mostrar archivos que se añadirían
- Mostrar mensaje de commit que se generaría
- No ejecutar `git add` ni `git commit`

## Notas Adicionales

- Siempre usar `git` directamente, no atajos como `git c`
- En Windows, usar el operador de chaining punto y coma `;` si se necesitan comandos encadenados
- Preferir `git add -A` sobre `git add .` para incluir archivos eliminados
- Manejar gracefully caracteres especiales en mensajes de commit
- Soportar tanto Git Bash como PowerShell en Windows

## Código de salida

- 0: Commit exitoso
- 1: No hay cambios o error del usuario
- 2: Error de git (mostrar el error)

---

*Este comando fue diseñado para automatizar el flujo de trabajo de commits en opencode con soporte completo para Conventional Commits y contexto adicional del usuario.*