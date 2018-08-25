import { multiInject, injectable } from "inversify";

export interface Load {
    Load(): void;
}

export interface Awake {
    Awake(): void;
}

export interface Start {
    Start(): void;
}

export interface Update {
    Update(deltaTime: number): void;
}

export interface OnResize {
    OnResize(): void;
}

@injectable()
export class ExecutionOrderController {

    private loaders: Load[] = [];
    private awakers: Awake[] = [];
    private starters: Start[] = [];
    private updaters: Update[] = [];
    private onResizers: OnResize[] = [];

    public constructor(//@multiInject("Load") loaders: Load[],
        //@multiInject("Awake") awakers: Awake[],
        @multiInject("Start") starters: Start[],
        //@multiInject("Update") updaters: Update[],
        /*@multiInject("OnResize") onResizers: OnResize[]*/) {
        //this.loaders = loaders;
        //this.awakers = awakers;
        this.starters = starters;
        //this.updaters = updaters;
        //this.onResizers = onResizers;
    }

    public remove(item: Update | OnResize): void {
        this.updaters = this.updaters.filter(h => h !== item);
        this.onResizers = this.onResizers.filter(h => h !== item);
    }

    public add(item: Awake | Start | Update | OnResize): void {
        if((item as Awake).Awake !== undefined) {
            (item as Awake).Awake();
        }
        if((item as Start).Start !== undefined) {
            (item as Start).Start();
        }
        if((item as Update).Update !== undefined) {
            this.updaters.push(<Update>item);
        }
        if((item as OnResize).OnResize !== undefined) {
            this.onResizers.push(<OnResize>item);
        }
    }

    public load(): void {
        for(let load of this.loaders){
            load.Load();
        }

        this.loaders = null;
    }

    public awake(): void {
        for(let awake of this.awakers){
            awake.Awake();
        }

        this.awakers = null;
    }

    public start(): void {
        for(let start of this.starters){
            start.Start();
        }

        this.starters = null;
    }

    public update(deltaTime: number): void {
        for(let update of this.updaters){
            update.Update(deltaTime);
        }
    }

    public onResize(): void {
        for(let onResize of this.onResizers){
            onResize.OnResize();
        }
    }
}