import * as Phaser from "phaser";
import Marble from "../Objects/Marble";

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
                this.marbleTiles[j][i].setImmovable(true);

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

    getMarbleFromGroup(colorCode: number | string): Marble{
        var marble: Marble = this.marbleGroup.get();
      
        if(marble){
            marble.setActive(true);
            marble.setVisible(true);
            if(typeof(colorCode) == "number"){
                marble.setDefaultSetting(marble.colorList[colorCode]);
            } else {
                marble.setDefaultSetting(colorCode);
            }

            return marble;
        }
        return null;
    }

    getMarbleGroup(): Phaser.Physics.Arcade.Group{
        return this.marbleGroup;
    }

    getMarbleTiles(): Marble[][]{
        return this.marbleTiles;
    }

    
    putOnTiles(marble: Marble): void{
        var coord = this.getCoordinate(marble.x, marble.y);
        console.log(coord);
        var position = this.getPosition(coord.row,coord.column);

        this.marbleTiles[coord.row][coord.column] = this.getMarbleFromGroup(marble.getColor());
        this.marbleTiles[coord.row][coord.column].setDefaultSetting(marble.getColor());
        this.marbleTiles[coord.row][coord.column].setImmovable(true);
        this.marbleTiles[coord.row][coord.column].setPosition(position.x, position.y);
    }

    checkGameOver(): boolean{
        for(var i=0; i<8; i++){
            if(this.marbleTiles[10][i] != null){
                return true;
            }
        }
        return false;
    }
}