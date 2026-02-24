export const timeAgo = (timestamp) => {
    const now = new Date()
    const createdAt = new Date(timestamp)
    const diff = now - createdAt

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const weeks = Math.floor(hours / 24)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(months / 12)

    if (years > 0) return `${years}y`
    if (months > 0) return `${months}m`
    if (weeks > 0) return `${weeks}w`
    if (days > 0) return `${days}d`
    if (hours > 0) return `${hours}h`
    if (minutes > 0) return `${minutes}m`
    return "Just now"
}