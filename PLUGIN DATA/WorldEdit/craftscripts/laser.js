/*
 * Laser Beam Brush CraftScript for WorldEdit
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
 * along with this program. If not, see <http://www.gnu.org/licenses/>.e
*/
importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.blocks);
importPackage(Packages.com.sk89q.worldedit.tools);
importPackage(Packages.com.sk89q.worldedit.tools.brushes);
importPackage(Packages.com.sk89q.worldedit.patterns);

var xOff = ['1', '-1', '1', '1', '-1', '1', '-1', '-1'];
var yOff = ['1', '1', '-1', '1', '-1', '-1', '1', '-1'];
var zOff = ['1', '1', '1', '-1', '1', '-1', '-1', '-1'];

var beamSize = argv.length > 1 ? parseInt(argv[1]) : 5;
var depth = argv.length > 2 ? parseInt(argv[2]) : 50;
var material = argv.length > 3 ? parseInt(argv[3]) : 0;

if (beamSize == 0) {beamSize = 5;} 

var strength = 1;
var tool = context.getSession().getBrushTool(player.getItemInHand());
var matPat = new SingleBlockPattern(new BaseBlock(material));

tool.setFill(matPat);
tool.setSize(beamSize);

var brush = new Brush({
    strength : strength,
    build : function(editSession,posB,mat,size) {
		
		var session = context.remember();
		
		var origin = player.getBlockIn().add(0,1,0);	
		var pos = player.getBlockTrace(200);
		var distance = Distance3D(origin, pos);

		var step = .9/distance;
		var extendBeam = 1 + (depth*step);

		for( var i = 0; i <= extendBeam; i += step) {
			
			if (i < ((size/2*step) + step*2)) {continue;}
			
			pp_draw(origin, pos, i, editSession, mat, size/3 );
		}

        return true;
    },
	
});

if (argv.length < 2)  {
	CommandText();
} 
else {
	tool.setBrush(brush,"worldedit.brush.laser");
	player.printError("Laser brush bound to " + ItemType.toHeldName(player.getItemInHand()) + "." );
	player.print("[BeamSize: " +  beamSize +" | Depth: " + depth + " | Material: " + ItemType.toName(material) + "]"); 
}


function CommandText()  {
	
	player.print(" ");
	player.print("Laser Beam Brush Script by inHaze");
	player.printError("Usage: /cs laser <size><depth><mat>");
	player.print(" ");
	player.print("size - Overall beam width.");
	player.print("depth - Depth the beam will penetrate past the clicked block.");
	player.print("mat - Material of the beam.");
	player.print(" ");
	player.print("Use '/cs laser 0' to create with default settings.");
	return true;
}

function pp_draw( a, b, i, blocks, blockt, bSize ) {

	var xi = a.getX() + ((b.getX() - a.getX()) * i);
	var yi = a.getY() + ((b.getY() - a.getY()) * i);
	var zi = a.getZ() + ((b.getZ() - a.getZ()) * i);

	var v = new Vector( xi, yi, zi );
	
	if (beamSize == 1)	{
		blocks.setBlock(v, blockt );
	}
	else	{
		makeSphere(v, blockt, bSize, blocks);
	}
	
}

function makeSphere(pos, block, radius, editSession ) {

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
			
				for (var dirLoop = 0; dirLoop <= 7 ; dirLoop++)	{
				
					var setPnt = pos.add(x * xOff[dirLoop], y * yOff[dirLoop], z * zOff[dirLoop]);
					editSession.setBlock(setPnt, block)
				}
			}
		}
	}
}

function Distance3D(vecA, vecB)	{

var xSize = vecA.getX()-vecB.getX();
var ySize = vecA.getY()-vecB.getY();
var zSize = vecA.getZ()-vecB.getZ();
var distance = Math.sqrt((xSize*xSize)+(ySize*ySize)+(zSize*zSize));

return distance;
}

function lengthSq(x, y, z) {
	return (x * x) + (y * y) + (z * z);
}

