import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';
import styled from 'styled-components';

interface StyledModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: any;
}

interface ModalProps extends React.PropsWithChildren {
  name: string;
}

interface ModalOpenProps extends React.PropsWithChildren {
  windowName: string;
}

interface ModalContextModel {
  open: (windowName: string) => void;
  close: () => void;
  openWindowName: string;
}

const StyledModal = styled.div<StyledModalProps>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

const ModalContext = createContext<ModalContextModel>({
  open: () => {},
  close: () => {},
  openWindowName: '',
});

function Window({ children, name }: ModalProps) {
  const { openWindowName, close } = useContext(ModalContext);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
        close();
      }
    }

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [close]);

  if (name !== openWindowName) {
    return null;
  }

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        <div>{cloneElement(children, { onClose: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

function Open({ children, windowName }: ModalOpenProps) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(windowName) });
}

function Modal({ children }: React.PropsWithChildren) {
  const [openWindowName, setOpenName] = useState('');

  const close = () => setOpenName('');
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ close, open, openWindowName }}>
      {children}
    </ModalContext.Provider>
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
