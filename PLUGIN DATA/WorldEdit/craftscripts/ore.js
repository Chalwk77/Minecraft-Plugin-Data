/*
 * Ore Generator CraftScript for WorldEdit
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
*
*		**********Ore Settings are at the bottom of the script, starting at line 129.************
*
 */

importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.blocks);

var editX = context.getSession();
var session = context.remember();
var world = context.getSession().getSelectionWorld();
var region = context.getSession().getSelection(world);
var sel = editX.getSelection(editX.getSelectionWorld());

var overBlockID = argv.length > 1 ? parseInt(argv[1]) : BlockID.STONE;
var density = argv.length > 2 ? parseInt(argv[2]) : 200;

var origin = new Vector(
	region.getMinimumPoint().getX(),
	region.getMinimumPoint().getY(),
	region.getMinimumPoint().getZ()
	);

var width = Math.abs(region.getMaximumPoint().getX() - region.getMinimumPoint().getX());
var height = Math.abs(region.getMinimumPoint().getY() - region.getMaximumPoint().getY());
var length = Math.abs(region.getMinimumPoint().getZ() - region.getMaximumPoint().getZ());
var area = width * height * length;

var oreList = new Array();
var oreTotal = SetOreGroup() - 1;

var rand = new java.util.Random(); 	
var densityStep = 300;
var maxVeinSize = 200;
var veinCount = 0;
var oreCount = 0;

var maxPoints = (area / densityStep) * (density / 100);

for ( var pointStep = 0; pointStep < maxPoints; pointStep++) {
		
	randPnt = origin.add(rand.nextInt(width), rand.nextInt(height), rand.nextInt(length));
	randPnt2 = randPnt.add(rand.nextInt(maxVeinSize)*2-maxVeinSize, rand.nextInt(maxVeinSize)*2-maxVeinSize, rand.nextInt(maxVeinSize)*2-maxVeinSize);

	if (session.getBlock(randPnt).getType() != overBlockID)	{continue;}
	
	var radZ = randPnt.getZ()-randPnt2.getZ();			
	var radX = randPnt.getX()-randPnt2.getX();			
	var radY = randPnt.getY()-randPnt2.getY();
	var distance = Math.sqrt((radX*radX)+(radY*radY)+(radZ*radZ))
	
	var testOre = new Array();
	//var tmpOre = new Object();
	var maxOreID = 0;
	var maxOreChance = 0;
	var chanceMax = 0;
	
	for (var findOre = 0; findOre <= oreTotal; findOre++)	{
		
		if ((oreList[findOre].minY <= randPnt.getY()) && (oreList[findOre].maxY >= randPnt.getY())) {
			
			var tmpOre = new Object();
			tmpOre.myOreID = findOre;
			tmpOre.minChance = chanceMax;
			tmpOre.maxChance = chanceMax + oreList[findOre].chance;
			testOre.push(tmpOre);
			chanceMax += oreList[findOre].chance;
		}
	}
	
	randomProb = Math.random() * chanceMax;
	
	for (var getOre = 0; getOre < testOre.length; getOre++)	{
		if ((randomProb >= testOre[getOre].minChance) && (randomProb <= testOre[getOre].maxChance))	{
			maxOreID = testOre[getOre].myOreID;
		}
	}

	var bType = new BaseBlock(oreList[maxOreID].BlockID);
	
	var step = .9/distance;
	var newLength = (rand.nextInt(oreList[maxOreID].maxSize - oreList[maxOreID].minSize) + oreList[maxOreID].minSize);
	var chgCount = 0;
	
	for( var i = 0; i <= 1; i += step ) {
		
		if (chgCount >= newLength)	{break;}
		
		if (pp_draw( randPnt, randPnt2, i, session, bType ) == true) {
			chgCount++;
			oreCount++;
		}
	}
	veinCount++;
	
}

player.print(veinCount + " Veins created yielding " + oreCount + " total ore.  [" + width + "x" + length + "x" + height + "]");

function pp_draw( a, b, i, blocks, blockt ) {

	var xi = a.getX() + ((b.getX() - a.getX()) * i);
	var yi = a.getY() + ((b.getY() - a.getY()) * i);
	var zi = a.getZ() + ((b.getZ() - a.getZ()) * i);

	var v = new Vector( xi, yi, zi );
	
	if (blocks.getBlock(v).getType() == overBlockID) {	
		blocks.setBlock(v, blockt );
		return true;
	}
	return false
}


function SetOreGroup()	{			//----------------Ore Settings		

	oreList = {
		'0':  {
			BlockID:  16,			//Coal Ore
			chance:   100,			//Weighted probability, coal ore is considered baseline at 100, use 0 to stop an item from spawning completely
			minSize:   8,			//minimum possible vein size
			maxSize:	16,			//maximum possible vein size
			minY:	0,				//Lowest possible spawning y height
			maxY:	256				//Highest possible spawning y height
		},
		'1':  {
			BlockID:  15,			//Iron Ore
			chance:   60,
			minSize:   6,
			maxSize:	12,
			minY:	16,
			maxY:	256	
		},
		'2':  {						
			BlockID:  14,			//Gold Ore
			chance:   18,
			minSize:   6,
			maxSize:	10,
			minY:	4,
			maxY:	32
		},
		'3':  {	
			BlockID:  56,			//Diamond Ore
			chance:   16,
			minSize:   4,
			maxSize:	8,
			minY:	0,
			maxY:	16	
		},
		'4':  {						
			BlockID:  21,			//Lapis Lazuli Ore
			chance:   14,
			minSize:   4,
			maxSize:	10,
			minY:	0,
			maxY:	32
		},
		'5':  {						
			BlockID:  73,			//Redstone Ore
			chance:   75,
			minSize:   6,
			maxSize:	10,
			minY:	0,
			maxY:	15
		},
		'6':  {						
			BlockID:  48,			//Emerald Ore Placeholder (Normal - 129)
			chance:   .25,
			minSize:   2,
			maxSize:	45,
			minY:	0,
			maxY:	125
		},
		'7':  {						
			BlockID:  12,			//Sand
			chance:   10,
			minSize:   6,
			maxSize:	20,
			minY:	65,
			maxY:	130
		},
		'8':  {						
			BlockID:  13,			//Gravel
			chance:   10,
			minSize:   6,
			maxSize:	16,
			minY:	25,
			maxY:	90
		},
		'9':  {						
			BlockID:  82,			//Clay
			chance:   15,
			minSize:   4,
			maxSize:	12,
			minY:	50,
			maxY:	110
		},
		'10':  {						
			BlockID:  3,			//Dirt
			chance:   10,
			minSize:   4,
			maxSize:	12,
			minY:	60,
			maxY:	175
		},
		'11':  {						
			BlockID:  45,			//Bricks - Test Item
			chance:   0,
			minSize:   10,
			maxSize:	150,
			minY:	50,
			maxY:	60
		}
	};
	
	var oreCnt = 0;
	for (var k in oreList) {
	  if (oreList.hasOwnProperty(k)) {oreCnt++;}
	}
	return oreCnt;

}


