import * as Phaser from "phaser";
import Marble from "../Objects/Marble";

const OFFSET = 18;
const PADDING_LEFT = 20;
const PADDING_TOP = 59;
const TILE_WIDTH = 36;
const TILE_HEIGHT = 30;

type tilePosition = {x: number, y: number};
type tileCoordinate = {row: number, column: number};

/**
 * Marble manager to manage marble groups and marble puzzle tiling
 */
export default class MarbleManager {
    private marbleGroup: Phaser.Physics.Arcade.Group;
    private marbleTiles: Marble[][];
    private cluster: tileCoordinate[];
    private clusterNeighbor: tileCoordinate[];

    constructor(scene: Phaser.Scene){
        // Init marble group
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
            repeat: this.marbleGroup.maxSize-1,
            setScale: {x: 0.3, y: 0.3}
        });

        // Init marble tiles
        this.marbleTiles = [];
        for(var j=0; j<11; j++){
            this.marbleTiles.push([]);

            for(var i=0; i<8-(j%2); i++){
                this.marbleTiles[j][i] = null;
            }
        }

        this.cluster = [];
        this.clusterNeighbor = [];
        this.generateRandom(scene);
    }

    /**
     * Generate random marbles in the puzzle tiles
     * @param scene: Game Scene
     */
    generateRandom(scene: Phaser.Scene): void{
        for(var j=0; j<5; j++){

            // One less marble on odd rows
            for(var i=0; i<8-(j%2); i++){
                var random = Math.floor(Math.random() * 7);

                this.marbleTiles[j][i] = this.getMarbleFromGroup(random);
                this.marbleTiles[j][i].setPosition(PADDING_LEFT+TILE_WIDTH*i+OFFSET*(j%2),PADDING_TOP+TILE_HEIGHT*j);
                this.marbleTiles[j][i].setImmovable(true);

            }
        }
    }

    /**
     * Get position (x,y) of marble based on row and column
     * @param row: Tile row
     * @param column: Tile column
     * @returns: tile position (x,y)
     */
    getPosition(row: number, column: number): tilePosition{
        return {x: PADDING_LEFT+TILE_WIDTH*column+OFFSET*(row%2), y: PADDING_TOP+TILE_HEIGHT*row};
    }

    /**
     * Get coordinate (row,column) of marble based on xy coordinate
     * @param x: x coordinate
     * @param y: y coordinate
     * @returns: tile coordinate (row,column)
     */
    getCoordinate(x: number, y: number): tileCoordinate{
        var row = Math.floor((y-PADDING_TOP)/TILE_HEIGHT);
        var col = Math.floor((x-OFFSET*(row%2))/TILE_WIDTH);
        if(row%2==1 && col==7){
            col=6;
        }
        return {row: row, column: col};
    }

    /**
     * Get existing neigbors' coordinate of current marble, represented in
     * tile coordinate (row,column)
     * @param row: Current marble row
     * @param column: Current marble column
     * @returns: tile coordinate (row,column) if current marble coordinate is correct, false otherwise
     */
    getNeighborsOf(row: number, column: number): tileCoordinate[] | false {
        if(row<0 || row>this.marbleTiles.length-1){
            return false;
        }
        if(column<0 || column>this.marbleTiles[row].length-1){
            return false;
        }

        var neighbors = [];

        // Left and right neighbors
        if(column>0 && this.getMarbleFromTile({row: row, column: column-1})){
            neighbors.push({row: row, column: column-1});
        }
        if(column<this.marbleTiles[row].length-1 && this.getMarbleFromTile({row: row, column: column+1})){
            neighbors.push({row: row, column: column+1});
        }

        // Above neighbors
        if(row!=0){
            //Exact above neighbor
            if(((row%2==0 && column<this.marbleTiles[row].length-1) || row%2==1) && this.getMarbleFromTile({row: row-1, column: column})){
                neighbors.push({row: row-1, column: column});
            }
            //Extra neighbor
            if(row%2==1 && this.getMarbleFromTile({row: row-1, column: column+1})){
                neighbors.push({row: row-1, column: column+1})
            } else if (column!=0  && this.getMarbleFromTile({row: row-1, column: column-1})){
                neighbors.push({row: row-1, column: column-1});
            }
        }
        
        // Below neighbors
        if(row!=this.marbleTiles.length-1){
            //Exact below neighbor
            if(((row%2==0 && column<this.marbleTiles[row].length-1) || row%2==1)  && this.getMarbleFromTile({row: row+1, column: column})){
                neighbors.push({row: row+1, column: column});
            }
            //Extra neighbor
            if(row%2==1  && this.getMarbleFromTile({row: row+1, column: column+1})){
                neighbors.push({row: row+1, column: column+1})
            } else if (column!=0  && this.getMarbleFromTile({row: row+1, column: column-1})){
                neighbors.push({row: row+1, column: column-1});
            }
        }

        return neighbors;
    }

    /**
     * Get cluster of marbles with the same color.
     * Cluster of marbles is saved in this.cluster variable
     * @param coord: current marble coordinate (row,column)
     */
    checkCluster(coord: tileCoordinate): void{
        this.cluster.push(coord);
        let checkedColor = this.getMarbleFromTile(coord).getColor();
        console.log(checkedColor);

        let currentMarble = this.getMarbleFromTile(coord);
        let neighbors = <tileCoordinate[]>this.getNeighborsOf(coord.row,coord.column);
        console.log(neighbors);
        currentMarble.checked = true;

        neighbors.forEach(coordinate => {
            let neighborMarble = this.getMarbleFromTile(coordinate);
            if(neighborMarble==null || neighborMarble.checked){ 
                return; 
            }
            if(neighborMarble.getColor()==checkedColor){
                this.checkCluster(coordinate);
            } else {
                this.clusterNeighbor.push(coordinate);
            }
        });
    }

    /**
     * Get marble group
     * @returns: marble group
     */
    getMarbleGroup(): Phaser.Physics.Arcade.Group{
        return this.marbleGroup;
    }

    /**
     * Get marble puzzle tile (2D matrix)
     * @returns: marble puzzle tile
     */
    getMarbleTiles(): Marble[][]{
        return this.marbleTiles;
    }

    /**
     * Get marble based on tile coordinate (row,column)
     * @param coord: marble coordinate
     */
    getMarbleFromTile(coord: tileCoordinate): Marble{
        return this.marbleTiles[coord.row][coord.column];
    }

    /**
     * Get marble from marble group
     * @param colorCode: color code for marble (number if randomized, string if exact)
     * @returns: marble
     */
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
    
    /**
     * Put marble on tiles based on current position (x,y) of the marble
     * @param marble: marble that wants to be put into tiles
     */
    putOnTiles(marble: Marble): void{
        var coord = this.getCoordinate(marble.x, marble.y);
        var position = this.getPosition(coord.row,coord.column);

        this.marbleTiles[coord.row][coord.column] = this.getMarbleFromGroup(marble.getColor());
        this.marbleTiles[coord.row][coord.column].setDefaultSetting(marble.getColor());
        this.marbleTiles[coord.row][coord.column].setImmovable(true);
        this.marbleTiles[coord.row][coord.column].setPosition(position.x, position.y);
        
        this.checkCluster(coord);
        // console.log(this.cluster.length);
    }

    /**
     * Pop cluster after the cluster has been found
     * @returns: score calculation based on how many marbles are popped
     */
    popCluster(): number{
        let score = 0;
        // Check if cluster needs to be popped
        if(this.cluster.length>=3){
            this.cluster.forEach(coordinate => {
                console.log("pop",coordinate);
                let currentMarble = this.getMarbleFromTile(coordinate);
                currentMarble.pop();
                this.marbleTiles[coordinate.row][coordinate.column] = null;
            });
            score = 10*3+15*(this.cluster.length-3);
        } else {
            this.cluster.forEach(coordinate => {
                let currentMarble = this.getMarbleFromTile(coordinate);
                console.log(currentMarble.getColor());
                currentMarble.checked = false;
            });
        }
        // Drop marbles affected by pop
        // this.clusterNeighbor.forEach(coordinate => {
        //     let neighbors = <tileCoordinate[]>this.getNeighborsOf(coordinate.row,coordinate.column);
        //     if(neighbors.length==0){
        //         this.dropMarble(coordinate);
        //     }
            
        // });

        // Reset cluster and cluster neighbor array
        this.cluster = [];
        this.clusterNeighbor = [];
        return score;
    }

    /**
     * Drop marble affected by pop
     * @param coordinate: coordinate (row,column) of dropped marble
     */
    dropMarble(coordinate: tileCoordinate): void{
        console.log("drop",coordinate);
        let currentMarble = this.getMarbleFromTile(coordinate);
        currentMarble.drop();
        // this.marbleTiles[coordinate.row][coordinate.column] = null;
    }

    /**
     * Check if game over state is fulfilled
     * @returns: true if game over state is fulfilled
     */
    checkGameOver(): boolean{
        for(var i=0; i<8; i++){
            if(this.marbleTiles[10][i] != null){
                return true;
            }
        }
        return false;
    }
    
}