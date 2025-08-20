import type { Meta, StoryObj } from '@storybook/react';
import CardCarousel from '../components/feature/Carousel/CardCarousel';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof CardCarousel> = {
    title: 'Feature/Carousel/CardCarousel',
    component: CardCarousel,
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <BrowserRouter>
                <Story />
            </BrowserRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof CardCarousel>;

export const Default: Story = {
    args: {
        cards: [
            {
                id: 1,
                title: '카드 제목 1',
                description: '카드 설명입니다. 이것은 첫 번째 카드입니다.',
                image: 'https://picsum.photos/200/300',
            },
            {
                id: 2, 
                title: '카드 제목 2',
                description: '카드 설명입니다. 이것은 두 번째 카드입니다.',
                image: 'https://picsum.photos/200/300',
            },
            {
                id: 3,
                title: '카드 제목 3', 
                description: '카드 설명입니다. 이것은 세 번째 카드입니다.',
                image: 'https://picsum.photos/200/300',
            },
            {
                id: 4,
                title: '카드 제목 4',
                description: '카드 설명입니다. 이것은 네 번째 카드입니다.',
                image: 'https://picsum.photos/200/400',
            },
            {
                id: 5,
                title: '카드 제목 5',
                description: '카드 설명입니다. 이것은 다섯 번째 카드입니다.',
                image: 'https://picsum.photos/200/350',
            },
            {
                id: 6,
                title: '카드 제목 6',
                description: '카드 설명입니다. 이것은 여섯 번째 카드입니다.',
                image: 'https://picsum.photos/200/250',
            }
        ],
    },
};

export const WithRank: Story = {
    args: {
        cards: [
            {
                id: 1,
                rank: 1,
                title: '랭킹 1위 카드',
                description: '1등 카드의 설명입니다.',
                image: 'https://picsum.photos/200/300',
            },
            {
                id: 2,
                rank: 2,
                title: '랭킹 2위 카드',
                description: '2등 카드의 설명입니다.',
                image: 'https://picsum.photos/200/300',
            },
            {
                id: 3,
                rank: 3,
                title: '랭킹 3위 카드',
                description: '3등 카드의 설명입니다.',
                image: 'https://picsum.photos/200/300',
            },
            {
                id: 4,
                title: '카드 제목 4',
                description: '카드 설명입니다. 이것은 네 번째 카드입니다.',
                image: 'https://picsum.photos/200/400',
            },
            {
                id: 5,
                title: '카드 제목 5',
                description: '카드 설명입니다. 이것은 다섯 번째 카드입니다.',
                image: 'https://picsum.photos/200/350',
            },
            {
                id: 6,
                title: '카드 제목 6',
                description: '카드 설명입니다. 이것은 여섯 번째 카드입니다.',
                image: 'https://picsum.photos/200/250',
            }
        ],
    },
};
