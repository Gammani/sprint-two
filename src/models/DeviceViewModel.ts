export type DeviceViewModel = {
    ip: string
    title: string
    lastActiveDate: Date
    deviceId: string
}

export type SimpleDeviceViewModel = {
    deviceId: string
    iat: number
    exp: number
}