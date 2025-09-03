import type { StoryObj } from '@storybook/react';
import ListPage from '../pages/ListPage';
import '../App.css';
import '../index.css';
import { BrowserRouter } from 'react-router-dom';
import HeaderSelector from '../components/header/HeaderSelector';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import MainPage from '../pages/MainPage';

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
        </div>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  render: () => <MainPage />,
}

export const List: Story = {
  render: () => <ListPage />,
};

export const Login: Story =  {
  render: () => <LoginPage />,
}

export const Signup: Story = {
  render: () => <SignupPage />,
}