import type { Meta, StoryObj } from '@storybook/react';
import ContentPage from '../pages/ContentPage';
import { BrowserRouter } from 'react-router-dom';
import '../App.css';
import '../index.css'

const meta: Meta<typeof ContentPage> = {
    title: 'Pages/ContentPage',
    component: ContentPage,
};

export default meta;

type Story = StoryObj<typeof ContentPage>;

export const Default: Story = {
    render: () => (
        <BrowserRouter>
            <div style={{ maxWidth: '360px', margin: '0 auto' }}>
                <ContentPage />
            </div>
        </BrowserRouter>
    ),
};
