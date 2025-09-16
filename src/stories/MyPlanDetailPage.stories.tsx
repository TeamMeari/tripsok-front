import type { Meta, StoryObj } from '@storybook/react';
import MyPlanDetailPage from '../pages/MyPlanDetail';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n'; // i18n 설정 파일
import '../App.css';
import '../index.css';

const meta: Meta<typeof MyPlanDetailPage> = {
    title: 'Page/MyPlanDetailPage',
    component: MyPlanDetailPage,
};

export default meta;

type Story = StoryObj<typeof MyPlanDetailPage>;

export const Default: Story = {
    render: () => (
        <I18nextProvider i18n={i18n}>
            <BrowserRouter>
                <div style={{ maxWidth: '360px', margin: '0 auto', height: '100vh', border: '1px solid #ddd' }}>
                    <MyPlanDetailPage />
                </div>
            </BrowserRouter>
        </I18nextProvider>
    ),
};
