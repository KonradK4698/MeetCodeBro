import { User } from "./user"

export interface limitSkip{
    skip: number,
    limit: number
}

export interface SearchData{
    name: string, 
    surname: string, 
    technologies: number[], 
    socialMedia: {
        github:  boolean, 
        linkedin: boolean
    }
}

export interface CatalogData{
    userCount: number, 
    users: User[]
}