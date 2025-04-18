const { app, BrowserWindow, Menu, shell, ipcMain } = require("electron");

function CreateWindow() {
	// 创建浏览器窗口
	const window = new BrowserWindow({
		Title: '铁路大亨 1483',
		width: 1600,
		height: 900,
		minWidth: 800,
		minHeight: 450,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
		resizable: false,
	});
	window.loadFile('index.html');
	//window.webContents.openDevTools();
}

app.whenReady().then(CreateWindow);

const list_MenuData = [
	{
		label: '控制',
		submenu: [
			{
				label: '重新开始（还没做）',
				click: function () {
					console.log('重新开始');
				}
			}
		],
	}
];

Menu.setApplicationMenu(Menu.buildFromTemplate(list_MenuData));