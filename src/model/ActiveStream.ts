import {Player} from "@/model/Player";

export class ActiveStream {

    _groups: string[] = [];
    _players: Player[] = [];

    constructor(private _id: string) {

    }

    get id() {
        return this._id;
    }

    get name() {
        return this._id;
    }

    get first_group_id() {
        return this._groups[0];
    }

    get players() {
        return this._players;
    }

    get groups() {
        return this._groups;
    }

    add_group = (group: string): void => {
        this._groups.push(group);
    }
    add_player = (player: Player): void => {
        this.players.push(player);
    }


    contains_group = (group: string): boolean =>{
        return this.groups.includes(group);
    }
    contains_player = (player: Player): boolean =>{
        return this.players.includes(player);
    }

}