// Normalizes an RSA public key string to proper PEM format
export function normalizeRSAPubkey(key: string) {
    const lineLength = 64
    const begin = "-----BEGIN PUBLIC KEY-----\n"
    const end = "-----END PUBLIC KEY-----\n"
    if (key.startsWith(begin)) {
        return key
    }
    let s = begin
    for (let i = 0; i < key.length; i += lineLength) {
        let end = i + lineLength
        if (end > key.length) {
            end = key.length
        }
        s += key.substring(i, end) + '\n'
    }
    s += end
    return s
}