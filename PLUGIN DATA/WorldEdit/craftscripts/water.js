/*
 * Water Fill Brush CraftScript for WorldEdit
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
var yLimit = argv.length > 2 ? (argv[2]) : (player.getBlockIn().getY()-1);
var lilypDensity = argv.length > 3 ? (argv[3]) : 2
var bMat = argv.length > 4 ? (argv[4]) : BlockID.WATER;

if (bSize == 0)	{bSize = 6;}
var strength = 1;

var xOff = ['1', '-1', '1', '1', '-1', '1', '-1', '-1'];
var yOff = ['1', '1', '-1', '1', '-1', '-1', '1', '-1'];
var zOff = ['1', '1', '1', '-1', '1', '-1', '-1', '-1'];

var whitelist = new Array();
whitelist[BlockID.AIR] = true;
whitelist[BlockID.SAPLING] = true;
whitelist[BlockID.WATER] = true;
whitelist[BlockID.STATIONARY_WATER] = true;
whitelist[BlockID.WEB] = true;
whitelist[BlockID.LONG_GRASS] = true;
whitelist[BlockID.DEAD_BUSH] = true;
whitelist[BlockID.YELLOW_FLOWER] = true;
whitelist[BlockID.RED_FLOWER] = true;
whitelist[BlockID.BROWN_MUSHROOM] = true;
whitelist[BlockID.RED_MUSHROOM] = true;
whitelist[BlockID.FIRE] = true;
whitelist[BlockID.VINE] = true;
whitelist[BlockID.LILY_PAD] = true;
whitelist[BlockID.REED] = true;


var tool = context.getSession().getBrushTool(player.getItemInHand());
var matPat = new SingleBlockPattern(new BaseBlock(bMat));

tool.setSize(bSize);
tool.setFill(matPat);

var brush = new Brush({
    strength : strength,
    build : function(editSession,pos,mat,bSize) {
		
        try {
			
			var rand = new java.util.Random(); 
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
							var curBlock = editSession.getBlock(setPnt);
							
							if (!(curBlock.getType() in whitelist) || (setPnt.getY() > yLimit)) {continue;}
				
							if ((editSession.getBlockType(setPnt.add(0, 1, 0)) == BlockID.AIR) && (setPnt.getY() == yLimit) && (mat.next(setPnt).getType() == BlockID.WATER))	{
								if (lilypDensity >= rand.nextInt(100))	{								
									editSession.setBlock(setPnt.add(0, 1, 0), new BaseBlock(BlockID.LILY_PAD));
								}
							}
							
							for (var extendWater = 0; extendWater <= 64; extendWater++) {
								
								if (editSession.getBlockType(setPnt.add(0,-(extendWater),0)) in whitelist) {
									editSession.setBlock(setPnt.add(0,-(extendWater),0), mat);							
									continue;
								}
								break;
							}
						}
					}						
				}
			}			
        } catch(e) {
          
            player.print("You broke it! | Error= " + e);
			
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
	tool.setBrush(brush, "worldedit.brush.water");
	player.printError("Water Fill brush bound to " + ItemType.toHeldName(player.getItemInHand()) + "." );
	player.print("[Size: " + bSize + " | yLimit: " + yLimit + " | Lily Pad Density: " + lilypDensity + "% | Material: " + ItemType.toName(bMat) + "]"); 
}


function CommandText()  {
	
	player.print(" ");
	player.print("Water Fill Brush Script by inHaze");
	player.printError("Usage: /cs water <size><yLimit><mat><lilypad%>");
	player.print(" ");
	player.print("size - Brush radius size.");
	player.print("yLimit - Maximum water level y limit. (Important!)");
	player.print("lilypad% - Lily pad density %. (0-100)");
	player.print("mat - Alternate fill material to use.");
	player.print(" ");
	player.print("Use '/cs water 0' to create with default settings.");
	player.print("**Stand on the water 'shore' when setting with defaults**");
	return true;
}

function lengthSq(x, y, z) {
	return (x * x) + (y * y) + (z * z);
}