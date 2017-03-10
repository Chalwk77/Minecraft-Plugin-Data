/*
 * Fragment Brush CraftScript for WorldEdit
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

var size = argv.length > 1 ? argv[1] : 3;
var material = argv.length > 2 ? parseInt(argv[2]) : 1;
var density = argv.length > 3 ? (parseInt(argv[3]))/100 : .5;
var shellThickness = argv.length > 4 ? (parseInt(argv[4]))/100 : 0;

if (size == 0)	{size = 3;}

var xOff = ['1', '-1', '1', '1', '-1', '1', '-1', '-1'];
var yOff = ['1', '1', '-1', '1', '-1', '-1', '1', '-1'];
var zOff = ['1', '1', '1', '-1', '1', '-1', '-1', '-1'];

var strength = 1;
var tool = context.getSession().getBrushTool(player.getItemInHand());
var matPat = new SingleBlockPattern(new BaseBlock(material));

tool.setSize(size);
tool.setFill(matPat);

var brush = new Brush({
    strength : strength,
    build : function(editSession,posB,mat,size) {
		
		var session = context.remember();
		var pos = player.getBlockTrace(300, true);
		
		makeSphere(pos, mat, size, shellThickness, editSession);

        return true;
    },
	
});

if (argv.length < 2)  {
	CommandText();
} 
else {
	tool.setBrush(brush,"worldedit.brush.frag");
	player.printError("Fragment brush bound to " + ItemType.toHeldName(player.getItemInHand()) + "." );
	player.print("[Size: " + size + " | Material: " + ItemType.toName(material) + " | Density: " + (density*100) + "% | Shell: " + (shellThickness*100) + "%]"); 
}

function CommandText()  {
	
	player.print(" ");
	player.print("Fragment Brush Script by inHaze");
	player.printError("Usage: /cs frag <size><mat><density><shellSize>");
	player.print(" ");
	player.print("size - Brush radius size.");
	player.print("mat - Brush material to use.");
	player.print("density - Outside density (0-100| 0=Fragmented| 100=Solid)");
	player.print("shellSize - Hollow shell thickness (0-100| 0=Solid| 100=Hollow)");
	player.print(" ");
	player.print("Use '/cs frag 0' to create with default settings.");
	return true;
}

function makeSphere(pos, block, radius, hollow, editSession ) {
	var affected = 0;
	var rand = new java.util.Random(); 

	radius += 0.5;
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

				if (hollow != 0) {
					if (lengthSq(nextXn, yn, zn) <= (1-hollow) && lengthSq(xn, nextYn, zn) <= (1-hollow) && lengthSq(xn, yn, nextZn) <= (1-hollow)) {
						continue;
					}
				}
				
				for (var dirLoop = 0; dirLoop <= 7 ; dirLoop++)	{
					var stopSet = 0;
				
					var goodDistance = Math.min(lengthSq(nextXn, yn, zn), lengthSq(xn, nextYn, zn), lengthSq(xn, yn, nextZn));
					
					if (goodDistance >= density)	{

						if ((((1-goodDistance)/(1-density)) * 100) <= rand.nextInt(100)) {
							stopSet = 1;
						}
					}

					var setPnt = pos.add(x * xOff[dirLoop], y * yOff[dirLoop], z * zOff[dirLoop]);
					if (stopSet == 0)	{
						if (editSession.setBlock(setPnt, block))	{
							++affected;
						}
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


