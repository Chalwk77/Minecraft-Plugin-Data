/*
 * Rectangle Brush CraftScript for WorldEdit
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

var xSize = argv.length > 1 ? parseInt(argv[1]) : 3;
var ySize = argv.length > 2 ? parseInt(argv[2]) : 5;
var zSize = argv.length > 3 ? parseInt(argv[3]) : 12;
var material = argv.length > 4 ? parseInt(argv[4]) : 1;

if (xSize == 0) {xSize = 3;}

var strength = 1;
var tool = context.getSession().getBrushTool(player.getItemInHand());
var matPat = new SingleBlockPattern(new BaseBlock(material));

tool.setFill(matPat);

var brush = new Brush({
    strength : strength,
    build : function(editSession,posB,mat,size) {
 
		var session = context.remember();
		var pos = player.getBlockTrace(200, true);
 
		for (var x = 0; x <= (xSize*2); x++) {
			for (var y = 0; y <= (ySize*2); y++) {
				for (var z = 0; z <= (zSize*2); z++) {
										
					var pt = pos.add((x-xSize), (y-ySize), (z-zSize));
					
					editSession.setBlock(pt, mat);
					
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
	tool.setBrush(brush,"worldedit.brush.rectangle");
	player.printError("Rectangle brush bound to " + ItemType.toHeldName(player.getItemInHand()) + "." );
	player.print("[xSize: " +  xSize +" | ySize: " + ySize + " | zSize: " + zSize + " | Material: " + ItemType.toName(material) + "]"); 
}


function CommandText()  {
	
	player.print(" ");
	player.print("Rectangle Brush Script by inHaze");
	player.printError("Usage: /cs rect <xSize><ySize><zSize><mat>");
	player.print(" ");
	player.print("xSize - Brush radius size in x direction.");
	player.print("ySize - Brush radius size in y direction.");
	player.print("zSize - Brush radius size in z direction.");
	player.print("mat - Brush material.");
	player.print(" ");
	player.print("Use '/cs rect 0' to create with default settings.");
	return true;
}


