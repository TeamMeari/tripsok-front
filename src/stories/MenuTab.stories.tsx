import type { Meta, StoryObj } from '@storybook/react';
import MenuTab from '../components/feature/Tab/MenuTab';

const meta: Meta<typeof MenuTab> = {
  title: 'Components/MenuTab',
  component: MenuTab,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isIcon: {
      control: 'boolean',
      defaultValue: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof MenuTab>;

export const Default: Story = {
  args: {},
};

export const Icon: Story = {
  args: {
    isIcon: true,
  },
};
