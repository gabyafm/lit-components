import { html, css, LitElement } from "lit";
import { Directive, directive } from "lit/directive.js";
import { render } from "lit";

import {
  computePosition,
  autoPlacement,
  offset,
  shift,
} from "@floating-ui/dom";

const enterEvents = ["pointerenter", "focus"];
const leaveEvents = ["pointerleave", "blur", "keydown", "click"];

export class SimpleTooltip extends LitElement {
  static properties = {
    showing: { reflect: true, type: Boolean },
    offset: { type: Number },
  };

  static lazy(target, callback) {
    const createTooltip = () => {
      const tooltip = document.createElement("simple-tooltip");
      callback(tooltip);
      target.parentNode.insertBefore(tooltip, target.nextSibling);
      tooltip.show();
      enterEvents.forEach((eventName) =>
        target.removeEventListener(eventName, createTooltip)
      );
    };
    enterEvents.forEach((eventName) =>
      target.addEventListener(eventName, createTooltip)
    );
  }

  static styles = css`
    :host {
      position: fixed;
      border: 1px solid darkgray;
      background: #ccc;
      padding: 4px;
      border-radius: 4px;
      display: inline-block;
      pointer-events: none;

      opacity: 0;
      transform: scale(0.75);
      transition: opacity, transform;
      transition-duration: 0.33s;
    }

    :host([showing]) {
      opacity: 1;
      transform: scale(1);
    }
  `;

  constructor() {
    super();
    this.addEventListener("transitionend", this.finishHide);
    this.showing = false;
    this.offset = 4;
  }

  connectedCallback() {
    super.connectedCallback();
    this.target ??= this.previousElementSibling;
    this.finishHide();
  }

  _target = null;
  get target() {
    return this._target;
  }
  set target(target) {
    if (this.target) {
      enterEvents.forEach((name) =>
        this.target.removeEventListener(name, this.show)
      );
      leaveEvents.forEach((name) =>
        this.target.removeEventListener(name, this.hide)
      );
    }
    if (target) {
      enterEvents.forEach((name) => target.addEventListener(name, this.show));
      leaveEvents.forEach((name) => target.addEventListener(name, this.hide));
    }
    this._target = target;
  }

  show = () => {
    this.style.cssText = "";
    computePosition(this.target, this, {
      strategy: "fixed",
      middleware: [
        offset(this.offset),
        shift(),
        autoPlacement({ allowedPlacements: ["top", "bottom"] }),
      ],
    }).then(({ x, y }) => {
      this.style.left = `${x}px`;
      this.style.top = `${y}px`;
    });
    this.showing = true;
  };

  hide = () => {
    this.showing = false;
  };

  finishHide = () => {
    if (!this.showing) {
      this.style.display = "none";
    }
  };

  render() {
    return html`<slot></slot>`;
  }
}
customElements.define("simple-tooltip", SimpleTooltip);

class TooltipDirective extends Directive {
  didSetupLazy = false;
  tooltipContent;
  part;
  tooltip;
  render(tooltipContent = "") {}
  update(part, [tooltipContent]) {
    this.tooltipContent = tooltipContent;
    this.part = part;
    if (!this.didSetupLazy) {
      this.setupLazy();
    }
    if (this.tooltip) {
      this.renderTooltipContent();
    }
  }
  setupLazy() {
    this.didSetupLazy = true;
    SimpleTooltip.lazy(this.part.element, (tooltip) => {
      this.tooltip = tooltip;
      this.renderTooltipContent();
    });
  }
  renderTooltipContent() {
    render(this.tooltipContent, this.tooltip, this.part.options);
  }
}

export const tooltip = directive(TooltipDirective);
