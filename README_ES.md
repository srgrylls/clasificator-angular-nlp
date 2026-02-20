# Clasificator · Aprendizaje No Supervisado en Español

Proyecto Angular para el **análisis del lenguaje natural** y la **clasificación de opiniones**
mediante **aprendizaje no supervisado**.

---

## Aprendizaje No Supervisado

El aprendizaje no supervisado no requiere datos etiquetados previamente.
Se basa en **recursos léxicos** para determinar la orientación semántica de un comentario.

El proceso consiste en:
- Normalizar el texto
- Eliminar puntuación
- Eliminar palabras vacías (*stopwords*)
- Comparar tokens con listas positivas y negativas
- Calcular la polaridad final: **positiva, negativa o neutra**

---

## Requisitos

Proyecto actualizado a **Angular 21** sin vulnerabilidades conocidas.

### Software requerido
- Node.js >= 20
- npm >= 10
- Angular CLI 21

Instalar Angular CLI:

```bash
npm install -g @angular/cli
```

---

## Instalación

```bash
cd clasificator
npm install
```

---

## Ejecución

```bash
npm start
```

Disponible en:

```
http://localhost:4200
```

---

## Build de producción

```bash
npm run build
```

Salida:

```
dist/clasificator
```

---

## Tests unitarios

Ejecutar tests:

```bash
npm test
```

Ejecutar tests para CI:

```bash
npm run test:ci
```

Ejecutar tests con cobertura:

```bash
npm run test:coverage
```

Informe:

```
coverage/index.html
```

---

## Referencias

Molina-González, M. D., Martínez-Cámara, E., Martín-Valdivia, M. T., & Perea-Ortega, J. M. (2013).
Semantic orientation for polarity classification in Spanish reviews.
Expert Systems with Applications, 40(18), 7250-7257.
