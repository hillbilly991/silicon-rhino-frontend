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
