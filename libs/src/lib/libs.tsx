import styled from 'styled-components';

/* eslint-disable-next-line */
export interface LibsProps {}

const StyledLibs = styled.div`
  color: pink;
`;

export function Libs(props: LibsProps) {
  return (
    <StyledLibs>
      <h1>Welcome to Libs!</h1>
    </StyledLibs>
  );
}

export default Libs;
