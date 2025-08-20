import type { Meta, StoryObj } from '@storybook/react';
import MainCarousel from '../components/feature/Carousel/MainCarousel';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof MainCarousel> = {
    title: 'Feature/Carousel/MainCarousel',
    component: MainCarousel,
    parameters: {
        layout: 'fullscreen',
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
type Story = StoryObj<typeof MainCarousel>;

export const Default: Story = {
    args: {
        items: [
            {
                id: 1,
                image: 'https://cdn.pixabay.com/photo/2024/12/29/09/14/glitter-9297612_1280.jpg',
            },
            {
                id: 2,
                image: 'https://cdn.pixabay.com/photo/2025/06/13/14/48/bird-9658215_1280.jpg',
            },
            {
                id: 3,
                image: 'https://cdn.pixabay.com/photo/2022/11/17/09/49/fog-7597710_1280.jpg',
            }
        ],
    },
};

export const WithManyImages: Story = {
    args: {
        items: [
            {
                id: 1,
                image: 'https://cdn.pixabay.com/photo/2024/12/29/09/14/glitter-9297612_1280.jpg',
            },
            {
                id: 2,
                image: 'https://cdn.pixabay.com/photo/2025/06/13/14/48/bird-9658215_1280.jpg',
            },
            {
                id: 3,
                image: 'https://cdn.pixabay.com/photo/2022/11/17/09/49/fog-7597710_1280.jpg',
            },
            {   
                id: 4,
                image: 'https://cdn.pixabay.com/photo/2022/09/05/17/15/vancouver-7434702_1280.jpg',
            },
            {
                id: 5,
                image: 'https://pixabay.com/ko/playlists/reggae-sunshine-28696853/',
            },
            {
                id: 6,
                image: 'https://cdn.pixabay.com/photo/2021/08/17/17/52/cat-6553749_1280.jpg',
            },
            {
                id: 7,
                image: 'https://cdn.pixabay.com/photo/2025/05/22/20/33/robin-9616505_1280.jpg',
            },
            {
                id: 8,
                image: 'https://cdn.pixabay.com/photo/2020/11/04/18/59/leaves-5713290_1280.jpg',
            },
        ],
    },
};
