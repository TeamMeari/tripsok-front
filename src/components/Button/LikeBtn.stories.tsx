import React from 'react';
import LikeButton from './LikeBtn';

export default {
    title: 'Button/LikeButton',
    component: LikeButton,
};

export const Default = () => <LikeButton />;
export const Liked = () => <LikeButton initialLiked={true} />;
