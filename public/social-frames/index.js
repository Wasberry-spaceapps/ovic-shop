document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const canvas = document.getElementById('output-canvas');
    const ctx = canvas.getContext('2d');
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const charCounter = document.getElementById('char-counter');
    const templateCards = document.querySelectorAll('.template-card');
    const fontFamilySelect = document.getElementById('font-family');
    const fontWeightSelect = document.getElementById('font-weight');
    const fontStyleSelect = document.getElementById('font-style');
    const fontSizeSlider = document.getElementById('font-size');
    const fontSizeVal = document.getElementById('font-size-val');
    const lineHeightSlider = document.getElementById('line-height');
    const lineHeightVal = document.getElementById('line-height-val');
    const safeMarginSlider = document.getElementById('safe-margin');
    const safeMarginVal = document.getElementById('safe-margin-val');
    const downloadBtn = document.getElementById('download-btn');
    const colorSwatches = document.querySelectorAll('.color-swatch');

    // Cached Frame Backgrounds
    const frames = {
        calligraphy: new Image(),
        vintage: new Image(),
        modern: new Image()
    };

    // Keep track of loaded status
    const loadedImages = {
        calligraphy: false,
        vintage: false,
        modern: false
    };

    // Load assets
    frames.calligraphy.src = 'assets/frame_calligraphy.jpg';
    frames.vintage.src = 'assets/frame_vintage.jpg';
    frames.modern.src = 'assets/frame_modern.jpg';

    // Set onload handlers
    Object.keys(frames).forEach(key => {
        frames[key].onload = () => {
            loadedImages[key] = true;
            if (key === getActiveTemplate()) {
                draw();
            }
        };
    });

    // Helper: Get active template key
    function getActiveTemplate() {
        const activeRadio = document.querySelector('input[name="template"]:checked');
        return activeRadio ? activeRadio.value : 'calligraphy';
    }

    // Helper: Get active text color
    function getActiveColor() {
        const activeRadio = document.querySelector('input[name="text-color"]:checked');
        return activeRadio ? activeRadio.value : '#1a1a1a';
    }

    // Wrap text based on maxWidth
    function getWrappedLines(context, text, maxWidth) {
        const paragraphs = text.split('\n');
        const lines = [];

        for (const para of paragraphs) {
            if (para.trim() === '') {
                lines.push('');
                continue;
            }

            const words = para.split(' ');
            let currentLine = '';

            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                const testLine = currentLine ? currentLine + ' ' + word : word;
                const metrics = context.measureText(testLine);

                if (metrics.width > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            if (currentLine) {
                lines.push(currentLine);
            }
        }
        return lines;
    }

    // Main Draw Function
    function draw() {
        const templateKey = getActiveTemplate();
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw Background Image
        if (loadedImages[templateKey]) {
            ctx.drawImage(frames[templateKey], 0, 0, canvas.width, canvas.height);
        } else {
            // Placeholder background if still loading
            ctx.fillStyle = '#f7f5f0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#888';
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Loading template background...', canvas.width / 2, canvas.height / 2);
            return;
        }

        // 2. Fetch Text and Settings
        const text = quoteText.value.trim();
        const author = quoteAuthor.value.trim();
        const fontFamily = fontFamilySelect.value;
        const fontWeight = fontWeightSelect.value;
        const fontStyle = fontStyleSelect.value;
        const color = getActiveColor();
        
        const initialFontSize = parseInt(fontSizeSlider.value, 10);
        const lineSpacing = parseFloat(lineHeightSlider.value);
        const sideMargin = parseInt(safeMarginSlider.value, 10);

        if (!text) {
            // Draw a subtle placeholder hint on canvas if empty
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            ctx.font = `italic 300 32px ${fontFamily}`;
            ctx.textAlign = 'center';
            ctx.fillText('Your quote will appear here...', canvas.width / 2, canvas.height / 2);
            return;
        }

        const maxWidth = canvas.width - (sideMargin * 2);
        
        // Define safe vertical bounds (e.g. Y=240 to Y=840 is the 600px safe middle zone)
        const safeHeight = 600; 

        // 3. Render Text with Auto-Scale Down Logic
        let fontSize = initialFontSize;
        let lines = [];
        let lhQuote = 0;
        let lhAuthor = 0;
        let authorFontSize = 0;
        let spacer = 0;
        let totalHeight = 0;

        while (fontSize >= 18) {
            ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
            lines = getWrappedLines(ctx, text, maxWidth);

            lhQuote = fontSize * lineSpacing;
            authorFontSize = fontSize * 0.72; // author font is scaled to 72%
            lhAuthor = authorFontSize * 1.4;
            spacer = fontSize * 0.8; // gap between quote and author

            totalHeight = lines.length * lhQuote;
            if (author) {
                totalHeight += spacer + lhAuthor;
            }

            if (totalHeight <= safeHeight) {
                break; // Fits within the safe boundaries!
            }
            fontSize--; // Try slightly smaller
        }

        // Draw with resolved font details
        ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Calculate Y starting position to vertically center the block
        let startY = (canvas.height / 2) - (totalHeight / 2);

        // Draw the quote lines
        for (let i = 0; i < lines.length; i++) {
            if (lines[i] !== '') {
                ctx.fillText(lines[i], canvas.width / 2, startY);
            }
            startY += lhQuote;
        }

        // Draw the author line
        if (author) {
            startY += spacer;
            // Draw author in normal style (non-italic) but matching weight
            ctx.font = `normal ${fontWeight} ${authorFontSize}px ${fontFamily}`;
            ctx.fillText(`— ${author}`, canvas.width / 2, startY);
        }
    }

    // Event Listeners for Live Updates
    quoteText.addEventListener('input', () => {
        const count = quoteText.value.length;
        charCounter.textContent = `${count} / 220`;
        
        // Visual indicator warning if close to limit
        if (count >= 200) {
            charCounter.classList.add('warning');
        } else {
            charCounter.classList.remove('warning');
        }
        draw();
    });

    quoteAuthor.addEventListener('input', draw);
    fontFamilySelect.addEventListener('change', draw);
    fontWeightSelect.addEventListener('change', draw);
    fontStyleSelect.addEventListener('change', draw);

    // Slider inputs
    fontSizeSlider.addEventListener('input', () => {
        fontSizeVal.textContent = `${fontSizeSlider.value}px`;
        draw();
    });

    lineHeightSlider.addEventListener('input', () => {
        lineHeightVal.textContent = `${lineHeightSlider.value}`;
        draw();
    });

    safeMarginSlider.addEventListener('input', () => {
        safeMarginVal.textContent = `${safeMarginSlider.value}px`;
        draw();
    });

    // Template selection cards logic
    templateCards.forEach(card => {
        card.addEventListener('click', () => {
            templateCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const radio = card.querySelector('input[type="radio"]');
            radio.checked = true;
            
            draw();
        });
    });

    // Ink Color selection swatches logic
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            colorSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            
            const radio = swatch.querySelector('input[type="radio"]');
            radio.checked = true;
            
            draw();
        });
    });

    // Download Image Trigger
    downloadBtn.addEventListener('click', () => {
        if (!quoteText.value.trim()) {
            alert('Please write a quote before downloading.');
            return;
        }

        // Create high-res download filename
        const authorClean = quoteAuthor.value.trim().toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 15);
        const fileName = `book_quote_${authorClean ? authorClean + '_' : ''}${Date.now()}.png`;

        // Trigger file download
        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // Initial canvas render
    draw();
});
