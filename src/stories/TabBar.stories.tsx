import type { Meta, StoryObj } from '@storybook/react';
import TabBar from '../components/tabbar/TabBar';
import MenuApp from '../components/tabbar/MenuApp';
import { BrowserRouter } from 'react-router-dom';
import '../App.css';
import { useState } from 'react';
import ButtonTabBar from '../components/tabbar/ButtonTabBar';
import LikeButton from '../components/common/Button/LikeBtn';
import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button/CommonBtn';
import IconButton from '../components/common/Button/IconBtn';
import { SquarePen } from 'lucide-react';

const meta: Meta<typeof TabBar> = {
    title: 'Layout/TabBar',
    component: TabBar,
    parameters: {
        layout: 'centered',
    },
}

export default meta;
type Story = StoryObj<typeof TabBar>;

export const Default: Story = {
    render: () => {
        return <div
            style={{ width: '360px', height: '100%', backgroundColor: '#fff'}}
        >
            <TabBar />
        </div>
    }
}

export const MenuAppComponent: Story = {
    render: () => {
        return <BrowserRouter>
            <div
                style={{ width: '360px', height: '100%', backgroundColor: '#fff'}}
            >
                <MenuApp />
            </div>
        </BrowserRouter>
    }
}

export const ContentTabBarComponent: Story = {
    render: () => {
        const [like, setLike] = useState(false);
        const { t } = useTranslation();
        return <BrowserRouter>
            <div style={{ width: '360px', height: '100%', backgroundColor: '#fff'}}>
            <ButtonTabBar
                IconButton={<LikeButton state={like} onClick={() => { setLike(!like) }}/>}
                Button={
                    <Button variant="primary"
                    size="small"
                    onClick={() => {}}
                    >
                        {t("addToJourney")}
                    </Button>
                }
            />
            </div>
        </BrowserRouter>
    }
}

export const MyPlanRevervationAndPaymentTabBarComponent: Story = {
    render: () => {
        const { t } = useTranslation();
        return <BrowserRouter>
            <div style={{ width: '360px', height: '100%', backgroundColor: '#fff'}}>
            <ButtonTabBar
                Button={
                    <Button variant="primary"
                    size="large"
                    onClick={() => {}}
                    >
                        {t("reserveButton")}
                    </Button>
                }
            />
            </div>
        </BrowserRouter>
    }
}

export const MyPlanPaymentTabBarComponent: Story = {
    render: () => {
        const { t } = useTranslation();
        return <BrowserRouter>
        <div style={{ width: '360px', height: '100%', backgroundColor: '#fff'}}>
            <ButtonTabBar
                Button={
                    <Button variant="primary"
                    size="large"
                    disabled={true}
                    onClick={() => {}}
                    >
                        {t("payButton")}
                    </Button>
                }
            />
            </div>
        </BrowserRouter>
    }
}

export const PlanCompleteContactCenterTabBarComponent: Story = {
    render: () => {
        const { t } = useTranslation();
        return <BrowserRouter>
            <div style={{ width: '360px', height: '100%', backgroundColor: '#fff'}}>
                <ButtonTabBar
                    IconButton={<IconButton Icon={SquarePen} color="gray" />}
                    Button={
                        <Button variant="primary"
                        size="small"
                        onClick={() => {}}
                        >
                            {t("booking.contactCenter")}
                        </Button>
                    }
                />
            </div>
        </BrowserRouter>
    }
}

export const PlanCompleteWriteReviewTabBarComponent: Story = {
    render: () => {
        const { t } = useTranslation();
        return <BrowserRouter>
        <div style={{ width: '360px', height: '100%', backgroundColor: '#fff'}}>
            <ButtonTabBar
                Button={
                    <Button variant="primary"
                    size="large"
                    onClick={() => {}}
                    >
                        {t("booking.writeReview")}
                    </Button>
                }
            />
            </div>
        </BrowserRouter>
    }
}

export const ToHomeTabBarComponent: Story = {
    render: () => {
        const { t } = useTranslation();
        return <BrowserRouter>
        <div style={{ width: '360px', height: '100%', backgroundColor: '#fff'}}>
            <ButtonTabBar
                Button={
                    <Button variant="primary"
                    size="large"
                    onClick={() => {}}
                    >
                        {t("home")}
                    </Button>
                }
            />
            </div>
        </BrowserRouter>
    }
}

export const SignUpTabBarComponent: Story = {
    render: () => {
        const { t } = useTranslation();
        return <BrowserRouter>
        <div style={{ width: '360px', height: '100%', backgroundColor: '#fff'}}>
            <ButtonTabBar
                type="inTheAir"
                Button={
                    <Button variant="primary"
                    size="large"
                    onClick={() => {}}
                    >
                        {t("signup")}
                    </Button>
                }
            />
            </div>
        </BrowserRouter>
    }
}

export const LoginTabBarComponent: Story = {
    render: () => {
        const { t } = useTranslation();
        return <BrowserRouter>
        <div style={{ width: '360px', height: '100%', backgroundColor: '#fff'}}>
            <ButtonTabBar
                type="inTheAir"
                Button={
                    <Button variant="primary"
                    size="large"
                    onClick={() => {}}
                    >
                        {t("login")}
                    </Button>
                }
            />
            </div>
        </BrowserRouter>
    }
}