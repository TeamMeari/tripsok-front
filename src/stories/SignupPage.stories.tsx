import type { Meta, StoryObj } from '@storybook/react';
import SignupPage from '../pages/SignupPage';
import StepOne from '../components/feature/Signup/StepOne';
import StepTwo from '../components/feature/Signup/StepTwo';
import '../App.css';
import '../index.css';
import { BrowserRouter } from 'react-router-dom';
import HeaderSelector from '../components/header/HeaderSelector';
import StepThree from '../components/feature/Signup/StepThree';
import Complete from '../components/feature/Signup/Complete';

const meta = {
  title: 'Page/Signup',
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
} satisfies Meta<typeof SignupPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <SignupPage />,
};

export const EmailVerification: Story = {
  render: () => <div style={{ margin: "84px 0" }}><StepOne onSubmit={() => {
    console.log("email verification");
  }} /></div>,
};

export const CodeVerification: Story = {
  render: () => <div style={{ margin: "84px 0" }}><StepTwo email="test@example.com" onSubmit={() => {
    console.log("code verification");
  }} /></div>,
};

export const InfoVerification: Story = {
  render: () => <div style={{ margin: "84px 0" }}><StepThree onSubmit={() => {
    console.log("info verification");
  }} emailVerifyToken="123456" goStepFour={() => {}} goStepFive={() => {}} /></div>,
};

export const SignupComplete: Story = {
  render: () => <div style={{ margin: "84px 0" }}><Complete nickname="test" /></div>,
};