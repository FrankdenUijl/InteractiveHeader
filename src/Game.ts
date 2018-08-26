import firebase = require("firebase/app");
import { injectable, inject, interfaces } from "inversify";
import { Awake, Start, Load } from "./ExecutionOrderController";
import { WordController } from "./WordController";
import { Word } from "./Word";
import { WordView } from "./WordView";
import { List } from "linqts";

@injectable()
export class Game implements Start
{
    public get Container(): PIXI.Container {
        return this.container;
    }

    private readonly container: PIXI.Container = new PIXI.Container();

    private readonly factoryWordController: interfaces.Factory<WordController>;
    private readonly factoryWordView: interfaces.Factory<WordView>;

    public constructor(@inject("Factory<WordController>") factoryWordController: (word: Word, firebaseDatabaseRef: firebase.database.Reference) => WordController,
        @inject("Factory<WordView>") factoryWordView: (wordController: WordController) => WordView)
    {
        this.factoryWordController = factoryWordController;
        this.factoryWordView = factoryWordView;
    }

    public Start()
    {
        var config = {
            apiKey: "AIzaSyCRqjFOgXZR_WxTMjx9gdo39mBYJi0SYSw",
            authDomain: "interactiveheader.firebaseapp.com",
            databaseURL: "https://interactiveheader.firebaseio.com",
            projectId: "interactiveheader",
            storageBucket: "",
            messagingSenderId: "463374262265"
        };

        firebase.initializeApp(config);

        var defaultDatabase = firebase.database();

        defaultDatabase.ref("Letters").once("value", (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                let word = new Word(childSnapshot.key, 
                    childSnapshot.child("x").val(), 
                    childSnapshot.child("y").val(),
                    childSnapshot.child("color").exists() ? childSnapshot.child("color").val() : 0xFFFFFF);
              
                let wordController = this.factoryWordController(word, childSnapshot.ref);
                let wordView = <WordView>this.factoryWordView(wordController);

                this.container.addChild(wordView.Container);
            })
        });

    }
}