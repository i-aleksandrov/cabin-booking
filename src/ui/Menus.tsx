import { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { HiEllipsisVertical } from 'react-icons/hi2';
import styled from 'styled-components';

interface Position {
  x: number;
  y: number;
}

interface ToggleProps {
  id: string;
}

interface ListProps extends React.PropsWithChildren {
  id: string;
}

interface ButtonProps extends React.PropsWithChildren {
  onClick?: () => void;
}

interface MenusContextModel {
  openId: string;
  position: Position;
  setPosition: (position: Position) => void;
  open: (id: string) => void;
  close: () => void;
}

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul<{ $position: { x: number; y: number } }>`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.$position.x}px;
  top: ${(props) => props.$position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenusContext = createContext<MenusContextModel>({
  open: () => {},
  close: () => {},
  setPosition: () => {},
  openId: '',
  position: { x: 0, y: 0 },
});

function Menus({ children }: React.PropsWithChildren) {
  const [openId, setOpenId] = useState('');
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const close = () => setOpenId('');
  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{ openId, open, close, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id }: ToggleProps) {
  const { openId, close, open, setPosition } = useContext(MenusContext);

  function handleClick(event: React.MouseEvent) {
    if (openId === '' || openId !== id) {
      const rect = (event.target as HTMLElement)
        .closest('button')!
        .getBoundingClientRect();
      setPosition({
        x: window.innerWidth - rect.width - rect.x,
        y: rect.y + rect.height + 8,
      });
      open(id);
    } else {
      close();
    }
  }

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ id, children }: ListProps) {
  const { openId, position } = useContext(MenusContext);

  if (openId !== id) {
    return null;
  }

  return createPortal(
    <StyledList $position={position}>{children}</StyledList>,
    document.body
  );
}

function Button({ children, onClick = () => {} }: ButtonProps) {
  const { close } = useContext(MenusContext);

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <StyledButton onClick={handleClick}>{children}</StyledButton>
    </li>
  );
}

Menus.Toggle = Toggle;
Menus.Menu = Menu;
Menus.List = List;
Menus.Button = Button;

export default Menus;
