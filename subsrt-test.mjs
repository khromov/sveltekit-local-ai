import subsrt from 'subsrt-ts';

// Example caption object
const captions = [
  {
    type: 'caption',
    index: 1,
    start: '00:00:01,000',
    end: '00:00:05,000',
    content: 'Hello world',
    text: 'Hello world'
  },
  {
    type: 'caption',
    index: 2,
    start: '00:00:06,000',
    end: '00:00:10,000',
    content: 'This is a test',
    text: 'This is a test'
  }
];

// Try building SRT content
const srt = subsrt.build(captions);
console.log('SRT Output:');
console.log(srt);

// Let's try with milliseconds format
const captionsMs = [
  {
    type: 'caption',
    index: 1,
    start: 1000, // 1 second in milliseconds
    end: 5000,   // 5 seconds in milliseconds
    content: 'Hello world (milliseconds)',
    text: 'Hello world (milliseconds)'
  },
  {
    type: 'caption',
    index: 2,
    start: 6000,
    end: 10000,
    content: 'This is a test (milliseconds)',
    text: 'This is a test (milliseconds)'
  }
];

const srtMs = subsrt.build(captionsMs);
console.log('\nSRT Output (milliseconds):');
console.log(srtMs);

// Let's try with the format we're currently using in the app
console.log('\nChecking the timestamps format from the app:');
const appStyle = [
  {
    type: 'caption',
    index: 1,
    start: '00:00:01.000',  // Using dots instead of commas
    end: '00:00:05.000',
    content: 'Testing app format',
    text: 'Testing app format'
  }
];

const srtApp = subsrt.build(appStyle);
console.log(srtApp);