# Clasificator · Spanish Unsupervised Machine Learning

Angular project for **natural language analysis** and **opinion classification** using **unsupervised machine learning** techniques.

---

## Unsupervised Machine Learning

Unsupervised learning is a classification technique that does not require previously labeled data.
It relies on **lexical resources** to determine the semantic orientation of words in a comment.

The process consists of:
- Normalizing the input text
- Removing punctuation
- Removing stopwords
- Comparing tokens against positive and negative word lists
- Calculating the final polarity: **positive, negative, or neutral**

---

## Requirements

This project is fully updated to **Angular 21** and uses modern tooling with **zero known vulnerabilities**.

### Required software
- Node.js >= 20
- npm >= 10
- Angular CLI 21

Install Angular CLI globally:

```bash
npm install -g @angular/cli
```

---

## Installation

```bash
cd clasificator
npm install
```

---

## Development server

```bash
npm start
```

Application runs at:

```
http://localhost:4200
```

---

## Production build

```bash
npm run build
```

Output:

```
dist/clasificator
```

---

## Unit Testing

Run tests (watch mode):

```bash
npm test
```

Run tests once (CI):

```bash
npm run test:ci
```

Run tests with coverage:

```bash
npm run test:coverage
```

Coverage report:

```
coverage/index.html
```

---

## References

Molina-González, M. D., Martínez-Cámara, E., Martín-Valdivia, M. T., & Perea-Ortega, J. M. (2013).
Semantic orientation for polarity classification in Spanish reviews.
Expert Systems with Applications, 40(18), 7250-7257.
