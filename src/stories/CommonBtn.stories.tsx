import React from 'react';
import Button from '../components/common/Button/CommonBtn';
import PlusIcon from "../../public/InfoIcon/plusColorIcon.svg";

export default {
    title: 'Button/CustomButton',
    component: Button,
};

export const AllButtons = () => (
    <div style={{display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start'}}>
        <Button variant="primary" size="small">내 여정에 추가</Button>
        <Button variant="primary" size="large">내 여정에 추가</Button>
        <Button variant="secondary" radius="large">로그인</Button>
        <Button variant="secondary" radius="large">로그아웃</Button>
        <Button variant="orangeOutline" size="large">
          <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <img src="/InfoIcon/plusColorIcon.svg" alt="plus" style={{width:16, height:16}} />
            주황 테두리 버튼
          </span>
        </Button>
        <Button variant="grayDashed" size="large">회색 점선 버튼</Button>
        <Button variant="blackOutline" size="large">
            검정 테두리 버튼
        </Button>
    </div>
);
