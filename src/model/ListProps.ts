export interface ListProps {
    page: number
    pageSize: number
    search: string
    sort: {
        field: string
        direction: 'asc' | 'desc'
    }
}