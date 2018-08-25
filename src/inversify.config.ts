import { Container, interfaces } from "inversify";
import { ExecutionOrderController, Update, Load, Start, Awake, OnResize } from "./ExecutionOrderController";
import { WordController } from "./WordController";
import { Word } from "./Word";
import { WordView } from "./WordView";
import { Game } from "./Game";

var container = new Container();

container.bind(Game)
    .toSelf()
    .inSingletonScope();
container.bind<Start>("Start")
    .toDynamicValue(ctx => ctx.container.get(Game))
    .inSingletonScope();

container.bind(ExecutionOrderController)
    .toSelf()
    .inSingletonScope();

container.bind(WordController)
    .toSelf();

container.bind(WordView)
    .toSelf();

container.bind<interfaces.Factory<WordController>>("Factory<WordController>")
    .toFactory(context => {
        return (word: Word, firebaseDatabaseRef: firebase.database.Reference): WordController => {
            let wordController = context.container.get(WordController);

            wordController.Init(word, firebaseDatabaseRef);

            let executionOrderController = context.container.get(ExecutionOrderController);
            executionOrderController.add(wordController);

            return wordController;
        }
    });

container.bind<interfaces.Factory<WordView>>("Factory<WordView>")
    .toFactory(context => {
        return (wordController: WordController): WordView => {
            let wordView = context.container.get(WordView);

            wordView.Init(wordController);

            let executionOrderController = context.container.get(ExecutionOrderController);
            executionOrderController.add(wordView);

            return wordView;
        }
    });

export default container;