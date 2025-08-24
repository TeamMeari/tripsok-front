import type { Meta, StoryObj } from '@storybook/react';
import PasswordInput from '../components/feature/Input/passwordInput';

const meta: Meta<typeof PasswordInput> = {
  title: 'Components/PasswordInput',
  component: PasswordInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    onChange: { action: 'changed' }
  },
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  args: {
    placeholder: '영문, 숫자, 특수문자 포함 8 - 20자'
  },
};
