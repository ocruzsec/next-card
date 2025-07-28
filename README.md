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
import 'next-card/dist/card.css'

const form = document.querySelector('#payment-form');
const container = document.querySelector('#card-container');

if (form && container) {
  new Card({ form, container });
}
```

### Vue

For use with VueJs, install next-card.js from npm:

```bash
npm install next-card --save

```
Add in your component an Div with class 'card-wrapper', just pass in a selector that selects the fields in the correct order. Import the component next-card.js and add the object in instance mounted like this example:
```html
<template>
  <div>
    <div class="card-wrapper" ref="cardWrapper"></div>

    <form ref="form" id="cc-form">
      <input type="text" name="number" id="cc-number" />
      <input type="text" name="full-name" id="cc-fullname" />
      <input type="text" name="expiry" id="cc-expiration" />
      <input type="text" name="cvc" id="cc-cvv" />
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Card from 'next-card';
import 'next-card/dist/next-card.css';

const form = ref(null);
const cardWrapper = ref(null);

onMounted(() => {
  if (form.value && cardWrapper.value) {
    new Card({
      form: form.value,
      container: cardWrapper.value,
      formSelectors: {
        numberInput: "input#cc-number",
        expiryInput: "input#cc-expiration",
        cvcInput: "input#cc-cvv",
        nameInput: "input#cc-fullname"
      },
      width: 270,
      formatting: true,
      placeholders: {
        number: "•••• •••• •••• ••••",
        name: "Full name",
        expiry: "••/••",
        cvc: "•••"
      }
    });
  }
});
</script>
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