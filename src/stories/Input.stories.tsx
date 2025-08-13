import type { Meta, StoryObj } from '@storybook/react';
import Input from '../components/common/Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    leftIcon: {
      control: 'object',
      table: {
        type: { summary: 'React.FC' },
      },
    },
    rightButton: {
      control: 'object',
      table: {
        type: { summary: 'React.ElementType' },
      },
    },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: '인풋창'
  },
};

export const WithLeftIcon: Story = {
  args: {
    leftIcon: <img src="/public/InfoIcon/flag.svg" alt="search" />,
    placeholder: '출발지'
  }
}