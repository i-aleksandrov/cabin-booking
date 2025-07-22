import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2';
import { useTheme } from '../context/ThemeContext';
import ButtonIcon from './ButtonIcon';

interface DarkModeToggleModel {
  onClick: () => void;
}

function DarkModeToggle({ onClick }: DarkModeToggleModel) {
  const { currentTheme } = useTheme();
  return (
    <ButtonIcon onClick={onClick}>
      {currentTheme === 'light-mode' ? <HiOutlineMoon /> : <HiOutlineSun />}
    </ButtonIcon>
  );
}

export default DarkModeToggle;
