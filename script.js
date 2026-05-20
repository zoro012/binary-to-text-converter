document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const inputArea = document.getElementById('input-area');
    const outputArea = document.getElementById('output-area');
    const tabBin2Text = document.getElementById('tab-bin2text');
    const tabText2Bin = document.getElementById('tab-text2bin');
    const swapBtn = document.getElementById('swap-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const inputStats = document.getElementById('input-stats');
    const outputStats = document.getElementById('output-stats');
    const errorMsg = document.getElementById('error-msg');
    const outputLabel = document.getElementById('output-label');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    // --- State ---
    let currentMode = 'bin2text'; // 'bin2text' or 'text2bin'

    // --- Theme Toggle Logic ---
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

    // Initialize Theme
    const currentTheme = localStorage.getItem('theme') || 'dark'; // Default to dark theme
    if (currentTheme === 'dark') {
        htmlElement.classList.add('dark');
        themeIcon.innerHTML = sunIcon;
    } else {
        htmlElement.classList.remove('dark');
        themeIcon.innerHTML = moonIcon;
    }

    themeToggleBtn.addEventListener('click', () => {
        htmlElement.classList.toggle('dark');
        const isDark = htmlElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeIcon.innerHTML = isDark ? sunIcon : moonIcon;
    });

    // --- Core Conversion Logic ---

    const binaryToText = (binaryStr) => {
        const cleanBinary = binaryStr.replace(/[^01]/g, '');
        let text = '';
        for (let i = 0; i < cleanBinary.length; i += 8) {
            const byte = cleanBinary.slice(i, i + 8);
            if (byte.length === 8) {
                text += String.fromCharCode(parseInt(byte, 2));
            }
        }
        return text;
    };

    const textToBinary = (textStr) => {
        let binary = '';
        for (let i = 0; i < textStr.length; i++) {
            const charCode = textStr.charCodeAt(i);
            const binChar = charCode.toString(2).padStart(8, '0');
            binary += binChar + ' ';
        }
        return binary.trim();
    };

    const validateBinaryInput = (val) => {
        const invalidCharsRegex = /[^01 \n\r\t]/;
        if (val.length > 0 && invalidCharsRegex.test(val)) {
            errorMsg.classList.remove('hidden');
        } else {
            errorMsg.classList.add('hidden');
        }
    };

    const performConversion = () => {
        const val = inputArea.value;
        let result = '';

        if (currentMode === 'bin2text') {
            validateBinaryInput(val);
            result = binaryToText(val);
        } else {
            errorMsg.classList.add('hidden');
            result = textToBinary(val);
        }

        outputArea.value = result;
        updateStats(val, result);
    };

    const updateStats = (inputVal, outputVal) => {
        const inLen = inputVal.length;
        const outLen = outputVal.length;
        inputStats.textContent = `${inLen} character${inLen !== 1 ? 's' : ''}`;
        outputStats.textContent = `${outLen} character${outLen !== 1 ? 's' : ''}`;
    };

    // --- UI Interactions ---

    const activeTabClass = 'px-4 py-2 rounded-xl text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-zinc-900 transition-colors';
    const inactiveTabClass = 'px-4 py-2 rounded-xl text-sm font-bold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors';

    const setMode = (mode) => {
        currentMode = mode;
        
        if (mode === 'bin2text') {
            tabBin2Text.className = activeTabClass;
            tabText2Bin.className = inactiveTabClass;
            inputArea.placeholder = "Paste or type binary code (e.g., 01001000 01101001) here...";
            outputLabel.textContent = "Text Output";
        } else {
            tabText2Bin.className = activeTabClass;
            tabBin2Text.className = inactiveTabClass;
            inputArea.placeholder = "Type normal text here to convert to binary...";
            outputLabel.textContent = "Binary Output";
            errorMsg.classList.add('hidden');
        }

        performConversion();
    };

    // --- Event Listeners ---

    inputArea.addEventListener('input', performConversion);
    tabBin2Text.addEventListener('click', () => setMode('bin2text'));
    tabText2Bin.addEventListener('click', () => setMode('text2bin'));

    swapBtn.addEventListener('click', () => {
        const currentInput = inputArea.value;
        const currentOutput = outputArea.value;
        
        inputArea.value = currentOutput;
        if (currentMode === 'bin2text') {
            setMode('text2bin');
        } else {
            setMode('bin2text');
        }
    });

    clearBtn.addEventListener('click', () => {
        inputArea.value = '';
        outputArea.value = '';
        errorMsg.classList.add('hidden');
        updateStats('', '');
        inputArea.focus();
    });

    copyBtn.addEventListener('click', async () => {
        const textToCopy = outputArea.value;
        if (!textToCopy) return;

        try {
            await navigator.clipboard.writeText(textToCopy);
            
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span id="copy-text">Copied!</span>
            `;
            copyBtn.classList.remove('bg-slate-100', 'hover:bg-slate-200', 'dark:bg-zinc-800', 'dark:hover:bg-zinc-700', 'text-slate-900');
            copyBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-500', 'text-white');

            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.classList.add('bg-slate-100', 'hover:bg-slate-200', 'dark:bg-zinc-800', 'dark:hover:bg-zinc-700', 'text-slate-900');
                copyBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-500', 'text-white');
            }, 2000);
            
        } catch (err) {
            console.error('Failed to copy text: ', err);
            const copyTextSpan = document.getElementById('copy-text');
            if (copyTextSpan) {
                copyTextSpan.textContent = "Error";
                setTimeout(() => {
                    copyTextSpan.textContent = "Copy";
                }, 2000);
            }
        }
    });

    // Initialize UI
    updateStats('', '');
});
