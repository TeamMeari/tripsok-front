import type { Meta, StoryObj } from '@storybook/react';
import SearchInput from '../components/feature/SearchInput'

const meta: Meta<typeof SearchInput> = {
    title: 'Components/SearchInput',
    component: SearchInput,
    parameters: {
        layout: 'centered',
      },
      tags: ['autodocs'],
      argTypes: {
        searchWord: { control: 'object' },
      },
}

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  render: () => {
    return <SearchInput
      searchWord=""
    />
  }
}

export const AfterSearch: Story = {
    render: () => {
      return <SearchInput
        searchWord="검색 결과"
      />
    }
  }