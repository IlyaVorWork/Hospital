import type { Meta, StoryObj } from "@storybook/react";
import Header from "./Header";
import { ButtonProps } from "../button/Button";

const clientMenu: ButtonProps[] = [
  {
    header: true,
    label: "Записаться на приём",
  },
  {
    header: true,
    label: "Личный кабинет",
  },
  {
    header: true,
    label: "Выход",
  },
];

const adminMenu: ButtonProps[] = [
  {
    header: true,
    label: "Кабинеты",
  },
  {
    header: true,
    label: "Врачи",
  },
  {
    header: true,
    label: "Расписание",
  },
  {
    header: true,
    label: "Выход",
  },
];

const meta = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Guest: Story = {
  args: {},
};

export const Client: Story = {
  args: {
    menu: clientMenu,
  },
};

export const Admin: Story = {
  args: {
    menu: adminMenu,
  },
};
