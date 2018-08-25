import { WordController } from "./WordController";
import { Awake, Start } from "./ExecutionOrderController";
import { LiteEvent, ILiteEvent } from "./LiteEvent";
import { injectable } from "inversify";

@injectable()
export class WordView implements Awake, Start
{
    public get Container(): PIXI.Container {
        return this.container;
    }

    public get OnDragStart(): ILiteEvent<PIXI.interaction.InteractionData> { 
        return this.onDragStart.expose(); 
    }

    public get OnDragEnd(): ILiteEvent<PIXI.Point, PIXI.interaction.InteractionData> { 
        return this.onDragEnd.expose(); 
    }

    public get OnDragMove(): ILiteEvent<PIXI.Point, PIXI.interaction.InteractionData> { 
        return this.onDragMove.expose(); 
    }

    private wordController: WordController;

    private isDragging: boolean;
    private mouseData: PIXI.interaction.InteractionData;
    private startPoint: PIXI.Point;

    private readonly onDragStart = new LiteEvent<PIXI.interaction.InteractionData>();
    private readonly onDragEnd = new LiteEvent<PIXI.Point, PIXI.interaction.InteractionData>();
    private readonly onDragMove = new LiteEvent<PIXI.Point, PIXI.interaction.InteractionData>();

    private readonly container: PIXI.Container = new PIXI.Container();
    private readonly background: PIXI.Graphics = new PIXI.Graphics();
    private readonly word: PIXI.Text = new PIXI.Text('', {fontFamily : 'Arial', fontSize: 12, fill : 0xFFFFFF});

    public Init(wordController: WordController): void
    {
        this.wordController = wordController;
    }

    public Awake(): void 
    {
        this.setWordEvents();
        this.setPointerEvents();
        this.setDragEvents();
    }

    public Start(): void 
    {
        this.setViewYours();
        this.setViewLocked();
        this.setViewPosition();

        this.word.text = this.wordController.Word;

        this.background.lineStyle(0, 0x1E73BE, 1);
        this.background.beginFill(0x141414, 1);
        this.background.drawRect(-5, -5, this.word.width + 10, this.word.height + 10);
        this.background.endFill();        

        this.container.addChild(this.background);        
        this.container.addChild(this.word);
    }

    private setWordEvents(): void 
    {
        this.wordController.OnNewPosition.subscribe(() => { 
            this.setViewPosition() 
        });
        this.wordController.OnIsYoursChange.subscribe(() => { 
            this.setViewYours() 
        });
        this.wordController.OnIsLockedChange.subscribe(() => { 
            this.setViewLocked() 
        });
    }

    private setDragEvents(): void
    {
        this.OnDragStart.subscribe((startPoint, data) => { 
            this.wordController.SetYours(true);
        });

        this.OnDragMove.subscribe((startPoint, data) => { 
            var newPosition = data.getLocalPosition(this.container.parent);

            this.wordController.SetPosition(newPosition.x - startPoint.x, 
                newPosition.y - startPoint.y);
        });

        this.OnDragEnd.subscribe((startPoint, data) => { 
            this.wordController.SetYours(false);
        });
    }

    private setPointerEvents(): void 
    {
        this.container.on('pointerdown', (event: PIXI.interaction.InteractionEvent) => {
            this.mouseData = event.data;

            this.startPoint =  event.data.getLocalPosition(this.container);

            this.isDragging = true;
            this.onDragStart.invoke(event.data);
        });

        this.container.on('pointerup', () => {
            let mouseDate = this.mouseData;
            let startPoint = this.startPoint;

            this.mouseData = null;
            this.isDragging = false;
            this.startPoint = null;

            this.onDragEnd.invoke(startPoint, mouseDate);
        });
        
        this.container.on('pointerupoutside', () => {
            let mouseDate = this.mouseData;
            let startPoint = this.startPoint;

            this.mouseData = null;
            this.isDragging = false;
            this.startPoint = null;

            this.onDragEnd.invoke(startPoint, mouseDate);
        });

        this.container.on('pointermove', () => {
            if(this.isDragging) 
            {
                this.onDragMove.invoke(this.startPoint, this.mouseData);
            }
        });
    }

    private setViewYours(): void
    {
        this.container.alpha = this.wordController.IsYours ? 0.5 : 1;
    }

    private setViewLocked(): void
    {
        this.container.interactive = this.wordController.IsLocked && !this.wordController.IsYours ? false : true;
        this.container.cursor = this.wordController.IsLocked && !this.wordController.IsYours ? 'not-allowed' : 'move';
    }

    private setViewPosition(): void 
    {
        this.container.x = this.wordController.X < 0 ? 0 :
            this.wordController.X + this.container.width > window.innerWidth ? window.innerWidth - this.container.width : 
            this.wordController.X;

        this.container.y = this.wordController.Y < 0 ? 0 :
            this.wordController.Y + this.container.height > window.innerHeight ? window.innerHeight - this.container.height : 
            this.wordController.Y;
    }
}