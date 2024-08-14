import type { Meta, StoryObj } from "@storybook/react";
import CheckboxList from "./CheckboxList";
import { useState } from "react";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/CheckboxList",
  component: CheckboxList,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof CheckboxList>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    checkedValues: [1, 2, 3, 4, 5],
    options: [
      {
        value: "1",
      },
      {
        value: "2",
      },
      {
        value: "3",
      },
      {
        value: "4",
      },
      {
        value: "5",
      },
      {
        value: "6",
      },
      {
        value: "7",
      },
      {
        value: "8",
      },
      {
        value: "9",
      },
      {
        value: "10",
      },
    ],
  },
};
