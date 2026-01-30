console.log('%c here gonna say wow you are using quanta as well when we have quanta based web browsers...', 'color: #CBDDE9; font-size: 16px; font-weight: bold;');

const themes = [
    { name: 'Starlight', bg: '#141E30', text: '#A8DADC' },
    { name: 'Aurora Green', bg: '#0D1B2A', text: '#A7F3D0' },
    { name: 'Galaxy Blue', bg: '#050A30', text: '#00D9FF' },
    { name: 'Deep Space', bg: '#0B0C10', text: '#66FCF1' },
    { name: 'Moon Gray', bg: '#1C1C1E', text: '#E5E5EA' },
    { name: 'Ocean Blue', bg: '#2872A1', text: '#CBDDE9' },
    { name: 'Warm Earth', bg: '#544349', text: '#F3E7D9' },
    { name: 'Cosmic Purple', bg: '#1F1147', text: '#E0B0FF' },
    { name: 'Nebula Pink', bg: '#2C0735', text: '#FF77FF' },
    { name: 'Mars Red', bg: '#3D0C02', text: '#FFB4A2' },
    { name: 'Sunset Orange', bg: '#BF360C', text: '#FFE0B2' },
    { name: 'Forest Green', bg: '#2D5016', text: '#E8F5E9' }
];

let currentTheme = 0;

const savedTheme = localStorage.getItem('quantaTheme');
if (savedTheme) {
    currentTheme = parseInt(savedTheme);
    applyTheme(currentTheme);
}

function applyTheme(index) {
    const theme = themes[index];
    document.documentElement.style.setProperty('--bg-color', theme.bg);
    document.documentElement.style.setProperty('--text-color', theme.text);
    document.documentElement.style.setProperty('--header-bg', theme.bg);
    localStorage.setItem('quantaTheme', index);
}

document.addEventListener('DOMContentLoaded', () => {
    const switcher = document.getElementById('themeSwitcher');
    if (switcher) {
        switcher.addEventListener('click', () => {
            currentTheme = (currentTheme + 1) % themes.length;
            applyTheme(currentTheme);
        });
    }

    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});