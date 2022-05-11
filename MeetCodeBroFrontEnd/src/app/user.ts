import { Technology } from "./technology";

export interface User{
    id?: number;
    email?: string;
    password?: string;
    name?: string; 
    surname?: string; 
    description?: string;
    linkedin?: string; 
    github?:  string; 
    label?: string[];
    technologies?: Technology[]
}

