export function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString('id-ID')
}

export function diffDays(secondDate: string | Date, firstDate?: string | Date) {
    const second = new Date(secondDate)
    const first = firstDate ? new Date(firstDate) : new Date()
    second.setHours(0, 0, 0, 0)
    first.setHours(0, 0, 0, 0)
    return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
}
