import React from 'react';
import Button from '../components/common/Button/CommonBtn';

export default {
    title: 'Button/CustomButton',
    component: Button,
};

export const AllButtons = () => (
    <div style={{display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start'}}>
        <Button variant="primary" size="small" borderRadius="12px">내 여정에 추가</Button>
        <Button variant="primary" size="large" borderRadius="12px">내 여정에 추가</Button>
        <Button variant="secondary" borderRadius="48px">로그인</Button>
        <Button variant="secondary" borderRadius="48px">로그아웃</Button>
    </div>
);
