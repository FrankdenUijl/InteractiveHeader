import { LiteEvent, ILiteEvent } from "./LiteEvent";

export class Word 
{
    public get OnNewPosition(): ILiteEvent<number, number> 
    { 
        return this.onNewPosition; 
    }

    public get OnIsYoursChange(): ILiteEvent<{}> 
    { 
        return this.onIsYoursChange; 
    }

    public get OnIsLockedChange(): ILiteEvent<{}> 
    { 
        return this.onIsLockedChange; 
    }

    public get Word(): string
    {
        return this.word;
    }

    public get X(): number
    {
        return this.x;
    }

    public get Y(): number
    {
        return this.y;
    }

    public get IsLocked(): boolean
    {
        return this.isLocked;
    }

    public get IsYours(): boolean
    {
        return this.isYours;
    }

    public get Color(): number 
    {
        return this.color;
    }

    private x: number;
    private y: number;
    private isLocked: boolean;
    private isYours: boolean;
    private color: number;

    private readonly onNewPosition = new LiteEvent<number, number>();
    private readonly onIsYoursChange = new LiteEvent();
    private readonly onIsLockedChange = new LiteEvent();

    private readonly word: string;

    public constructor(word: string, 
        x: number, 
        y: number,
        color: number)
    {
        this.word = word;

        this.x = x;
        this.y = y;
        this.color = color;
    }

    public SetPosition(x: number, y: number): void
    {
        this.x = x;
        this.y = y;

        this.onNewPosition.invoke(x, y);
    }

    public SetYours(isYours:boolean)
    {
        this.isYours = isYours;

        this.onIsYoursChange.invoke();
    }

    public SetLocked(isLocked:boolean)
    {
        this.isLocked = isLocked;

        this.onIsLockedChange.invoke();
    }
}