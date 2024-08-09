import type { Meta, StoryObj } from "@storybook/react";
import InfoCard from "./InfoCard";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/InfoCard",
  component: InfoCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof InfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    text: "Est qui consequat excepteur cupidatat occaecat eiusmod officia irure proident laboris aliqua duis do do. Anim laboris elit eiusmod veniam magna eu amet amet id ad consectetur. Ad deserunt dolor non est esse deserunt occaecat velit laboris aute.",
  },
};

export const Error: Story = {
  args: {
    text: "Est qui consequat excepteur cupidatat occaecat eiusmod officia irure proident laboris aliqua duis do do. Anim laboris elit eiusmod veniam magna eu amet amet id ad consectetur. Ad deserunt dolor non est esse deserunt occaecat velit laboris aute.",
    type: "error",
  },
};
