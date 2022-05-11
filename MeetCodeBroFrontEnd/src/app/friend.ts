import { User } from "./user";

export interface Friend{
    relationID?: number,
    friendID: number,
    relationType?: string,
    properties?: object,
    userInformation?: User
}

export interface SugestedUser{
    id: number;
    email: string;
    name: string; 
    surname: string; 
    description: string;
    linkedin: string; 
    github:  string; 
    tdg_id: string;
}