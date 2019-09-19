import styled from 'styled-components';
import { primaryButton, buttonHasIcon } from '~/styles/mixins';
import colors from '~/styles/colors';

export const Container = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;

  form {
    margin: 20px 0;
    display: flex;
    flex-direction: column;

    textarea,
    input {
      background: rgba(0, 0, 0, 0.1);
      border: 0;
      border-radius: 4px;
      height: 44px;
      padding: 0 15px;
      color: #fff;
      margin: 0 0 10px;
      width: 100%;

      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    & > span {
      color: ${colors.primary};
      align-self: flex-start;
      margin: 0 0 10px;
      font-weight: bold;
      padding-left: 5px;
    }

    textarea {
      height: 100px;
      padding: 15px;
    }

    & > button {
      ${primaryButton}
      ${buttonHasIcon}
      align-self: flex-end;
      padding: 10px 25px;
      margin-top: 5px;
    }
  }
`;
