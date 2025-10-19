export type PlaceType = 'tour' | 'restaurant' | 'accommodation';

export const menuTabs: {
    [key in PlaceType]: {
        id: number;
        label: string;
        icon: string;
        uri: string;
    }
} = {
    tour: {
        id: 1,
        label: 'tabTour',
        icon: 'typeIcon/spot.png',
        uri: '/tour',
    },
    restaurant: {
        id: 2,
        label: 'tabFood',
        icon: 'typeIcon/restaurant.png',
        uri: '/food',
    },
    accommodation: {
        id: 3,
        label: 'tabStay',
        icon: 'typeIcon/accommodation.png',
        uri: '/stay',
    }
}