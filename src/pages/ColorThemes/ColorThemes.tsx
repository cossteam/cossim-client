import { useState } from 'react'
import { Navbar, Page, BlockTitle, Block, Checkbox, f7 } from 'framework7-react'
import { getCookie, setCookie } from '@/utils/cookie'
import { THEME } from '@/shared'

let globalTheme = getCookie(THEME) || 'light'
// let globalThemeColor = $('html').css('--f7-color-primary').trim();

const ColorThemes = () => {
	// const colors = Object.keys(f7.colors).filter(
	// 	(c) => c !== 'primary' && c !== 'white' && c !== 'black',
	// );

	const [theme, setTheme] = useState(globalTheme)
	// const [themeColor, setThemeColor] = useState(globalThemeColor);

	const setScheme = (newTheme: string) => {
		f7.setDarkMode(newTheme === 'dark')
		globalTheme = newTheme
		setTheme(newTheme)
		localStorage.setItem('theme', newTheme)
		if (newTheme == 'dark') {
			document.documentElement.setAttribute('theme', 'dark')
			setCookie(THEME, 'dark')
		} else {
			document.documentElement.removeAttribute('theme')
			setCookie(THEME, 'light')
		}
	}

	// const setColorTheme = (newColor: string) => {
	// 	globalThemeColor = f7.colors[newColor];
	// 	setThemeColor(globalThemeColor);
	// 	f7.setColorTheme(globalThemeColor);
	//
	// };
	//
	// const setCustomColor = (newColor: string) => {
	// 	globalThemeColor = newColor;
	// 	setThemeColor(globalThemeColor);
	// 	f7.setColorTheme(globalThemeColor);
	// };

	return (
		<Page noToolbar>
			<Navbar backLink></Navbar>
			<BlockTitle medium>主题</BlockTitle>
			<Block strong>
				<p>布局主题:浅色(默认)和深色:</p>
				<div className="grid grid-cols-2 h-20 grid-gap">
					<div
						className="bg-color-white demo-theme-picker rounded-md border-2"
						onClick={() => setScheme('light')}
					>
						{theme === 'light' && <Checkbox checked disabled />}
					</div>
					<div className="bg-color-black rounded-md demo-theme-picker" onClick={() => setScheme('dark')}>
						{theme === 'dark' && <Checkbox checked disabled />}
					</div>
				</div>
			</Block>

			{/*<BlockTitle medium>默认颜色主题</BlockTitle>*/}
			{/*<Block strong>*/}
			{/*	<div className="grid grid-cols-3 medium-grid-cols-2 large-grid-cols-5 grid-gap">*/}
			{/*		{colors.map((color, index) => (*/}
			{/*			<div key={index}>*/}
			{/*				<Button*/}
			{/*					fill*/}
			{/*					round*/}
			{/*					small*/}
			{/*					className="demo-color-picker-button"*/}
			{/*					color={color}*/}
			{/*					onClick={() => setColorTheme(color)}*/}
			{/*				>*/}
			{/*					{color}*/}
			{/*				</Button>*/}
			{/*			</div>*/}
			{/*		))}*/}
			{/*	</div>*/}
			{/*</Block>*/}
			{/*<BlockTitle medium>自定义颜色主题</BlockTitle>*/}
			{/*<List strongIos outlineIos>*/}
			{/*	<ListInput*/}
			{/*		type="colorpicker"*/}
			{/*		label="HEX Color"*/}
			{/*		placeholder="e.g. #ff0000"*/}
			{/*		readonly*/}
			{/*		value={{ hex: themeColor }}*/}
			{/*		onColorPickerChange={(value) => setCustomColor(value.hex)}*/}
			{/*		colorPickerParams={{*/}
			{/*			targetEl: '#color-theme-picker-color',*/}
			{/*		}}*/}
			{/*	>*/}
			{/*		<div*/}
			{/*			slot="media"*/}
			{/*			id="color-theme-picker-color"*/}
			{/*			style={{*/}
			{/*				width: '28px',*/}
			{/*				height: '28px',*/}
			{/*				borderRadius: '4px',*/}
			{/*				background: 'var(--f7-theme-color)',*/}
			{/*			}}*/}
			{/*		></div>*/}
			{/*	</ListInput>*/}
			{/*</List>*/}
		</Page>
	)
}

export default ColorThemes
