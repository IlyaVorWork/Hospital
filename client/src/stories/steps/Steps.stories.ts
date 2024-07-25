import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Steps from "./Steps";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Steps",
  component: Steps,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof Steps>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const FirstStep: Story = {
  args: {
    activeStep: 1,
  },
};

export const SecondStep: Story = {
  args: {
    activeStep: 2,
  },
};

export const ThirdStep: Story = {
  args: {
    activeStep: 3,
  },
};
