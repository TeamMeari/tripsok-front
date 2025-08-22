import type { Meta, StoryObj } from '@storybook/react';
import ListPage from '../../pages/ListPage';
import '../../App.css';
import '../../index.css';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/header/Header';
import MenuApp from '../../components/MenuApp';

const meta = {
  title: 'Pages/ListPage',
  component: ListPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="app-area">
          <Header />
          <div className="content-area">
            <Story />
          </div>
          <MenuApp />
        </div>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof ListPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};

