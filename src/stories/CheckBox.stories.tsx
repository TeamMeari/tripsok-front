import type { Meta, StoryObj } from '@storybook/react';
import CheckBox from '../components/common/CheckBox';
import { useState } from 'react';

const meta = {
    title: 'Components/CheckBox',
    component: CheckBox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof CheckBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
    render: () => {
        const [checked, setChecked] = useState(false);
        return <CheckBox checked={checked} disabled={false} onClick={() => setChecked(!checked)} />
    }
};

export const Checked: Story = {
    args: {
        checked: true,
        disabled: false,
        onClick: () => {}
    }
};

export const Disabled: Story = {
    args: {
        checked: false,
        disabled: true,
        onClick: () => {}
    }
};
