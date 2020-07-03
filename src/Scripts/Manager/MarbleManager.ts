import * as Phaser from "phaser";
import Marble from "../Objects/Marble";

const COLOR = ["red","green","blue","orange","yellow","black","white"];
const OFFSET = 18;
const PADDING_LEFT = 20;
const PADDING_TOP = 56;
const TILE_WIDTH = 36;
const TILE_HEIGHT = 30;

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

                this.marbleTiles[j][i] = this.getMarbleFromGroup(random);
                this.marbleTiles[j][i].setPosition(PADDING_LEFT+TILE_WIDTH*i+OFFSET*(j%2),PADDING_TOP+TILE_HEIGHT*j);

            }
        }
    }

    getPosition(row: number, column: number): tilePosition{
        return {x: PADDING_LEFT+TILE_WIDTH*column+OFFSET*(row%2), y: PADDING_TOP+TILE_HEIGHT*row};
    }

    getCoordinate(x: number, y: number): tileCoordinate{
        var row = Math.round((y-PADDING_TOP)/TILE_HEIGHT);
        var col = Math.round((x-PADDING_LEFT-OFFSET*(row%2))/TILE_WIDTH);
        return {row: row, column: col};
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

    getMarbleFromTile(coord: tileCoordinate): Marble{
        return this.marbleTiles[coord.row][coord.column];
    }

    getMarbleFromGroup(colorCode: number): Marble{
        var marble: Marble = this.marbleGroup.get();
      
        if(marble){
            marble.setActive(true);
            marble.setVisible(true);
            marble.updateColor(COLOR[colorCode]);
            marble.setScale(0.3);
            marble.body.setCircle(marble.width/3);
            marble.body.setOffset(marble.width/6,marble.height/6);

            return marble;
        }
        return null;
    }
}