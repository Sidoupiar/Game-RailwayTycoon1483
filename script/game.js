class MainGameManager {
	constructor() {
		this.gameSaveID = 'railwayTycoonSave';
		// 用于清除存档
		//localStorage.setItem(this.gameSaveID, false);
		// 初始化数据
		this.money = 20000;
		this.gameSpeed = 1;
		this.structureManager = new StructureManager(this);
		this.rarityManager = new RarityManager(this);
		this.cargoManager = new CargoManager(this);
		this.weatherManager = new WeatherManager(this);
		this.eventManager = new EventManager(this);
		this.terrainManager = new TerrainManager(this);
		this.stationManager = new StationManager(this);
		this.trainManager = new TrainManager(this);
		this.Init();
	}

	Init() {
		if (!this.LoadGame()) {
			this.structureManager.Init();
			this.rarityManager.Init();
			this.cargoManager.Init();
			this.weatherManager.Init();
			this.eventManager.Init();
			this.terrainManager.Init();
			this.stationManager.Init();
			this.trainManager.Init();
			this.SaveGame();
			this.ApplyWeatherEffect();
		}
		document.getElementById('autoDriveButton').addEventListener('click', () => {
			this.trainManager.SwitchAutoDrive();
		});
		document.getElementById('autoTradeButton').addEventListener('click', () => {
			this.trainManager.SwitchAutoTrade();
		});
		document.getElementById('manualDriveButton').addEventListener('click', () => {
			this.trainManager.SwitchManualDrive();
		});
		this.FinalInit();
		this.GameLoop();
	}

	FinalInit() {
		this.structureManager.FinalInit();
		this.rarityManager.FinalInit();
		this.cargoManager.FinalInit();
		this.weatherManager.FinalInit();
		this.eventManager.FinalInit();
		this.terrainManager.FinalInit();
		this.stationManager.FinalInit();
		this.trainManager.FinalInit();
	}

	LoadGame() {
		const savedGame = localStorage.getItem(this.gameSaveID);
		if (savedGame) {
			const gameData = JSON.parse(savedGame);
			this.money = gameData.money || 20000;
			this.gameSpeed = gameData.gameSpeed || 1;
			this.structureManager.LoadGame(gameData);
			this.rarityManager.LoadGame(gameData)
			this.cargoManager.LoadGame(gameData);
			this.weatherManager.LoadGame(gameData);
			this.eventManager.LoadGame(gameData);
			this.terrainManager.LoadGame(gameData);
			this.stationManager.LoadGame(gameData);
			this.trainManager.LoadGame(gameData);
			return true;
		} else {
			return false;
		}
	}

	SaveGame() {
		const gameData = {
			money: this.money,
			gameSpeed: this.gameSpeed,
		};
		this.structureManager.SaveGame(gameData);
		this.rarityManager.SaveGame(gameData);
		this.cargoManager.SaveGame(gameData);
		this.weatherManager.SaveGame(gameData);
		this.eventManager.SaveGame(gameData);
		this.terrainManager.SaveGame(gameData);
		this.stationManager.SaveGame(gameData);
		this.trainManager.SaveGame(gameData);
		localStorage.setItem(this.gameSaveID, JSON.stringify(gameData));
	}

	ApplyDialog(title, content, duration) {
		const dialogPanel = document.getElementById('dialog');
		if (!dialogPanel.classList.contains('hidden')) {
			return;
		}
		dialogPanel.querySelector('.dialog-title').textContent = title;
		dialogPanel.querySelector('.dialog-content').textContent = content;
		dialogPanel.classList.remove('hidden');
		const dialogHiddenFunction = function () {
			dialogPanel.classList.add('hidden');
		}
		dialogPanel.querySelector('.dialog-button').addEventListener('click', dialogHiddenFunction);
		if (duration > 1000) {
			setTimeout(() => {
				dialogPanel.classList.add('hidden');
				dialogPanel.querySelector('.dialog-title').textContent = '';
				dialogPanel.querySelector('.dialog-content').textContent = '';
				dialogPanel.querySelector('.dialog-button').removeEventListener('click', dialogHiddenFunction);
			}, duration);
		} else {
			setTimeout(() => {
				dialogPanel.classList.add('hidden');
				dialogPanel.querySelector('.dialog-title').textContent = '';
				dialogPanel.querySelector('.dialog-content').textContent = '';
				dialogPanel.querySelector('.dialog-button').removeEventListener('click', dialogHiddenFunction);
			}, 1000);
		}
	}

	ApplyNotification(title, content, duration) {
		const notificationPanel = document.getElementById('notification');
		if (notificationPanel.classList.contains('notification-show')) {
			return;
		}
		notificationPanel.querySelector('.notification-title').textContent = title;
		notificationPanel.querySelector('.notification-content').textContent = content;
		notificationPanel.classList.add('notification-show');
		if (duration > 1000) {
			setTimeout(() => {
				notificationPanel.classList.remove('notification-show');
				notificationPanel.querySelector('.notification-title').textContent = '';
				notificationPanel.querySelector('.notification-content').textContent = '';
			}, duration);
		} else {
			setTimeout(() => {
				notificationPanel.classList.remove('notification-show');
				notificationPanel.querySelector('.notification-title').textContent = '';
				notificationPanel.querySelector('.notification-content').textContent = '';
			}, 1000);
		}
	}

	ApplyWeatherEffect() {
		this.stationManager.ApplyWeatherEffect();
		this.trainManager.ApplyWeatherEffect();
	}

	Update() {
		const deltaTime = 1;
		this.structureManager.Update(deltaTime);
		this.rarityManager.Update(deltaTime);
		this.cargoManager.Update(deltaTime);
		this.weatherManager.Update(deltaTime);
		this.eventManager.Update(deltaTime);
		this.terrainManager.Update(deltaTime);
		this.stationManager.Update(deltaTime);
		this.trainManager.Update(deltaTime);
	}

	UpdateUI() {
		this.structureManager.UpdateUI();
		this.trainManager.UpdateUI();
		this.stationManager.UpdateUI();
		this.terrainManager.UpdateUI();
		this.eventManager.UpdateUI();
		this.weatherManager.UpdateUI();
		this.cargoManager.UpdateUI();
		this.rarityManager.UpdateUI();
		// 系统界面更新
		document.getElementById('moneyDisplay').textContent = `$${this.money}`;
	}

	GameLoop() {
		// 更新数据
		this.Update();
		this.UpdateUI();
		// 继续主循环
		requestAnimationFrame(() => this.GameLoop());
	}

	MakeTypeContainer(typeList) {
		const container = {};
		for (const type of typeList) {
			container[type.id] = type;
		}
		return container;
	}

	MakeElement(baseElement, elementType, className, innerHTML) {
		const element = document.createElement(elementType);
		element.className = className;
		if (innerHTML !== '') {
			element.innerHTML = innerHTML;
		}
		baseElement.appendChild(element);
		return element;
	}
}

// 页面加载完毕后启动游戏
document.addEventListener('DOMContentLoaded', () => {
	window.game = new MainGameManager();
});