import Card from './card';
import './scss/card.scss';

const form = document.querySelector('#payment-form');
const container = document.querySelector('#card-container');

if (form && container) {
  new Card({ form, container });
}