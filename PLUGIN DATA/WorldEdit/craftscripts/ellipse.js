/*
 * Ellipse Brush CraftScript for WorldEdit
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

var xOff = ['1', '-1', '1', '1', '-1', '1', '-1', '-1'];
var yOff = ['1', '1', '-1', '1', '-1', '-1', '1', '-1'];
var zOff = ['1', '1', '1', '-1', '1', '-1', '-1', '-1'];

var xSize = argv.length > 1 ? parseInt(argv[1]) : 7;
var ySize = argv.length > 2 ? parseInt(argv[2]) : 4;
var zSize = argv.length > 3 ? parseInt(argv[3]) : 11;
var material = argv.length > 4 ? parseInt(argv[4]) : 1;
var hollow = argv.length > 5 ? parseInt(argv[5]) : 1;

if (xSize == 0)	{xSize = 7;}

var strength = 1;
var tool = context.getSession().getBrushTool(player.getItemInHand());
matPat = new SingleBlockPattern(new BaseBlock(material));

tool.setFill(matPat);

var brush = new Brush({
    strength : strength,
    build : function(editSession,posB,mat,size) {
 
		var session = context.remember();
		var pos = player.getBlockTrace(200, true);
			
		makeSphere(pos, mat, xSize, ySize, zSize, hollow, editSession);
		
        return true;
    },
	
});

if (argv.length < 2)  {
	CommandText();
} 
else {
	tool.setBrush(brush,"worldedit.brush.ellipse");
	player.printError("Ellipse brush bound to " + ItemType.toHeldName(player.getItemInHand()) + "." );
	player.print("[xSize: " +  xSize +" | ySize: " + ySize + " | zSize: " + zSize + " | Material: " + ItemType.toName(material) + "]"); 
}

function CommandText()  {
	
	player.print(" ");
	player.print("Ellipse Brush Script by inHaze");
	player.printError("Usage: /cs ellipse <xSize><ySize><zSize><mat><hollow>");
	player.print(" ");
	player.print("xSize - Brush radius size in x direction.");
	player.print("ySize - Brush radius size in y direction.");
	player.print("zSize - Brush radius size in z direction.");
	player.print("mat - Brush material.");
	player.print("hollow - Brush inner fill. (Solid=1 | Hollow=0)");
	player.print(" ");
	player.print("Use '/cs ellipse 0' to create with default settings.");
	return true;
}

function makeSphere(pos, block, radiusX, radiusY, radiusZ, filled, editSession ) {
	var affected = 0;

	radiusX += 0.5;
	radiusY += 0.5;
	radiusZ += 0.5;

	var invRadiusX = 1 / radiusX;
	var invRadiusY = 1 / radiusY;
	var invRadiusZ = 1 / radiusZ;

	var ceilRadiusX = Math.ceil(radiusX);
	var ceilRadiusY = Math.ceil(radiusY);
	var ceilRadiusZ = Math.ceil(radiusZ);

	var nextXn = 0;
	forX: for (var x = 0; x <= ceilRadiusX; ++x) {
		var xn = nextXn;
		nextXn = (x + 1) * invRadiusX;
		var nextYn = 0;
		forY: for (var y = 0; y <= ceilRadiusY; ++y) {
			var yn = nextYn;
			nextYn = (y + 1) * invRadiusY;
			var nextZn = 0;
			forZ: for (var z = 0; z <= ceilRadiusZ; ++z) {
				var zn = nextZn;
				nextZn = (z + 1) * invRadiusZ;

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

				if (!filled) {
					if (lengthSq(nextXn, yn, zn) <= 1 && lengthSq(xn, nextYn, zn) <= 1 && lengthSq(xn, yn, nextZn) <= 1) {
						continue;
					}
				}
				
				
				for (var dirLoop = 0; dirLoop <= 7 ; dirLoop++)	{

					var setPnt = pos.add(x * xOff[dirLoop], y * yOff[dirLoop], z * zOff[dirLoop]);
					if (editSession.setBlock(setPnt, block))	{
						++affected;
					}
					
				}
			}
		}
	}

	return affected;
}


function lengthSq(x, y, z) {
	return (x * x) + (y * y) + (z * z);
}

