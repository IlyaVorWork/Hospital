import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Select from "./Select";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Select",
  component: Select,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    name: "Время",
    options: [
      {
        id: 1,
        value: "10:00-10:15",
      },
      {
        id: 2,
        value: "10:15-10:30",
      },
      {
        id: 3,
        value: "10:30-10:45",
      },
    ],
  },
};
