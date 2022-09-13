
/* eslint-disable */
import Layout from '../../data/layout';


const state = {
	layout: Layout,
	sidebarType: localStorage.getItem('SidebarType') || 'default',
	boxlayout: true,
	shouldAddStyles: false
};

// getters
const getters = {

};

// mutations
const mutations = {
	set: (state) => {
		document.body.className = state.layout.color.mix_layout + " " + state.layout.settings.layout_type;
		document.body.setAttribute('main-theme-layout', state.layout.settings.layout_type);
		document.getElementsByTagName('html')[0].setAttribute('dir', state.layout.settings.layout_type);
		let primaryColor = localStorage.getItem('primary_color') || state.layout.color.primary_color;
		let secondaryColor = localStorage.getItem('secondary_color') || state.layout.color.secondary_color;
		let layoutVersion = localStorage.getItem('layoutVersion') || state.layout.color.layout_version;
		if ((primaryColor || secondaryColor) && state.shouldAddStyles) {
			addStyle(primaryColor, secondaryColor);
			if (layoutVersion)
				document.body.className = layoutVersion;
		}
	},
	setLayoutType: (state, payload) => {
		document.body.setAttribute('main-theme-layout', payload);
		if (payload == 'ltr') {
			document.body.classList.remove('rtl');
		} else if (payload == 'rtl') {
			document.body.classList.add(payload);
		}
		state.layout.settings.layout_type = payload;
		document.getElementsByTagName('html')[0].setAttribute('dir', payload);
	},
	setLayout: (state, payload) => {
		if (payload == 'light-only') {
			document.body.classList.remove('dark-only')
		}
		if (payload == 'dark-only') {
			document.body.classList.remove('light-only')
		}
		document.body.classList.add(payload);
	},
	setColorScheme: (state, payload) => {
		setColor(state, payload);
		state.primaryColor = payload.primary;
		state.secondaryColor = payload.secondary;
		state.layout.color.layout_version = 'light';
		localStorage.setItem('layoutVersion', state.layout.color.layout_version);
	},
	setColorDarkScheme: (state, payload) => {
		setColor(state, payload);
		state.layout.color.layout_version = 'dark-only';
		localStorage.setItem('layoutVersion', state.layout.color.layout_version);
	},
	setCustomizeSidebarType: (state, payload) => {
		localStorage.setItem('SidebarType', payload);
	}
};

// actions
const actions = {
	set: (context) => {
		context.commit('set');
	},
	setLayoutType: (context, payload) => {
		context.commit('setLayoutType', payload);
	},
	setLayout: (context, payload) => {
		context.commit('setLayout', payload);
	},
	setColorScheme: (context, payload) => {
		context.commit('setColorScheme', payload);
	},
	setColorDarkScheme: (context, payload) => {
		context.commit('setColorDarkScheme', payload);
	},
	setCustomizeSidebarType: (context, payload) => {
		context.commit('setCustomizeSidebarType', payload);
	}
};

function addStyle(primary, secondary) {
	document.documentElement.style.setProperty('--theme-default', primary);
	document.documentElement.style.setProperty('--theme-secondary', secondary);
}

function setColor(state, color) {
	if (state.shouldAddStyles) {
		addStyle(color.primary, color.secondary);
	}
	localStorage.setItem('primary_color', color.primary);
	localStorage.setItem('secondary_color', color.secondary);
	window.location.reload();
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
};
