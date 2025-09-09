import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import DropdownInput from '../components/common/DropdownInput';
import FlagIcon from '/public/InfoIcon/flag.svg';
import PersonIcon from '/public/InfoIcon/person.svg';
import DateIcon from '/public/InfoIcon/date.svg';
const meta: Meta<typeof DropdownInput> = {
    title: 'Components/DropdownInput',
    component: DropdownInput,
};

export default meta;

type Story = StoryObj<typeof DropdownInput>;

export const Default: Story = {
    render: () => {
        const [personValue, setPersonValue] = useState('');
        const [fromValue, setFromValue] = useState('');
        const [dateValue, setDateValue] = useState('');

        const personOptions = ['1명', '2명', '3명','4명'];
        const from = ['강릉역'];
        return (
            <div >
                <DropdownInput
                    value={personValue}
                    onChange={setPersonValue}
                    options={personOptions}
                    placeholder="인원 수"
                    width={148}
                    leftIcon={<img src={PersonIcon} alt="person" style={{ height: 19, width: 'auto'}} />}
                />
                <DropdownInput
                    value={fromValue}
                    onChange={setFromValue}
                    options={from}
                    placeholder="출발지"
                    width={148}
                    leftIcon={<img src={FlagIcon} alt="flag" style={{ height: 19, width: 'auto'}} />}
                />
                <DropdownInput
                    value={dateValue}
                    onChange={setDateValue}
                    options={from}
                    placeholder="여행 일자를 선택하세요"
                    leftIcon={<img src={DateIcon} alt="date" style={{ height: 19, width: 'auto'}} />}
                    type="date"
                />
            </div>
        );
    },
};
