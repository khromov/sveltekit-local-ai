import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFile } from 'fs/promises';
import subsrt from 'subsrt-ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to log the first transcription segment to analyze its format
async function loadSampleTranscription() {
  try {
    // Create a fake transcription result with timestamp similar to what we'd expect
    const transcriptionData = {
      transcription: [
        {
          text: "This is a sample text.",
          timestamps: {
            from: "00:00:01.000", // Note the period instead of comma
            to: "00:00:05.000"
          }
        }
      ]
    };
    
    console.log('Sample timestamp format:');
    console.log(JSON.stringify(transcriptionData.transcription[0].timestamps, null, 2));
    
    // Try to use subsrt directly on the transcription
    const captions = transcriptionData.transcription.map((segment, index) => {
      return {
        type: 'caption',
        index: index + 1,
        start: segment.timestamps.from,
        end: segment.timestamps.to,
        content: segment.text.trim(),
        text: segment.text.trim()
      };
    });
    
    // Test the SRT generation
    try {
      const srtContent = subsrt.build(captions);
      console.log('\nGenerated SRT:');
      console.log(srtContent);
    } catch (error) {
      console.error('Error building SRT:', error);
    }
    
    // Now let's try converting the timestamps to milliseconds
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
    
    const captionsInMs = transcriptionData.transcription.map((segment, index) => {
      return {
        type: 'caption',
        index: index + 1,
        start: convertTimeToMs(segment.timestamps.from),
        end: convertTimeToMs(segment.timestamps.to),
        content: segment.text.trim(),
        text: segment.text.trim()
      };
    });
    
    console.log('\nProcessed captions with milliseconds:');
    console.log(JSON.stringify(captionsInMs, null, 2));
    
    // Try generating SRT with milliseconds
    try {
      const srtContentMs = subsrt.build(captionsInMs);
      console.log('\nGenerated SRT with milliseconds:');
      console.log(srtContentMs);
    } catch (error) {
      console.error('Error building SRT with milliseconds:', error);
    }
    
    // Test converting the timestamps to SRT format directly
    const toSrtTime = (timeString) => {
      if (!timeString) return '00:00:00,000';
      
      // Convert from "00:00:00.000" to "00:00:00,000"
      return timeString.replace('.', ',');
    };
    
    const captionsWithFormattedTime = transcriptionData.transcription.map((segment, index) => {
      return {
        type: 'caption',
        index: index + 1,
        start: toSrtTime(segment.timestamps.from),
        end: toSrtTime(segment.timestamps.to),
        content: segment.text.trim(),
        text: segment.text.trim()
      };
    });
    
    console.log('\nCaptions with formatted SRT time:');
    console.log(JSON.stringify(captionsWithFormattedTime, null, 2));
    
    // Try generating SRT with formatted times
    try {
      const srtContentFormatted = subsrt.build(captionsWithFormattedTime);
      console.log('\nGenerated SRT with formatted times:');
      console.log(srtContentFormatted);
    } catch (error) {
      console.error('Error building SRT with formatted times:', error);
    }
  } catch (error) {
    console.error('Error in loadSampleTranscription:', error);
  }
}

loadSampleTranscription();
