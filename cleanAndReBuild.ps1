cd android

./gradlew clean

cd ..
# Remove-Item -Force -Recurse node_modules
# Remove-Item -Force -Recurse android/.gradle
# Remove-Item -Force -Recurse android/app/build
# Remove-Item -Force -Recurse $TMPDIR/metro-*
# Remove-Item -Force -Recurse $TMPDIR/react-native-*
# Remove-Item -Force -Recurse package-lock.json
# npm i
# npm start -- --reset-cache
npm run android --info
