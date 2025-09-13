import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const allieTodayTheme: CustomThemeConfig = {
	name: 'allie-today',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': `Rubik`,
		'--theme-font-family-heading': `Rubik`,
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '9999px',
		'--theme-rounded-container': '8px',
		'--theme-border-base': '1px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '255 255 255',
		'--on-secondary': '255 255 255',
		'--on-tertiary': '0 0 0',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '255 255 255',
		'--on-surface': '255 255 255',
		// =~= Theme Colors  =~=
		// primary | #8B5CF6 (soft purple - playful and modern)
		'--color-primary-50': '238 236 254', // #eeecfe
		'--color-primary-100': '232 229 253', // #e8e5fd
		'--color-primary-200': '226 223 253', // #e2dffd
		'--color-primary-300': '209 203 251', // #d1cbfb
		'--color-primary-400': '174 164 248', // #aea4f8
		'--color-primary-500': '139 92 246', // #8B5CF6
		'--color-primary-600': '125 83 221', // #7d53dd
		'--color-primary-700': '104 69 185', // #6845b9
		'--color-primary-800': '83 55 148', // #533794
		'--color-primary-900': '68 45 121', // #442d79
		// secondary | #EC4899 (warm pink - friendly and energetic)
		'--color-secondary-50': '252 228 240', // #fce4f0
		'--color-secondary-100': '251 219 235', // #fbdbeb
		'--color-secondary-200': '250 210 230', // #fad2e6
		'--color-secondary-300': '247 182 214', // #f7b6d6
		'--color-secondary-400': '242 128 184', // #f280b8
		'--color-secondary-500': '236 72 153', // #EC4899
		'--color-secondary-600': '213 65 138', // #d5418a
		'--color-secondary-700': '177 54 115', // #b13673
		'--color-secondary-800': '142 43 92', // #8e2b5c
		'--color-secondary-900': '116 35 75', // #74234b
		// tertiary | #14B8A6 (teal - calming and natural)
		'--color-tertiary-50': '220 244 242', // #dcf4f2
		'--color-tertiary-100': '208 241 237', // #d0f1ed
		'--color-tertiary-200': '196 237 233', // #c4ede9
		'--color-tertiary-300': '161 227 219', // #a1e3db
		'--color-tertiary-400': '91 205 193', // #5bcdc1
		'--color-tertiary-500': '20 184 166', // #14B8A6
		'--color-tertiary-600': '18 166 149', // #12a695
		'--color-tertiary-700': '15 138 125', // #0f8a7d
		'--color-tertiary-800': '12 110 100', // #0c6e64
		'--color-tertiary-900': '10 90 81', // #0a5a51
		// success | #10B981 (green - natural and positive)
		'--color-success-50': '219 245 236', // #dbf5ec
		'--color-success-100': '207 241 230', // #cff1e6
		'--color-success-200': '195 238 224', // #c3eee0
		'--color-success-300': '159 227 205', // #9fe3cd
		'--color-success-400': '88 207 167', // #58cfa7
		'--color-success-500': '16 185 129', // #10B981
		'--color-success-600': '14 167 116', // #0ea774
		'--color-success-700': '12 139 97', // #0c8b61
		'--color-success-800': '10 111 77', // #0a6f4d
		'--color-success-900': '8 91 63', // #085b3f
		// warning | #F59E0B (amber - warm and attention-grabbing)
		'--color-warning-50': '254 240 219', // #fef0db
		'--color-warning-100': '253 236 207', // #fdecce
		'--color-warning-200': '253 231 195', // #fde7c3
		'--color-warning-300': '251 216 158', // #fbd89e
		'--color-warning-400': '249 187 86', // #f9bb56
		'--color-warning-500': '245 158 11', // #F59E0B
		'--color-warning-600': '221 142 10', // #dd8e0a
		'--color-warning-700': '184 119 8', // #b87708
		'--color-warning-800': '147 95 7', // #935f07
		'--color-warning-900': '120 77 5', // #784d05
		// error | #EF4444 (red - clear but not harsh)
		'--color-error-50': '253 227 227', // #fde3e3
		'--color-error-100': '252 218 218', // #fcdada
		'--color-error-200': '251 208 208', // #fbd0d0
		'--color-error-300': '249 180 180', // #f9b4b4
		'--color-error-400': '244 124 124', // #f47c7c
		'--color-error-500': '239 68 68', // #EF4444
		'--color-error-600': '215 61 61', // #d73d3d
		'--color-error-700': '179 51 51', // #b33333
		'--color-error-800': '143 41 41', // #8f2929
		'--color-error-900': '117 33 33', // #752121
		// surface | #14532D (deep forest green - natural and earthy)
		'--color-surface-50': '220 229 224', // #dce5e0
		'--color-surface-100': '208 221 213', // #d0ddd5
		'--color-surface-200': '196 212 203', // #c4d4cb
		'--color-surface-300': '161 186 171', // #a1baab
		'--color-surface-400': '91 135 108', // #5b876c
		'--color-surface-500': '20 83 45', // #14532D
		'--color-surface-600': '18 75 41', // #124b29
		'--color-surface-700': '15 62 34', // #0f3e22
		'--color-surface-800': '12 50 27', // #0c321b
		'--color-surface-900': '10 41 22' // #0a2916
	}
};
