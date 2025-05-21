import subsrt from 'subsrt-ts';

// Create a mock transcription data object
const transcriptionData = {
  transcription: [
    {
      text: "And so my fellow Americans ask not what your country can do for you, ask what you can do for your country.",
      timestamps: {
        from: "00:00:01.500",
        to: "00:00:08.000"
      }
    },
    {
      text: "My fellow citizens of the world: ask not what America will do for you, but what together we can do for the freedom of man.",
      timestamps: {
        from: "00:00:08.500",
        to: "00:00:15.750"
      }
    }
  ]
};

// Our updated convertToSRT function
function convertToSRT() {
  if (!transcriptionData?.transcription?.length) return '';
  
  try {
    // Helper function to convert time format "00:00:00.000" to milliseconds
    const convertTimeToMs = (timeString) => {
      if (!timeString) return 0;
      
      // Handle "00:00:00.000" format
      const parts = timeString.split(':');
      if (parts.length !== 3) return 0;
      
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const seconds = parseFloat(parts[2]);
      
      return (hours * 3600 + minutes * 60 + seconds) * 1000;
    };
    
    // Create captions with milliseconds for proper subsrt-ts support
    const captions = transcriptionData.transcription.map((segment, index) => {
      return {
        type: 'caption',
        index: index + 1,
        // Convert timestamps to milliseconds for reliable processing
        start: convertTimeToMs(segment.timestamps.from),
        end: convertTimeToMs(segment.timestamps.to),
        content: segment.text.trim(),
        text: segment.text.trim()
      };
    });
    
    // Build SRT content using subsrt-ts
    return subsrt.build(captions);
  } catch (error) {
    console.error('Error generating SRT format:', error);
    // Fallback to manual conversion if subsrt-ts fails
    return transcriptionData.transcription
      .map((segment, index) => {
        const segmentIndex = index + 1;
        const timeRange = segment.timestamps.from + " --> " + segment.timestamps.to;
        const content = segment.text.trim();
        
        return segmentIndex + "\n" + timeRange + "\n" + content + "\n";
      })
      .join('\n');
  }
}

// Print the SRT output to verify our fix
const srtContent = convertToSRT();
console.log("Generated SRT content:");
console.log(srtContent);
