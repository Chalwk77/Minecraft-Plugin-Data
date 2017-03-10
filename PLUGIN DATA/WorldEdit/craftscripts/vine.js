/*
 * Vine Brush CraftScript for WorldEdit
 * Copyright (C) 2012 inHaze <http://bit.ly/inHaze>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.blocks);
importPackage(Packages.com.sk89q.worldedit.tools);
importPackage(Packages.com.sk89q.worldedit.tools.brushes);
importPackage(Packages.com.sk89q.worldedit.patterns);

var bSize = argv.length > 1 ? parseInt(argv[1]) : 6;
var density = argv.length > 2 ? (argv[2]) : 20;	
var length = argv.length > 3 ? (argv[3]) : 12;
var bMat = argv.length > 4 ? (argv[4]) : BlockID.VINE;

if (bSize == 0)	{bSize = 6;}
var strength = 1;

var xOff = ['1', '-1', '1', '1', '-1', '1', '-1', '-1'];
var yOff = ['1', '1', '-1', '1', '-1', '-1', '1', '-1'];
var zOff = ['1', '1', '1', '-1', '1', '-1', '-1', '-1'];

var vines = new Array();
vines[1] = new BaseBlock(BlockID.VINE, 8);  
vines[2] = new BaseBlock(BlockID.VINE, 2);  
vines[3] = new BaseBlock(BlockID.VINE, 1);  
vines[4] = new BaseBlock(BlockID.VINE, 4); 

var blacklist = new Array();
blacklist[BlockID.SAPLING] = true;
blacklist[BlockID.WATER] = true;
blacklist[BlockID.STATIONARY_WATER] = true;
blacklist[BlockID.AIR] = true;
blacklist[BlockID.WEB] = true;
blacklist[BlockID.LONG_GRASS] = true;
blacklist[BlockID.DEAD_BUSH] = true;
blacklist[BlockID.YELLOW_FLOWER] = true;
blacklist[BlockID.RED_FLOWER] = true;
blacklist[BlockID.BROWN_MUSHROOM] = true;
blacklist[BlockID.RED_MUSHROOM] = true;
blacklist[BlockID.FIRE] = true;
blacklist[BlockID.SNOW] = true;
blacklist[BlockID.VINE] = true;
blacklist[BlockID.LILY_PAD] = true;
blacklist[BlockID.REED] = true;
blacklist[BlockID.FENCE] = true;

var tool = context.getSession().getBrushTool(player.getItemInHand());
var matPat = new SingleBlockPattern(new BaseBlock(bMat));

tool.setSize(bSize);
tool.setFill(matPat);

var brush = new Brush({
    strength : strength,
    build : function(editSession,pos,mat,bSize) {
		
        try {
			
			var rand = new java.util.Random(); 
			var blockCnt = 0;
			var blockFaces = new Array(6);

			var radius = bSize + 0.5;
			var invRadius = 1 / radius;
			var ceilRadius = Math.ceil(radius);
			
			var nextXn = 0;
			var setBlockTotal = 0;
			forX: for (var x = 0; x <= ceilRadius; ++x) {
				var xn = nextXn;
				nextXn = (x + 1) * invRadius;
				var nextYn = 0;
				forY: for (var y = 0; y <= ceilRadius; ++y) {
					var yn = nextYn;
					nextYn = (y + 1) * invRadius;
					var nextZn = 0;
					forZ: for (var z = 0; z <= ceilRadius; ++z) {
						var zn = nextZn;
						nextZn = (z + 1) * invRadius;
						
						var distanceSq = lengthSq(xn, yn, zn);
						if (distanceSq > 1) {
							if (z == 0) {
								if (y == 0) {
									break forX;
								}
								break forY;
							}
							break forZ;
						}
						for (var dirLoop = 0; dirLoop <= 7 ; dirLoop++)	{
							
							var setPnt = pos.add(x * xOff[dirLoop], y * yOff[dirLoop], z * zOff[dirLoop]);
					
							var matID = mat.next(setPnt).getType();
							var curBlock = editSession.getBlock(setPnt);
							if (curBlock.getType() != 0) {continue;}
							
							if (rand.nextInt(100) >= density) {continue;}
							
							blockFaces = [];
							
							blockFaces[1] = editSession.getBlockType(setPnt.add(1,0,0));
							blockFaces[2] = editSession.getBlockType(setPnt.add(-1,0,0));
							blockFaces[3] = editSession.getBlockType(setPnt.add(0,0,1));
							blockFaces[4] = editSession.getBlockType(setPnt.add(0,0,-1));
							
							var solidSide = new Array;
							
							for (var lpC = 1; lpC <= 4; lpC++) {
								
								if ((blockFaces[lpC] in blacklist) || (blockFaces[lpC] == matID)) {continue;}
								if (blockFaces[lpC] != 0) {
									solidSide.push(lpC)
								}												
							}
								
							if ((solidSide.length >= 1)){
								randomSide = solidSide[(rand.nextInt(solidSide.length))];
								randomLength = rand.nextInt(length);
								
								var newVine = vines[randomSide];
								for (var extendVine = 0; extendVine <= randomLength; extendVine++) {
									
									if (editSession.getBlockType(setPnt.add(0,-(extendVine),0)) == 0) {
										if (matID == BlockID.VINE) {
											editSession.setBlock(setPnt.add(0,-(extendVine),0), newVine);
										}
										else {
											editSession.setBlock(setPnt.add(0,-(extendVine),0), mat);
										}
										continue;
									}
									break;
								}
							}
						}
					}						
				}
			}			
        } catch(e) {
          
            player.print("You broke it! | Error= " + e);
            throw e;
			
        } finally {
            session.remember(editSession);
        }
		
        return true;
    },
	
	
});

if (argv.length < 2)  {
	CommandText();
} 
else {
	tool.setBrush(brush,"worldedit.brush.vine");
	player.printError("Vine brush bound to " + ItemType.toHeldName(player.getItemInHand()) + "." );
	player.print("[Size: " + bSize + " | Density: " + density + "% | Length: " + length + " | Material: " + ItemType.toName(bMat) + "]"); 
}

function CommandText()  {
	
	player.print(" ");
	player.print("Vine Brush Script by inHaze");
	player.printError("Usage: /cs vine <size><density><length><mat>");
	player.print(" ");
	player.print("size - Brush radius size.");
	player.print("density - Vine placement density. (0-100)");
	player.print("length - Maximum random vine length.");
	player.print("mat - Alternate material to use.");
	player.print(" ");
	player.print("Use '/cs vine 0' to create with default settings.");
	return true;
}
	
function lengthSq(x, y, z) {
	return (x * x) + (y * y) + (z * z);
}