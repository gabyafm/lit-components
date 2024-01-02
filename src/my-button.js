import { html, css, LitElement } from "lit";

class MyButton extends LitElement {
  static styles = css`
    .primary-button {
      background-color: rgb(19, 19, 19);
      color: white;
      width: 180px;
      height: 50px;
      border-radius: 10px;
    }

    .secondary-button {
      background-color: rgb(255, 255, 255);
      color: black;
      width: 180px;
      height: 50px;
      border-radius: 10px;
    }
  `;

  static get properties() {
    return {
      type: { type: String },
      label: { type: String },
    };
  }

  constructor() {
    super();
    this.type = "primary";
    this.label = "Button";
  }

  render() {
    const buttonClass =
      this.type === "primary" ? "primary-button" : "secondary-button";

    return html`<button class=${buttonClass}>${this.label}</button>`;
  }
}

customElements.define("my-button", MyButton);
