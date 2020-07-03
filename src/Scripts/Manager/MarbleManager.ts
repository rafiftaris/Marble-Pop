import * as Phaser from "phaser";
import Marble from "../Objects/Marble";

const COLOR = ["red","green","blue","orange","yellow","black","white"];
const PADDING = 18;

type tilePosition = {x: number, y: number};
type tileCoordinate = {row: number, column: number};

export default class MarbleManager {
    private marbleGroup: Phaser.Physics.Arcade.Group;
    private marbleTiles: Marble[][];

    constructor(scene: Phaser.Scene){
        this.marbleGroup = new Phaser.Physics.Arcade.Group(scene.physics.world,scene,{
            classType: Marble,
            defaultKey: 'marble',
            maxSize: 100,
            active: false,
            visible: false,
        });
        this.marbleGroup.createMultiple({
            active: false,
            visible: false,
            quantity: 100,
            key: 'marble',
            repeat: this.marbleGroup.maxSize-1
        });

        this.marbleTiles = [];
        for(var j=0; j<11; j++){
            this.marbleTiles.push([]);

            for(var i=0; i<8-(j%2); i++){
                this.marbleTiles[j][i] = null;
            }
        }

        this.generateRandom(scene);
    }

    generateRandom(scene: Phaser.Scene): void{
        
        for(var j=0; j<5; j++){

            // One less marble on odd rows
            for(var i=0; i<8-(j%2); i++){
                var random = Math.round(Math.random()*7);

                this.marbleTiles[j][i] = new Marble(scene, 20+36*i+PADDING*(j%2),56+30*j,COLOR[random]);
            }
        }
    }

    getPosition(row: number, column: number): tilePosition{
        return {x: 20+36*column+PADDING*(row%2), y: 56+30*row};
    }

    getNeighborsOf(row: number, column: number): tileCoordinate[] | false {
        if(row<0 || row>this.marbleTiles.length-1){
            return false;
        }
        if(column<0 || column>this.marbleTiles[row].length-1){
            return false;
        }

        var neighbors = [];

        // Left and right neighbors
        if(column>0){
            neighbors.push({row: row, column: column-1});
        }
        if(column<this.marbleTiles[row].length-1){
            neighbors.push({row: row, column: column+1});
        }

        // Above neighbors
        if(row!=0){
            if((row%2==0 && column<this.marbleTiles[row].length-1) || row%2==1){
                neighbors.push({row: row-1, column: column});
            }
            if(row%2==1){
                neighbors.push({row: row-1, column: column+1})
            } else if (column!=0){
                neighbors.push({row: row-1, column: column-1});
            }
        }
        
        // Below neighbors
        if(row!=this.marbleTiles.length-1){
            if((row%2==0 && column<this.marbleTiles[row].length-1) || row%2==1){
                neighbors.push({row: row+1, column: column});
            }
            if(row%2==1){
                neighbors.push({row: row+1, column: column+1})
            } else if (column!=0){
                neighbors.push({row: row+1, column: column-1});
            }
        }

        return neighbors;
    }

    getMarble(coord: tileCoordinate): Marble{
        return this.marbleTiles[coord.row][coord.column];
    }
}