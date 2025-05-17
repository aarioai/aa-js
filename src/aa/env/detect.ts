export function isLocalhost(): boolean {
    if (typeof location === 'undefined' || !location.hostname) {
        return true
    }
    const h = location.hostname.toLowerCase()
    if (['localhost', '127.0.0.1', '::1'].includes(h)) {
        return true
    }
    // A类局域网IP范围
    if (/^10\.\d+\.\d+\.\d+$/.test(h)) {
        return true
    }
    // B类局域网
    if (/^127\.\d+\.\d+\.\d+$/.test(h) || /^172\.(1[6-9]|2\d|3[0-2])\.\d+\.\d+$/.test(h)) {
        return true
    }

    // C类局域网IP
    return /^192\.168\.\d+\.\d+$/.test(h);
}