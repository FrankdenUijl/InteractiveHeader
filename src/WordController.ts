import { Word } from "./Word";
import { ILiteEvent } from "./LiteEvent";
import { injectable } from "inversify";
import { Awake } from "./ExecutionOrderController";

@injectable()
export class WordController implements Awake  
{
    public get OnNewPosition(): ILiteEvent<number, number> 
    { 
        return this.word.OnNewPosition; 
    }

    public get OnIsYoursChange(): ILiteEvent<{}> 
    { 
        return this.word.OnIsYoursChange; 
    }

    public get OnIsLockedChange(): ILiteEvent<{}> 
    { 
        return this.word.OnIsLockedChange; 
    }

    public get Word(): string
    {
        return this.word.Word;
    }

    public get X(): number
    {
        return this.word.X;
    }

    public get Y(): number
    {
        return this.word.Y;
    }

    public get IsLocked(): boolean
    {
        return this.word.IsLocked;
    }

    public get IsYours(): boolean
    {
        return this.word.IsYours;
    }

    public get Color(): number 
    {
        return this.word.Color;
    }

    private word: Word;
    private firebaseDatabaseRef: firebase.database.Reference;

    public Init(word: Word, firebaseDatabaseRef: firebase.database.Reference): void
    {
        this.word = word;
        this.firebaseDatabaseRef = firebaseDatabaseRef;
    }

    public Awake(): void
    {
        this.setFirebaseEvents();

        //this.word.OnNewPosition.subscribe(() => { console.log("test");});
    }

    private setFirebaseEvents(): void {
        this.firebaseDatabaseRef.child("x").on("value", (snapshot) => {
            
            if(this.word.IsYours)
            {
                return;
            }
            
            this.word.SetPosition(snapshot.val(), this.word.Y);
        });

        this.firebaseDatabaseRef.child("y").on("value", (snapshot) => {

            if(this.word.IsYours)
            {
                return;
            }

            this.word.SetPosition(this.word.X, snapshot.val());
        });

        this.firebaseDatabaseRef.child("isLocked").on("value", (snapshot) => {
            let isLocked = snapshot.val();

            if(this.word.IsYours)
            {
                if(!isLocked)
                {
                    this.word.SetYours(false);
                }
            }

            this.word.SetLocked(isLocked);
        });
    }

    public SetYours(isYours: boolean): void
    {
        if(this.word.IsYours == isYours)
        {
            throw new Error("Letter already: " + isYours);
        }
        
        if(isYours)
        {
            this.word.SetYours(true);
            this.word.SetLocked(true);
        }

        this.firebaseDatabaseRef.set({
            x: this.word.X,
            y: this.word.Y,
            isLocked: isYours,
            color: this.word.Color
        });
    }

    public SetPosition(x:number, y:number): void
    {
        if(!this.word.IsYours)
        {
            throw new Error("Letter not yours to change.");
        }

        this.word.SetPosition(x, y);

        this.firebaseDatabaseRef.set({
            x: this.word.X,
            y: this.word.Y,
            isLocked: true,
            color: this.word.Color
        });
    }
}