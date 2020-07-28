export interface ChartRange {
    from?: Date
    to?: Date
}

export const defaultRange = (): ChartRange => {
    const from = new Date()
    from.setDate(from.getDate() - 5)
    const to = new Date()
    to.setDate(to.getDate() + 2)
    return {
        from,
        to
    }
}
