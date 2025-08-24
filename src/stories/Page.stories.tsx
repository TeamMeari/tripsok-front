import type { Meta, StoryObj } from '@storybook/react';
import ListPage from '../pages/ListPage';
import '../App.css';
import '../index.css';
import { BrowserRouter } from 'react-router-dom';
import MenuApp from '../components/MenuApp';
import HeaderSelector from '../components/header/HeaderSelector';

const meta = {
  title: 'Page/Pages',
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <BrowserRouter>
        <div className="app-area">
          <HeaderSelector />
          <div className="content-area">
            <Story />
          </div>
          <MenuApp />
        </div>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = {
  render: () => <ListPage />,
};