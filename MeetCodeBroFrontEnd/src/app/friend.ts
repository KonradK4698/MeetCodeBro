import { User } from "./user";

export interface Friend{
    relationID?: number,
    friendID: number,
    relationType?: string,
    properties?: object,
    userInformation?: User
}