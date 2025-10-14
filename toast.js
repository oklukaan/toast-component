class Toast extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._inited = false;
    this._hideTimer = null;
  }

  connectedCallback() {
    if (this._inited) return; // idempotent
    this._inited = true;
    this._iconSlotHost = document.createElement('div');
    this._iconSlotHost.slot = 'icon';
    this.shadowRoot.innerHTML = `
    <style>
    :host { all: initial; display:block; }
      .toast{
        position: fixed;
        top: 20px;
        right: 20px;
        background:#fff;
        color:#0f172a;
        border-radius:14px;
        box-shadow:0 10px 30px rgba(2,6,23,.12);
        font-family: ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
        line-height:1.3;
        padding:16px 44px 16px 86px;
        max-width: 460px;
        opacity:0;
        transform: translateY(-16px);
        transition: opacity .28s ease, transform .28s ease;
        z-index:9999;
        pointer-events:none;
        position:fixed;
      }
      .toast.show{ opacity:1; transform:translateY(0); pointer-events:auto; }
      .toast::before{
        content:"";
        position:absolute; inset:0 auto 0 0;
        width:12px;
        background:var(--accent,#64748b);
        border-radius:14px 0 0 14px;
      }
      .toast::after{
        content: var(--glyph, "");
        position:absolute; left:28px; top:50%; transform:translateY(-50%);
        width:38px; height:38px; border-radius:9999px;
        background: color-mix(in oklab, var(--accent,#64748b) 18%, #fff);
        display:flex; align-items:center; justify-content:center;
        font-weight:800; font-size:20px;
        color: var(--accent,#64748b);
      }
      .msg{
        margin:0;
        font-weight:700;
        font-size:16px;
      }
      .extra{
        margin-top:6px;
        font-size:14px;
        color:#475569;
      }
      .extra a{ text-decoration:none; font-weight:600; }
      .hide{
        position:absolute; top:10px; right:12px;
        background:transparent; border:0; cursor:pointer;
        width:28px; height:28px; border-radius:9999px;
        font-size:18px; line-height:1; color:#94a3b8;
      }
      .hide:hover{ background:#f1f5f9; color:#0f172a; }
      .toast.toast--info   { --accent:#3b82f6; --glyph:"i"; }
      .toast.toast--success{ --accent:#22c55e; --glyph:"✓"; }
      .toast.toast--error  { --accent:#ef4444; --glyph:"✕"; }
      .toast.toast--warning{ --accent:#f59e0b; --glyph:"!"; }
      .icon-slot{
        position:absolute; left:28px; top:50%; transform:translateY(-50%);
        width:38px; height:38px; border-radius:9999px;
        display:flex; align-items:center; justify-content:center;
        background: color-mix(in oklab, var(--accent,#64748b) 18%, #fff);
        color: var(--accent,#64748b);
        font-weight:800; font-size:20px;
      }
      .toast.has-custom-icon::after{ display:none; }
    </style>
      <div class="toast" role="status" aria-live="polite">
        <div class="icon-slot"><slot name="icon"></slot></div>
        <div class="row">
          <button class="hide" aria-label="close">×</button>
          <p class="msg">Bu bir toast mesajıdır!</p>
        </div>
          <div class="extra"><slot name="extra"></slot></div>
      </div>
    `;
    this.toast = this.shadowRoot.querySelector('.toast');
    this.msg = this.shadowRoot.querySelector('.msg');
    this.shadowRoot.querySelector('.hide').addEventListener('click', () => this.hide());
    this._lightExtra;
  }
  disconnectedCallback() {
    clearTimeout(this._hideTimer);
  }
  show(message, options = {}) {
    if (!this._inited) this.connectedCallback();
    const { timeout = 3000, color, textColor, width, height, extraHTML, className, iconHTML, glyph } = options;
    if (glyph != null) {
      this.toast.style.setProperty('--glyph', `"${glyph}"`);
    } else {
      this.toast.style.removeProperty('--glyph');
    }
    if (iconHTML != null) {
      this._iconSlotHost.innerHTML = iconHTML;
      this.appendChild(this._iconSlotHost);
      this.toast.classList.add('has-custom-icon');
      this.toast.classList.remove('no-icon');
    } else {
      if (this._iconSlotHost.isConnected) this._iconSlotHost.remove();
      this.toast.classList.remove('has-custom-icon');
    }
    if (this._customClasses?.length) {
      this._customClasses.forEach(c => this.toast.classList.remove(c));
    }

    if (className) {
      const classes = Array.isArray(className)
        ? className
        : String(className).trim().split(/\s+/).filter(Boolean);
      this.toast.classList.add(...classes);
      this._customClasses = classes;
    } else {
      this._customClasses = [];
    }
    const VARIANTS = ['success', 'error', 'info', 'warning'];
    this.toast.classList.remove(...VARIANTS.map(v => `toast--${v}`));
    this.toast.classList.add('toast--info');
    const variant = String(options.type || 'info').toLowerCase();
    if (VARIANTS.includes(variant) && variant !== 'info') {
      this.toast.classList.add(`toast--${variant}`);
    }

    if (color) this.toast.style.backgroundColor = color;
    if (textColor) this.toast.style.color = textColor;
    this.toast.style.width = width || 'auto';
    this.toast.style.height = height || 'auto';

    this.msg.textContent = message;
    if (extraHTML != null) {
      if (!this._lightExtra) {
        this._lightExtra = document.createElement('div');
        this._lightExtra.slot = 'extra';
        this.appendChild(this._lightExtra);
      }
      this._lightExtra.innerHTML = extraHTML;
    } else if (this._lightExtra) {
      this._lightExtra.remove();
      this._lightExtra = null;
    }
    this.toast.classList.remove('show');
    void this.toast.offsetWidth;
    this.toast.classList.add('show');
    this.toast.setAttribute('aria-hidden', 'false');
    this.dispatchEvent(new CustomEvent('toast:show', { detail: { message, options }, bubbles: true }));

    clearTimeout(this._hideTimer);
    if (timeout > 0) {
      this._hideTimer = setTimeout(() => this.hide(), timeout);
    }
  }

  hide() {
    clearTimeout(this._hideTimer);
    this.toast.classList.remove('show');
    this.toast.setAttribute('aria-hidden', 'true');
    this.dispatchEvent(new CustomEvent('toast:hide', { bubbles: true }));

  }
}

customElements.define('toast-message', Toast);
