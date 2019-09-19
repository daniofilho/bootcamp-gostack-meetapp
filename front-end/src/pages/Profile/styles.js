import styled from 'styled-components';
import colors from '~/styles/colors';
import { primaryButton, buttonHasIcon } from '~/styles/mixins';

export const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;

  form {
    display: flex;
    flex-direction: column;
    margin-top: 30px;

    input {
      background: rgba(0, 0, 0, 0.1);
      border: 0;
      border-radius: 4px;
      height: 44px;
      padding: 0 15px;
      color: #fff;
      margin: 0 0 10px;

      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    span {
      color: ${colors.primary};
      align-self: flex-start;
      margin: 0 0 10px;
      font-weight: bold;
      padding-left: 5px;
    }

    hr {
      border: 0;
      height: 1px;
      background: rgba(255, 255, 255, 0.2);
      margin: 10px 0 20px;
    }

    button {
      ${primaryButton}
      ${buttonHasIcon}
      margin: 5px 0 0;
      padding: 10px 15px;
      align-self: flex-end;
    }

    a {
      color: #fff;
      margin-top: 15px;
      font-size: 16px;
      opacity: 0.8;

      &:hover {
        opacity: 1;
      }
    }
  }

  > button {
    ${primaryButton}
    width: 100%;
    margin: 10px 0 0;
    height: 44px;
  }
`;
