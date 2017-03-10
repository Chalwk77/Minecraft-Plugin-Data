/*
 * Erode Brush CraftScript for WorldEdit
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

var bSize = argv.length > 1 ? parseInt(argv[1]) : 4;
var maxFaces = argv.length > 2 ? (argv[2]) : 2;		
var strength = argv.length > 3 ? (argv[3]) : 1;

var xOff = ['1', '-1', '1', '1', '-1', '1', '-1', '-1'];
var yOff = ['1', '1', '-1', '1', '-1', '-1', '1', '-1'];
var zOff = ['1', '1', '1', '-1', '1', '-1', '-1', '-1'];

if (bSize == 0)	{bSize = 4;}
var blocks = new Array();

var tool = context.getSession().getBrushTool(player.getItemInHand());
var matPat = new SingleBlockPattern(new BaseBlock(maxFaces));

tool.setSize(bSize);
tool.setFill(matPat);

var brush = new Brush({
    strength : strength,
    build : function(editSession,pos,mat,bSize) {
		
		var session = context.remember();
 
		for (iteration = 1; iteration <= strength; iteration++)	{

			var matID = mat.getBlock().getType();
			maxFaces = ((matID >= 0) && (matID <= 6)) ? matID : 3;
			
			var blockTotal = 0;			
			var blockCnt = 0;			
			var blockFaces = new Array(6);

			radius = bSize + 0.5;
			var invRadius = 1 / radius;
			var ceilRadius = Math.ceil(radius);

			var nextXn = 0;
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
						
							var pt = pos.add(x * xOff[dirLoop], y * yOff[dirLoop], z * zOff[dirLoop]);
							var curBlock = editSession.getBlock(pt);
							
							blockCnt = 0;
							blockFaces = [];
							
							blockFaces[1] = editSession.getBlockType(pt.add(1,0,0));
							blockFaces[2] = editSession.getBlockType(pt.add(-1,0,0));
							blockFaces[3] = editSession.getBlockType(pt.add(0,1,0));
							blockFaces[4] = editSession.getBlockType(pt.add(0,-1,0));
							blockFaces[5] = editSession.getBlockType(pt.add(0,0,1));
							blockFaces[6] = editSession.getBlockType(pt.add(0,0,-1));	
							
							for (var lpC = 1; lpC <= 6; lpC++) {
								if((blockFaces[lpC]) == 0) {blockCnt++;}												
							}
							
							if (blockCnt >= maxFaces) {
							
								blocks[blockTotal] = BlockID.AIR;
							}
							else {
								blocks[blockTotal] = curBlock.getType();
							}
							blockTotal++;
						}
					}
				}
			}
			
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
							var ID = blocks[setBlockTotal];

							editSession.setBlock(setPnt, new BaseBlock(ID));
							setBlockTotal++;
						}	
					}
				}
			}
		}
        return true;
    },
	
});

if (argv.length < 2)  {
	CommandText();
} 
else {
	tool.setBrush(brush,"worldedit.brush.erode");
	player.printError("Erode brush bound to " + ItemType.toHeldName(player.getItemInHand()) + "." );
	player.print("[Size: " + bSize + " | Faces: " + maxFaces + " | Strength: " + strength + "]"); 
}

function CommandText()  {
	
	player.print(" ");
	player.print("Erode Brush Script by inHaze");
	player.printError("Usage: /cs erode <size><faces><strength>");
	player.print(" ");
	player.print("size - Brush radius size.");
	player.print("faces - Min # of exposed faces needed to trigger erosion. (1-6)");
	player.print("strength - Brush strength multiplier.");
	player.print(" ");
	player.print("Use '/cs erode 0' to create with default settings.");
	return true;
}


function lengthSq(x, y, z) {
	return (x * x) + (y * y) + (z * z);
}

