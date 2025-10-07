export type SortType = 'like' | 'name';
export const sortKey: Record<SortType, { label: string, value: SortType }> = {
    like: {
        label: '좋아요순',
        value: 'like',
    },
    name: {
        label: '이름순',
        value: 'name',
    },
}