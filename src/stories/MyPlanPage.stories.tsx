import type { Meta, StoryObj } from '@storybook/react';
import MyPlanPage from '../pages/MyPlanPage';
import { BrowserRouter } from 'react-router-dom';
import '../App.css';
import '../index.css'

const meta: Meta<typeof MyPlanPage> = {
    title: 'Page/MyPlanPage',
    component: MyPlanPage,
};

export default meta;

type Story = StoryObj<typeof MyPlanPage>;

export const Default: Story = {
    render: () => (
        <BrowserRouter>
            <div >
                <MyPlanPage />
            </div>
        </BrowserRouter>
    ),
};
