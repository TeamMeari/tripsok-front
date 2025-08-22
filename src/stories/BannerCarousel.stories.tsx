import type { Meta, StoryObj } from '@storybook/react';
import BannerCarousel from '../components/feature/Carousel/BannerCarousel';

const meta = {
    title: 'Feature/Carousel/BannerCarousel',
    component: BannerCarousel,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof BannerCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        banners: [
            {
                url: 'https://example.com/1',
                image: 'https://plus.unsplash.com/premium_photo-1754759082755-4bb1bf09ba2a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8'
            },
            {
                url: 'https://example.com/2', 
                image: 'https://images.unsplash.com/photo-1755306064502-6df8d7ee33f7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8'
            },
            {
                url: 'https://example.com/3',
                image: 'https://plus.unsplash.com/premium_photo-1755273421507-4ef20f6ef877?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D'
            }
        ]
    }
};
