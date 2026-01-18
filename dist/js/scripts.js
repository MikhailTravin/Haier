
const modules_flsModules = {};

let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    setTimeout((() => {
      lockPaddingElements.forEach((lockPaddingElement => {
        lockPaddingElement.style.paddingRight = "";
      }));
      document.body.style.paddingRight = "";
      document.documentElement.classList.remove("lock");
    }), delay);
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    }));
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.classList.add("lock");
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
function functions_FLS(message) {
  setTimeout((() => {
    if (window.FLS) console.log(message);
  }), 0);
}

let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout((() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout((() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
};

function getHash() {
  if (location.hash) { return location.hash.replace('#', ''); }
}

function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter(function (item) {
    return item.dataset[dataSetValue];
  });

  if (media.length) {
    const breakpointsArray = media.map(item => {
      const params = item.dataset[dataSetValue];
      const paramsArray = params.split(",");
      return {
        value: paramsArray[0],
        type: paramsArray[1] ? paramsArray[1].trim() : "max",
        item: item
      };
    });

    const mdQueries = uniqArray(
      breakpointsArray.map(item => `(${item.type}-width: ${item.value}px),${item.value},${item.type}`)
    );

    const mdQueriesArray = mdQueries.map(breakpoint => {
      const [query, value, type] = breakpoint.split(",");
      const matchMedia = window.matchMedia(query);
      const itemsArray = breakpointsArray.filter(item => item.value === value && item.type === type);
      return { itemsArray, matchMedia };
    });

    return mdQueriesArray;
  }
}

function uniqArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}

//========================================================================================================================================================

//Попап
class Popup {
  constructor(options) {
    let config = {
      logging: true,
      init: true,
      attributeOpenButton: "data-popup",
      attributeCloseButton: "data-close",
      fixElementSelector: "[data-lp]",
      youtubeAttribute: "data-popup-youtube",
      youtubePlaceAttribute: "data-popup-youtube-place",
      setAutoplayYoutube: true,
      classes: {
        popup: "popup",
        popupContent: "popup__content",
        popupActive: "popup_show",
        bodyActive: "popup-show"
      },
      focusCatch: true,
      closeEsc: true,
      bodyLock: true,
      hashSettings: {
        goHash: true
      },
      on: {
        beforeOpen: function () { },
        afterOpen: function () { },
        beforeClose: function () { },
        afterClose: function () { }
      }
    };
    this.youTubeCode;
    this.isOpen = false;
    this.targetOpen = {
      selector: false,
      element: false
    };
    this.previousOpen = {
      selector: false,
      element: false
    };
    this.lastClosed = {
      selector: false,
      element: false
    };
    this._dataValue = false;
    this.hash = false;
    this._reopen = false;
    this._selectorOpen = false;
    this.lastFocusEl = false;
    this._focusEl = ["a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'];
    this.options = {
      ...config,
      ...options,
      classes: {
        ...config.classes,
        ...options?.classes
      },
      hashSettings: {
        ...config.hashSettings,
        ...options?.hashSettings
      },
      on: {
        ...config.on,
        ...options?.on
      }
    };
    this.bodyLock = false;
    this.options.init ? this.initPopups() : null;
  }
  initPopups() {
    this.eventsPopup();
  }
  eventsPopup() {
    document.addEventListener("click", function (e) {
      const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
      if (buttonOpen) {
        e.preventDefault();
        this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
        this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
        if ("error" !== this._dataValue) {
          if (!this.isOpen) this.lastFocusEl = buttonOpen;
          this.targetOpen.selector = `${this._dataValue}`;
          this._selectorOpen = true;
          this.open();
          return;
        }
        return;
      }
      const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
      if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
    }.bind(this));
    document.addEventListener("keydown", function (e) {
      if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
      if (this.options.focusCatch && 9 == e.which && this.isOpen) {
        this._focusCatch(e);
        return;
      }
    }.bind(this));
    if (this.options.hashSettings.goHash) {
      window.addEventListener("hashchange", function () {
        if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
      }.bind(this));
      window.addEventListener("load", function () {
        if (window.location.hash) this._openToHash();
      }.bind(this));
    }
  }
  open(selectorValue) {
    if (bodyLockStatus) {
      this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
      if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
        this.targetOpen.selector = selectorValue;
        this._selectorOpen = true;
      }
      if (this.isOpen) {
        this._reopen = true;
        this.close();
      }
      if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
      if (!this._reopen) this.previousActiveElement = document.activeElement;
      this.targetOpen.element = document.querySelector(this.targetOpen.selector);
      if (this.targetOpen.element) {
        if (this.youTubeCode) {
          const codeVideo = this.youTubeCode;
          const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
          const iframe = document.createElement("iframe");
          iframe.setAttribute("allowfullscreen", "");
          const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
          iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
          iframe.setAttribute("src", urlVideo);
          if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
          }
          this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
        }
        const videoElement = this.targetOpen.element.querySelector("video");
        if (videoElement) {
          videoElement.muted = true;
          videoElement.currentTime = 0;
          videoElement.play().catch((e => console.error("Autoplay error:", e)));
        }
        if (this.options.hashSettings.location) {
          this._getHash();
          this._setHash();
        }
        this.options.on.beforeOpen(this);
        document.dispatchEvent(new CustomEvent("beforePopupOpen", {
          detail: {
            popup: this
          }
        }));
        this.targetOpen.element.classList.add(this.options.classes.popupActive);
        document.documentElement.classList.add(this.options.classes.bodyActive);
        if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
        this.targetOpen.element.setAttribute("aria-hidden", "false");
        this.previousOpen.selector = this.targetOpen.selector;
        this.previousOpen.element = this.targetOpen.element;
        this._selectorOpen = false;
        this.isOpen = true;
        this.options.on.afterOpen(this);
        document.dispatchEvent(new CustomEvent("afterPopupOpen", {
          detail: {
            popup: this
          }
        }));
      }
    }
  }
  close(selectorValue) {
    if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
    if (!this.isOpen || !bodyLockStatus) return;
    this.options.on.beforeClose(this);
    document.dispatchEvent(new CustomEvent("beforePopupClose", {
      detail: {
        popup: this
      }
    }));
    if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
    this.previousOpen.element.classList.remove(this.options.classes.popupActive);
    const videoElement = this.previousOpen.element.querySelector("video");
    if (videoElement) videoElement.pause();
    this.previousOpen.element.setAttribute("aria-hidden", "true");
    if (!this._reopen) {
      document.documentElement.classList.remove(this.options.classes.bodyActive);
      !this.bodyLock ? bodyUnlock() : null;
      this.isOpen = false;
    }
    document.dispatchEvent(new CustomEvent("afterPopupClose", {
      detail: {
        popup: this
      }
    }));
  }
  _getHash() {
    if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
  }
  _openToHash() {
    let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
    const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
    if (buttons && classInHash) this.open(classInHash);
  }
  _setHash() {
    history.pushState("", "", this.hash);
  }
  _removeHash() {
    history.pushState("", "", window.location.href.split("#")[0]);
  }
  _focusCatch(e) {
    const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);
    if (e.shiftKey && 0 === focusedIndex) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }
    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }
}
modules_flsModules.popup = new Popup({});

function menuOpen() {
  bodyLock();
  document.documentElement.classList.add("menu-open");
}
function menuClose() {
  bodyUnlock();
  document.documentElement.classList.remove("menu-open");
}

//========================================================================================================================================================

//Форма
function formFieldsInit(options = { viewPass: true, autoHeight: false }) {
  function checkAllFieldsFilled() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      const submitButton = form.querySelector('button[type="submit"]');
      if (!submitButton) return;

      const requiredFields = form.querySelectorAll('[data-required]');
      let allFilled = true;

      requiredFields.forEach(field => {
        if (field.type === 'checkbox') {
          if (!field.checked) allFilled = false;
        } else if (field.type === 'select-one' || field.tagName === 'SELECT') {
          if (!field.value) allFilled = false;
        } else {
          if (!field.value.trim()) allFilled = false;
        }
      });

      const emailFields = form.querySelectorAll('[data-required="email"]');
      emailFields.forEach(emailField => {
        if (emailField.value && formValidate.emailTest(emailField)) {
          allFilled = false;
        }
      });

      const passwordConfirmFields = form.querySelectorAll('[data-validate="password-confirm"]');
      passwordConfirmFields.forEach(field => {
        const passwordInput = document.getElementById('password');
        if (passwordInput && field.value !== passwordInput.value) {
          allFilled = false;
        }
      });

      if (allFilled && requiredFields.length > 0) {
        submitButton.classList.remove('disabled');
        submitButton.disabled = false;
      } else {
        submitButton.classList.add('disabled');
        submitButton.disabled = true;
      }
    });
  }

  document.body.addEventListener("focusin", function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      if (!targetElement.hasAttribute('data-no-focus-classes')) {
        targetElement.classList.add('_form-focus');
        targetElement.parentElement.classList.add('_form-focus');
      }
      formValidate.removeError(targetElement);
      targetElement.hasAttribute('data-validate') ? formValidate.removeError(targetElement) : null;
    }
  });

  document.body.addEventListener("focusout", function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      if (!targetElement.hasAttribute('data-no-focus-classes')) {
        targetElement.classList.remove('_form-focus');
        targetElement.parentElement.classList.remove('_form-focus');
      }
      targetElement.hasAttribute('data-validate') ? formValidate.validateInput(targetElement) : null;
    }
  });

  document.body.addEventListener("input", function (e) {
    const targetElement = e.target;
    if (targetElement.hasAttribute('data-required')) {
      checkAllFieldsFilled();
    }
  });

  document.body.addEventListener("change", function (e) {
    const targetElement = e.target;
    if (targetElement.hasAttribute('data-required')) {
      checkAllFieldsFilled();
    }
  });

  if (options.viewPass) {
    document.addEventListener("click", function (e) {
      const targetElement = e.target;
      if (targetElement.closest('.form__viewpass')) {
        const viewpassBlock = targetElement.closest('.form__viewpass');
        const input = viewpassBlock.closest('.form__input').querySelector('input');

        if (input) {
          const isActive = viewpassBlock.classList.contains('_viewpass-active');
          input.setAttribute("type", isActive ? "password" : "text");
          viewpassBlock.classList.toggle('_viewpass-active');
        } else {
          console.error('Input не найден!');
        }
      }
    });
  }

  if (options.autoHeight) {
    const textareas = document.querySelectorAll('textarea[data-autoheight]');
    if (textareas.length) {
      textareas.forEach(textarea => {
        const startHeight = textarea.hasAttribute('data-autoheight-min') ?
          Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
        const maxHeight = textarea.hasAttribute('data-autoheight-max') ?
          Number(textarea.dataset.autoheightMax) : Infinity;
        setHeight(textarea, Math.min(startHeight, maxHeight))
        textarea.addEventListener('input', () => {
          if (textarea.scrollHeight > startHeight) {
            textarea.style.height = `auto`;
            setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
          }
        });
      });
      function setHeight(textarea, height) {
        textarea.style.height = `${height}px`;
      }
    }
  }

  setTimeout(() => {
    checkAllFieldsFilled();
  }, 100);
}

formFieldsInit({
  viewPass: true,
  autoHeight: false
});

let formValidate = {
  getErrors(form) {
    let error = 0;
    let formRequiredItems = form.querySelectorAll('*[data-required]');
    if (formRequiredItems.length) {
      formRequiredItems.forEach(formRequiredItem => {
        if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
          error += this.validateInput(formRequiredItem);
        }
      });
    }
    return error;
  },
  validateInput(formRequiredItem) {
    let error = 0;

    if (formRequiredItem.dataset.required === "email") {
      formRequiredItem.value = formRequiredItem.value.replace(" ", "");
      if (this.emailTest(formRequiredItem)) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
      this.addError(formRequiredItem);
      this.removeSuccess(formRequiredItem);
      error++;
    } else if (formRequiredItem.dataset.validate === "password-confirm") {
      const passwordInput = document.getElementById('password');
      if (!passwordInput) return error;

      if (formRequiredItem.value !== passwordInput.value) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else {
      if (!formRequiredItem.value.trim()) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    }

    const form = formRequiredItem.closest('form');
    if (form) {
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        const requiredFields = form.querySelectorAll('[data-required]');
        let allFilled = true;

        requiredFields.forEach(field => {
          if (field.type === 'checkbox') {
            if (!field.checked) allFilled = false;
          } else if (field.type === 'select-one' || field.tagName === 'SELECT') {
            if (!field.value) allFilled = false;
          } else {
            if (!field.value.trim()) allFilled = false;
          }
        });

        const emailFields = form.querySelectorAll('[data-required="email"]');
        emailFields.forEach(emailField => {
          if (emailField.value && this.emailTest(emailField)) {
            allFilled = false;
          }
        });

        const passwordConfirmFields = form.querySelectorAll('[data-validate="password-confirm"]');
        passwordConfirmFields.forEach(field => {
          const passwordInput = document.getElementById('password');
          if (passwordInput && field.value !== passwordInput.value) {
            allFilled = false;
          }
        });

        if (allFilled && requiredFields.length > 0) {
          submitButton.classList.remove('disabled');
          submitButton.disabled = false;
        } else {
          submitButton.classList.add('disabled');
          submitButton.disabled = true;
        }
      }
    }

    return error;
  },
  addError(formRequiredItem) {
    formRequiredItem.classList.add('_form-error');
    formRequiredItem.parentElement.classList.add('_form-error');
    let inputError = formRequiredItem.parentElement.querySelector('.form__error');
    if (inputError) formRequiredItem.parentElement.removeChild(inputError);
    if (formRequiredItem.dataset.error) {
      formRequiredItem.parentElement.insertAdjacentHTML('beforeend', `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
    }
  },
  removeError(formRequiredItem) {
    formRequiredItem.classList.remove('_form-error');
    formRequiredItem.parentElement.classList.remove('_form-error');
    if (formRequiredItem.parentElement.querySelector('.form__error')) {
      formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector('.form__error'));
    }
  },
  addSuccess(formRequiredItem) {
    formRequiredItem.classList.add('_form-success');
    formRequiredItem.parentElement.classList.add('_form-success');
  },
  removeSuccess(formRequiredItem) {
    formRequiredItem.classList.remove('_form-success');
    formRequiredItem.parentElement.classList.remove('_form-success');
  },
  formClean(form) {
    form.reset();
    setTimeout(() => {
      let inputs = form.querySelectorAll('input,textarea');
      for (let index = 0; index < inputs.length; index++) {
        const el = inputs[index];
        el.parentElement.classList.remove('_form-focus');
        el.classList.remove('_form-focus');
        this.removeError(el);
      }
      let checkboxes = form.querySelectorAll('.checkbox__input');
      if (checkboxes.length > 0) {
        for (let index = 0; index < checkboxes.length; index++) {
          const checkbox = checkboxes[index];
          checkbox.checked = false;
        }
      }
      if (modules_flsModules.popup && modules_flsModules.select) {
        let selects = form.querySelectorAll('div.select');
        if (selects.length) {
          for (let index = 0; index < selects.length; index++) {
            const select = selects[index].querySelector('select');
            modules_flsModules.select.selectBuild(select);
          }
        }
      }
    }, 0);
  },
  emailTest(formRequiredItem) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
  }
};

function formSubmit() {
  const forms = document.forms;
  if (forms.length) {
    for (const form of forms) {
      form.addEventListener('submit', function (e) {
        const form = e.target;
        formSubmitAction(form, e);
      });
      form.addEventListener('reset', function (e) {
        const form = e.target;
        formValidate.formClean(form);
      });
    }
  }

  async function formSubmitAction(form, e) {
    const error = !form.hasAttribute('data-no-validate') ? formValidate.getErrors(form) : 0;
    if (error === 0) {
      const ajax = form.hasAttribute('data-ajax');
      if (ajax) {
        e.preventDefault();
        const formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
        const formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
        const formData = new FormData(form);

        form.classList.add('_sending');
        const response = await fetch(formAction, {
          method: formMethod,
          body: formData
        });
        if (response.ok) {
          let responseResult = await response.json();
          form.classList.remove('_sending');
          formSent(form, responseResult);
        } else {
          alert("Помилка");
          form.classList.remove('_sending');
        }
      } else if (form.hasAttribute('data-dev')) {
        e.preventDefault();
        formSent(form);
      }
    } else {
      e.preventDefault();
      if (form.querySelector('._form-error') && form.hasAttribute('data-goto-error')) {
        const formGoToErrorClass = form.dataset.gotoError ? form.dataset.gotoError : '._form-error';
        gotoBlock(formGoToErrorClass, true, 1000);
      }
    }
  }

  function formSent(form, responseResult = ``) {
    document.dispatchEvent(new CustomEvent("formSent", {
      detail: {
        form: form
      }
    }));
    setTimeout(() => {
      if (modules_flsModules && modules_flsModules.popup) {
        const popup = form.dataset.popupMessage;
        popup ? modules_flsModules.popup.open(popup) : null;
      }
    }, 0);
    formValidate.formClean(form);
    formLogging(`Форма отправлена!`);
  }

  function formLogging(message) {
    console.log(`[Форма]: ${message}`);
  }
}

formSubmit();

//========================================================================================================================================================

//Маска телефона
const telephone = document.querySelectorAll('.telephone');
if (telephone) {
  Inputmask({
    "mask": "+7 (999) 999 - 99 - 99",
    "showMaskOnHover": false,
  }).mask(telephone);
}

//========================================================================================================================================================

function handleSalonSelection() {
  const salonInputs = document.querySelectorAll('#select-salon .salon-options__input');
  const salonInputField = document.querySelector('.select-input input');
  const salonPlaceholder = document.querySelector('.select-input .form__placeholder');

  if (salonInputField && salonInputs.length > 0) {
    salonInputs.forEach(input => {
      input.addEventListener('change', function () {
        if (this.checked) {
          const salonTitle = this.closest('.salon-options__item')
            .querySelector('.salon-options__title').textContent.trim();

          salonInputField.value = salonTitle;
          salonInputField.classList.add('active');

          if (salonPlaceholder) {
            salonPlaceholder.style.display = 'block';
          }

          const salonPopup = document.querySelector('#select-salon');
          if (salonPopup) {
            salonPopup.setAttribute('aria-hidden', 'true');
            salonPopup.style.display = 'none';
          }

          const backButton = document.querySelector('[data-popup="#leave-request"]');
          if (backButton) {
            backButton.click();
          }
        }
      });
    });
  }
}

handleSalonSelection();

const selectInput = document.querySelector('.select-input');
if (selectInput) {
  selectInput.addEventListener('click', function () {
    const salonPopup = document.querySelector('#select-salon');
    if (salonPopup) {
      salonPopup.setAttribute('aria-hidden', 'false');
      salonPopup.style.display = 'flex';
    }
  });
}

//========================================================================================================================================================

//Карта

const mapElement = document.querySelector('#map');
let myMap = null;
let currentPlacemark = null;

if (mapElement) {
  const mapObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        mapObserver.unobserve(mapElement);

        if (typeof ymaps === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
          script.async = true;

          script.onload = () => {
            if (typeof ymaps !== 'undefined') {
              ymaps.ready(safeInitMap);
              initSalonSelection();
            }
          };

          document.head.appendChild(script);
        } else {
          ymaps.ready(safeInitMap);
          initSalonSelection();
        }
      }
    });
  }, {
    rootMargin: '0px 0px 200px 0px'
  });

  mapObserver.observe(mapElement);

  function safeInitMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement || mapElement.dataset.initialized === 'true') return;

    try {
      const preview = mapElement.querySelector('.map-preview');
      if (preview) preview.remove();

      myMap = new ymaps.Map('map', {
        center: [59.890857, 30.411512],
        zoom: 14,
        controls: ['zoomControl']
      });

      const firstInput = document.querySelector('.salon-options__input[value="1"]');
      if (firstInput) {
        firstInput.checked = true;
        showPlacemark(firstInput);
      }

      mapElement.dataset.initialized = 'true';

    } catch (error) {
      console.error("Map init error:", error);
    }
  }
  function showPlacemark(inputElement) {
    const coordsStr = inputElement.getAttribute('data-coords');

    if (!coordsStr) return;

    const coords = coordsStr.split(',').map(coord => parseFloat(coord.trim()));

    if (currentPlacemark) {
      myMap.geoObjects.remove(currentPlacemark);
    }

    currentPlacemark = new ymaps.Placemark(coords);

    // Можно добавить простую иконку, если нужно:
    // currentPlacemark = new ymaps.Placemark(coords, {}, {
    //   iconLayout: 'default#image',
    //   iconImageHref: 'img/icons/location.svg',
    //   iconImageSize: [30, 30],
    //   iconImageOffset: [-15, -15]
    // });

    myMap.geoObjects.add(currentPlacemark);

    myMap.setCenter(coords, 17);
  }
  function initSalonSelection() {
    const inputs = document.querySelectorAll('.salon-options__input');

    inputs.forEach(input => {
      input.addEventListener('change', function () {
        if (this.checked) {
          showPlacemark(this);
        }
      });

      const label = input.closest('.salon-options__item');
      label.addEventListener('click', (e) => {
        if (!input.checked) {
          input.checked = true;
          input.dispatchEvent(new Event('change'));
        }
      });
    });

    const firstInput = document.querySelector('.salon-options__input');
    if (firstInput && !firstInput.checked) {
      firstInput.checked = true;
    }
  }
}

//========================================================================================================================================================

//Селект
class SelectConstructor {
  constructor(props, data = null) {
    let defaultConfig = {
      init: true,
      logging: true,
      speed: 150
    }
    this.config = Object.assign(defaultConfig, props);
    // CSS класи модуля
    this.selectClasses = {
      classSelect: "select", // Головний блок
      classSelectBody: "select__body", // Тіло селекту
      classSelectTitle: "select__title", // Заголовок
      classSelectValue: "select__value", // Значення у заголовку
      classSelectLabel: "select__label", // Лабел
      classSelectInput: "select__input", // Поле введення
      classSelectText: "select__text", // Оболонка текстових даних
      classSelectLink: "select__link", // Посилання в елементі
      classSelectOptions: "select__options", // Випадаючий список
      classSelectOptionsScroll: "select__scroll", // Оболонка при скролі
      classSelectOption: "select__option", // Пункт
      classSelectContent: "select__content", // Оболонка контенту в заголовку
      classSelectRow: "select__row", // Ряд
      classSelectData: "select__asset", // Додаткові дані
      classSelectDisabled: "_select-disabled", // Заборонено
      classSelectTag: "_select-tag", // Клас тега
      classSelectOpen: "_select-open", // Список відкритий
      classSelectActive: "_select-active", // Список вибрано
      classSelectFocus: "_select-focus", // Список у фокусі
      classSelectMultiple: "_select-multiple", // Мультивибір
      classSelectCheckBox: "_select-checkbox", // Стиль чекбоксу
      classSelectOptionSelected: "_select-selected", // Вибраний пункт
      classSelectPseudoLabel: "_select-pseudo-label", // Псевдолейбл
    }
    this._this = this;
    if (this.config.init) {
      const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll('select');
      if (selectItems.length) {
        this.selectsInit(selectItems);
      }
    }
  }

  getSelectClass(className) {
    return `.${className}`;
  }

  getSelectElement(selectItem, className) {
    return {
      originalSelect: selectItem.querySelector('select'),
      selectElement: selectItem.querySelector(this.getSelectClass(className)),
    }
  }

  selectsInit(selectItems) {
    selectItems.forEach((originalSelect, index) => {
      this.selectInit(originalSelect, index + 1);
    });

    document.addEventListener('click', function (e) {
      this.selectsActions(e);
    }.bind(this));

    document.addEventListener('keydown', function (e) {
      this.selectsActions(e);
    }.bind(this));

    document.addEventListener('focusin', function (e) {
      this.selectsActions(e);
    }.bind(this));

    document.addEventListener('focusout', function (e) {
      this.selectsActions(e);
    }.bind(this));
  }

  selectInit(originalSelect, index) {
    const _this = this;
    let selectItem = document.createElement("div");
    selectItem.classList.add(this.selectClasses.classSelect);

    // Виводимо оболонку перед оригінальним селектом
    originalSelect.parentNode.insertBefore(selectItem, originalSelect);

    // Поміщаємо оригінальний селект в оболонку
    selectItem.appendChild(originalSelect);

    // Приховуємо оригінальний селект
    originalSelect.hidden = true;

    // Привласнюємо унікальний ID
    index ? originalSelect.dataset.id = index : null;

    // Робота з плейсхолдером
    if (this.getSelectPlaceholder(originalSelect)) {
      originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
      if (this.getSelectPlaceholder(originalSelect).label.show) {
        const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
        selectItemTitle.insertAdjacentHTML('afterbegin', `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
      }
    }

    // Конструктор основних елементів
    selectItem.insertAdjacentHTML('beforeend', `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);

    // Запускаємо конструктор псевдоселекту
    this.selectBuild(originalSelect);

    // Запам'ятовуємо швидкість
    originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : this.config.speed;
    this.config.speed = +originalSelect.dataset.speed;

    // Подія при зміні оригінального select
    originalSelect.addEventListener('change', function (e) {
      _this.selectChange(e);

      // Триггерим кастомное событие для фильтрации
      const filterEvent = new CustomEvent('filterChange', {
        detail: {
          name: originalSelect.name,
          value: originalSelect.value
        }
      });
      document.dispatchEvent(filterEvent);
    });
  }

  // Конструктор псевдоселекту
  selectBuild(originalSelect) {
    const selectItem = originalSelect.parentElement;
    selectItem.dataset.id = originalSelect.dataset.id;

    originalSelect.dataset.classModif ? selectItem.classList.add(`select_${originalSelect.dataset.classModif}`) : null;

    originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);

    originalSelect.hasAttribute('data-checkbox') && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);

    this.setSelectTitleValue(selectItem, originalSelect);

    this.setOptions(selectItem, originalSelect);

    originalSelect.hasAttribute('data-search') ? this.searchActions(selectItem) : null;

    originalSelect.hasAttribute('data-open') ? this.selectAction(selectItem) : null;

    this.selectDisabled(selectItem, originalSelect);
  }

  // Функція реакцій на події
  selectsActions(e) {
    const targetElement = e.target;
    const targetType = e.type;

    if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect)) || targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
      const selectItem = targetElement.closest('.select') ? targetElement.closest('.select') : document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag)).dataset.selectId}"]`);
      const originalSelect = this.getSelectElement(selectItem).originalSelect;

      if (targetType === 'click') {
        if (!originalSelect.disabled) {
          if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
            const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag));
            const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`);
            this.optionAction(selectItem, originalSelect, optionItem);
          } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTitle))) {
            this.selectAction(selectItem);
          } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption))) {
            const optionItem = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption));
            this.optionAction(selectItem, originalSelect, optionItem);
          }
        }
      } else if (targetType === 'focusin' || targetType === 'focusout') {
        if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect))) {
          targetType === 'focusin' ? selectItem.classList.add(this.selectClasses.classSelectFocus) : selectItem.classList.remove(this.selectClasses.classSelectFocus);
        }
      } else if (targetType === 'keydown' && e.code === 'Escape') {
        this.selectsСlose();
      }
    } else {
      this.selectsСlose();
    }
  }

  selectsСlose(selectOneGroup) {
    const selectsGroup = selectOneGroup ? selectOneGroup : document;
    const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
    if (selectActiveItems.length) {
      selectActiveItems.forEach(selectActiveItem => {
        this.selectСlose(selectActiveItem);
      });
    }
  }

  selectСlose(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    if (!selectOptions.classList.contains('_slide')) {
      selectItem.classList.remove(this.selectClasses.classSelectOpen);
      _slideUp(selectOptions, originalSelect.dataset.speed);
      setTimeout(() => {
        selectItem.style.zIndex = '';
      }, originalSelect.dataset.speed);
    }
  }

  selectAction(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    const selectOpenzIndex = originalSelect.dataset.zIndex ? originalSelect.dataset.zIndex : 3;

    this.setOptionsPosition(selectItem);
    this.selectsСlose();

    setTimeout(() => {
      if (!selectOptions.classList.contains('_slide')) {
        selectItem.classList.toggle(this.selectClasses.classSelectOpen);
        _slideToggle(selectOptions, originalSelect.dataset.speed);

        if (selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
          selectItem.style.zIndex = selectOpenzIndex;
        } else {
          setTimeout(() => {
            selectItem.style.zIndex = '';
          }, originalSelect.dataset.speed);
        }
      }
    }, 0);
  }

  setSelectTitleValue(selectItem, originalSelect) {
    const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
    const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
    if (selectItemTitle) selectItemTitle.remove();
    selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
    originalSelect.hasAttribute('data-search') ? this.searchActions(selectItem) : null;
  }

  getSelectTitleValue(selectItem, originalSelect) {
    let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;

    if (originalSelect.multiple && originalSelect.hasAttribute('data-tags')) {
      selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map(option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="_select-tag">${this.getSelectElementContent(option)}</span>`).join('');
      if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
        document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
        if (originalSelect.hasAttribute('data-search')) selectTitleValue = false;
      }
    }

    selectTitleValue = selectTitleValue.length ? selectTitleValue : (originalSelect.dataset.placeholder ? originalSelect.dataset.placeholder : '');

    let pseudoAttribute = '';
    let pseudoAttributeClass = '';
    if (originalSelect.hasAttribute('data-pseudo-label')) {
      pseudoAttribute = originalSelect.dataset.pseudoLabel ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"` : ` data-pseudo-label="Заповніть атрибут"`;
      pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
    }

    this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);

    if (originalSelect.hasAttribute('data-search')) {
      return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`;
    } else {
      const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : '';
      return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
    }
  }

  getSelectElementContent(selectOption) {
    const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : '';
    const selectOptionDataHTML = selectOptionData.indexOf('img') >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
    let selectOptionContentHTML = ``;
    selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : '';
    selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : '';
    selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : '';
    selectOptionContentHTML += selectOptionData ? `</span>` : '';
    selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : '';
    selectOptionContentHTML += selectOption.textContent;
    selectOptionContentHTML += selectOptionData ? `</span>` : '';
    selectOptionContentHTML += selectOptionData ? `</span>` : '';
    return selectOptionContentHTML;
  }

  getSelectPlaceholder(originalSelect) {
    const selectPlaceholder = Array.from(originalSelect.options).find(option => !option.value);
    if (selectPlaceholder) {
      return {
        value: selectPlaceholder.textContent,
        show: selectPlaceholder.hasAttribute("data-show"),
        label: {
          show: selectPlaceholder.hasAttribute("data-label"),
          text: selectPlaceholder.dataset.label
        }
      }
    }
  }

  getSelectedOptionsData(originalSelect, type) {
    let selectedOptions = [];
    if (originalSelect.multiple) {
      selectedOptions = Array.from(originalSelect.options).filter(option => option.value).filter(option => option.selected);
    } else {
      selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
    }
    return {
      elements: selectedOptions.map(option => option),
      values: selectedOptions.filter(option => option.value).map(option => option.value),
      html: selectedOptions.map(option => this.getSelectElementContent(option))
    }
  }

  getOptions(originalSelect) {
    const selectOptionsScroll = originalSelect.hasAttribute('data-scroll') ? `data-simplebar` : '';
    const customMaxHeightValue = +originalSelect.dataset.scroll ? +originalSelect.dataset.scroll : null;

    let selectOptions = Array.from(originalSelect.options);
    if (selectOptions.length > 0) {
      let selectOptionsHTML = ``;

      if ((this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show) || originalSelect.multiple) {
        selectOptions = selectOptions.filter(option => option.value);
      }

      selectOptionsHTML += `<div ${selectOptionsScroll} ${selectOptionsScroll ? `style="max-height: ${customMaxHeightValue}px"` : ''} class="${this.selectClasses.classSelectOptionsScroll}">`;

      selectOptions.forEach(selectOption => {
        selectOptionsHTML += this.getOption(selectOption, originalSelect);
      });

      selectOptionsHTML += `</div>`;
      return selectOptionsHTML;
    }
  }

  getOption(selectOption, originalSelect) {
    const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : '';
    const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute('data-show-selected') && !originalSelect.multiple ? `hidden` : ``;
    const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : '';
    const selectOptionLink = selectOption.dataset.href ? selectOption.dataset.href : false;
    const selectOptionLinkTarget = selectOption.hasAttribute('data-href-blank') ? `target="_blank"` : '';

    let selectOptionHTML = ``;
    selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
    selectOptionHTML += this.getSelectElementContent(selectOption);
    selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
    return selectOptionHTML;
  }

  setOptions(selectItem, originalSelect) {
    const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    selectItemOptions.innerHTML = this.getOptions(originalSelect);
  }

  setOptionsPosition(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    const selectItemScroll = this.getSelectElement(selectItem, this.selectClasses.classSelectOptionsScroll).selectElement;
    const customMaxHeightValue = +originalSelect.dataset.scroll ? `${+originalSelect.dataset.scroll}px` : ``;
    const selectOptionsPosMargin = +originalSelect.dataset.optionsMargin ? +originalSelect.dataset.optionsMargin : 10;

    if (!selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
      selectOptions.hidden = false;
      const selectItemScrollHeight = selectItemScroll.offsetHeight ? selectItemScroll.offsetHeight : parseInt(window.getComputedStyle(selectItemScroll).getPropertyValue('max-height'));
      const selectOptionsHeight = selectOptions.offsetHeight > selectItemScrollHeight ? selectOptions.offsetHeight : selectItemScrollHeight + selectOptions.offsetHeight;
      const selectOptionsScrollHeight = selectOptionsHeight - selectItemScrollHeight;
      selectOptions.hidden = true;

      const selectItemHeight = selectItem.offsetHeight;
      const selectItemPos = selectItem.getBoundingClientRect().top;
      const selectItemTotal = selectItemPos + selectOptionsHeight + selectItemHeight + selectOptionsScrollHeight;
      const selectItemResult = window.innerHeight - (selectItemTotal + selectOptionsPosMargin);

      if (selectItemResult < 0) {
        const newMaxHeightValue = selectOptionsHeight + selectItemResult;
        if (newMaxHeightValue < 100) {
          selectItem.classList.add('select--show-top');
          selectItemScroll.style.maxHeight = selectItemPos < selectOptionsHeight ? `${selectItemPos - (selectOptionsHeight - selectItemPos)}px` : customMaxHeightValue;
        } else {
          selectItem.classList.remove('select--show-top');
          selectItemScroll.style.maxHeight = `${newMaxHeightValue}px`;
        }
      }
    } else {
      setTimeout(() => {
        selectItem.classList.remove('select--show-top');
        selectItemScroll.style.maxHeight = customMaxHeightValue;
      }, +originalSelect.dataset.speed);
    }
  }

  // ОБНОВЛЕННЫЙ МЕТОД - правильная работа со скрытыми select
  optionAction(selectItem, originalSelect, optionItem) {
    const selectOptions = selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOptions)}`);
    if (!selectOptions.classList.contains('_slide')) {
      if (originalSelect.multiple) {
        optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
        const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
        originalSelectSelectedItems.forEach(originalSelectSelectedItem => {
          originalSelectSelectedItem.removeAttribute('selected');
        });

        const selectSelectedItems = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
        selectSelectedItems.forEach(selectSelectedItems => {
          originalSelect.querySelector(`option[value = "${selectSelectedItems.dataset.value}"]`).setAttribute('selected', 'selected');
        });
      } else {
        if (!originalSelect.hasAttribute('data-show-selected')) {
          setTimeout(() => {
            if (selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`)) {
              selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`).hidden = false;
            }
            optionItem.hidden = true;
          }, this.config.speed);
        }

        // Устанавливаем значение в оригинальный select
        const newValue = optionItem.hasAttribute('data-value') ? optionItem.dataset.value : optionItem.textContent;
        originalSelect.value = newValue;

        // Явно триггерим событие change на оригинальном select
        const changeEvent = new Event('change', { bubbles: true });
        originalSelect.dispatchEvent(changeEvent);

        this.selectAction(selectItem);
      }

      this.setSelectTitleValue(selectItem, originalSelect);
      this.setSelectChange(originalSelect);
    }
  }

  selectChange(e) {
    const originalSelect = e.target;
    this.selectBuild(originalSelect);
    this.setSelectChange(originalSelect);
  }

  setSelectChange(originalSelect) {
    if (originalSelect.hasAttribute('data-validate')) {
      formValidate.validateInput(originalSelect);
    }

    if (originalSelect.hasAttribute('data-submit') && originalSelect.value) {
      let tempButton = document.createElement("button");
      tempButton.type = "submit";
      originalSelect.closest('form').append(tempButton);
      tempButton.click();
      tempButton.remove();
    }

    const selectItem = originalSelect.parentElement;
    this.selectCallback(selectItem, originalSelect);
  }

  selectDisabled(selectItem, originalSelect) {
    if (originalSelect.disabled) {
      selectItem.classList.add(this.selectClasses.classSelectDisabled);
      this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
    } else {
      selectItem.classList.remove(this.selectClasses.classSelectDisabled);
      this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
    }
  }

  searchActions(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption} `);
    const _this = this;

    selectInput.addEventListener("input", function () {
      selectOptionsItems.forEach(selectOptionsItem => {
        if (selectOptionsItem.textContent.toUpperCase().includes(selectInput.value.toUpperCase())) {
          selectOptionsItem.hidden = false;
        } else {
          selectOptionsItem.hidden = true;
        }
      });
      selectOptions.hidden === true ? _this.selectAction(selectItem) : null;
    });
  }

  selectCallback(selectItem, originalSelect) {
    document.dispatchEvent(new CustomEvent("selectCallback", {
      detail: {
        select: originalSelect
      }
    }));
  }
}
modules_flsModules.select = new SelectConstructor({});

//========================================================================================================================================================

//Фильтр
const filterButtons = document.querySelectorAll('.block-showrooms-nav [data-filter]');
const filterContents = document.querySelectorAll('.block-showrooms__left, .block-showrooms__right');
const htmlElement = document.documentElement;
const savedFilter = localStorage.getItem('activeFilter');
const initialFilter = savedFilter || 'map';

if (filterButtons.length) {
  let isManuallyMoving = false;
  const daClassname = '_dynamic_adapt_';

  function activateFilter(filterType) {
    htmlElement.classList.remove('filter-list');

    filterButtons.forEach(btn => {
      btn.classList.remove('active');
    });

    filterContents.forEach(content => {
      content.classList.remove('active');
    });

    const activeButton = document.querySelector(`.block-showrooms-nav [data-filter="${filterType}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }

    if (filterType === 'list') {
      const listContent = document.querySelector('.block-showrooms__left');
      if (listContent) {
        listContent.classList.add('active');
      }
      htmlElement.classList.add('filter-list');
    } else if (filterType === 'map') {
      const mapContent = document.querySelector('.block-showrooms__right');
      if (mapContent) {
        mapContent.classList.add('active');
      }
    }

    localStorage.setItem('activeFilter', filterType);
    checkAndHandleMobileLayout(filterType);
  }

  function checkAndHandleMobileLayout(currentFilter) {
    const selectSalonSelect = document.querySelector('.select-salon__select');
    const container = document.querySelector('.block-showrooms .container');

    if (!selectSalonSelect || !container) return;

    if (selectSalonSelect.classList.contains(daClassname)) {
      return;
    }

    isManuallyMoving = true;

    try {
      if (window.innerWidth <= 992) {
        if (currentFilter === 'list') {
          const listContent = document.querySelector('.block-showrooms__left');
          if (listContent && !listContent.contains(selectSalonSelect)) {
            const selectSalon = document.querySelector('.select-salon');
            if (selectSalon) {
              selectSalon.insertBefore(selectSalonSelect, selectSalon.firstChild);
            }
          }
        } else {
          if (container && !container.contains(selectSalonSelect)) {
            container.insertBefore(selectSalonSelect, container.firstChild);
          }
        }
      } else {
        const selectSalon = document.querySelector('.select-salon');
        if (selectSalon && !selectSalon.contains(selectSalonSelect)) {
          selectSalon.insertBefore(selectSalonSelect, selectSalon.firstChild);
        }
      }
    } finally {
      setTimeout(() => {
        isManuallyMoving = false;
      }, 50);
    }
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      const filterType = this.getAttribute('data-filter');
      activateFilter(filterType);
    });
  });

  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (isManuallyMoving) return;

      const activeButton = document.querySelector('.block-showrooms-nav [data-filter].active');
      let currentFilter = 'map';

      if (activeButton) {
        currentFilter = activeButton.getAttribute('data-filter');
      } else {
        if (document.querySelector('.block-showrooms__right.active')) {
          currentFilter = 'map';
        } else if (document.querySelector('.block-showrooms__left.active')) {
          currentFilter = 'list';
        }
      }

      checkAndHandleMobileLayout(currentFilter);

      if (currentFilter === 'list') {
        document.querySelector('.block-showrooms__left')?.classList.add('active');
        document.querySelector('.block-showrooms__right')?.classList.remove('active');
        document.querySelector('.block-showrooms-nav [data-filter="list"]')?.classList.add('active');
        document.querySelector('.block-showrooms-nav [data-filter="map"]')?.classList.remove('active');
        htmlElement.classList.add('filter-list');
      } else {
        document.querySelector('.block-showrooms__right')?.classList.add('active');
        document.querySelector('.block-showrooms__left')?.classList.remove('active');
        document.querySelector('.block-showrooms-nav [data-filter="map"]')?.classList.add('active');
        document.querySelector('.block-showrooms-nav [data-filter="list"]')?.classList.remove('active');
        htmlElement.classList.remove('filter-list');
      }
    }, 250);
  }

  // Инициализация
  const hasInitialActive = document.querySelector('.block-showrooms__right.active') ||
    document.querySelector('.block-showrooms-nav [data-filter="map"].active');

  if (!hasInitialActive) {
    activateFilter(initialFilter);
  } else {
    const mapButton = document.querySelector('.block-showrooms-nav [data-filter="map"]');
    if (mapButton && mapButton.classList.contains('active')) {
      activateFilter('map');
    } else {
      const listButton = document.querySelector('.block-showrooms-nav [data-filter="list"]');
      if (listButton && listButton.classList.contains('active')) {
        activateFilter('list');
      }
    }
  }

  window.addEventListener('resize', handleResize);

  const initialActiveButton = document.querySelector('.block-showrooms-nav [data-filter].active');
  const initialFilterFromDOM = initialActiveButton ? initialActiveButton.getAttribute('data-filter') : 'map';
  checkAndHandleMobileLayout(initialFilterFromDOM);
}

//========================================================================================================================================================

if (document.querySelector('.block-intro__slider')) {
  const swiperIntro = new Swiper('.block-intro__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    lazy: true,
    speed: 800,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    autoplay: {
      delay: 3000,
    },
    navigation: {
      prevEl: '.block-intro-arrow-prev',
      nextEl: '.block-intro-arrow-next',
    },
    on: {
      init: function () {
        updateFraction(this);
        updateSliderNavPosition();
      },
      slideChange: function () {
        updateFraction(this);
      },
    },
  });

  function updateFraction(swiper) {
    const currentEl = document.querySelector('.block-intro-pagination-fraction .swiper-pagination-current');
    const totalEl = document.querySelector('.block-intro-pagination-fraction .swiper-pagination-total');

    if (currentEl && totalEl) {
      let currentSlide;
      if (swiper.params.loop) {
        currentSlide = swiper.realIndex + 1;
      } else {
        currentSlide = swiper.activeIndex + 1;
      }

      currentEl.textContent = currentSlide.toString().padStart(2, '0');
      const slides = document.querySelectorAll('.block-intro__slider .swiper-slide[data-swiper-slide-index]');
      const uniqueIndices = new Set();

      slides.forEach(slide => {
        const index = parseInt(slide.getAttribute('data-swiper-slide-index'));
        if (!isNaN(index)) {
          uniqueIndices.add(index);
        }
      });

      const totalSlides = uniqueIndices.size;
      totalEl.textContent = totalSlides > 0 ? totalSlides.toString().padStart(2, '0') : '00';
    }
  }

  function updateSliderNavPosition() {
    const sliderNav = document.querySelector('.slider-nav');
    const container = document.querySelector('.container');

    if (!sliderNav || !container) return;

    if (window.innerWidth <= 992) {
      sliderNav.style.right = '';
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const pageWidth = document.documentElement.clientWidth;

    const rightPosition = pageWidth - containerRect.right;

    sliderNav.style.right = rightPosition + 'px';
  }

  function handleResize() {
    updateSliderNavPosition();
  }

  let resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 100);
  });

  window.addEventListener('load', updateSliderNavPosition);

  if (document.readyState === 'complete') {
    updateSliderNavPosition();
  }
}

if (document.querySelector('.block-portfolio1__slider')) {
  const swiperPortfolio1 = new Swiper('.block-portfolio1__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    loop: true,
    spaceBetween: 20,
    speed: 400,
    navigation: {
      prevEl: '.block-portfolio1-arrow-prev',
      nextEl: '.block-portfolio1-arrow-next',
    },
    breakpoints: {
      992: {
        slidesPerView: 1,
        spaceBetween: 24,
      },
      1730: {
        slidesPerView: 1.3,
        spaceBetween: 24,
      },
    },
    on: {
      init: function () {
        updateFraction(this);
        updateSliderNavPosition();
      },
      slideChange: function () {
        updateFraction(this);
      },
      imagesReady: function () {
        updateFraction(this);
      }
    },
  });

  function updateFraction(swiper) {
    const currentEl = document.querySelector('.block-portfolio1-pagination-fraction .swiper-pagination-current');
    const totalEl = document.querySelector('.block-portfolio1-pagination-fraction .swiper-pagination-total');

    if (currentEl && totalEl) {
      const slides = document.querySelectorAll('.block-portfolio1__slider .swiper-slide:not(.swiper-slide-duplicate)');
      const totalSlides = slides.length;

      let currentPage;

      if (swiper.params.loop) {
        currentPage = swiper.realIndex + 1;
      } else {
        if (totalSlides <= swiper.params.slidesPerView) {
          currentPage = 1;
        } else {
          const maxIndex = totalSlides - swiper.params.slidesPerView;
          currentPage = Math.min(swiper.activeIndex + 1, maxIndex + 1);
        }
      }

      let totalPages;
      if (totalSlides <= swiper.params.slidesPerView) {
        totalPages = 1;
      } else {
        totalPages = Math.ceil(totalSlides - swiper.params.slidesPerView + 1);
      }

      currentEl.textContent = currentPage.toString().padStart(2, '0');
      totalEl.textContent = totalPages.toString().padStart(2, '0');
    }
  }
}

if (document.querySelector('.block-portfolio2__slider')) {
  const swiperPortfolio2 = new Swiper('.block-portfolio2__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 400,
    navigation: {
      prevEl: '.block-portfolio2-arrow-prev',
      nextEl: '.block-portfolio2-arrow-next',
    },
    pagination: {
      el: '.block-portfolio2__pagination',
      clickable: true,
    },
    breakpoints: {
      992: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      1300: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
    on: {
      init: function () {
        updateFraction(this);
        updateSliderNavPosition();
      },
      slideChange: function () {
        updateFraction(this);
      },
      imagesReady: function () {
        updateFraction(this);
      }
    },
  });

  function updateFraction(swiper) {
    const currentEl = document.querySelector('.block-portfolio2-pagination-fraction .swiper-pagination-current');
    const totalEl = document.querySelector('.block-portfolio2-pagination-fraction .swiper-pagination-total');

    if (currentEl && totalEl) {
      const slides = document.querySelectorAll('.block-portfolio2__slider .swiper-slide:not(.swiper-slide-duplicate)');
      const totalSlides = slides.length;

      let currentPage;

      if (swiper.params.loop) {
        currentPage = swiper.realIndex + 1;
      } else {
        if (totalSlides <= swiper.params.slidesPerView) {
          currentPage = 1;
        } else {
          const maxIndex = totalSlides - swiper.params.slidesPerView;
          currentPage = Math.min(swiper.activeIndex + 1, maxIndex + 1);
        }
      }

      let totalPages;
      if (totalSlides <= swiper.params.slidesPerView) {
        totalPages = 1;
      } else {
        totalPages = totalSlides - swiper.params.slidesPerView + 1;
      }

      currentEl.textContent = currentPage.toString().padStart(2, '0');
      totalEl.textContent = totalPages.toString().padStart(2, '0');
    }
  }
}

if (document.querySelector('.block-materials__slider')) {
  const swiperMaterials = new Swiper('.block-materials__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    lazy: true,
    speed: 400,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    navigation: {
      prevEl: '.block-materials-arrow-prev',
      nextEl: '.block-materials-arrow-next',
    },
  });

  const circles = document.querySelectorAll('.block-materials__circle');
  const slides = document.querySelectorAll('.block-materials__slide');

  function updateActiveSlide(activeIndex) {
    circles.forEach(circle => circle.classList.remove('active'));
    slides.forEach(slide => slide.classList.remove('active'));

    circles.forEach(circle => {
      if (parseInt(circle.dataset.id) === activeIndex + 1) {
        circle.classList.add('active');
      }
    });

    slides.forEach(slide => {
      if (parseInt(slide.dataset.id) === activeIndex + 1) {
        slide.classList.add('active');
      }
    });
  }

  swiperMaterials.on('slideChange', function () {
    let realIndex = swiperMaterials.realIndex;
    updateActiveSlide(realIndex);
  });

  circles.forEach(circle => {
    circle.addEventListener('click', () => {
      const targetSlideId = parseInt(circle.dataset.id) - 1;
      swiperMaterials.slideTo(targetSlideId);
    });
  });

  updateActiveSlide(swiperMaterials.realIndex);
}

//========================================================================================================================================================

Fancybox.bind("[data-fancybox]", {
  // опции
});

//========================================================================================================================================================

// Добавление к шапке при скролле
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 0) {
      header.classList.add('_header-scroll');
    } else {
      header.classList.remove('_header-scroll');
    }
  });
}

//========================================================================================================================================================

let searchButton = document.querySelector('.search-icon');
let searchInput = document.querySelector('.search-input input');

if (searchButton && searchInput) {
  searchButton.addEventListener("click", function (e) {
    e.stopPropagation();
    let search = this.closest('.search-button');
    search.classList.toggle('_active');

    if (search.classList.contains('_active')) {
      searchInput.focus();
    }
  });

  searchInput.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  let searchInputContainer = document.querySelector('.search-input');
  if (searchInputContainer) {
    searchInputContainer.addEventListener("click", function (e) {
      e.stopPropagation();
      let search = this.closest('.search');
      if (search.classList.contains('_active')) {
        searchInput.focus();
      }
    });
  }

  document.addEventListener("click", function (e) {
    let search = document.querySelector('.search-button');
    if (search && search.classList.contains('_active')) {
      if (!search.contains(e.target)) {
        search.classList.remove('_active');
      }
    }
  });

  window.addEventListener('resize', function () {
    let search = document.querySelector('.search-button');
    if (search && window.innerWidth <= 1200 && search.classList.contains('_active')) {
      search.classList.remove('_active');
    }
  });
}

//========================================================================================================================================================

//Меню
const iconMenu = document.querySelector('.icon-menu');
const headerTop = document.querySelector('.header__body');
if (iconMenu) {
  iconMenu.addEventListener("click", function (e) {
    e.stopPropagation();
    document.documentElement.classList.toggle("menu-open");
  });
  document.addEventListener('click', function (e) {
    const isClickInsideHeaderTop = headerTop && headerTop.contains(e.target);
    const isClickOnMenuIcon = e.target === iconMenu || iconMenu.contains(e.target);

    if (!isClickInsideHeaderTop && !isClickOnMenuIcon) {
      document.documentElement.classList.remove("menu-open");
    }
  });
}

//========================================================================================================================================================

// Добавляем класс 'loaded' после полной загрузки страницы
window.addEventListener('load', function () {
  document.documentElement.classList.add('loaded');
});