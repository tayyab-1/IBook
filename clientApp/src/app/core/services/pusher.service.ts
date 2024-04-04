import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Pusher from 'pusher-js';

@Injectable({
    providedIn: 'root',
})
export class PusherService {
    pusher;

    constructor() {
        this.pusher = new Pusher(environment.pusher.key, {
            cluster: environment.pusher.clustor
        });
    }

    public init(channel: string) {
        return this.pusher.subscribe(channel);
    }

    public unsubscribe(channel: string) {
        return this.pusher.unsubscribe(channel);
    }
}
