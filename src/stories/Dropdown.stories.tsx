import type { Meta, StoryObj } from '@storybook/react';
import Dropdown from '../components/common/Dropdown';
import { useState } from "react"

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    current: { control: 'number' },
    options: {
      control: 'object',
      table: {
        type: { summary: 'Record<number, string>' },
      },
    },
    onClickOption: {
      action: 'optionClicked',
      table: {
        type: { summary: '(option: number) => void' },
      },
    }
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  args: {
    options: {
      1: "옵션1",
      2: "옵션2",
      3: "옵션3"
    },
  },
  render: (args) => {
    const [current, setCurrent] = useState(1)
    return <Dropdown {...args} current={current} onClickOption={(op) => setCurrent(op)} />
  },
};