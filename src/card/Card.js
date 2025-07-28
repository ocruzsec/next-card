import payment from 'payment';
import extend from 'node.extend';

class Card {
  static initializedDataAttr = "data-jp-card-initialized";

  static cardTemplate = `
    <div class="jp-card-container">
      <div class="jp-card">
        <div class="jp-card-front">
          <div class="jp-card-logo jp-card-elo">
            <div class="e">e</div>
            <div class="l">l</div>
            <div class="o">o</div>
          </div>
          <div class="jp-card-logo jp-card-visa">Visa</div>
          <div class="jp-card-logo jp-card-visaelectron">Visa<div class="elec">Electron</div></div>
          <div class="jp-card-logo jp-card-mastercard">Mastercard</div>
          <div class="jp-card-logo jp-card-maestro">Maestro</div>
          <div class="jp-card-logo jp-card-amex"></div>
          <div class="jp-card-logo jp-card-discover">discover</div>
          <div class="jp-card-logo jp-card-unionpay">UnionPay</div>
          <div class="jp-card-logo jp-card-dinersclub"></div>
          <div class="jp-card-logo jp-card-hipercard">Hipercard</div>
          <div class="jp-card-logo jp-card-troy">troy</div>
          <div class="jp-card-logo jp-card-dankort"><div class="dk"><div class="d"></div><div class="k"></div></div></div>
          <div class="jp-card-logo jp-card-jcb">
            <div class="j">J</div>
            <div class="c">C</div>
            <div class="b">B</div>
          </div>
          <div class="jp-card-lower">
            <div class="jp-card-shiny"></div>
            <div class="jp-card-cvc jp-card-display jp-card-cvc-front">{{cvc}}</div>
            <div class="jp-card-number jp-card-display">{{number}}</div>
            <div class="jp-card-name jp-card-display">{{name}}</div>
            <div class="jp-card-expiry jp-card-display" data-before="{{monthYear}}" data-after="{{validDate}}">{{expiry}}</div>
          </div>
        </div>
        <div class="jp-card-back">
          <div class="jp-card-bar"></div>
          <div class="jp-card-cvc jp-card-display jp-card-cvc-back">{{cvc}}</div>
          <div class="jp-card-shiny"></div>
        </div>
      </div>
    </div>
  `;

  static cardTypes = [
    'jp-card-amex',
    'jp-card-dankort',
    'jp-card-dinersclub',
    'jp-card-discover',
    'jp-card-unionpay',
    'jp-card-jcb',
    'jp-card-laser',
    'jp-card-maestro',
    'jp-card-mastercard',
    'jp-card-troy',
    'jp-card-unionpay',
    'jp-card-visa',
    'jp-card-visaelectron',
    'jp-card-elo',
    'jp-card-hipercard'
  ];

  static defaults = {
    formatting: true,
    formSelectors: {
      numberInput: 'input[name="number"]',
      expiryInput: 'input[name="expiry"]',
      cvcInput: 'input[name="cvc"]',
      nameInput: 'input[name="name"]'
    },
    cardSelectors: {
      cardContainer: '.jp-card-container',
      card: '.jp-card',
      numberDisplay: '.jp-card-number',
      expiryDisplay: '.jp-card-expiry',
      cvcDisplayFront: '.jp-card-cvc-front',
      cvcDisplayBack: '.jp-card-cvc-back',
      nameDisplay: '.jp-card-name'
    },
    messages: {
      validDate: 'valid\nthru',
      monthYear: 'month/year'
    },
    placeholders: {
      number: '•••• •••• •••• ••••',
      cvc: '•••',
      expiry: '••/••',
      name: 'Full Name'
    },
    masks: {
      cardNumber: false
    },
    classes: {
      valid: 'jp-card-valid',
      invalid: 'jp-card-invalid'
    },
    debug: false
  };

  constructor(opts) {
    this.maskCardNumber = this.maskCardNumber.bind(this);
    this.options = extend(true, Card.defaults, opts);

    if (!this.options.form) {
      console.error("Please provide a form");
      return;
    }
    if (!this.options.container) {
      console.error("Please provide a container");
      return;
    }

    this.$el = typeof this.options.form === 'string' ? document.querySelector(this.options.form) : this.options.form;
    this.$container = typeof this.options.container === 'string' ? document.querySelector(this.options.container) : this.options.container;

    if (this.$container.getAttribute(Card.initializedDataAttr)) return;
    this.$container.setAttribute(Card.initializedDataAttr, true);

    this.render();
    this.$card = this.$container.querySelector(this.options.cardSelectors.card);

    this.attachHandlers();
    this.handleInitialPlaceholders();
  }

  template(tpl, data) {
    return tpl.replace(/\{\{(.*?)\}\}/g, (match, key) => data[key] || '');
  }

  render() {
    this.$container.insertAdjacentHTML('beforeend', this.template(Card.cardTemplate, {
      ...this.options.messages,
      ...this.options.placeholders
    }));

    for (const [key, selector] of Object.entries(this.options.cardSelectors)) {
      this['$' + key] = this.$container.querySelector(selector);
      if (!this['$' + key] && this.options.debug) {
        console.warn(`No element found for selector ${selector} (${key})`);
      }
    }

    for (const [key, selector] of Object.entries(this.options.formSelectors)) {
      const sel = this.options[key] || selector;
      const found = this.$el.querySelectorAll(sel);
      if (found.length === 0 && this.options.debug) {
        console.error(`Card can't find a ${key} in your form.`);
      }
      this['$' + key] = found.length > 1 ? found : found[0];
    }

    if (this.options.formatting) {
      payment.formatCardNumber(this.$numberInput);
      payment.formatCardCVC(this.$cvcInput);
      payment.formatCardExpiry(this.$expiryInput);
    }

    if (this.options.width) {
      const $cardContainer = this.$container.querySelector(this.options.cardSelectors.cardContainer);
      const baseWidth = parseInt(getComputedStyle($cardContainer).width, 10);
      $cardContainer.style.transform = `scale(${this.options.width / baseWidth})`;
    }

    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('safari') && !ua.includes('chrome')) {
      this.$card.classList.add('jp-card-safari');
    }
    if (/MSIE 10\./i.test(navigator.userAgent)) {
      this.$card.classList.add('jp-card-ie-10');
    }
    if (/rv:11.0/i.test(navigator.userAgent)) {
      this.$card.classList.add('jp-card-ie-11');
    }
  }

  attachHandlers() {
    const numberInputFilters = [this.validToggler('cardNumber')];
    if (this.options.masks.cardNumber) numberInputFilters.push(this.maskCardNumber);

    this.bindVal(this.$numberInput, this.$numberDisplay, {
      fill: false,
      filters: numberInputFilters
    });

    this.$numberInput.addEventListener('keyup', (e) => {
      this.handlers.setCardType.call(this, payment.fns.cardType(e.target.value));
    });

    const expiryFilters = [val => (val.length === 1 && val[0] === '0') ? '' : val.replace(/\s+/g, '')];
    expiryFilters.push(this.validToggler('cardExpiry'));

    this.bindVal(this.$expiryInput, this.$expiryDisplay, {
      join: text => (text[0] && text[0].length === 2) || (text[1] && text[1]) ? '/' : '',
      filters: expiryFilters
    });

    this.bindVal(this.$cvcInput, [this.$cvcDisplayFront, this.$cvcDisplayBack], {
      filters: this.validToggler('cardCVC')
    });

    this.$cvcInput.addEventListener('focus', () => this.handlers.flipCard.call(this));
    this.$cvcInput.addEventListener('blur', () => this.handlers.unflipCard.call(this));

    this.bindVal(this.$nameInput, this.$nameDisplay, {
      fill: false,
      filters: this.validToggler('cardHolderName'),
      join: ' '
    });
  }

  handleInitialPlaceholders() {
    for (const name in this.options.formSelectors) {
      let el = this['$' + name];
      if (NodeList.prototype.isPrototypeOf(el)) el = el[0];
      if (el && el.value) {
        el.dispatchEvent(new Event('paste'));
        setTimeout(() => el.dispatchEvent(new Event('keyup')), 0);
      }
    }
  }

  bindVal(el, out, opts = {}) {
    opts.fill = opts.fill || false;
    opts.filters = Array.isArray(opts.filters) ? opts.filters : [opts.filters];
    opts.join = typeof opts.join === 'function' ? opts.join : () => opts.join || '';

    if (!(out instanceof NodeList) && !Array.isArray(out)) out = [out];
    if (!(el instanceof NodeList) && !Array.isArray(el)) el = [el];

    const outDefaults = Array.from(out).map(o => o.textContent);
    this.setVal(el, out, outDefaults, opts);

    const addClass = (elements, cls) => {
      if (elements instanceof NodeList || Array.isArray(elements)) {
        elements.forEach(e => e.classList.add(cls));
      } else {
        elements.classList.add(cls);
      }
    };
    const removeClass = (elements, cls) => {
      if (elements instanceof NodeList || Array.isArray(elements)) {
        elements.forEach(e => e.classList.remove(cls));
      } else {
        elements.classList.remove(cls);
      }
    };

    const onFocus = () => addClass(out, 'jp-card-focused');
    const onBlur = () => removeClass(out, 'jp-card-focused');
    const onUpdate = () => this.setVal(el, out, outDefaults, opts);

    el.forEach(element => {
      element.addEventListener('focus', onFocus);
      element.addEventListener('blur', onBlur);
      ['keyup', 'change', 'paste'].forEach(event => element.addEventListener(event, onUpdate));
    });
  }

  setVal(el, out, outDefaults, opts) {
    let val = Array.from(el).map(elem => elem.value);
    const join = opts.join(val);
    val = val.join(join);
    if (val === join) val = "";

    for (const filter of opts.filters) {
      val = filter(val, el, out);
    }

    for (let i = 0; i < out.length; i++) {
      let outVal = opts.fill ? val + outDefaults[i].substring(val.length) : (val || outDefaults[i]);
      out[i].textContent = outVal;
    }
  }

  handlers = {
    setCardType: (data) => {
      const cardType = data;
      document.dispatchEvent(new CustomEvent('card-type-changed', { detail: cardType }));

      if (!this.$card.classList.contains(cardType)) {
        this.$card.classList.remove('jp-card-unknown');
        this.$card.classList.remove(...Card.cardTypes);
        this.$card.classList.add(`jp-card-${cardType}`);
        if (cardType !== 'unknown') {
          this.$card.classList.add('jp-card-identified');
        } else {
          this.$card.classList.remove('jp-card-identified');
        }
        this.cardType = cardType;
      }
    },

    flipCard: () => {
      this.$card.classList.add('jp-card-flipped');
    },

    unflipCard: () => {
      this.$card.classList.remove('jp-card-flipped');
    }
  };

  handle(fn) {
    return e => {
      const args = Array.from(arguments);
      args.unshift(e.target);
      return this.handlers[fn].apply(this, args);
    };
  }

  validToggler(validatorName) {
    let isValid;

    if (validatorName === "cardExpiry") {
      isValid = val => {
        const objVal = payment.fns.cardExpiryVal(val);
        return payment.fns.validateCardExpiry(objVal.month, objVal.year);
      };
    } else if (validatorName === "cardCVC") {
      isValid = val => payment.fns.validateCardCVC(val, this.cardType);
    } else if (validatorName === "cardNumber") {
      isValid = val => payment.fns.validateCardNumber(val);
    } else if (validatorName === "cardHolderName") {
      isValid = val => val !== "";
    }

    return (val, $in, $out) => {
      const result = isValid(val);
      this.toggleValidClass($in, result);
      this.toggleValidClass($out, result);
      return val;
    };
  }

  toggleValidClass(el, test) {
    const addRemoveClass = (elements, cls, add) => {
      if (elements instanceof NodeList || Array.isArray(elements)) {
        elements.forEach(e => add ? e.classList.add(cls) : e.classList.remove(cls));
      } else {
        if (add) {
          elements.classList.add(cls);
        } else {
          elements.classList.remove(cls);
        }
      }
    };

    addRemoveClass(el, this.options.classes.valid, test);
    addRemoveClass(el, this.options.classes.invalid, !test);
  }

  maskCardNumber(val) {
    const mask = this.options.masks.cardNumber;
    const numbers = val.split(' ');

    if (numbers.length >= 3) {
      numbers.forEach((item, idx) => {
        if (idx !== numbers.length - 1) {
          numbers[idx] = numbers[idx].replace(/\d/g, mask);
        }
      });
      return numbers.join(' ');
    } else {
      return val.replace(/\d/g, mask);
    }
  }

  getCardType() {
    const ccType = payment.fns.cardType(this.$numberInput.value);
    return ccType || 'unknown';
  }
}

export default Card;
