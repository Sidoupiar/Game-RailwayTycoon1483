class TerrainManager {
	constructor(game) {
		this.game = game;
		this.terrainTypeList = [
			{
				id: 'plain',
				peakWidthBase: 420.0,
				peakWidthRandom: 120.0,
				peakHeightBase: 25.0,
				peakHeightRandom: 45.0,
				CreateStructureData: function (terrainManager, terrainDataStyle, layerData) {
					const positionY = Math.random() * 10 - layerData.baseHeightOffset;
					const realWidth = (terrainDataStyle.peakWidth * (1.1 - Math.random() * 0.2)) * layerData.baseScale;
					const realHeight = (terrainDataStyle.peakHeight + Math.random() * 10 - 5) * layerData.baseScale;
					const peakColor = terrainManager.game.structureManager.MakeColorData(0, 210, 100, 255);
					const structureData = terrainManager.game.structureManager.MakeStructureData(layerData.positionGenerate, positionY, realWidth, realHeight, peakColor);
					return [
						terrainManager.game.structureManager.ModifyStructureData_DrawType_Sin(structureData),
						terrainDataStyle.peakWidth * 0.65 * layerData.baseScale,
					];
				}
			},
			{
				id: 'mountain',
				peakWidthBase: 450.0,
				peakWidthRandom: 220.0,
				peakHeightBase: 35.0,
				peakHeightRandom: 85.0,
				CreateStructureData: function (terrainManager, terrainDataStyle, layerData) {
					const positionY = Math.random() * 20 - 10 - layerData.baseHeightOffset;
					const realWidth = (terrainDataStyle.peakWidth * (1.1 - Math.random() * 0.2)) * layerData.baseScale;
					const realHeight = (terrainDataStyle.peakHeight + Math.random() * 20 - 10) * layerData.baseScale;
					const peakColor = terrainManager.game.structureManager.MakeColorData(0, 130, 70, 255);
					const structureData = terrainManager.game.structureManager.MakeStructureData(layerData.positionGenerate, positionY, realWidth, realHeight, peakColor);
					return [
						terrainManager.game.structureManager.ModifyStructureData_DrawType_Sin(structureData),
						terrainDataStyle.peakWidth * 0.85 * layerData.baseScale,
					];
				}
			},
			{
				id: 'desert',
				peakWidthBase: 330.0,
				peakWidthRandom: 90.0,
				peakHeightBase: 25.0,
				peakHeightRandom: 35.0,
				CreateStructureData: function (terrainManager, terrainDataStyle, layerData) {
					const positionY = Math.random() * 14 - 4 - layerData.baseHeightOffset;
					const realWidth = (terrainDataStyle.peakWidth * (1.1 - Math.random() * 0.2)) * layerData.baseScale;
					const realHeight = (terrainDataStyle.peakHeight + Math.random() * 14 - 7) * layerData.baseScale;
					const peakColor = terrainManager.game.structureManager.MakeColorData(180, 140, 0, 255);
					const structureData = terrainManager.game.structureManager.MakeStructureData(layerData.positionGenerate, positionY, realWidth, realHeight, peakColor);
					return [
						terrainManager.game.structureManager.ModifyStructureData_DrawType_Sin(structureData),
						terrainDataStyle.peakWidth * 0.6 * layerData.baseScale,
					];
				}
			}
		];
		this.terrainTypeContainer = this.game.MakeTypeContainer(this.terrainTypeList);
		this.terrainLocationBase = this.game.structureManager.MakeLocationData(0, 200);
	}

	Init() {
		this.currentPeakListLayerContainer = [
			{
				layerIndex: 4,
				positionGenerate: 0,
				baseScale: 0.4,
				baseHeightOffset: 61,
				moveSpeedMultiplier: 0.4,
				list: [],
			},
			{
				layerIndex: 3,
				positionGenerate: 0,
				baseScale: 0.6,
				baseHeightOffset: 44,
				moveSpeedMultiplier: 0.6,
				list: [],
			},
			{
				layerIndex: 2,
				positionGenerate: 0,
				baseScale: 0.8,
				baseHeightOffset: 25,
				moveSpeedMultiplier: 0.8,
				list: [],
			},
			{
				layerIndex: 1,
				positionGenerate: 0,
				baseScale: 1.0,
				baseHeightOffset: 0,
				moveSpeedMultiplier: 1.0,
				list: [],
			},
		];
	}

	FinalInit() {
		const stationTerrainData = this.game.stationManager.GetNextStationTerrainData();
		this.GenerateBackgroundTerrain(0.0, stationTerrainData);
	}

	LoadGame(gameData) {
		const terrainData = gameData.terrainData || {};
		this.Init();
	}

	SaveGame(gameData) {
		gameData.terrainData = {};
	}

	Update(deltaTime) {

	}

	UpdateUI() {

	}

	DrawTerrain(trainMoveDistance, stationTerrainData) {
		// 绘制地形外观
		if (trainMoveDistance != 0) {
			this.GenerateBackgroundTerrain(trainMoveDistance, stationTerrainData);
		}
		for (const layerData of this.currentPeakListLayerContainer) {
			for (let index = 0, count = layerData.list.length; index < count; ++index) {
				const terrainStructureData = layerData.list[index];
				this.game.structureManager.ModifyStructureData_MoveX(terrainStructureData, -trainMoveDistance * layerData.moveSpeedMultiplier);
				if (this.game.structureManager.IsStructureOutOfScreen(terrainStructureData, this.terrainLocationBase)) {
					layerData.list.splice(index, 1);
					--index;
					--count;
					continue;
				}
				this.game.structureManager.DrawStructure(this.terrainLocationBase, terrainStructureData);
			}
		}
	}

	GenerateBackgroundTerrain(trainMoveDistance, stationTerrainData) {
		const terrainType = this.terrainTypeContainer[stationTerrainData.terrainID];
		if (terrainType) {
			const screenWidth = this.game.structureManager.GetScreenWidth();
			const terrainStyleData = stationTerrainData.style;
			for (const layerData of this.currentPeakListLayerContainer) {
				layerData.positionGenerate -= trainMoveDistance;
				while (layerData.positionGenerate < screenWidth) {
					const createDataArray = terrainType.CreateStructureData(this, terrainStyleData, layerData);
					layerData.list.push(createDataArray[0]);
					layerData.positionGenerate += createDataArray[1];
				}
			}
		}
	}

	GenerateStationTerrain() {
		const terrainType = this.terrainTypeList[Math.floor(Math.random() * this.terrainTypeList.length)];
		return {
			terrainID: terrainType.id,
			style: {
				peakWidth: terrainType.peakWidthBase + Math.random() * terrainType.peakWidthRandom,
				peakHeight: terrainType.peakHeightBase + Math.random() * terrainType.peakHeightRandom,
				randomSeed: Math.random(),
			}
		}
	}
}