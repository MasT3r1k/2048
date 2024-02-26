import { Injectable } from "@angular/core";

@Injectable()
export class GameStorage {
    public save(key: string, value: Record<string, string|number> | string): void {
        let obj = JSON.parse(localStorage.getItem(key) as string);
        if (typeof value != 'string') {
            Object.keys(value).forEach((value: string|number, index: number) => {
                obj[index] = value;
            })
        }
        localStorage.setItem(key, JSON.stringify((obj && typeof value != 'string') ? obj : value));
    }

    public get(key: string, value?: string): string | number | null {
        let obj = JSON.parse(localStorage.getItem(key) as string);
        if (!obj) return null;
        if (value && !obj[value]) return null;
        if (!value) return obj;
        return obj[value];
    }

}