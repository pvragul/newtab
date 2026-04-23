import { IconSize } from '../../interface';
import {
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
  Svg,
  ClipPath,
  Symbol,
  Circle,
  Use,
} from 'react-native-svg';

const SunIcon = ({ width, height, fill }: IconSize) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 512 512">
      <Defs>
        <LinearGradient
          id="SVGeq4GoeLw"
          x1="150"
          x2="234"
          y1="119.2"
          y2="264.8"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#fbbf24" />
          <Stop offset=".5" stopColor="#fbbf24" />
          <Stop offset="1" stopColor="#f59e0b" />
        </LinearGradient>
        <LinearGradient
          id="SVG7OJrxcmf"
          x1="264.6"
          x2="303.4"
          y1="244.4"
          y2="311.6"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#d4d7dd" />
          <Stop offset=".5" stopColor="#d4d7dd" />
          <Stop offset="1" stopColor="#bec1c6" />
        </LinearGradient>
        <LinearGradient
          id="SVG6cNylckE"
          x1="324.6"
          x2="363.4"
          y1="244.4"
          y2="311.6"
        >
          <Stop offset="0" stopColor="#d4d7dd" />
          <Stop offset=".5" stopColor="#d4d7dd" />
          <Stop offset="1" stopColor="#bec1c6" />
        </LinearGradient>
        <ClipPath id="SVGT7dzJbuf">
          <Path fill="none" d="M0 0h512L0 512V0z" />
        </ClipPath>
        <Symbol id="SVG0a04Kbxn" viewBox="0 0 384 384">
          <Circle
            cx="192"
            cy="192"
            r="84"
            fill="url(#SVGeq4GoeLw)"
            stroke="#f8af18"
            strokeMiterlimit="10"
            strokeWidth="6"
          />
          <Path
            fill="none"
            stroke="#fbbf24"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="24"
            d="M192 61.7V12m0 360v-49.7m92.2-222.5l35-35M64.8 319.2l35.1-35.1m0-184.4l-35-35m254.5 254.5l-35.1-35.1M61.7 192H12m360 0h-49.7"
          />
        </Symbol>
      </Defs>
      <G clipPath="url(#SVGT7dzJbuf)">
        <Use width="384" height="384" href="#SVG0a04Kbxn" x="64" y="64" />
      </G>
      <Path
        fill="none"
        stroke="url(#SVG7OJrxcmf)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
        d="M197.48,355.79c11.43-12,24.46.42,35.89-11.58s-1.61-24.41,9.82-36.41,24.46.41,35.89-11.59-1.6-24.41,9.82-36.41,24.47.41,35.9-11.59-1.61-24.41,9.82-36.41,24.47.41,35.9-11.59"
      />
      <Path
        fill="none"
        stroke="url(#SVG6cNylckE)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
        d="M257.48,355.79c11.43-12,24.46.42,35.89-11.58s-1.61-24.41,9.82-36.41,24.46.41,35.89-11.59-1.6-24.41,9.82-36.41,24.47.41,35.9-11.59-1.61-24.41,9.82-36.41,24.47.41,35.9-11.59"
      />
    </Svg>
  );
};

export default SunIcon;
