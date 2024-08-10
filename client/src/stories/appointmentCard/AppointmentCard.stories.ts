import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import AppointmentCard from "./AppointmentCard";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/AppointmentCard",
  component: AppointmentCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof AppointmentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    specialization: "Отолоринголог",
    fullName: "Иванов Иван Иванович",
    date: "01.01.2024",
    time: "16:00 - 16:15",
    cabinetNumber: 304,
    isOpened: false,
  },
};

export const Opened: Story = {
  args: {
    specialization: "Отолоринголог",
    fullName: "Иванов Иван Иванович",
    date: "01.01.2024",
    time: "16:00 - 16:15",
    cabinetNumber: 304,
    isOpened: true,
  },
};
