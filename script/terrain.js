class TerrainManager {
	constructor(game) {
		this.game = game;
		this.terrainTypeList = [
			{
				id: 'plain',
				CreateElement: function (randomSeed, layerIndex) {
					return {}
				}
			},
			{
				id: 'mountain',
				CreateElement: function (randomSeed, layerIndex) {
					return {}
				}
			},
			{
				id: 'desert',
				CreateElement: function (randomSeed, layerIndex) {
					return {}
				}
			}
		];
		this.terrainTypeContainer = this.game.MakeTypeContainer(this.terrainTypeList);
	}

	Init() {
		this.currentTerrain = 'plain';
	}

	LoadGame(gameData) {
		const terrainData = gameData.terrainData || {};
		this.currentTerrain = terrainData.currentTerrain || 'plain';
	}

	SaveGame(gameData) {
		gameData.terrainData = {
			currentTerrain: this.currentTerrain,
		};
	}

	Update(deltaTime) {

	}

	UpdateUI(canvasElementContext) {

	}

	DrawTerrain(canvasElementContext, trainLocationBase, distanceToStationCurrent, stationTerrainData) {
		// 绘制地形外观
	}

	GenerateStationTerrain() {
		const terrainType = this.terrainTypeList[Math.floor(Math.random() * this.terrainTypeList.length)];
		return {
			terrain: terrainType.id,
			randomSeed: Math.random(),
		}
	}
}