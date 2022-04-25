export interface Invite{
    identity: {
        low: number,
        high: number
    },
    start: {
        low: number,
        high: number
    }
    end: {
        low: number,
        high: number
    }
    type?: string
    properties?: Object
}