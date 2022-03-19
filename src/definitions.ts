import { DetailedHTMLProps, InputHTMLAttributes } from "react";

 export interface IEvent {
    id: number;
    time: string;
    title: string;
    creator: IUser;
    guests: IUser[];
    type: 'BEERS' | 'COCKTAILS' | 'COFFEES' | 'MILKSHAKES';
    location: IEventLocation;
    comments: IEventComment[];
  }

export interface IEventLocation {
    name: string;
    latitude: number;
    longitude: number;
}

export interface IEventComment {
    user: IUser;
    timestamp: string;
    message: string;
}

export interface IUser {
    name: string;
    avatarUrl: string;
}

export interface ITextInput {
    value: string;
    label: string;
    onChange: (e:any) => void
}

export interface ISelectInput {
    value: string;
    label: string;
    onChange: (e:any) => void;
    options: Array<{
        id: number;
        name: string
    }>
}

