import type { Meta, StoryObj } from '@storybook/react';
import MenuTab from '../components/feature/Tab/MenuTab';
import { BrowserRouter } from 'react-router-dom';
import menuTabs from '../types/menuTabs';

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
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MenuTab>;

export const Default: Story = {
  args: {
    tabs: menuTabs,
    activeTab: 0,
    tabOnClick: () => {},
    isDot: [false, false, false],
  },
};

export const Icon: Story = {
  args: {
    isIcon: true,
    tabs: menuTabs,
    activeTab: 0,
    tabOnClick: () => {},
    isDot: [false, false, false],
  },
};
