/**
 * RoundedASS - Adds rounded backgrounds to ASS subtitles using JASSUB
 * Browser-only version
 * 
 * @author montagao
 * @version 1.0.0
 */

class RoundedASS {
    /**
     * Create a new RoundedASS instance
     * 
     * @param {Object} options - Configuration options
     * @param {number} options.bgAlpha - Background alpha (0-255, default: 80)
     * @param {string} options.bgColor - Background color in hex without # (default: '000000')
     * @param {string} options.textColor - Text color in hex without # (default: 'FFFFFF')
     * @param {number} options.paddingV - Vertical padding in pixels (default: 10)
     * @param {number} options.paddingH - Horizontal padding in pixels (default: 20)
     * @param {number} options.borderRadius - Border radius in pixels (default: 10)
     * @param {boolean} options.preserveFormatting - Keep original text formatting commands (default: true)
     */
    constructor(options = {}) {
      this.options = {
        bgAlpha: options.bgAlpha ?? 80,
        bgColor: options.bgColor ?? '000000',
        textColor: options.textColor ?? 'FFFFFF',
        paddingV: options.paddingV ?? 10,
        paddingH: options.paddingH ?? 20,
        borderRadius: options.borderRadius ?? 10,
        preserveFormatting: options.preserveFormatting ?? true
      };
      
      this.jassubInstance = null;
    }
  
    /**
     * Initialize JASSUB instance
     * 
     * @param {HTMLVideoElement|null} video - Video element (optional)
     * @param {Object} jassubOptions - Additional JASSUB initialization options
     * @returns {Promise<void>}
     */
    async setJassub(jassubInstance) {
      if (this.jassubInstance) {
        return;
      }
      
      this.jassubInstance = jassubInstance;
    }
    
    /**
     * Parse ASS content into header, styles, and events sections
     * 
     * @param {string} assContent - The ASS file content
     * @returns {Object} - Parsed ASS data
     */
    parseAss(assContent) {
      const sections = {
        header: [],
        styles: [],
        events: []
      };
      
      let currentSection = 'header';
      const lines = assContent.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Check for section markers
        if (trimmedLine.startsWith('[') && trimmedLine.endsWith(']')) {
          if (trimmedLine.toLowerCase() === '[v4+ styles]') {
            currentSection = 'styles';
            sections[currentSection].push(trimmedLine);
          } else if (trimmedLine.toLowerCase() === '[events]') {
            currentSection = 'events';
            sections[currentSection].push(trimmedLine);
          } else {
            currentSection = 'header';
            sections[currentSection].push(trimmedLine);
          }
          continue;
        }
        
        // Add the line to the current section
        sections[currentSection].push(trimmedLine);
      }
      
      return sections;
    }
    
    
    /**
     * Get dimensions for all subtitle events
     * 
     * @returns {Promise<Array>} - Array of dimensions for each event
     */
    async getAllDimensions() {
      return new Promise((resolve, reject) => {
        this.jassubInstance.getAllEventDimensions()
          .then(dimensions => {
            console.log(`Got dimensions for ${dimensions.length} events`);
            resolve(dimensions);
          })
          .catch(err => {
            console.error('Failed to get dimensions:', err);
            reject(err);
          });
      });
    }
    
    /**
     * Extract text content from an ASS dialog line
     * 
     * @param {string} dialogLine - Dialog line from ASS file
     * @returns {Object} - Dialog text and style information
     */
    extractDialogText(dialogLine) {
      if (!dialogLine.startsWith('Dialogue:')) {
        return null;
      }
      
      // Format: Dialogue: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
      const parts = dialogLine.substring('Dialogue:'.length).split(',');
      
      // Text is everything after the 9th comma
      let text = parts.slice(9).join(',').trim();
      let styleOverrides = '';
      
      // Extract style overrides like {\pos(x,y)}
      const styleMatch = text.match(/^{([^}]*)}/);
      if (styleMatch) {
        styleOverrides = styleMatch[0];
        text = text.substring(styleMatch[0].length);
      }
      
      return {
        layer: parseInt(parts[0]),
        start: parts[1].trim(),
        end: parts[2].trim(),
        style: parts[3].trim(),
        name: parts[4].trim(),
        marginL: parts[5].trim(),
        marginR: parts[6].trim(),
        marginV: parts[7].trim(),
        effect: parts[8].trim(),
        text: text,
        styleOverrides: styleOverrides
      };
    }
    
    /**
     * Process an ASS file and add rounded backgrounds
     * 
     * @param {string} assContent - Original ASS file content
     * @returns {Promise<string>} - Modified ASS file content
     */
    async processAss(assContent) {
      // Initialize JASSUB if not already initialized
      if (!this.jassubInstance) {
        await this.initJassub();
      }
      
      // Parse ASS content
      const parsedAss = this.parseAss(assContent);
      
      // Get dimensions for all events
      const dimensions = await this.getAllDimensions();
      
      // Process events
      const originalEvents = parsedAss.events.filter(line => line.startsWith('Dialogue:'));
      const newEvents = [];
      
      // Add a Box-BG style if it doesn't exist
      let hasBoxBgStyle = false;
      for (const line of parsedAss.styles) {
        if (line.startsWith('Style: Box-BG')) {
          hasBoxBgStyle = true;
          break;
        }
      }
      
      if (!hasBoxBgStyle) {
        parsedAss.styles.push(
          `Style: Box-BG,Arial,20,&H${this.options.textColor},&H${this.options.textColor},&H${this.options.textColor},&H${this.options.textColor},0,0,0,0,100,100,0,0,1,0,0,7,0,0,0,0`
        );
      }
      
      // Track which events we've processed
      const processedIndices = new Set();
      
      // Process each dialogue line
      let eventIndex = 0;
      for (let i = 0; i < originalEvents.length; i++) {
        const dialogLine = originalEvents[i];
        const dialog = this.extractDialogText(dialogLine);
        
        // Skip if we couldn't parse the dialog line or it's a drawing
        if (!dialog || dialog.text.includes('\\p1')) {
          newEvents.push(dialogLine);
          continue;
        }
        
        // Check if we have dimensions for this event
        if (eventIndex >= dimensions.length) {
          console.warn(`No dimensions for event ${eventIndex}, using original line`);
          newEvents.push(dialogLine);
          eventIndex++;
          continue;
        }
        
        // Get dimensions for this event
        const dim = dimensions[eventIndex];
        eventIndex++;
        
        // Skip if dimensions are invalid
        if (!dim || dim.width <= 0 || dim.height <= 0) {
          console.warn(`Invalid dimensions for event ${eventIndex-1}, using original line`);
          newEvents.push(dialogLine);
          continue;
        }
        
        // Add padding
        const boxWidth = dim.width + (this.options.paddingH * 2);
        const boxHeight = dim.height + (this.options.paddingV * 2);
        
        // Get half dimensions for drawing
        const halfWidth = boxWidth / 2;
        const halfHeight = boxHeight / 2;
        
        // Check border radius
        const maxRadius = Math.min(halfWidth, halfHeight) - 1;
        const borderRadius = Math.min(this.options.borderRadius, maxRadius);
        
        // Extract position from style overrides or use centered position
        let posX = dim.x + (dim.width / 2);
        let posY = dim.y + (dim.height / 2);
        
        // Create background dialogue
        const bgAlphaHex = this.options.bgAlpha.toString(16).padStart(2, '0');
        
        // Background line with rounded rectangle
        let bgLine = `Dialogue: 0,${dialog.start},${dialog.end},Box-BG,,0,0,0,,{\\pos(${posX},${posY})\\bord0\\shad0\\1c&H${this.options.bgColor}\\1a&H${bgAlphaHex}\\p1}`;
        bgLine += this.generateRoundedRectDrawing(halfWidth, halfHeight, borderRadius);
        bgLine += "{\\p0}";
        
        // Original text line with preserved formatting
        let textLine = `Dialogue: 1,${dialog.start},${dialog.end},${dialog.style},,${dialog.marginL},${dialog.marginR},${dialog.marginV},${dialog.effect},`;
        
        // Add position override if not already present in styleOverrides
        if (!dialog.styleOverrides.includes('\\pos')) {
          textLine += `{\\pos(${posX},${posY})\\an5`;
          if (this.options.preserveFormatting && dialog.styleOverrides) {
            // Extract just the style commands from the overrides, removing the braces
            const styleCommands = dialog.styleOverrides.substring(1, dialog.styleOverrides.length - 1);
            textLine += `\\${styleCommands}`;
          }
          textLine += '}';
        } else if (this.options.preserveFormatting) {
          // Use original style overrides
          textLine += dialog.styleOverrides;
        } else {
          textLine += `{\\an5}`; // Center alignment
        }
        
        textLine += dialog.text;
        
        // Add the new lines
        newEvents.push(bgLine);
        newEvents.push(textLine);
        
        // Mark this event as processed
        processedIndices.add(i);
      }
      
      // Create modified ASS content
      const modifiedAss = [
        ...parsedAss.header,
        ...parsedAss.styles,
        '[Events]',
        'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text',
        ...newEvents
      ].join('\n');
      
      return modifiedAss;
    }
    
    /**
     * Process ASS content from a file input element
     * 
     * @param {HTMLInputElement} fileInput - File input element containing ASS file
     * @returns {Promise<Object>} - Object containing modified ASS content and blob
     */
    async processAssFromInput(fileInput) {
      if (!fileInput.files || fileInput.files.length === 0) {
        throw new Error('No file selected');
      }
      
      const file = fileInput.files[0];
      if (!file.name.endsWith('.ass') && !file.name.endsWith('.ssa')) {
        throw new Error('Selected file is not an ASS/SSA subtitle file');
      }
      
      // Read the file
      const assContent = await this.readFileAsText(file);
      
      // Process the ASS content
      const modifiedAss = await this.processAss(assContent);
      
      // Create a blob with the modified content
      const blob = new Blob([modifiedAss], { type: 'text/plain' });
      
      return {
        content: modifiedAss,
        blob: blob,
        url: URL.createObjectURL(blob),
        filename: file.name.replace(/\.ass$|\.ssa$/, '-rounded$&')
      };
    }
    
    /**
     * Read a file as text
     * 
     * @param {File} file - File object
     * @returns {Promise<string>} - File content as text
     */
    readFileAsText(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });
    }
    
    /**
     * Save the modified ASS content as a file for download
     * 
     * @param {string} assContent - ASS file content
     * @param {string} filename - Name for the downloaded file
     */
    downloadAss(assContent, filename = 'subtitles-rounded.ass') {
      const blob = new Blob([assContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    }
    
    /**
     * Clean up resources
     */
    dispose() {
      if (this.jassubInstance) {
        this.jassubInstance.dispose();
        this.jassubInstance = null;
      }
    }
  }
  
  // Export for browser environment
  window.RoundedASS = RoundedASS;