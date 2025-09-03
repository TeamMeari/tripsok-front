import type { Meta, StoryObj } from '@storybook/react';
import ValidationBtn from '../components/common/Button/ValidationBtn';

const meta = {
    title: 'Button/ValidationButton',
    component: ValidationBtn,
    argTypes: {
        children: {
            control: 'text',
            description: '버튼 내부 텍스트',
        },
        isDisabled: {
            control: 'boolean',
            description: '버튼 비활성화 여부',
            defaultValue: false,
        },
        onClick: {
            description: '클릭 이벤트 핸들러',
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const AllValidationButtons: Story = {
    args: {
        children: '버튼 텍스트',
        isDisabled: false,
        onClick: () => {},
    },
}


