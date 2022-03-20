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
    id?: number;
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
    id?: number;
    name: string;
    avatarUrl: string;
}

export interface IInput {
    value: string;
    label: string;
    type?: 'date' | 'text' | 'number'
    onChange: (e:any) => void
}

export interface ISelectInput {
    value: string;
    label: string;
    onChange: (e:any) => void;
    options: Array<{
        id: number | string;
        name?: string;
        text?: string;
    }>
}

