import { html } from "lit";
import "../my-button";

export default {
  title: "Example/MyButton",
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: {
        type: "radio",
        options: ["primary", "secondary"],
      },
    },
    label: { control: "text" },
  },
};

const Template = ({ type, label }) =>
  html`<my-button type=${type} label=${label}></my-button>`;

export const Primary = Template.bind({});
Primary.args = {
  type: "primary",
  label: "Mutant Primary Button",
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: "secondary",
  label: "Mutant Secondary Button",
};
