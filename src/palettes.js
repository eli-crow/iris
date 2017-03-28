const mathutils = require('./mathutils.js');

module.exports = [
	{
		name: 'Colors',
		enabled: true,
		fragmentSource: require('../shaders/frag/same_lightness.frag'),
		properties: {
			lightness: {
				type: '1f', 
				icon: 'lightness',
				value: 77, 
				min: 0,
				max: 100, 
				step: 0.01,
				classes: 'lightness'
			}
		}
	},
	{
		name: 'Colors 2',
		enabled: true,
		fragmentSource: require('../shaders/frag/same_lightness_hsl.frag'),
		properties: {
			lightness: {
				type: '1f',
				icon: 'lightness',
				value: .77, 
				min: 0,
				max: 1, 
				step: 0.01,
				classes: 'lightness'
			}
		}
	},
	{
		name: 'Tones',
		enabled: true,
		fragmentSource: require('../shaders/frag/same_hue.frag'),
		properties: {
			hue: {
				type: '1f', 
				icon: 'hue',
				value: 0, 
				min: 0,
				max: 360, 
				step: 0.01,
				map: x => mathutils.radians(x),
				unmap: x => mathutils.degrees(x),
				classes: 'hue'
			}
		}
	}
];