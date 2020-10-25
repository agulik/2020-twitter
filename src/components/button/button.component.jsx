import styled from 'styled-components';

const Button = styled.button`
  width: 100%;
  font-weight: 500;
  border-radius: 3px;
  padding: 1rem;
  border: initial;
  color: white;
  display: block;
  cursor: pointer;
  position: relative;
  transition: 250ms linear;
  background: linear-gradient(120deg, #7b94ff 54%, #b88cfd 100%);
  box-shadow: 0 0.2rem 0.5rem rgba(103, 110, 144, 0.2),
    0 0 0 0.1rem rgba(103, 110, 144, 0.05);
  &:hover {
    box-shadow: 0 0.2rem 0.5rem rgba(103, 110, 144, 0.4),
      0 0 0 0.1rem rgba(103, 110, 144, 0.05);
  }
`;
export default Button;
