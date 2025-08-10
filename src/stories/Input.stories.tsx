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
        type: { summary: 'React.ElementType' },
      },
    },
    rightIcon: {
      control: 'object',
      table: {
        type: { summary: 'React.ElementType' },
      },
    },
    placeholder: { control: 'text' },
    shadow: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: '인풋창'
  },
};

export const Shadow: Story = {
  args: {
    placeholder: "그림자 인풋창",
    shadow: true
  }
}