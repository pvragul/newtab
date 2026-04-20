import Svg, { Path } from 'react-native-svg';
import { IconSize } from '../../interface';

const RearrangeIcon = ({ width, height, fill }: IconSize) => {
  return (
    <Svg
      width={width || '24'}
      height={height || '24'}
      viewBox="0 0 16 16"
      fill="none"
    >
      <Path
        d="M1 2H12ZM1 14H12ZM4 8H15Z"
        fill={fill || '#000'}
      />
      <Path
        d="M1 2H12M1 14H12M4 8H15"
        stroke={fill || '#000'}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default RearrangeIcon;
