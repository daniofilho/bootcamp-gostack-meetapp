import styled from 'styled-components';

export const Container = styled.div`
  label {
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }

    img {
      max-width: 100%;
      height: 400px;
      border-radius: 4px;
      background: #eee;
      display: block;
      margin: 0 auto;
    }

    input {
      display: none;
    }
  }
`;

export const Placeholder = styled.div`
  background: rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 300px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  margin-bottom: 10px;
  span {
    color: #999;
    font-weight: bold;
  }
  svg {
    fill: #999;
  }
`;
