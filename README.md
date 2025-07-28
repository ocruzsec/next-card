![npm](https://img.shields.io/npm/v/next-card)

# Next Card

[![npm version](https://img.shields.io/npm/v/next-card.svg)](https://www.npmjs.com/package/next-card)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

> 💳 A better way to collect credit card information — visually and interactively.  
> **This is a modern fork of [jessepollak/card](https://github.com/jessepollak/card), updated for modern build tools and frameworks.**

---

## About

This library provides a beautiful and responsive credit card interface to help users input their card details more intuitively. Originally created by Jesse Pollak, this fork:

- Updates the codebase to **ES Modules**
- Migrates build tooling to **Vite 7**
- Replaces deprecated **Bourbon mixins** with modern CSS or custom Sass mixins
- Supports **SCSS** styling and tree-shakable JavaScript

---

## Installation

```bash
npm install next-card
```

or

```bash
yarn add next-card
```

---

## Usage

### HTML

```html
<form id="payment-form">
  <input name="number" placeholder="Card Number" type="text" />
  <input name="name" placeholder="Full Name" type="text" />
  <input name="expiry" placeholder="MM/YY" type="text" />
  <input name="cvc" placeholder="CVC" type="text" />
</form>

<div id="card-container"></div>
```

### JavaScript

```js
import Card from 'next-card'
import 'next-card/card/dist/card.css' // or your custom theme

const form = document.querySelector('#payment-form');
const container = document.querySelector('#card-container');

if (form && container) {
  new Card({ form, container });
}
```

---

## Build

To build the library:

```bash
npm run build
```

The output files will be generated in the `dist/` folder in `ESM` and `UMD` formats.

---

## License

MIT

---

## Credits

Original author: [Jesse Pollak](https://github.com/jessepollak)  
Fork maintained by: [Oscar Cruz](https://github.com/ocruzsec)  
Original project: https://github.com/jessepollak/card