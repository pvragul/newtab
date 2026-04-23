const fs = require('fs');

const file = './android/gradle.properties';
let content = fs.readFileSync(file, 'utf8');

const versionMatch = content.match(/VERSION_NAME=(\d+)\.(\d+)\.(\d+) (\(\d+\))/);
const codeMatch = content.match(/VERSION_CODE=(\d+)/);

//argument from command line
const args = process.argv.slice(2);
const versionType = args[0];
const date = new Date().toISOString().slice(0,10).replace(/-/g,"").slice(2)
// logic
const [, major, minor, patch, dated] = versionMatch;
let majorNum = parseInt(major);
let minorNum = parseInt(minor);
let patchNum = parseInt(patch);

let versionCode = parseInt(codeMatch[1]);
if(dated !== `(${date})`){
  patchNum = 0;
  versionCode = versionCode + 1;

}

if (versionType === '--minor') {
  minorNum++;
  patchNum = 0;
  versionCode = versionCode + 1;
} else if (versionType === '--major') {
  majorNum++;
  minorNum = 0;
  patchNum = 0;
  versionCode = versionCode + 1;
} else {
  patchNum++;
}



content = content.replace(
  /VERSION_NAME=\d+\.\d+\.\d+ (\(\d+\))/,
  `VERSION_NAME=${majorNum}.${minorNum}.${patchNum} (${date})`,
);

content = content.replace(/VERSION_CODE=\d+/, `VERSION_CODE=${versionCode}`);

fs.writeFileSync(file, content);

console.log(`Version bumped to ${majorNum}.${minorNum}.${patchNum} (${date})`);
console.log(`Version code: ${versionCode}`);
